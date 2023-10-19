import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import MainSeeder from './seeds/MainSeeder';
import { Company } from '../modules/users/companies/entities/company.entity';
import { Job } from '../modules/jobs/entities/job.entity';
import { City } from '../modules/cities/entities/city.entity';
import { Area } from '../modules/areas/entities/area.entity';
import { Institution } from '../modules/institutions/entities/institution.entity';
import { User } from '../modules/users/user/user.entity';
import { Student } from '../modules/users/students/entities/student.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Region } from '../modules/cities/entities/region.entity';
import { Resume } from '../modules/resumes/resume/resume.entity';
import { Education } from '../modules/resumes/educations/educations.entity';
import { Skill } from '../modules/resumes/skills/skill.entity';
import { Language } from '../modules/resumes/languages/language.entity';
import { Experience } from '../modules/resumes/experiences/experiences.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database: 'meuestagio',
  username: 'postgres',
  host: process.env.PG_HOST,
  password: 'qwerty',
  entities: [
    Company,
    Job,
    City,
    Area,
    Institution,
    User,
    Student,
    Course,
    Region,
    Resume,
    Education,
    Skill,
    Language,
    Experience,
  ],
  seeds: [MainSeeder],
  synchronize: process.env.NODE_ENV !== 'production',
};

export const dataSource = new DataSource(options);
