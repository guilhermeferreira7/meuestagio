import { Test, TestingModule } from '@nestjs/testing';

import { CitiesService } from '../services/city.service';
import { CitiesController } from './city.controller';
import { InstitutionsService } from '../../institutions/services/institution.service';

const city = {
  name: 'Guarapuava',
  uf: 'PR',
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
      await controller.getAll();
      expect(service.findAll).toBeCalled();
    });
  });
});
