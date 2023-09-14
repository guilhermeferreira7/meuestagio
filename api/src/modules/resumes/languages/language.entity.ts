import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from '../resume/resume.entity';

export enum LanguageLevel {
  Basic = 'Básico',
  Intermediate = 'Intermediário',
  Advanced = 'Avançado',
  Fluent = 'Fluente',
}

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: LanguageLevel,
    default: LanguageLevel.Basic,
  })
  level: string;

  @Column()
  resumeId: number;

  @ManyToOne(() => Resume, (resume) => resume.languages)
  resume: Resume;
}
