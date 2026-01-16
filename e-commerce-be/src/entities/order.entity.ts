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

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

