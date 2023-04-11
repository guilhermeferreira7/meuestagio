import { Test, TestingModule } from '@nestjs/testing';

import { InstitutionsController } from './institution.controller';
import { InstitutionsService } from '../services/institution.service';
import { CoursesService } from '../../courses/services/courses.service';

describe('InstitutionsController', () => {
  let controller: InstitutionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstitutionsController],
      providers: [
        { provide: InstitutionsService, useValue: {} },
        { provide: CoursesService, useValue: {} },
      ],
    }).compile();

    controller = module.get<InstitutionsController>(InstitutionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
