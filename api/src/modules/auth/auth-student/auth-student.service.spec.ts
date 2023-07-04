import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../../users/students/entities/student.entity';
import { StudentsService } from '../../users/students/services/students.service';
import { AuthStudentService } from './auth-student.service';

describe('AuthStudentService', () => {
  let service: AuthStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthStudentService,
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: StudentsService, useValue: { findOne: jest.fn() } },
        {
          provide: getRepositoryToken(Student),
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthStudentService>(AuthStudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
