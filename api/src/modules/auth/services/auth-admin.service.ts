import { Injectable } from '@nestjs/common';

import bcryptService from '../../../utils/bcriptUtils';
import { UserAuth } from '../../../types/auth/user-auth';
import { Role } from '../roles/roles';
import { AdminService } from '../../users/admin/admin.service';

@Injectable()
export class AuthAdminService {
  constructor(private readonly adminService: AdminService) {}

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    const admin = await this.adminService.findByEmail(email);
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
