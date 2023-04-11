import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { City } from '../../cities/models/city.entity';

@Entity()
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => City)
  city: City;

  @Column()
  cityId: number;
}
