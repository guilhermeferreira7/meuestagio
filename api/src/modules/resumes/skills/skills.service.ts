import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Skill } from './skill.entity';
import { CreateSkillDto } from './create-skill.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly repository: Repository<Skill>,
  ) {}

  async add(body: CreateSkillDto): Promise<Skill> {
    const skillExists = await this.repository.findOne({
      where: {
        resumeId: body.resumeId,
        name: body.name,
      },
    });
    if (skillExists) {
      throw new ConflictException('Habilidade já cadastrada');
    }
    const skill = this.repository.create(body);
    await this.repository.save(skill);
    return skill;
  }

  async getAll(resumeId: number): Promise<Skill[]> {
    return await this.repository.find({
      where: { resumeId },
    });
  }

  async delete(id: number): Promise<void> {
    const skill = await this.repository.find({
      where: { id },
    });
    if (!skill) {
      throw new NotFoundException('Habilidade não encontrada');
    }

    await this.repository.delete(id);
  }
}
