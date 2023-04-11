import { Test, TestingModule } from '@nestjs/testing';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { StudentsService } from '../services/student.service';
import { StudentsController } from './student.controller';

const createStudentDto: CreateStudentDto = {
  name: 'student one',
  email: 'email1@example.com',
  password: 'changeme',
  cityId: 1,
  institutionId: 1,
  courseId: 1,
};

const studentsArray = [
  {
    name: 'student one',
    email: 'student@email.com',
    cityId: 1,
    password: 'abc123',
  },
  {
    name: 'student two',
    email: 'student2@email.com',
    cityId: 1,
    password: 'abc123',
  },
  {
    name: 'student three',
    email: 'student3@email.com',
    cityId: 1,
    password: 'abc123',
  },
];

const mockService = {
  createStudent: jest.fn((student) => Promise.resolve({ id: 1, ...student })),
  findAll: jest.fn(() => studentsArray),
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

  describe('findAll()', () => {
    it('should return all students', async () => {
      const findAll = await controller.getAll();

      expect(findAll).toEqual(studentsArray);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
