import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ type: 'bytea', nullable: true })
  @IsOptional()
  picture: Buffer;

  @Column({ nullable: false, unique: true })
  description: string;

  @Column()
  price: number;
}
