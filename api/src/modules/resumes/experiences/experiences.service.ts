import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './experiences.entity';
import { CreateExperienceDto } from './create-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private readonly repository: Repository<Experience>,
  ) {}

  async add(body: CreateExperienceDto): Promise<Experience> {
    const expExists = await this.repository.findOne({
      where: {
        resumeId: body.resumeId,
        company: body.company,
        position: body.position,
      },
    });
    if (expExists) {
      throw new ConflictException('Experiência já cadastrada');
    }

    return await this.repository.save(body);
  }

  async getAll(resumeId: number): Promise<Experience[]> {
    return await this.repository.find({
      where: { resumeId },
    });
  }

  async delete(id: number): Promise<void> {
    const education = await this.repository.find({
      where: { id },
    });
    if (!education) {
      throw new NotFoundException('Experiência não encontrada');
    }

    await this.repository.delete(id);
  }
}
