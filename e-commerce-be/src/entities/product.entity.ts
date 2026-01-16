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
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { ProductColor } from './product-color.entity';
import { OrderItem } from './order-item.entity';
import { ProductReview } from './product-review.entity';
import { Favorite } from './favorite.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'bigint', nullable: true, name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'text', nullable: true, name: 'short_description' })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'text', name: 'main_image_url' })
  mainImageUrl: string;

  @Column({ type: 'text', nullable: true, name: 'extra_image_1' })
  extraImage1: string;

  @Column({ type: 'text', nullable: true, name: 'extra_image_2' })
  extraImage2: string;

  @Column({ type: 'text', nullable: true, name: 'extra_image_3' })
  extraImage3: string;

  @Column({ type: 'text', nullable: true, name: 'extra_image_4' })
  extraImage4: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  attribute: string;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];

  @OneToMany(() => ProductColor, (productColor) => productColor.product,{
    cascade:true,
  })
  productColors: ProductColor[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => ProductReview, (review) => review.product)
  reviews: ProductReview[];

  @OneToMany(() => Favorite, (favorite) => favorite.product)
  favorites: Favorite[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
