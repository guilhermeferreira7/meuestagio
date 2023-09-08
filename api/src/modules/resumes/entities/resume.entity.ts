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
import { Skill } from '../skills/skill.entity';
import { Project } from './project.entity';
import { Language } from './language.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  studentId: number;

  @ManyToOne(() => Student)
  student: Student;

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  about: string;

  @OneToMany(() => Education, (education) => education.resume, {
    nullable: true,
  })
  educations: Education[];

  @OneToMany(() => Experience, (experience) => experience.resume, {
    nullable: true,
  })
  experiences: Experience[];

  @OneToMany(() => Language, (language) => language.resume, {
    nullable: true,
  })
  languages: Language[];

  @OneToMany(() => Skill, (skill) => skill.resume, {
    nullable: true,
  })
  skills: Skill[];

  @OneToMany(() => Project, (project) => project.resume, {
    nullable: true,
  })
  projects: Project[];
}
