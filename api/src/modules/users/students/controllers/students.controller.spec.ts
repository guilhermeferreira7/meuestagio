import { Test, TestingModule } from '@nestjs/testing';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { StudentsService } from '../services/students.service';
import { StudentsController } from './students.controller';

const createStudentDto: CreateStudentDto = {
  name: 'student one',
  email: 'email1@example.com',
  password: 'changeme',
  institutionId: 1,
  courseId: 1,
  cityId: 1,
};

const mockService = {
  createStudent: jest.fn((student) => Promise.resolve({ id: 1, ...student })),
};

describe('StudentController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = app.get<StudentsController>(StudentsController);
    service = app.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a Student', async () => {
      const createStudent = await controller.create(createStudentDto);
      expect(createStudent).toEqual({ id: 1, ...createStudentDto });
      expect(service.createStudent).toHaveBeenCalledWith(createStudentDto);
    });
  });
});
