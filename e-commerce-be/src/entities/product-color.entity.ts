import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_colors')
export class ProductColor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.productColors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 50, name: 'color_name' })
  colorName: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'color_hex' })
  colorHex: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

