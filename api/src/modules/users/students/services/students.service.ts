import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../entities/student.entity';
import bcryptService from '../../../../utils/bcriptUtils';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { Resume } from '../../../resumes/resume/resume.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repository: Repository<Student>,
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
  ) {}

  async createStudent(createStudent: CreateStudentDto): Promise<Student> {
    const emailUsed = await this.findOne(createStudent.email);
    if (emailUsed) {
      throw new ConflictException('Email já cadastrado!');
    }

    const password = await bcryptService.hash(createStudent.password);

    const newStudent = this.repository.create({
      ...createStudent,
      password,
    });

    const studentSave = await this.repository.save({
      ...newStudent,
    });

    const newResume = this.resumeRepository.create({
      studentId: studentSave.id,
    });

    await this.resumeRepository.save(newResume);
    await this.repository.update(studentSave.id, { resumeId: newResume.id });

    return studentSave;
  }

  async findOne(email: string): Promise<Student> {
    if (!email) throw new UnauthorizedException();
    return await this.repository.findOne({
      relations: ['course', 'institution', 'city'],
      where: { email },
    });
  }

  async findAll(): Promise<Student[]> {
    return await this.repository.find();
  }

  async updateStudent(email: string, student: UpdateStudentDto) {
    if (!email) throw new UnauthorizedException();

    await this.repository.update(
      {
        email: email,
      },
      {
        ...student,
      },
    );
    const studentUpdated = await this.findOne(email);
    return studentUpdated;
  }
}
