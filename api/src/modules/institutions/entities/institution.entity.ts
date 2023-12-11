import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;


  @Column()
  cityId: number;
}
