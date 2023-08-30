import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobApplicationStatus } from './status';
import { Student } from '../../users/students/entities/student.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { Resume } from '../../resumes/entities/resume.entity';

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student)
  student: Student;

  @Column()
  studentId: number;

  @ManyToOne(() => Resume)
  resume: Resume;

  @Column()
  resumeId: number;

  @ManyToOne(() => Vacancy)
  vacancy: Vacancy;

  @Column()
  vacancyId: number;

  @Column({
    type: 'enum',
    enum: JobApplicationStatus,
    default: JobApplicationStatus.IN_PROGRESS,
  })
  status: string;
}
