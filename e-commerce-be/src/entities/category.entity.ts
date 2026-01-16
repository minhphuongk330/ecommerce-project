import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { AttributeDef } from './attribute-def.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true, name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column({ type: 'text', nullable: true })
  configs: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => AttributeDef, (attributeDef) => attributeDef.category)
  attributeDefs: AttributeDef[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

