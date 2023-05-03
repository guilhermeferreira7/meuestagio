import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCourseDto } from '../dtos/create-course.dto';
import { Course } from '../entities/course.entity';
import { Institution } from '../../institutions/entities/institution.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Institution)
    private readonly institutionsRepository: Repository<Institution>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    await this.validate(createCourseDto);

    const createdCouse = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(createdCouse);
  }

  async findOne(id: number): Promise<Course> {
    return await this.coursesRepository.findOneBy({ id });
  }

  async findByInstitution(institutionId: number): Promise<Course[]> {
    return await this.coursesRepository.find({ where: { institutionId } });
  }

  async validate(createCourseDto: CreateCourseDto): Promise<boolean> {
    const institution = await this.institutionsRepository.findOneBy({
      id: createCourseDto.institutionId,
    });

    if (!institution) {
      throw new BadRequestException();
    }

    const courseAlreadyExists = await this.coursesRepository.findOneBy({
      name: createCourseDto.name,
      institutionId: createCourseDto.institutionId,
    });

    if (courseAlreadyExists) {
      throw new ConflictException('Course already exists!');
    }

    return true;
  }
}
