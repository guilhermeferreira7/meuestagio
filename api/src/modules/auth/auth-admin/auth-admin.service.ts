import { Injectable } from '@nestjs/common';

import bcryptService from '../../../utils/bcriptUtils';
import { CompaniesService } from '../../users/companies/services/companies.service';
import { dataSource } from '../../../database/data-source';
import { User } from '../../users/user/user.entity';
import { UserAuth } from '../../../types/auth/user-auth';
import { Role } from '../roles/roles';

@Injectable()
export class AuthAdminService {
  constructor() {}

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    const usersRepository = dataSource.getRepository(User);
    const admin = await usersRepository.findOne({ where: { email } });

    const validCredentials =
      admin && (await bcryptService.compare(password, admin?.password));

    if (validCredentials) {
      return {
        sub: admin.id,
        email: admin.email,
        name: admin.name,
        role: Role.ADMIN,
      };
    }

    return null;
  }
}
