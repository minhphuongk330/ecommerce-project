import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('pending_payments')
export class PendingPayment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, name: 'txn_ref' })
  txnRef: string;

  @Column({ type: 'bigint', name: 'customer_id' })
  customerId: number;

  @Column({ type: 'text', name: 'payload' })
  payload: string; // JSON string representing the order details and items

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
