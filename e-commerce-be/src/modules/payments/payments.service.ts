import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VNPay, ProductCode, VnpLocale, VerifyReturnUrl, HashAlgorithm } from 'vnpay';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { PendingPayment } from '../../entities/pending-payment.entity';
import { MailService } from '../mail/mail.service';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private vnpay: VNPay;
  private readonly tmnCode: string;
  private readonly hashSecret: string;
  private readonly returnUrl: string;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(PendingPayment)
    private readonly pendingPaymentRepository: Repository<PendingPayment>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
  ) {

    this.tmnCode = this.configService.get<string>('VNPAY_TMN_CODE', '');
    this.hashSecret = this.configService.get<string>('VNPAY_HASH_SECRET', '');
    this.returnUrl = this.configService.get<string>('VNPAY_RETURN_URL', 'http://localhost:3000/payment/result');

    this.vnpay = new VNPay({
      tmnCode: this.tmnCode,
      secureSecret: this.hashSecret,
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
    });
  }

  // ─── Trừ stock cho các order items (gọi sau khi thanh toán thành công) ────
  private async decrementStockForOrder(orderId: number): Promise<void> {
    const orderItems = await this.orderItemRepository.find({
      where: { orderId },
    });

    for (const item of orderItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      if (product) {
        product.stock = Math.max(0, product.stock - (item.quantity || 1));
        await this.productRepository.save(product);

        if (product.stock <= 0) {
          try {
            await this.notificationsService.createNotification(
              null,
              'Sản phẩm hết hàng',
              `Sản phẩm "${product.name}" đã hết hàng trong kho.`,
              'OUT_OF_STOCK',
              '/admin/products',
              true,
            );
          } catch (error) {
            console.error('Failed to create out of stock notification:', error);
          }
        }
      }
    }
  }

  // ─── Tạo URL thanh toán VNPay từ payload checkout (lưu pending_payments) ────
  async createVnpayCheckout(payload: any, ipAddr: string): Promise<{ paymentUrl: string }> {
    const txnRef = `PP-${Date.now()}-${Math.random().toString().slice(2, 6)}`;

    // Lưu thông tin tạm thời vào bảng pending_payments
    const pendingPayment = this.pendingPaymentRepository.create({
      txnRef,
      customerId: payload.userId,
      payload: JSON.stringify(payload),
    });
    await this.pendingPaymentRepository.save(pendingPayment);

    const paymentUrl = this.vnpay.buildPaymentUrl({
      vnp_Amount: Math.round(Number(payload.totalAmount)),
      vnp_IpAddr: ipAddr === '::1' ? '127.0.0.1' : (ipAddr || '127.0.0.1'),
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang bang VNPAY`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.returnUrl,
      vnp_Locale: VnpLocale.VN,
    });

    return { paymentUrl };
  }

  // ─── Tạo URL thanh toán VNPay (Cũ - cho order đã tồn tại) ──────────────────
  async createPaymentUrl(orderId: number, ipAddr: string): Promise<{ paymentUrl: string }> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new BadRequestException(`Order #${orderId} không tồn tại`);
    }
    if (order.paymentMethod !== 'VNPAY') {
      throw new BadRequestException('Order này không dùng phương thức VNPAY');
    }
    if (order.paymentStatus === 'paid') {
      throw new BadRequestException('Order này đã được thanh toán');
    }

    const txnRef = `${order.id}${Date.now().toString().slice(-6)}`; // unique ref

    const paymentUrl = this.vnpay.buildPaymentUrl({
      vnp_Amount: Math.round(Number(order.totalAmount)),
      vnp_IpAddr: ipAddr === '::1' ? '127.0.0.1' : (ipAddr || '127.0.0.1'),
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang ${order.orderNo}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.returnUrl,
      vnp_Locale: VnpLocale.VN,
    });

    // Lưu txnRef vào DB để đối soát
    await this.orderRepository.update(order.id, { txnRef });

    return { paymentUrl };
  }

  // ─── Xử lý Return URL (VNPay redirect về sau thanh toán) ──────────────────
  async handleReturnUrl(query: any): Promise<{
    success: boolean;
    orderId?: number;
    orderNo?: string;
    message: string;
  }> {
    let verify: VerifyReturnUrl;
    try {
      verify = this.vnpay.verifyReturnUrl(query);
    } catch (error) {
      return { success: false, message: 'Dữ liệu không hợp lệ' };
    }

    if (!verify.isSuccess) {
      return { success: false, message: 'Chữ ký không hợp lệ' };
    }

    const txnRef = query['vnp_TxnRef'];
    const responseCode = query['vnp_ResponseCode'];

    // 1. Kiểm tra xem đơn hàng thực sự đã được tạo chưa (do IPN hoặc redirect trước đó)
    const order = await this.orderRepository.findOne({
      where: { txnRef },
      relations: ['customer', 'address', 'orderItems', 'orderItems.product'],
    });

    if (order) {
      if (order.paymentStatus === 'paid') {
        return { success: true, orderId: order.id, orderNo: order.orderNo, message: 'Thanh toán thành công' };
      } else {
        return { success: false, orderId: order.id, orderNo: order.orderNo, message: 'Thanh toán thất bại' };
      }
    }

    // 2. Nếu đơn hàng chưa được tạo, tìm PendingPayment
    const pendingPayment = await this.pendingPaymentRepository.findOne({
      where: { txnRef },
    });

    if (!pendingPayment) {
      return { success: false, message: 'Không tìm thấy thông tin giao dịch tạm thời' };
    }

    if (verify.isSuccess && responseCode === '00') {
      try {
        const payload = JSON.parse(pendingPayment.payload);
        const createdOrder = await this.ordersService.createFullOrderFromPayload(payload, txnRef);

        // Xóa pending record sau khi xử lý thành công
        await this.pendingPaymentRepository.delete(pendingPayment.id);

        return {
          success: true,
          orderId: createdOrder.id,
          orderNo: createdOrder.orderNo,
          message: 'Thanh toán và tạo đơn hàng thành công',
        };
      } catch (error) {
        console.error('Failed to create order from pending payment payload:', error);
        return { success: false, message: `Thanh toán thành công nhưng không tạo được đơn hàng: ${error.message}` };
      }
    } else {
      // Hủy thanh toán hoặc thanh toán thất bại: Xóa pending record, không tạo đơn
      await this.pendingPaymentRepository.delete(pendingPayment.id);
      return { success: false, message: `Thanh toán thất bại hoặc đã bị hủy (code: ${responseCode})` };
    }
  }

  // ─── IPN — VNPay gọi server-to-server ─────────────────────────────────────
  async handleIpn(query: any): Promise<{ RspCode: string; Message: string }> {
    let verify;
    try {
      verify = this.vnpay.verifyIpnCall(query);
    } catch (error) {
      return { RspCode: '97', Message: 'Invalid Checksum' };
    }

    if (!verify.isSuccess) {
      return { RspCode: '97', Message: 'Invalid Checksum' };
    }

    const txnRef = query['vnp_TxnRef'];
    const responseCode = query['vnp_ResponseCode'];

    // 1. Kiểm tra xem đơn hàng thực sự đã được tạo chưa
    const order = await this.orderRepository.findOne({ where: { txnRef } });
    if (order) {
      if (order.paymentStatus === 'paid') {
        return { RspCode: '02', Message: 'Order already confirmed' };
      }
      if (responseCode === '00') {
        await this.orderRepository.update(order.id, {
          paymentStatus: 'paid',
          status: 'Processing',
        });
        await this.decrementStockForOrder(order.id);
      } else {
        await this.orderRepository.update(order.id, { paymentStatus: 'failed' });
      }
      return { RspCode: '00', Message: 'Confirm Success' };
    }

    // 2. Tìm PendingPayment
    const pendingPayment = await this.pendingPaymentRepository.findOne({
      where: { txnRef },
    });
    if (!pendingPayment) {
      return { RspCode: '01', Message: 'Order not found' };
    }

    if (responseCode === '00') {
      try {
        const payload = JSON.parse(pendingPayment.payload);
        await this.ordersService.createFullOrderFromPayload(payload, txnRef);
      } catch (error) {
        console.error('Failed to create order in IPN:', error);
      }
    }

    // Xóa pending record dù thành công hay thất bại
    await this.pendingPaymentRepository.delete(pendingPayment.id);

    return { RspCode: '00', Message: 'Confirm Success' };
  }

  // ─── Kiểm tra trạng thái thanh toán ──────────────────────────────────────
  async getPaymentStatus(txnRef: string): Promise<{
    paymentStatus: string;
    orderNo: string;
    totalAmount: number;
  }> {
    const order = await this.orderRepository.findOne({ where: { txnRef } });
    if (order) {
      return {
        paymentStatus: order.paymentStatus,
        orderNo: order.orderNo,
        totalAmount: Number(order.totalAmount),
      };
    }

    const pending = await this.pendingPaymentRepository.findOne({ where: { txnRef } });
    if (pending) {
      const payload = JSON.parse(pending.payload);
      return {
        paymentStatus: 'pending',
        orderNo: 'PENDING',
        totalAmount: Number(payload.totalAmount),
      };
    }

    throw new BadRequestException(`Không tìm thấy giao dịch với txnRef: ${txnRef}`);
  }
}


