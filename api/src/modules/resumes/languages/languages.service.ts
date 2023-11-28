import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateLanguageDto } from './create.dto';

@Injectable()
export class LanguagesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(body: CreateLanguageDto, email: string) {
    const resume = await this.validateLanguage(body, email);

    return await this.prisma.language.create({
      data: {
        ...body,
        resumeId: resume.id,
      },
    });
  }

  async getAll(email: string) {
    const resume = await this.getResume(email);
    return await this.prisma.language.findMany({
      where: {
        resumeId: resume.id,
      },
    });
  }

  async delete(id: number, email: string) {
    const resume = await this.getResume(email);
    const language = await this.prisma.language.findFirst({
      where: {
        id,
        resumeId: resume.id,
      },
    });
    if (!language) throw new NotFoundException('Idioma não encontrada');

    await this.prisma.language.delete({
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

  private async validateLanguage(body: CreateLanguageDto, email: string) {
    const resume = await this.getResume(email);
    if (!resume) throw new NotFoundException('Currículo não encontrado');

    const language = await this.prisma.language.findFirst({
      where: { resumeId: resume.id, name: body.name },
    });

    if (language) throw new ConflictException('Idioma já cadastrado');

    return resume;
  }
}
