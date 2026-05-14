import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { FlashSale } from './flash-sale.entity';
import { Product } from './product.entity';

@Entity('flash_sale_items')
export class FlashSaleItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'flash_sale_id' })
  flashSaleId: number;

  @ManyToOne(() => FlashSale, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flash_sale_id' })
  flashSale: FlashSale;

  @Column({ type: 'bigint', name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'sale_price' })
  salePrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'original_price' })
  originalPrice: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0, name: 'sold_quantity' })
  soldQuantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
