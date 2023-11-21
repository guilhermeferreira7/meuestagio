import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { Prisma } from '@prisma/client';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resume } from '../../resumes/resume/resume.entity';
import { ImagesService } from '../../images/images.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { StudentWithAllRelations } from '../../../types/prisma/student';
import bcryptService from '../../../utils/bcriptUtils';

const student = {
  id: 1,
  cityId: 1,
  city: {
    id: 1,
    name: 'city one',
    state: 'state one',
    regionId: 1,
    IBGECityCode: 1,
  },
  institution: {
    id: 1,
    name: 'institution one',
    cityId: 1,
    city: {
      id: 1,
      name: 'city one',
      state: 'state one',
      regionId: 1,
      IBGECityCode: 1,
    },
  },
  course: {
    id: 1,
    name: 'course one',
    areaId: 1,
    institutionId: 1,
    institution: {
      id: 1,
      name: 'institution one',
      cityId: 1,
      city: {
        id: 1,
        name: 'city one',
        state: 'state one',
        regionId: 1,
        IBGECityCode: 1,
      },
    },
  },
  resume: {
    id: 1,
    studentId: 1,
  },
  resumeId: 1,
  courseId: 1,
  institutionId: 1,
  name: 'student one',
  email: 'student@email.com',
  password: 'abc123',
  phone: '123456789',
  phoneVerified: false,
  emailVerified: false,
  about: 'about',
  imageUrl: 'imageurl',
};

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
          },
        },
        // TODO: remove this
        {
          provide: getRepositoryToken(Resume),
          useValue: {
            save: jest.fn().mockResolvedValue({} as Resume),
          },
        },
      ],
    }).compile();

    service = app.get<StudentsService>(StudentsService);
  });

  describe('createStudent', () => {
    it('should not create a student with an existing email', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce({} as StudentWithAllRelations);
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
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        email,
      } as StudentWithAllRelations);

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

  describe('updateImage', () => {});
});
