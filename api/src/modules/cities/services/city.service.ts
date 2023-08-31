import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCityDto } from '../dtos/create-city.dto';
import { City } from '../models/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
  ) {}

  async createCity(createCityDto: CreateCityDto): Promise<City> {
    const cityExists = await this.findByName(createCityDto.name);

    if (cityExists) {
      throw new ConflictException('City already exists!');
    }

    const newCity = this.citiesRepository.create(createCityDto);
    return await this.citiesRepository.save(newCity);
  }

  async findAll(): Promise<City[]> {
    return await this.citiesRepository.find();
  }

  async findOne(id: number): Promise<City> {
    return await this.citiesRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<City> {
    return await this.citiesRepository.findOneBy({ name });
  }
}