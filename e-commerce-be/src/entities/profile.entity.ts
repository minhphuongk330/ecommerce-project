import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @OneToOne(() => Customer, (customer) => customer.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Customer;
}
