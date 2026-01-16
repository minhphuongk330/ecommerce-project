import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('attribute_defs')
export class AttributeDef {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'bigint', nullable: true, name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.attributeDefs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'text', nullable: true })
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

