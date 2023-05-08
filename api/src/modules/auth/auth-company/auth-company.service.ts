import { Injectable } from '@nestjs/common';

import bcryptService from '../../../utils/bcriptUtils';
import { UserAuth } from '../types/user-auth';
import { Role } from '../../../utils/roles';
import { CompaniesService } from '../../users/companies/services/companies.service';

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
