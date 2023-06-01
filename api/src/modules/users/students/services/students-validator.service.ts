import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { Institution } from '../../../institutions/entities/institution.entity';
import { Course } from '../../../courses/entities/course.entity';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentValidator {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Institution)
    private readonly institutionsRepository: Repository<Institution>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async validateCreate(createStudentDto: CreateStudentDto): Promise<boolean> {
    await this.validateInstitution(createStudentDto.institutionId);
    await this.validateCourse(createStudentDto.courseId);
    return true;
  }

  async validateUpdate(updateStudentDto: UpdateStudentDto): Promise<boolean> {
    updateStudentDto.institutionId &&
      (await this.validateInstitution(updateStudentDto.institutionId));
    updateStudentDto.courseId &&
      (await this.validateCourse(updateStudentDto.courseId));
    updateStudentDto.email &&
      (await this.validateEmail(updateStudentDto.email));

    return true;
  }

  private async validateInstitution(institutionId: number) {
    const institution = await this.institutionsRepository.findOneBy({
      id: institutionId,
    });

    if (!institution) {
      throw new BadRequestException('Instituição não encontrada!');
    }
  }

  private async validateCourse(courseId: number) {
    const course = await this.coursesRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new BadRequestException('Curso não encontrado!');
    }
  }

  private async validateEmail(email: string) {
    const emailUsed = await this.studentsRepository.findOneBy({ email });
    if (emailUsed) {
      throw new BadRequestException('Email já cadastrado!');
    }
  }
}
