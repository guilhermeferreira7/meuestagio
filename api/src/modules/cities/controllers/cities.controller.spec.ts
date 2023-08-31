import { Test, TestingModule } from '@nestjs/testing';

import { CitiesService } from '../services/cities.service';
import { CitiesController } from './cities.controller';
import { InstitutionsService } from '../../institutions/services/institutions.service';

const city = {
  name: 'Guarapuava',
  state: 'Paraná',
  regionId: 1,
  IBGECityCode: 4109401,
};

describe('CitiesController', () => {
  let controller: CitiesController;
  let service: CitiesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: { createCity: jest.fn(), findAll: jest.fn() },
        },
        { provide: InstitutionsService, useValue: {} },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call service when creating', async () => {
      await controller.createCity(city);
      expect(service.createCity).toBeCalled();
    });
  });

  describe('getAll() ', () => {
    it('should call service findAll()', async () => {
      await controller.getAll({ query: { page: 1, limit: 10 } });
      expect(service.findAll).toBeCalled();
    });
  });
});
