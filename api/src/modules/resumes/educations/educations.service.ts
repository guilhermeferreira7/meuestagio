import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from './educations.entity';
import { CreateEducationDto } from './create-education.dto';

@Injectable()
export class EducationsService {
  constructor(
    @InjectRepository(Education)
    private readonly repository: Repository<Education>,
  ) {}

  async add(body: CreateEducationDto): Promise<Education> {
    const educationExists = await this.repository.findOne({
      where: { school: body.school },
    });
    if (educationExists) {
      throw new ConflictException('Formação já cadastrada');
    }

    const education = this.repository.create(body);
    await this.repository.save(education);
    return education;
  }

  async getAll(resumeId: number): Promise<Education[]> {
    return await this.repository.find({
      where: { resumeId },
    });
  }

  async delete(id: number): Promise<void> {
    const education = await this.repository.find({
      where: { id },
    });
    if (!education) {
      throw new NotFoundException('Educação não encontrada');
    }

    await this.repository.delete(id);
  }
}
