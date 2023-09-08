import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { City } from '../../cities/entities/city.entity';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';
import { Institution } from '../entities/institution.entity';

type InstitutionsQuery = {
  page?: number;
  limit?: number;
  cityId?: number;
  name?: string;
  orderBy?: string;
  order?: string;
};

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectRepository(Institution)
    private readonly repository: Repository<Institution>,
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
  ) {}

  async createInstitution(
    createInstitutionDto: CreateInstitutionDto,
  ): Promise<Institution> {
    await this.validate(createInstitutionDto);

    const newInstitution = this.repository.create(createInstitutionDto);
    await this.repository.save(newInstitution);

    return await this.findOne(newInstitution.id);
  }

  async delete(id: number) {
    const institution = await this.findOne(id);
    await this.repository.delete(id);
    return institution;
  }

  async findOne(id: number): Promise<Institution> {
    const institution = await this.repository.findOne({
      where: { id },
      relations: ['city'],
    });

    if (!institution) {
      throw new BadRequestException('Instituição não encontrada!');
    }

    return institution;
  }

  async findAll(
    query: InstitutionsQuery = {
      page: undefined,
      limit: undefined,
      cityId: undefined,
      name: undefined,
      orderBy: undefined,
      order: undefined,
    },
  ): Promise<Institution[]> {
    return await this.repository.find({
      skip: query.page,
      take: query.limit,
      where: {
        cityId: query.cityId,
        name: query.name ? ILike(`%${query.name}%`) : undefined,
      },
      order: {
        [query.orderBy || 'name']: query.order || 'ASC',
      },
      relations: ['city'],
    });
  }

  private async validate(institution: CreateInstitutionDto): Promise<void> {
    const institutionExists = await this.repository.findOne({
      where: {
        name: institution.name,
        cityId: institution.cityId,
      },
    });

    if (institutionExists) {
      throw new BadRequestException('Instituição já existe neste município!');
    }

    const cityExists = await this.citiesRepository.findOne({
      where: {
        id: institution.cityId,
      },
    });

    if (!cityExists) {
      throw new BadRequestException('Município não encontrado!');
    }
  }
}
