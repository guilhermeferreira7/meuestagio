import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Skill } from './entities/skill.entity';
import { Experience } from './entities/experiences.entity';
import { Education } from './entities/education.entity';
import { Project } from './entities/project.entity';
import { Language } from './entities/language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resume,
      Education,
      Experience,
      Skill,
      Project,
      Language,
    ]),
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
