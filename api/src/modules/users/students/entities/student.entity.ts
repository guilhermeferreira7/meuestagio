import { Column, Entity, ManyToOne } from 'typeorm';

import { Institution } from '../../../institutions/models/institution.entity';
import { User } from '../../user/user.entity';
import { Course } from '../../../courses/models/course.entity';

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

  // id do curriculo
  @Column({ nullable: true })
  resumeId: number;

  @Column({ nullable: true })
  period: string;

  // phone
  // verificar telefone email e usuario pelo prof
  // periodo tabela curriculo
}
