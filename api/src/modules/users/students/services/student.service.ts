import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../models/student.entity';
import { StudentValidator } from './student-validator.service';
import bcryptService from '../../../../utils/bcriptUtils';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private readonly studentValidator: StudentValidator,
  ) {}

  async createStudent(createStudent: CreateStudentDto): Promise<Student> {
    const emailUsed = await this.findByEmail(createStudent.email);
    if (emailUsed) {
      throw new ConflictException('Email já cadastrado!');
    }

    const validStudent = await this.studentValidator.validateCreate(
      createStudent,
    );

    if (!validStudent) {
      throw new BadRequestException();
    }

    const password = await bcryptService.hash(createStudent.password);

    const newStudent = this.studentsRepository.create({
      ...validStudent,
      password,
    });

    return await this.studentsRepository.save(newStudent);
  }

  async findByEmail(email: string): Promise<Student> {
    return this.studentsRepository.findOneBy({ email });
  }

  async findOne(id: number): Promise<Student> {
    return await this.studentsRepository.findOneBy({ id });
  }

  async findAll(): Promise<Student[]> {
    return await this.studentsRepository.find();
  }
}
