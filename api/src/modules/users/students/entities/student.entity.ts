import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { Institution } from '../../../institutions/entities/institution.entity';
import { User } from '../../user/user.entity';
import { Course } from '../../../courses/entities/course.entity';
import { Resume } from '../../../resumes/resume/resume.entity';

@Entity()
export class Student extends User {
  @Column({ nullable: true })
  about: string;

  @ManyToOne(() => Institution)
  institution: Institution;

  @Column()
  institutionId: number;

  @ManyToOne(() => Course)
  course: Course;

  @Column({ nullable: true })
  courseId: number;

  @Column({ nullable: true })
  resumeId: number;

  @OneToOne(() => Resume)
  @JoinColumn()
  resume: Resume;
}
