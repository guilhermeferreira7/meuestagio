import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../users/companies/entities/company.entity';

@Entity()
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  // UNIQUE FOR TESTING PURPOSES ONLY
  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  salary: number;

  @Column()
  companyId: number;

  @ManyToOne(() => Company)
  company: Company;
}
