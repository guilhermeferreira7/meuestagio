import { Repository } from 'typeorm';
import { AreasService } from './areas.service';
import { Area } from '../entities/area.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

const mockRepository = {
  find: jest.fn(() => []),
  findOneBy: jest.fn(),
};

describe('AreasService', () => {
  let service: AreasService;
  let repository: Repository<Area>;

  const AREA_REPOSITORY_TOKEN = getRepositoryToken(Area);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AreasService,
        { provide: AREA_REPOSITORY_TOKEN, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AreasService>(AreasService);
    repository = module.get<Repository<Area>>(AREA_REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of areas', async () => {
      const areas = await service.findAll();
      expect(areas).toEqual([]);
    });
  });
});
