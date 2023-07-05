import { Test, TestingModule } from '@nestjs/testing';

import { StudentsService } from '../../users/students/services/students.service';
import { AuthStudentService } from './auth-student.service';
import { Role } from '../roles/roles';
import bcryptService from '../../../utils/bcriptUtils';

const student = {
  id: 1,
  email: 'email',
  name: 'name',
  password: 'password',
  role: Role.STUDENT,
};

describe('AuthStudentService', () => {
  let service: AuthStudentService;
  let studentsService: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthStudentService,
        { provide: StudentsService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthStudentService>(AuthStudentService);
    studentsService = module.get<StudentsService>(StudentsService);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
    expect(studentsService).toBeDefined();
  });

  describe('validateStudent()', () => {
    it('should return null if student not found', async () => {
      const user = await service.validateStudent('email', 'password');
      expect(user).toBeNull();
    });

    it('should return null if student password is invalid', async () => {
      jest.spyOn(bcryptService, 'compare').mockResolvedValueOnce(false);
      jest
        .spyOn(studentsService, 'findOne')
        .mockResolvedValueOnce(student as any);

      const user = await service.validateStudent('email', 'password');

      expect(studentsService.findOne).toBeCalledWith('email');
      expect(user).toBeNull();
    });

    it('should return student if student password is valid', async () => {
      jest.spyOn(bcryptService, 'compare').mockResolvedValueOnce(true);
      jest
        .spyOn(studentsService, 'findOne')
        .mockResolvedValueOnce(student as any);

      const user = await service.validateStudent(student.email, 'pass');

      expect(user).toEqual({
        sub: student.id,
        email: student.email,
        name: student.name,
        role: student.role,
      });
    });
  });
});
