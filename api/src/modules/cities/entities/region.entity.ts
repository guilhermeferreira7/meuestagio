import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  IBGECode: number;

  @Column()
  name: string;

  @Column()
  state: string;
}
