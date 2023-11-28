import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateExperienceDto } from './create.dto';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(body: CreateExperienceDto, email: string) {
    const resume = await this.validateExperience(body, email);

    return await this.prisma.experience.create({
      data: {
        ...body,
        resumeId: resume.id,
      },
    });
  }

  async getAll(email: string) {
    const resume = await this.getResume(email);
    return await this.prisma.experience.findMany({
      where: {
        resumeId: resume.id,
      },
    });
  }

  async delete(id: number, email: string) {
    const resume = await this.getResume(email);
    const experience = await this.prisma.experience.findFirst({
      where: {
        id,
        resumeId: resume.id,
      },
    });
    if (!experience) throw new NotFoundException('Experiência não encontrada');

    await this.prisma.experience.delete({
      where: {
        id,
      },
    });
  }

  private async getResume(email: string) {
    const student = await this.prisma.student.findUnique({ where: { email } });
    return await this.prisma.resume.findUnique({
      where: { studentId: student.id },
    });
  }

  private async validateExperience(body: CreateExperienceDto, email: string) {
    const resume = await this.getResume(email);
    if (!resume) throw new NotFoundException('Currículo não encontrado');

    const experience = await this.prisma.experience.findFirst({
      where: { resumeId: resume.id, company: body.company },
    });

    if (experience) throw new ConflictException('Experiência já cadastrada');

    return resume;
  }
}
