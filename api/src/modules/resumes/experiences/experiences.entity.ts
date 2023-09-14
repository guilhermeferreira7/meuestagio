import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from '../resume/resume.entity';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column()
  description: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  currentJob: boolean;

  @ManyToOne(() => Resume, (resume) => resume.experiences)
  resume: Resume;

  @Column()
  resumeId: number;
}
