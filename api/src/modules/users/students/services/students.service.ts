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
import { ImagesService } from '../../../images/images.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repository: Repository<Student>,
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
    private readonly imagesService: ImagesService,
  ) {}

  async createStudent(createStudent: CreateStudentDto): Promise<Student> {
    if (await this.findOne(createStudent.email)) {
      throw new ConflictException('Email já cadastrado!');
    }
    const password = await bcryptService.hash(createStudent.password);

    const studentSave = await this.repository.save({
      ...createStudent,
      password,
    });

    const newResume = await this.resumeRepository.save({
      studentId: studentSave.id,
    });
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

  async updateStudent(email: string, dto: UpdateStudentDto) {
    if (dto.email) {
      return await this.updateEmail(email, dto);
    }

    await this.repository.update({ email }, dto);
    return await this.findOne(email);
  }

  async updateImage(
    email: string,
    image: Express.Multer.File,
  ): Promise<Student> {
    const { id } = await this.findOne(email);
    const url = await this.imagesService.uploadImage(
      image,
      `students/${id}/profile-picture`,
    );

    await this.repository.update({ email }, { imageUrl: url });

    return await this.findOne(email);
  }

  private async updateEmail(email: string, dto: UpdateStudentDto) {
    const anotherStudent = await this.repository.findOne({
      where: { email: dto.email },
    });
    if (anotherStudent && anotherStudent.email !== email) {
      throw new ConflictException('Email pertence a outro usuário');
    }
    await this.repository.update({ email }, dto);
    return await this.findOne(dto.email);
  }
}
