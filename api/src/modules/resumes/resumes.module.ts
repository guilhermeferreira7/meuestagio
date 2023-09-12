import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { Resume } from './entities/resume.entity';
import { Skill } from './skills/skill.entity';
import { Education } from './educations/educations.entity';
import { Project } from './entities/project.entity';
import { Language } from './entities/language.entity';
import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';
import { EducationsController } from './educations/educations.controller';
import { EducationsService } from './educations/educations.service';
import { ExperiencesService } from './experiences/experiences.service';
import { Experience } from './experiences/experiences.entity';
import { ExperiencesController } from './experiences/experiences.controller';

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
  controllers: [
    ResumesController,
    SkillsController,
    EducationsController,
    ExperiencesController,
  ],
  providers: [
    ResumesService,
    SkillsService,
    EducationsService,
    ExperiencesService,
  ],
})
export class ResumesModule {}
