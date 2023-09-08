import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { Resume } from './entities/resume.entity';
import { Skill } from './skills/skill.entity';
import { Experience } from './entities/experiences.entity';
import { Education } from './entities/education.entity';
import { Project } from './entities/project.entity';
import { Language } from './entities/language.entity';
import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';

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
  controllers: [ResumesController, SkillsController],
  providers: [ResumesService, SkillsService],
})
export class ResumesModule {}
