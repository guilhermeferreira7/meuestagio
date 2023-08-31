import { Injectable } from '@nestjs/common';

import bcryptService from '../../../utils/bcriptUtils';
import { CompaniesService } from '../../users/companies/services/companies.service';
import { Role } from '../roles/roles';
import { UserAuth } from '../../../types/auth/user-auth';

@Injectable()
export class AuthCompanyService {
  constructor(private readonly companiesService: CompaniesService) {}

  async validateCompany(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    const company = await this.companiesService.findByEmail(email);

    const validCredentials =
      company && (await bcryptService.compare(password, company?.password));

    if (validCredentials) {
      return {
        sub: company.id,
        email: company.email,
        name: company.name,
        role: Role.COMPANY,
      };
    }
    return null;
  }
}
