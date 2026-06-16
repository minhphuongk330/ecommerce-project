import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  logoUrl: string;

  // Quan hệ 1 Brand có nhiều Products
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}