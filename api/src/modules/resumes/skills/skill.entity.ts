import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from '../resume/resume.entity';

export enum SkillLevel {
  Basic = 'Básico',
  Intermediate = 'Intermediário',
  Advanced = 'Avançado',
}

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: SkillLevel,
    default: SkillLevel.Basic,
  })
  level: string;

  @Column()
  resumeId: number;

  @ManyToOne(() => Resume, (resume) => resume.skills)
  resume: Resume;
}
