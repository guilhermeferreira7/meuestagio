import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Region } from './region.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  state: string;

  @ManyToOne(() => Region)
  region: Region;

  @Column()
  regionId: number;

  @Column()
  IBGECityCode: number;
}
