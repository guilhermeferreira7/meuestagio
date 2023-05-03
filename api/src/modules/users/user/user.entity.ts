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

  @Column({ nullable: true })
  userVerified: boolean;

  @Column({ nullable: true, unique: true })
  cpf: string;

  @Column({ nullable: true, unique: true })
  cnpj: string;

  @Column({ nullable: true })
  addressId: number;

  // @ManyToOne(() => Address)
  // address: Address;
}
