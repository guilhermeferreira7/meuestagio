import { Test, TestingModule } from '@nestjs/testing';
import { AreasService } from '../services/areas.service';
import { AreasController } from './areas.controller';

describe('AreasController', () => {
  let controller: AreasController;
  let service: AreasService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreasController],
      providers: [
        {
          provide: AreasService,
          useValue: { findAll: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AreasController>(AreasController);
    service = module.get<AreasService>(AreasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll() ', () => {
    it('should call service findAll()', async () => {
      await controller.findAll();
      expect(service.findAll).toBeCalled();
    });
  });
});
