import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private readonly repository: Repository<Resume>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async findByStudentId(id: number): Promise<Resume> {
    return await this.repository.findOne({
      where: { studentId: id },
      relations: ['educations', 'experiences', 'skills'],
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

  async addSkill(body: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepository.create(body);
    await this.skillRepository.save(skill);
    return skill;
  }

  async deleteSkill(id: number): Promise<void> {
    const skill = await this.skillRepository.find({
      where: { id },
    });
    if (!skill) {
      throw new Error('Skill not found');
    }

    await this.skillRepository.delete(id);
  }
}
