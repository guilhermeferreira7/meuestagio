import { Module } from '@nestjs/common';

import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { EducationsController } from './educations/educations.controller';
import { EducationsService } from './educations/educations.service';
import { ExperiencesController } from './experiences/experiences.controller';
import { ExperiencesService } from './experiences/experiences.service';
import { LanguagesController } from './languages/languages.controller';
import { LanguagesService } from './languages/languages.service';
import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';

@Module({
  controllers: [
    ResumesController,
    EducationsController,
    ExperiencesController,
    LanguagesController,
    SkillsController,
  ],
  providers: [
    ResumesService,
    PrismaService,
    EducationsService,
    ExperiencesService,
    LanguagesService,
    SkillsService,
  ],
})
export class ResumesModule {}
