import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from './resume.entity';

enum Level {
  Basic = 'Básico',
  Intermediate = 'Intermediário',
  Advanced = 'Avançado',
}

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Level,
    default: Level.Basic,
  })
  level: string;

  @Column()
  resumeId: number;

  @ManyToOne(() => Resume, (resume) => resume.skills)
  resume: Resume;
}
