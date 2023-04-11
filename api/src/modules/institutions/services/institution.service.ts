import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { City } from '../../cities/models/city.entity';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';
import { Institution } from '../models/institution.entity';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectRepository(Institution)
    private readonly institutionsReposity: Repository<Institution>,
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
  ) {}

  async createInstitution(
    createInstitutionDto: CreateInstitutionDto,
  ): Promise<Institution> {
    const validInstitution = await this.validate(createInstitutionDto);

    if (!validInstitution) {
      throw new BadRequestException();
    }

    const newInstitution =
      this.institutionsReposity.create(createInstitutionDto);
    return await this.institutionsReposity.save(newInstitution);
  }

  async findByName(name: string): Promise<Institution> {
    return await this.institutionsReposity.findOneBy({ name });
  }

  async findByCity(cityId: number) {
    return await this.institutionsReposity.find({ where: { cityId } });
  }

  async findOne(id: number): Promise<Institution> {
    return await this.institutionsReposity.findOneBy({ id });
  }

  async findAll(): Promise<Institution[]> {
    return await this.institutionsReposity.find();
  }

  private async validate(institution: CreateInstitutionDto): Promise<boolean> {
    const institutionExists = await this.findByName(institution.name);

    if (institutionExists) {
      throw new BadRequestException('Institution already exists!');
    }

    const cityExists = await this.citiesRepository.findOneBy({
      id: institution.cityId,
    });

    if (!cityExists) {
      return false;
    }

    return true;
  }
}
