import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResumesService } from './resume/resumes.service';
import { ResumesController } from './resume/resumes.controller';
import { Skill } from './skills/skill.entity';
import { Education } from './educations/educations.entity';
import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';
import { EducationsController } from './educations/educations.controller';
import { EducationsService } from './educations/educations.service';
import { ExperiencesService } from './experiences/experiences.service';
import { Experience } from './experiences/experiences.entity';
import { ExperiencesController } from './experiences/experiences.controller';
import { Resume } from './resume/resume.entity';
import { Language } from './languages/language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume, Education, Experience, Skill, Language]),
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
