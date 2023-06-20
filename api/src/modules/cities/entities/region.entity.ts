import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  IBGECode: number;

  @Column()
  name: string;

  @Column()
  state: string;
}
