import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  currentProject: boolean;

  @Column()
  resumeId: number;

  @ManyToOne(() => Resume, (resume) => resume.projects)
  resume: Resume;
}
