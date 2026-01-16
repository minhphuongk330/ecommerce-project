import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { CustomerAddress } from './customer-address.entity';
import { Order } from './order.entity';
import { ProductReview } from './product-review.entity';
import { Favorite } from './favorite.entity';
import { Profile } from './profile.entity';

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'full_name' })
  fullName: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @OneToMany(() => CustomerAddress, (address) => address.customer)
  addresses: CustomerAddress[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => ProductReview, (review) => review.customer)
  reviews: ProductReview[];

  @OneToMany(() => Favorite, (favorite) => favorite.customer)
  favorites: Favorite[];

  @OneToOne(() => Profile, (profile) => profile.customer, {
    cascade: true,
  })
  profile: Profile;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
