import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.productImages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'int', default: 0 })
  ordinal: number;

  @Column({ type: 'boolean', default: false, name: 'is_primary' })
  isPrimary: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

