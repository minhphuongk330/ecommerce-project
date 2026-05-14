import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { CartItem } from './cart-item.entity';
import { Category } from './category.entity';
import { Favorite } from './favorite.entity';
import { OrderItem } from './order-item.entity';
import { ProductReview } from './product-review.entity';

@Entity('products')
export class Product {
  @Column({ type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  mainImageUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  color: string;

  // Lưu nguyên cục object { ram: "12GB", storage: "256GB" } vào đây cho gọn
  @Column({ type: 'json', nullable: true })
  specifications: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  // --- Thiết lập khóa ngoại (Foreign Keys) ---

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => Favorite, (favorite) => favorite.product)
  favorites: Favorite[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => ProductReview, (review) => review.product)
  reviews: ProductReview[];
}