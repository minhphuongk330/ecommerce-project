import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, CouponType, DiscountType } from '../../entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  /** Lấy tất cả coupon hiển thị trên trang chủ */
  async findHomepage(): Promise<Coupon[]> {
    const now = new Date();
    return this.couponRepository
      .createQueryBuilder('coupon')
      .where('coupon.isActive = :isActive', { isActive: true })
      .andWhere('coupon.showOnHomepage = :show', { show: true })
      .andWhere(
        '(coupon.expiresAt IS NULL OR coupon.expiresAt > :now)',
        { now },
      )
      .andWhere(
        '(coupon.usageLimit IS NULL OR coupon.usedCount < coupon.usageLimit)',
      )
      .orderBy('coupon.createdAt', 'DESC')
      .getMany();
  }

  /** Validate & tính giảm giá */
  async validate(
    code: string,
    orderValue: number,
    shippingCost: number = 0,
  ): Promise<{ coupon: Coupon; discountAmount: number }> {
    const now = new Date();
    const coupon = await this.couponRepository.findOne({
      where: { code: code.toUpperCase(), isActive: true },
    });

    if (!coupon) throw new NotFoundException('Mã giảm giá không tồn tại');
    if (coupon.expiresAt && coupon.expiresAt < now)
      throw new BadRequestException('Mã giảm giá đã hết hạn');
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');

    // Coupon ship: check shippingCost > 0
    if (coupon.couponType === CouponType.SHIPPING && shippingCost <= 0) {
      throw new BadRequestException('Phương thức giao hàng miễn phí, không thể áp dụng coupon giảm ship');
    }

    // Base value để tính giảm: shipping coupon tính trên shippingCost, product tính trên orderValue
    const baseValue =
      coupon.couponType === CouponType.SHIPPING ? shippingCost : orderValue;

    if (orderValue < Number(coupon.minOrderValue))
      throw new BadRequestException(
        `Đơn hàng tối thiểu ${Number(coupon.minOrderValue).toLocaleString('vi-VN')}₫ để dùng mã này`,
      );

    let discountAmount =
      coupon.discountType === DiscountType.PERCENT
        ? (baseValue * Number(coupon.discountValue)) / 100
        : Number(coupon.discountValue);

    // Không được giảm quá baseValue
    discountAmount = Math.min(discountAmount, baseValue);

    if (
      coupon.discountType === DiscountType.PERCENT &&
      coupon.maxDiscountAmount
    ) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
    }

    return { coupon, discountAmount: Math.round(discountAmount) };
  }

  /** Tăng usedCount sau khi đơn hàng thành công */
  async incrementUsage(code: string): Promise<void> {
    await this.couponRepository.increment({ code }, 'usedCount', 1);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon #${id} không tồn tại`);
    return coupon;
  }

  async create(data: Partial<Coupon>): Promise<Coupon> {
    if (data.code) data.code = data.code.toUpperCase();
    const coupon = this.couponRepository.create(data);
    return this.couponRepository.save(coupon);
  }

  async update(id: number, data: Partial<Coupon>): Promise<Coupon> {
    const coupon = await this.findOne(id);
    if (data.code) data.code = data.code.toUpperCase();
    Object.assign(coupon, data);
    return this.couponRepository.save(coupon);
  }

  async remove(id: number): Promise<void> {
    const coupon = await this.findOne(id);
    await this.couponRepository.remove(coupon);
  }
}
