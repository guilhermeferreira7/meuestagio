import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { City } from '../../cities/entities/city.entity';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';
import { Institution } from '../entities/institution.entity';

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
    await this.institutionsReposity.save(newInstitution);

    const savedInstitution = await this.findOne(newInstitution.id);
    return savedInstitution;
  }

  async delete(id: number) {
    const institution = await this.findOne(id);
    await this.institutionsReposity.delete(id);
    return institution;
  }

  async findByName(name: string): Promise<Institution> {
    return await this.institutionsReposity.findOneBy({ name });
  }

  async findByCity(cityId: number) {
    return await this.institutionsReposity.find({ where: { cityId } });
  }

  async findOne(id: number): Promise<Institution> {
    const institution = await this.institutionsReposity.findOne({
      where: { id },
      relations: ['city'],
    });

    if (!institution) {
      throw new BadRequestException('Instituição não encontrada!');
    }

    return institution;
  }

  async findAll({ cityId }): Promise<Institution[]> {
    return await this.institutionsReposity.find({
      where: { cityId },
      relations: ['city'],
    });
  }

  private async validate(institution: CreateInstitutionDto): Promise<boolean> {
    const institutionExists = await this.findByName(institution.name);

    if (institutionExists) {
      throw new BadRequestException('Instituição já cadastrada!');
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
