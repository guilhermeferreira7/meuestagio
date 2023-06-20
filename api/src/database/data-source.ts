import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import MainSeeder from './seeds/MainSeeder';
import { Company } from '../modules/users/companies/entities/company.entity';
import { Vacancy } from '../modules/vacancies/entities/vacancy.entity';
import { City } from '../modules/cities/entities/city.entity';
import { Area } from '../modules/areas/entities/area.entity';
import { Institution } from '../modules/institutions/entities/institution.entity';
import { User } from '../modules/users/user/user.entity';
import { Student } from '../modules/users/students/entities/student.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { Region } from '../modules/cities/entities/region.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database: 'meuestagio',
  username: 'postgres',
  host: process.env.PG_HOST,
  password: 'qwerty',
  entities: [
    Company,
    Vacancy,
    City,
    Area,
    Institution,
    User,
    Student,
    Course,
    Region,
  ],
  seeds: [MainSeeder],
  synchronize: true,
};

export const dataSource = new DataSource(options);
