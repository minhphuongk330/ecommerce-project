import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity'; // Đảm bảo import đúng đường dẫn

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  productId: number;

  // 👇 SỬA Ở ĐÂY: Thêm '| null' vào kiểu dữ liệu
  @Column({ nullable: true })
  variantId: number | null; 

  @ManyToOne(() => Customer, (customer) => customer.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;
}