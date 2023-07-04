import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../users/companies/entities/company.entity';
import { Area } from '../../areas/entities/area.entity';
import { City } from '../../cities/entities/city.entity';
import { Region } from '../../cities/entities/region.entity';

@Entity()
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  salary: number;

  @Column()
  cityId: number;

  @ManyToOne(() => City)
  city: City;

  @ManyToOne(() => Region)
  region: Region;

  @Column()
  regionId: string;

  @Column()
  state: string;

  @Column({ default: false })
  remote: boolean;

  @Column()
  companyId: number;

  @ManyToOne(() => Company)
  company: Company;

  @Column()
  keywords: string;

  @Column()
  areaId: number;

  @ManyToOne(() => Area)
  area: Area;
}
