import { Test, TestingModule } from '@nestjs/testing';
import { EducationsService } from './educations.service';
import { EducationsController } from './educations.controller';
import { CreateEducationDto } from './create-education.dto';
import { Degree } from './educations.entity';

const mockService = {
  add: jest.fn((education) => Promise.resolve(education)),
  getAll: jest.fn((resumeId) => {
    if (resumeId !== 1) return Promise.resolve(null);
    return Promise.resolve([{ id: 1, resumeId }]);
  }),
  delete: jest.fn((id) => {
    if (id !== 1) return Promise.resolve(null);
    return Promise.resolve({ id });
  }),
};

describe('EducationsController', () => {
  let service: EducationsService;
  let controller: EducationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationsController],
      providers: [
        {
          provide: EducationsService,
          useValue: mockService,
        },
      ],
    }).compile();

    service = module.get<EducationsService>(EducationsService);
    controller = module.get<EducationsController>(EducationsController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add()', () => {
    it('should add new education', async () => {
      const educationDto: CreateEducationDto = {
        resumeId: 1,
        school: 'school one',
        degree: Degree.HighSchool,
        fieldOfStudy: 'field one',
        startDate: '2020-01-01',
        endDate: '2020-01-01',
      };
      const education = await controller.add(educationDto);

      expect(education).toEqual(educationDto);
      expect(service.add).toHaveBeenCalledWith(educationDto);
    });
  });

  describe('getAll()', () => {
    it('should get all educations', async () => {
      const educations = await controller.get(1);

      expect(educations).toEqual([{ id: 1, resumeId: 1 }]);
      expect(service.getAll).toHaveBeenCalledWith(1);
    });
  });

  describe('delete()', () => {
    it('should delete education', async () => {
      const education = await controller.delete(1);

      expect(education).toEqual({ id: 1 });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
