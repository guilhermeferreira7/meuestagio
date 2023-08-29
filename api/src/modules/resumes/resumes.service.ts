import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private readonly repository: Repository<Resume>,
  ) {}

  async findByStudentId(id: number): Promise<Resume> {
    return await this.repository.findOne({
      where: { studentId: id },
      relations: ['educations', 'experiences'],
    });
  }

  async update(id: number, body: UpdateResumeDto): Promise<Resume> {
    await this.repository.update(id, body);
    const resume = await this.repository.findOne({
      where: { id },
      relations: ['educations', 'experiences'],
    });

    return resume;
  }
}
