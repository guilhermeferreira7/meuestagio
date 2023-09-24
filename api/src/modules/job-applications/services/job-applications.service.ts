import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from '../entities/job-applications.entity';
import { CreateJobApplicationDto } from '../dtos/create-jobApplication.dto';
import { JobApplicationStatus } from '../entities/status';

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

  async setStatus(
    jobApplicationId: number,
    status: JobApplicationStatus,
  ): Promise<JobApplication> {
    const jobApplication = await this.jobApplicationRepository.findOne({
      where: { id: jobApplicationId },
    });

    if (!jobApplication) {
      throw new BadRequestException('Candidatura não encontrada');
    }

    jobApplication.status = status;

    return await this.jobApplicationRepository.save(jobApplication);
  }

  async findByJobId(jobId: number): Promise<any[]> {
    return await this.jobApplicationRepository.find({
      where: { jobId },
      relations: [
        'resume',
        'resume.skills',
        'resume.languages',
        'resume.experiences',
        'resume.educations',
        'student',
        'student.city',
        'student.institution',
        'student.course',
      ],
      select: {
        student: {
          id: true,
          about: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async findByStudentId(studentId: number): Promise<JobApplication[]> {
    return await this.jobApplicationRepository.find({
      where: { studentId },
      relations: ['job', 'job.company', 'job.company.city'],
    });
  }
}
