import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { City } from '../entities/city.entity';
import { CitiesService } from './cities.service';

const cityOne = {
  name: 'Guarapuava',
  state: 'Paraná',
};

const citiesArray = [
  {
    name: 'Guarapuava',
    state: 'Paraná',
  },
  {
    name: 'Curitiba',
    state: 'Paraná',
  },
];

const mockRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((city) => Promise.resolve(city)),
  find: jest.fn(() => citiesArray),
  findOneBy: jest.fn(),
};

describe('CityService', () => {
  let service: CitiesService;
  let repository: Repository<City>;

  const CITY_REPOSITORY_TOKEN = getRepositoryToken(City);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: CITY_REPOSITORY_TOKEN, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    repository = module.get<Repository<City>>(CITY_REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should throw error if city already in database', async () => {
      const cityCreated = await service.createCity(cityOne);
      const cityTwo = {
        name: 'Guarapuava',
        state: 'Paraná',
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
      const cities = await service.findAll({ page: 0, limit: 10 });
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
