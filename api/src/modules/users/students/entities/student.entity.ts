import { Column, Entity, ManyToOne } from 'typeorm';

import { Institution } from '../../../institutions/entities/institution.entity';
import { User } from '../../user/user.entity';
import { Course } from '../../../courses/entities/course.entity';

@Entity()
export class Student extends User {
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

  @Column({ nullable: true })
  period: string;
}
