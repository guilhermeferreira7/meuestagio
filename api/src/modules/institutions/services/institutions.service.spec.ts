import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { City } from '../../cities/entities/city.entity';
import { Institution } from '../entities/institution.entity';
import { InstitutionsService } from './institutions.service';

const institutionOne = {
  name: 'UTFPR',
  cityId: 1,
};

const institutionsArray = [
  {
    name: 'UTFPR',
    cityId: 1,
  },
  {
    name: 'Unicentro',
    cityId: 1,
  },
];

const mockInstitutionsRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((institution) => Promise.resolve(institution)),
  findOne: jest.fn(() => institutionOne),
  find: jest.fn(() => institutionsArray),
};

const mockCityRepository = {
  findOne: jest.fn((id) =>
    Promise.resolve({ id, name: 'Guarapuava', state: 'PR' }),
  ),
};

describe('InstitutionsService', () => {
  let institutionsService: InstitutionsService;
  let institutionsRepository: Repository<Institution>;
  let citiesRepository: Repository<City>;

  const INSTITUTION_REPOSTITORY_TOKEN = getRepositoryToken(Institution);
  const CITY_REPOSITORY_TOKEN = getRepositoryToken(City);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstitutionsService,
        {
          provide: INSTITUTION_REPOSTITORY_TOKEN,
          useValue: mockInstitutionsRepository,
        },
        {
          provide: CITY_REPOSITORY_TOKEN,
          useValue: mockCityRepository,
        },
      ],
    }).compile();

    institutionsService = module.get<InstitutionsService>(InstitutionsService);
    institutionsRepository = module.get<Repository<Institution>>(
      INSTITUTION_REPOSTITORY_TOKEN,
    );
    citiesRepository = module.get<Repository<City>>(CITY_REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(institutionsService).toBeDefined();
  });

  it('repostitories should be defined', () => {
    expect(institutionsRepository).toBeDefined();
    expect(citiesRepository).toBeDefined();
  });

  describe('create()', () => {
    it('should validate institution', async () => {
      try {
        await institutionsService.createInstitution(institutionOne);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Instituição já existe neste município!');
      }
    });

    it('should call repository.create', async () => {
      jest
        .spyOn(institutionsRepository, 'findOne')
        .mockReturnValueOnce(Promise.resolve(undefined));

      await institutionsService.createInstitution(institutionOne);
      expect(institutionsRepository.create).toBeCalledWith(institutionOne);
    });

    it('should call repository.save', async () => {
      jest
        .spyOn(institutionsRepository, 'findOne')
        .mockReturnValueOnce(Promise.resolve(undefined));

      await institutionsService.createInstitution(institutionOne);
      expect(institutionsRepository.save).toBeCalledWith(institutionOne);
    });
  });

  describe('findOne()', () => {
    it('should return one institution by id', async () => {
      const institution = await institutionsService.findOne(1);
      expect(institutionsRepository.findOne).toBeCalled();
      expect(institution).toEqual(institutionOne);
    });
  });

  describe('findAll()', () => {
    it('should return all institutions', async () => {
      const institutions = await institutionsService.findAll({ cityId: null });
      expect(institutions).toEqual(institutionsArray);
      expect(institutionsRepository.find).toBeCalled();
    });
  });
});
