import { BadRequestException, Injectable } from '@nestjs/common';
import { JobApplicationStatusEnum } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateJobApplicationDto } from './dtos/update';

@Injectable()
export class JobApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateJobApplicationDto) {
    await this.validateCreate(dto);
    const jobApplication = await this.prisma.jobApplication.create({
      data: dto,
    });

    return jobApplication;
  }

  async findByStudentId(studentId: number) {
    return await this.prisma.jobApplication.findMany({
      where: { studentId },
      include: {
        job: {
          include: { company: { select: { name: true } } },
        },
      },
    });
  }

  async setStatus(jobApplicationId: number, status: JobApplicationStatusEnum) {
    const jobApplication = await this.prisma.jobApplication.findUnique({
      where: { id: jobApplicationId },
    });
    if (!jobApplication) {
      throw new BadRequestException('Candidatura não encontrada');
    }

    return await this.prisma.jobApplication.update({
      where: { id: jobApplicationId },
      data: { status },
    });
  }

  async findByJobId(jobId: number) {
    return await this.prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        student: {
          select: { name: true, course: true, institution: true, city: true },
        },
        resume: {
          include: {
            skills: true,
            educations: true,
            experiences: true,
            languages: true,
          },
        },
      },
    });
  }

  private async validateCreate(dto: CreateJobApplicationDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
    });

    if (!job) throw new BadRequestException();

    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) throw new BadRequestException();

    const resume = await this.prisma.resume.findUnique({
      where: { id: dto.resumeId },
    });

    if (!resume) throw new BadRequestException();
  }
}
