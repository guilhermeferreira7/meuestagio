import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../../users/students/models/student.entity';
import { StudentsService } from '../../users/students/services/student.service';
import { AuthStudentService } from './auth-student.service';

describe('AuthStudentService', () => {
  let service: AuthStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthStudentService,
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: StudentsService, useValue: { findByEmail: jest.fn() } },
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
