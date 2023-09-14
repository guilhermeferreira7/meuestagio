import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../../../auth/roles/roles';
import { AdminController } from './admin.controller';
import { User } from '../../user/user.entity';

const mockRepository = {
  findOne: jest.fn((user) => user),
};

describe('Admin Controller', () => {
  let controller: AdminController;
  let repository: Repository<User>;

  beforeEach(async () => {
    const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
    })
      .useMocker((token) => {
        switch (token) {
          case USER_REPOSITORY_TOKEN:
            return mockRepository;
        }
      })
      .compile();

    controller = module.get<AdminController>(AdminController);
    repository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getProfile()', () => {
    it('should call repository', async () => {
      await controller.getProfile({
        user: {
          email: 'admin@email.com',
          name: 'admin',
          sub: 1,
          role: Role.ADMIN,
        },
      });
      expect(repository.findOne).toBeCalledWith({
        where: { email: 'admin@email.com' },
      });
    });

    it('should throw error if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockReturnValueOnce(undefined);
      await expect(
        controller.getProfile({
          user: {
            email: 'admin@email.com',
            name: 'admin',
            sub: 1,
            role: Role.ADMIN,
          },
        }),
      ).rejects.toThrowError('Unauthorized');

      expect(repository.findOne).toBeCalledWith({
        where: { email: 'admin@email.com' },
      });
    });
  });
});
