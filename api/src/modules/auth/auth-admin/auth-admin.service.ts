import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import bcryptService from '../../../utils/bcriptUtils';
import { User } from '../../users/user/user.entity';
import { UserAuth } from '../../../types/auth/user-auth';
import { Role } from '../roles/roles';

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    if (!email || !password) return null;
    const admin = await this.usersRepository.findOne({ where: { email } });
    if (!admin) return null;

    const validCredentials = await bcryptService.compare(
      password,
      admin.password,
    );

    if (!validCredentials) {
      return null;
    }

    return {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: Role.ADMIN,
    };
  }
}
