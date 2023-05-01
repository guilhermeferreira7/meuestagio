import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { City } from '../../cities/models/city.entity';

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

  //cadastra endereço curriculo contendo a cidade
  //opcional ja esta na instituição
  //tabela address
  // @ManyToOne(() => City)
  // city: City;

  // @Column()
  // cityId: number;
}
