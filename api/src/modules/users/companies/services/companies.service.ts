import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';
import { cp } from 'fs';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import bcryptService from '../../../../utils/bcriptUtils';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(company: CreateCompanyDto) {
    const emailUsed = await this.findByEmail(company.email);
    if (emailUsed) {
      throw new ConflictException('Email já cadastrado!');
    }

    const cnpjUsed = await this.findByCnpj(company.cnpj);
    if (cnpjUsed) {
      throw new ConflictException('CNPJ já cadastrado!');
    }

    const password = await bcryptService.hash(company.password);
    const newCompany = this.companiesRepository.create({
      ...company,
      password,
    });
    return await this.companiesRepository.save(newCompany);
  }

  async findByEmail(email: string): Promise<Company> {
    return await this.companiesRepository.findOneBy({ email });
  }

  async findAll(): Promise<Company[]> {
    return await this.companiesRepository.find();
  }

  async findByCnpj(cnpj: string): Promise<Company> {
    return await this.companiesRepository.findOneBy({ cnpj });
  }

  async findOne(id: number): Promise<Company> {
    return await this.companiesRepository.findOne({
      relations: ['city'],
      where: { id },
    });
  }
}
