import { Test, TestingModule } from '@nestjs/testing';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './create-experience.dto';

describe('ExperiencesController', () => {
  const mockService = {
    add: jest.fn((experience) => Promise.resolve(experience)),
    getAll: jest.fn((resumeId) => {
      if (resumeId !== 1) return Promise.resolve(null);
      return Promise.resolve([{ id: 1, resumeId }]);
    }),
    delete: jest.fn((id) => {
      if (id !== 1) return Promise.resolve(null);
      return Promise.resolve({ id });
    }),
  };

  let service: ExperiencesService;
  let controller: ExperiencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperiencesController],
      providers: [
        {
          provide: ExperiencesService,
          useValue: mockService,
        },
      ],
    }).compile();

    service = module.get<ExperiencesService>(ExperiencesService);
    controller = module.get<ExperiencesController>(ExperiencesController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add()', () => {
    it('should add new experience', async () => {
      const experienceDto = new CreateExperienceDto();
      const experience = await controller.add(experienceDto);
      expect(experience).toEqual(experienceDto);
      expect(service.add).toHaveBeenCalledWith(experienceDto);
    });
  });

  describe('get()', () => {
    it('should get all experiences', async () => {
      const experiences = await controller.get(1);
      expect(experiences).toEqual([{ id: 1, resumeId: 1 }]);
      expect(service.getAll).toHaveBeenCalledWith(1);
    });
  });

  describe('delete()', () => {
    it('should delete experience', async () => {
      const experience = await controller.delete(1);
      expect(experience).toEqual({ id: 1 });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
