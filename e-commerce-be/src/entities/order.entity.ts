import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerAddress } from './customer-address.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'order_no' })
  orderNo: string;

  @Column({ type: 'bigint', nullable: true, name: 'customer_id' })
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'bigint', name: 'address_id' })
  addressId: number;

  @ManyToOne(() => CustomerAddress, (address) => address.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'address_id' })
  address: CustomerAddress;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'shipping_discount' })
  shippingDiscount: number;

  @Column({type: 'decimal', precision: 12, scale: 2, default: 0})
  subtotal: number;

  @Column({type: 'decimal', precision: 12, scale: 2, default: 0})
  taxAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0})
  shippingCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  // ─── Payment ───────────────────────────────────────────────────────
  @Column({
    type: 'enum',
    enum: ['COD', 'VNPAY'],
    default: 'COD',
    name: 'payment_method',
  })
  paymentMethod: 'COD' | 'VNPAY';

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending',
    name: 'payment_status',
  })
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'txn_ref' })
  txnRef: string; // VNPay transaction reference

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'schedule_delivery_date' })
  scheduledDeliveryDate: Date;
}
