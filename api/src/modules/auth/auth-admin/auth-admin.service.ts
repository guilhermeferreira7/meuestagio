import { Injectable } from '@nestjs/common';

import bcryptService from '../../../utils/bcriptUtils';
import { CompaniesService } from '../../users/companies/services/companies.service';
import { dataSource } from '../../../database/data-source';
import { User } from '../../users/user/user.entity';
import { UserAuth } from '../../../types/auth/user-auth';
import { Role } from '../roles/roles';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
