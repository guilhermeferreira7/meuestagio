import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateCityDto } from '../dtos/create-city.dto';
import { CreateRegionDto } from '../dtos/create-region.dto';
import { City } from '../entities/city.entity';
import { Region } from '../entities/region.entity';

interface CitiesQuery {
  page?: number;
  limit?: number;
  state?: string;
  region?: number;
  name?: string;
  orderBy?: string;
}

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
    @InjectRepository(Region)
    private readonly regionsRepository: Repository<Region>,
  ) {}

  async createCity(createCityDto: CreateCityDto): Promise<City> {
    const cityExists = await this.findByName(createCityDto.name);

    if (cityExists) {
      throw new ConflictException('Cidade já cadastrada!');
    }

    const newCity = this.citiesRepository.create({
      ...createCityDto,
    });
    return await this.citiesRepository.save(newCity);
  }

  async createRegion(createRegionDto: CreateRegionDto): Promise<Region> {
    const regionExists = await this.regionsRepository.findOneBy({
      name: createRegionDto.name,
    });

    if (regionExists) {
      throw new ConflictException('Região já existe!');
    }

    const newRegion = this.regionsRepository.create({
      ...createRegionDto,
    });

    return await this.regionsRepository.save(newRegion);
  }

  async findAll(
    query: CitiesQuery = {
      page: 1,
      limit: 10,
      state: undefined,
      name: undefined,
      orderBy: undefined,
    },
  ): Promise<City[]> {
    const byName = query.orderBy === 'name' ? 'ASC' : 'DESC';
    const lastCreated = query.orderBy === 'lastCreated' ? 'DESC' : undefined;

    const res = await this.citiesRepository.find({
      skip: query.page,
      take: query.limit,
      order: {
        id: lastCreated,
        name: byName,
      },
      where: {
        state: query.state,
        regionId: query.region,
        name: query.name ? ILike(`%${query.name}%`) : undefined,
      },
    });

    return res;
  }

  async findRegionsByState({ page, limit, state, orderBy }): Promise<Region[]> {
    const byName = orderBy === 'name' ? 'ASC' : 'DESC';
    const lastCreated = orderBy === 'lastCreated' ? 'DESC' : undefined;
    return await this.regionsRepository.find({
      skip: page,
      take: limit,
      order: {
        id: lastCreated,
        name: byName,
      },
      where: {
        state,
      },
    });
  }

  async findOne(id: number): Promise<City> {
    return await this.citiesRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<City> {
    return await this.citiesRepository.findOneBy({ name });
  }
}
