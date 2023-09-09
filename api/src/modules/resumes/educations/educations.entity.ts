import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from '../entities/resume.entity';

export enum Degree {
  HighSchool = 'Ensino Médio',
  Technical = 'Ensino Técnico',
  Undergraduate = 'Ensino Superior',
  Postgraduate = 'Pós-Graduação',
}

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school: string;

  @Column({
    type: 'enum',
    enum: Degree,
    default: Degree.HighSchool,
  })
  degree: string;

  @Column()
  fieldOfStudy: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @ManyToOne(() => Resume, (resume) => resume.educations)
  resume: Resume;

  @Column()
  resumeId: number;
}
