import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateResumeDto } from './update-resume.dto';
import { Resume } from './resume.entity';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private readonly repository: Repository<Resume>,
  ) {}

  async update(id: number, body: UpdateResumeDto): Promise<Resume> {
    await this.repository.update(id, body);
    const resume = await this.repository.findOne({
      where: { id },
      relations: ['educations', 'experiences'],
    });

    return resume;
  }

  async getResume(studentId: number): Promise<Resume> {
    if (!studentId) {
      return null;
    }

    const resume = await this.repository.findOne({
      where: { studentId },
      relations: [
        'educations',
        'experiences',
        'skills',
        'languages',
        'projects',
      ],
    });

    return resume;
  }
}
