import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  async getResume(studentId: number) {
    return await this.prisma.resume.findUnique({
      where: { studentId },
      include: {
        educations: true,
        experiences: true,
        languages: true,
        skills: true,
      },
    });
  }
}
