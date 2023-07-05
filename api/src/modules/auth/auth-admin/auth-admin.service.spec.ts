import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminService } from './auth-admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/user/user.entity';
import { Role } from '../roles/roles';
import bcryptService from '../../../utils/bcriptUtils';

const admin = {
  id: 1,
  email: 'admin@email.com',
  name: 'name',
  role: Role.ADMIN,
};

describe('AuthAdminService', () => {
  let service: AuthAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthAdminService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthAdminService>(AuthAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAdmin()', () => {
    it('should return null if admin not found', async () => {
      const user = await service.validateAdmin('email', 'password');
      expect(user).toBeNull();
    });

    it('should return null if admin password is invalid', async () => {
      jest.spyOn(bcryptService, 'compare').mockResolvedValueOnce(false);
      jest
        .spyOn(service['usersRepository'], 'findOne')
        .mockResolvedValueOnce(admin as any);

      const user = await service.validateAdmin('admin@email.com', 'pass');

      expect(service['usersRepository'].findOne).toBeCalledWith({
        where: { email: admin.email },
      });

      expect(user).toBeNull();
    });

    it('should return admin if admin password is valid', async () => {
      jest.spyOn(bcryptService, 'compare').mockResolvedValueOnce(true);
      jest
        .spyOn(service['usersRepository'], 'findOne')
        .mockResolvedValueOnce(admin as any);

      const user = await service.validateAdmin(admin.email, 'pass');

      expect(user).toEqual({
        sub: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      });
    });
  });
});
