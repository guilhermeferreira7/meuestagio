import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResumesService } from './resume/resumes.service';
import { ResumesController } from './resume/resumes.controller';
import { Resume } from './resume/resume.entity';
import { Education } from './educations/educations.entity';
import { EducationsService } from './educations/educations.service';
import { EducationsController } from './educations/educations.controller';
import { Experience } from './experiences/experiences.entity';
import { ExperiencesService } from './experiences/experiences.service';
import { ExperiencesController } from './experiences/experiences.controller';
import { Language } from './languages/language.entity';
import { LanguagesService } from './languages/languages.service';
import { LanguagesController } from './languages/languages.controller';
import { Skill } from './skills/skill.entity';
import { SkillsService } from './skills/skills.service';
import { SkillsController } from './skills/skills.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume, Education, Experience, Skill, Language]),
  ],
  controllers: [
    ResumesController,
    SkillsController,
    EducationsController,
    ExperiencesController,
    LanguagesController,
  ],
  providers: [
    ResumesService,
    SkillsService,
    EducationsService,
    ExperiencesService,
    LanguagesService,
  ],
})
export class ResumesModule {}
