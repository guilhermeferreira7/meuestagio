import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job-applications.entity';
import { JobApplicationsService } from './services/job-applications.service';
import { JobApplicationsController } from './controllers/job-applications.controller';
import { StudentsService } from '../users/students/services/students.service';
import { CompaniesService } from '../users/companies/services/companies.service';
import { UsersModule } from '../users/users.module';
import { Student } from '../users/students/entities/student.entity';
import { Company } from '../users/companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, Student, Company]),
    UsersModule,
  ],
  providers: [JobApplicationsService],
  controllers: [JobApplicationsController],
})
export class JobApplicationModule {}
