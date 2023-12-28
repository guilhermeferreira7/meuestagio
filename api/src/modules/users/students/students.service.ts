import { ConflictException, Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateStudentDto } from './student-create.dto';
import bcryptService from '../../../utils/bcriptUtils';
import { UpdateStudentDto } from './student-update.dto';
import { ImagesService } from '../../images/images.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly imagesService: ImagesService,
    private prisma: PrismaService,
  ) {}

  async createStudent(createStudent: CreateStudentDto) {
    if (await this.findOne(createStudent.email)) {
      throw new ConflictException('Email já cadastrado!');
    }

    const password = await bcryptService.hash(createStudent.password);

    const studentSave = await this.prisma.student.create({
      data: {
        ...createStudent,
        password,
      },
    });

    const resume = await this.prisma.resume.create({
      data: {
        studentId: studentSave.id,
      },
    });

    await this.prisma.student.update({
      where: { id: studentSave.id },
      data: {
        resumeId: resume.id,
      },
    });

    return await this.findOne(createStudent.email);
  }

  async findOne(email: string) {
    const student = await this.prisma.student.findUnique({
      where: { email },
      include: {
        resume: true,
        institution: true,
        course: true,
        city: true,
      },
    });

    return student;
  }

  async findAll(): Promise<Student[]> {
    return await this.prisma.student.findMany();
  }

  async updateStudent(email: string, dto: UpdateStudentDto) {
    if (dto.email) {
      const studentExists = await this.findOne(dto.email);
      if (studentExists && studentExists.email !== email) {
        throw new ConflictException('Email pertence a outro usuário');
      }
    }

    const studentUpdated = await this.prisma.student.update({
      where: { email },
      data: dto,
    });

    return await this.findOne(studentUpdated.email);
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

    await this.prisma.student.update({
      where: { email },
      data: { imageUrl: url },
    });

    return await this.findOne(email);
  }

  private async updateEmail(oldEmail: string, newEmail: string) {
    if (await this.findOne(newEmail)) {
      throw new ConflictException('Email pertence a outro usuário');
    }

    await this.prisma.student.update({
      where: { email: oldEmail },
      data: { email: newEmail },
    });

    return await this.findOne(newEmail);
  }
}
