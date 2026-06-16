import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../../entities/coupon.entity';
import { CustomerCoupon } from '../../entities/customer-coupon.entity';

@Injectable()
export class CustomerCouponsService {
  constructor(
    @InjectRepository(CustomerCoupon)
    private readonly customerCouponRepo: Repository<CustomerCoupon>,
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) { }

  /** Thu thập coupon */
  async collect(customerId: number, couponId: number): Promise<CustomerCoupon> {
    const now = new Date();

    // Kiểm tra coupon tồn tại và còn hiệu lực
    const coupon = await this.couponRepo.findOne({ where: { id: couponId } });
    if (!coupon) throw new NotFoundException('Mã giảm giá không tồn tại');
    if (!coupon.isActive) throw new BadRequestException('Mã giảm giá không còn hoạt động');
    if (coupon.expiresAt && coupon.expiresAt < now)
      throw new BadRequestException('Mã giảm giá đã hết hạn');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');

    // Kiểm tra đã thu thập chưa
    const existing = await this.customerCouponRepo.findOne({
      where: { customerId, couponId },
    });
    if (existing) throw new ConflictException('Bạn đã thu thập mã này rồi');

    const record = this.customerCouponRepo.create({ customerId, couponId });
    return this.customerCouponRepo.save(record);
  }

  /** Xóa coupon đã thu thập */
  async remove(customerId: number, couponId: number): Promise<void> {
    const record = await this.customerCouponRepo.findOne({
      where: { customerId, couponId },
    });
    if (!record) throw new NotFoundException('Không tìm thấy mã giảm giá này');
    await this.customerCouponRepo.remove(record);
  }

  /** Lấy danh sách coupon đã thu thập của user (bao gồm cả đã dùng để hiển thị trạng thái) */
  async findByCustomer(customerId: number): Promise<CustomerCoupon[]> {
    const records = await this.customerCouponRepo.find({
      where: { customerId },
      order: { collectedAt: 'DESC' },
    });
    return records;
  }

  /** Kiểm tra user đã thu thập coupon nào chưa (trả về set couponId) */
  async getCollectedIds(customerId: number): Promise<string[]> {
    const records = await this.customerCouponRepo.find({
      where: { customerId },
      select: ['couponId'],
    });
    return records.map((r) => r.couponId.toString());
  }
}
