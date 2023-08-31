import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from '../entities/job-applications.entity';
import { CreateJobApplicationDto } from '../dtos/create-jobApplication.dto';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async create(
    createJobApplicationDto: CreateJobApplicationDto,
  ): Promise<JobApplication> {
    const jobApplication = this.jobApplicationRepository.create(
      createJobApplicationDto,
    );

    return await this.jobApplicationRepository.save(jobApplication);
  }

  async findByJobId(jobId: number): Promise<any[]> {
    const jobApplications = await this.jobApplicationRepository.find({
      where: { jobId },
      relations: [
        'resume',
        'resume.skills',
        'resume.languages',
        'resume.experiences',
        'resume.educations',
        'resume.projects',
        'student',
        'student.city',
        'student.institution',
        'student.course',
      ],
    });

    const response = jobApplications.map((jobApplication) => {
      return {
        ...jobApplication,
        student: {
          name: jobApplication.student.name,
          email: jobApplication.student.email,
          phone: jobApplication.student.phone,
          city: jobApplication.student.city.name,
          institution: jobApplication.student.institution.name,
          course: jobApplication.student.course.name,
        },
      };
    });

    return response;
  }

  async findByStudentId(studentId: number): Promise<JobApplication[]> {
    return await this.jobApplicationRepository.find({
      where: { studentId },
      relations: ['job', 'job.company', 'job.company.city'],
    });
  }
}
