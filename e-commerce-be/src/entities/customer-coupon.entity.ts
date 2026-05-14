import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Coupon } from './coupon.entity';

@Entity('customer_coupons')
@Unique(['customerId', 'couponId']) // mỗi user chỉ thu thập 1 lần
export class CustomerCoupon {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'customer_id' })
  customerId: number;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'bigint', name: 'coupon_id' })
  couponId: number;

  @ManyToOne(() => Coupon, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @CreateDateColumn({ name: 'collected_at' })
  collectedAt: Date;

  @Column({ type: 'int', default: 0, name: 'used_count' })
  usedCount: number;
}
