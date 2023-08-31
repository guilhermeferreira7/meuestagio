import { Test, TestingModule } from '@nestjs/testing';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';

describe('ResumesController', () => {
  let controller: ResumesController;
  let service: ResumesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumesController],
      providers: [
        {
          provide: ResumesService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ResumesController>(ResumesController);
    service = module.get<ResumesService>(ResumesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
