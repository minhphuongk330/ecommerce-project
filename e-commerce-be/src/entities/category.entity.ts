import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { AttributeDef } from './attribute-def.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => AttributeDef, (attributeDef) => attributeDef.category)
  attributeDefs: AttributeDef[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}