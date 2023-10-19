import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import bcryptService from '../../../../utils/bcriptUtils';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { ImagesService } from '../../../images/images.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly imagesService: ImagesService,
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

  async findOne(email: string): Promise<Company> {
    if (!email) return null;
    return await this.companiesRepository.findOne({
      relations: ['city'],
      where: { email },
    });
  }

  async update(email: string, dto: UpdateCompanyDto): Promise<Company> {
    if (dto.email) {
      return await this.updateEmail(email, dto);
    }

    await this.companiesRepository.update({ email }, dto);
    return await this.findOne(email);
  }

  async updateImage(
    email: string,
    image: Express.Multer.File,
  ): Promise<Company> {
    const { id } = await this.companiesRepository.findOne({
      where: { email },
    });

    const url = await this.imagesService.uploadImage(
      image,
      `companies/${id}/profile-picture`,
    );
    await this.companiesRepository.update({ email }, { imageUrl: url });
    return await this.findOne(email);
  }

  private async updateEmail(email: string, dto: UpdateCompanyDto) {
    const hasAnotherCompany = await this.companiesRepository.findOne({
      where: { email: dto.email },
    });

    if (hasAnotherCompany && hasAnotherCompany.email !== email) {
      throw new ConflictException('Email pertence a outro usuário');
    }
    await this.companiesRepository.update({ email }, dto);
    return await this.findOne(dto.email);
  }
}
