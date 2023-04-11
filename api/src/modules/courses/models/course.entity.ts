import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Institution } from '../../institutions/models/institution.entity';

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
}
