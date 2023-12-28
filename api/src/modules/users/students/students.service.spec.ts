import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { StudentsService } from './students.service';
import { ImagesService } from '../../images/images.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { StudentWithAllRelations } from '../../../types/prisma/student';
import bcryptService from '../../../utils/bcriptUtils';

const resume = { studentId: 1 } as Prisma.ResumeGetPayload<{
  include: {
    student: { select: { name: true } };
  };
}>;
const student = { name: 'student name' } as StudentWithAllRelations;

describe('Students Service', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        ImagesService,
        {
          provide: PrismaService,
          useValue: {
            student: {
              create: jest.fn().mockResolvedValue(student),
              findUnique: jest.fn().mockResolvedValue(null),
              findMany: jest.fn().mockResolvedValue([student]),
              update: jest.fn().mockResolvedValue(student),
            },
            resume: {
              create: jest.fn().mockResolvedValue(resume),
            },
          },
        },
      ],
    }).compile();

    service = app.get<StudentsService>(StudentsService);
  });

  describe('createStudent', () => {
    it('should not create a student with an existing email', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(student);
      await expect(service.createStudent(student)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash the password', async () => {
      jest.spyOn(bcryptService, 'hash').mockResolvedValue('hashedPassword');
      await service.createStudent(student);
      expect(bcryptService.hash).toHaveBeenCalledWith(student.password);
    });
  });

  describe('updateStudent', () => {
    it('should not update the email if it is taken', async () => {
      const email = 'new@email.com';
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(student);

      await expect(
        service.updateStudent(student.email, { email }),
      ).rejects.toThrow('Email pertence a outro usuário');
    });

    it('should update the email if it is not taken', async () => {
      const email = 'new@email.com';
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

      expect(service.updateStudent(student.email, { email })).resolves;
    });
  });
});
