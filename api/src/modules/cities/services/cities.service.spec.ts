import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { City } from '../entities/city.entity';
import { CitiesService } from './cities.service';
import { CreateCityDto } from '../dtos/create-city.dto';
import { Region } from '../entities/region.entity';

const cityOne: CreateCityDto = {
  name: 'Guarapuava',
  state: 'Paraná',
  IBGECityCode: 4109401,
  regionId: 1,
};

const citiesArray = [
  {
    name: 'Guarapuava',
    state: 'Paraná',
    IBGECityCode: 4109401,
    regionId: 1,
  },
  {
    name: 'Curitiba',
    state: 'Paraná',
    IBGECityCode: 4109402,
    regionId: 2,
  },
];

const mockRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((city) => Promise.resolve(city)),
  find: jest.fn(() => citiesArray),
  findOneBy: jest.fn(),
};

const mockRegionsRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((region) => Promise.resolve(region)),
  find: jest.fn(() => citiesArray),
  findOneBy: jest.fn(),
};

describe('CityService', () => {
  let service: CitiesService;
  let repository: Repository<City>;
  let regionsRepository: Repository<Region>;

  const CITY_REPOSITORY_TOKEN = getRepositoryToken(City);
  const REGIONS_REPOSITORY_TOKEN = getRepositoryToken(Region);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: CITY_REPOSITORY_TOKEN, useValue: mockRepository },
        { provide: REGIONS_REPOSITORY_TOKEN, useValue: mockRegionsRepository },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    repository = module.get<Repository<City>>(CITY_REPOSITORY_TOKEN);
    regionsRepository = module.get<Repository<Region>>(
      REGIONS_REPOSITORY_TOKEN,
    );
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository be defined', () => {
    expect(repository).toBeDefined();
    expect(regionsRepository).toBeDefined();
  });

  describe('create()', () => {
    it('should throw error if city already in database', async () => {
      const cityCreated = await service.createCity(cityOne);
      const cityTwo = {
        name: 'Guarapuava',
        state: 'Paraná',
        IBGECityCode: 4109401,
        regionId: 1,
      };

      jest
        .spyOn(repository, 'findOneBy')
        .mockReturnValue(Promise.resolve(cityCreated));

      try {
        await service.createCity(cityTwo);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('City already exists!');
      }
    });

    it('should call repository.create', async () => {
      jest.spyOn(repository, 'findOneBy').mockImplementation(() => undefined);

      await service.createCity(cityOne);
      expect(repository.create).toHaveBeenCalledWith(cityOne);
    });

    it('should call repository.save', async () => {
      await service.createCity(cityOne);
      expect(repository.save).toHaveBeenCalledWith(cityOne);
    });
  });

  describe('findAll()', () => {
    it('should return all cities', async () => {
      const cities = await service.findAll({ limit: 10, page: 1 });
      expect(cities).toEqual(citiesArray);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return one city by id', async () => {
      const findSpy = jest.spyOn(repository, 'findOneBy');
      expect(service.findOne(1));
      expect(findSpy).toBeCalledWith({ id: 1 });
    });
  });
});
