import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Institution } from '../../institutions/entities/institution.entity';
import { Area } from '../../areas/entities/area.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Institution)
  institution: Institution;

  @Column()
  institutionId: number;

  @Column()
  areaId: number;

  @ManyToOne(() => Area)
  area: Area;
}
