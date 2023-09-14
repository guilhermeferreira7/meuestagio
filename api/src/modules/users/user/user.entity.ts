import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { City } from '../../cities/entities/city.entity';

@Entity()
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true })
  emailVerified: boolean;

  @Column({ nullable: true })
  phoneVerified: boolean;

  @ManyToOne(() => City)
  city: City;

  @Column({ nullable: true })
  cityId: number;
}
