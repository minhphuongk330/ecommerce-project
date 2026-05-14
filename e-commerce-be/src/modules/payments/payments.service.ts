import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VNPay, ProductCode, VnpLocale, VerifyReturnUrl, HashAlgorithm } from 'vnpay';
import { Order } from '../../entities/order.entity';

@Injectable()
export class PaymentsService {
  private vnpay: VNPay;
  private readonly tmnCode: string;
  private readonly hashSecret: string;
  private readonly returnUrl: string;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly configService: ConfigService,
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

  // ─── Tạo URL thanh toán VNPay ─────────────────────────────────────────────
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

    const order = await this.orderRepository.findOne({ where: { txnRef } });
    if (!order) {
      return { success: false, message: 'Không tìm thấy đơn hàng' };
    }

    if (verify.isSuccess && responseCode === '00') {
      await this.orderRepository.update(order.id, {
        paymentStatus: 'paid',
        status: 'Processing',
      });
      return { success: true, orderNo: order.orderNo, message: 'Thanh toán thành công' };
    } else {
      await this.orderRepository.update(order.id, { paymentStatus: 'failed' });
      return { success: false, orderNo: order.orderNo, message: `Thanh toán thất bại (code: ${responseCode})` };
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

    const order = await this.orderRepository.findOne({ where: { txnRef } });
    if (!order) {
      return { RspCode: '01', Message: 'Order not found' };
    }

    if (order.paymentStatus === 'paid') {
      return { RspCode: '02', Message: 'Order already confirmed' };
    }

    if (responseCode === '00') {
      await this.orderRepository.update(order.id, {
        paymentStatus: 'paid',
        status: 'Processing',
      });
    } else {
      await this.orderRepository.update(order.id, { paymentStatus: 'failed' });
    }

    return { RspCode: '00', Message: 'Confirm Success' };
  }

  // ─── Kiểm tra trạng thái thanh toán ──────────────────────────────────────
  async getPaymentStatus(txnRef: string): Promise<{
    paymentStatus: string;
    orderNo: string;
    totalAmount: number;
  }> {
    const order = await this.orderRepository.findOne({ where: { txnRef } });
    if (!order) {
      throw new BadRequestException(`Không tìm thấy order với txnRef: ${txnRef}`);
    }
    return {
      paymentStatus: order.paymentStatus,
      orderNo: order.orderNo,
      totalAmount: Number(order.totalAmount),
    };
  }


}
