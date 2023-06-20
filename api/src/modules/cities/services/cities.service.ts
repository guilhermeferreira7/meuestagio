import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCityDto } from '../dtos/create-city.dto';
import { CreateRegionDto } from '../dtos/create-region.dto';
import { City } from '../entities/city.entity';
import { Region } from '../entities/region.entity';

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
      throw new ConflictException('City already exists!');
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

  async findAll({ page, limit }): Promise<City[]> {
    return await this.citiesRepository.find({
      skip: page,
      take: limit,
      order: {
        id: 'DESC',
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
