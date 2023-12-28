import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateSkillDto } from './create.dto';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async add(body: CreateSkillDto, email: string) {
    const resumeId = await this.validateSkill(body, email);

    return await this.prisma.skill.create({
      data: {
        name: body.name,
        level: body.level,
        resumeId,
      },
    });
  }

  async getAll(email: string) {
    const { id } = await this.getResume(email);
    return await this.prisma.skill.findMany({
      where: { resumeId: id },
    });
  }

  async delete(id: number, email: string) {
    const resume = await this.getResume(email);
    const skill = await this.prisma.skill.findFirst({
      where: {
        id,
        resumeId: resume.id,
      },
    });

    if (!skill) throw new NotFoundException('Habilidade não encontrada');

    await this.prisma.skill.delete({
      where: { id },
    });
  }

  private async getResume(email: string) {
    return await this.prisma.student
      .findUnique({
        where: { email },
      })
      .resume();
  }

  private async validateSkill(body: CreateSkillDto, email: string) {
    const { id } = await this.getResume(email);
    if (!id) throw new NotFoundException('Currículo não encontrado');

    const skill = await this.prisma.skill.findFirst({
      where: {
        resumeId: id,
        name: body.name,
      },
    });

    if (skill) throw new ConflictException('Habilidade já cadastrada');

    return id;
  }
}
