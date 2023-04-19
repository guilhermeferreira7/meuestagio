import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  // FOR TESTING PURPOSES ONLY
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  salary: number;

  @Column()
  companyId: number;

  // @ManyToOne(() => Company)
  // company: string;
}
