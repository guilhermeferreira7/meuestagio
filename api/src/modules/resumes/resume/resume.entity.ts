import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../../users/students/entities/student.entity';
import { Education } from '../educations/educations.entity';
import { Skill } from '../skills/skill.entity';
import { Language } from '../languages/language.entity';
import { Experience } from '../experiences/experiences.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Student, (student) => student.resume)
  student: Student;

  @Column({
    nullable: true,
  })
  studentId: number;

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
}
