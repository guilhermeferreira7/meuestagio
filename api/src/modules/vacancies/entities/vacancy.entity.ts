import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../users/companies/entities/company.entity';
import { Area } from '../../areas/entities/area.entity';
import { City } from '../../cities/entities/city.entity';

@Entity()
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  salary: number;

  @Column()
  cityId: number;

  @ManyToOne(() => City)
  city: City;

  @Column({ default: false })
  remote: boolean;

  @Column()
  companyId: number;

  @ManyToOne(() => Company)
  company: Company;

  @Column()
  requirements: string;

  @Column({ nullable: true })
  desirableRequirements: string;

  @Column()
  activities: string;

  @Column()
  keyWords: string;

  @Column()
  areaId: number;

  @ManyToOne(() => Area)
  area: Area;
}
