import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DiscountType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

export enum CouponType {
  PRODUCT = 'product',   // Giảm giá sản phẩm
  SHIPPING = 'shipping', // Giảm phí ship
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.PERCENT,
    name: 'discount_type',
  })
  discountType: DiscountType;

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.PRODUCT,
    name: 'coupon_type',
  })
  couponType: CouponType;

  /** Giá trị giảm: % hoặc số tiền cố định (VNĐ) */
  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'discount_value' })
  discountValue: number;

  /** Giá trị đơn hàng tối thiểu để áp dụng */
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    name: 'min_order_value',
  })
  minOrderValue: number;

  /** Giảm tối đa (áp dụng khi discountType = percent) */
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'max_discount_amount',
  })
  maxDiscountAmount: number;

  /** Số lần sử dụng tối đa (null = không giới hạn) */
  @Column({ type: 'int', nullable: true, name: 'usage_limit' })
  usageLimit: number;

  /** Số lượt sử dụng tối đa mỗi tài khoản */
  @Column({ type: 'int', default: 1, name: 'usage_limit_per_user' })
  usageLimitPerUser: number;

  /** Số lần đã dùng */
  @Column({ type: 'int', default: 0, name: 'used_count' })
  usedCount: number;

  @Column({ type: 'datetime', nullable: true, name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  /** Hiển thị trên trang chủ */
  @Column({ type: 'boolean', default: false, name: 'show_on_homepage' })
  showOnHomepage: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
