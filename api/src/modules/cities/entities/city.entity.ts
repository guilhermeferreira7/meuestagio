import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  state: string;

  @Column()
  IBGECityCode: number;

  @Column()
  IBGEStateCode: number;

  @Column()
  IBGERegionCode: number;
}
