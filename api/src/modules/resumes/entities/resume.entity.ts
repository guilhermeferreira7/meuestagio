import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../../users/students/entities/student.entity';
import { Experience } from './experiences.entity';
import { Education } from './education.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @ManyToOne(() => Student)
  student: Student;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  skills: string;

  @Column()
  languages: string;

  @OneToMany(() => Education, (education) => education.resume)
  educations: Education[];

  @OneToMany(() => Experience, (experience) => experience.resume, {
    nullable: true,
  })
  experiences: Experience[];
}
