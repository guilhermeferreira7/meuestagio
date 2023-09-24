import { Repository } from 'typeorm';
import { EducationsService } from './educations.service';
import { Degree, Education } from './educations.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEducationDto } from './create-education.dto';
import { NotFoundException } from '@nestjs/common';

const mockEducationsRepository = {
  findOne: jest.fn(),
  find: jest.fn(
    () =>
      new Promise((resolve) => {
        resolve([new Education()]);
      }),
  ),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const education: CreateEducationDto = {
  resumeId: 1,
  school: 'Test school',
  startDate: '2020-01-01',
  endDate: '2020-01-01',
  degree: Degree.HighSchool,
  fieldOfStudy: 'Test field of study',
};

describe('EducationsService', () => {
  let service: EducationsService;
  let repository: Repository<Education>;

  const REPOSITORY_TOKEN = getRepositoryToken(Education);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EducationsService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: mockEducationsRepository,
        },
      ],
    }).compile();

    service = module.get<EducationsService>(EducationsService);
    repository = module.get<Repository<Education>>(REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('add()', () => {
    it('should call repository.create', async () => {
      await service.add(education);
      expect(repository.create).toBeCalledWith(education);
    });

    it('should call repository.save', async () => {
      await service.add(education);
      expect(repository.save).toBeCalled();
    });

    it('should throw ConflictException', async () => {
      const education = new Education();
      const dto = new CreateEducationDto();
      jest.spyOn(repository, 'findOne').mockReturnValue(
        Promise.resolve({
          resumeId: 1,
          school: 'Test school',
          ...education,
        }),
      );
      await expect(service.add(dto)).rejects.toThrow('Formação já cadastrada');
    });
  });

  describe('getAll()', () => {
    it('should call repository.find', async () => {
      await service.getAll(1);
      expect(repository.find).toBeCalled();
    });
  });
  describe('delete()', () => {
    it('should call repository.find', async () => {
      await service.delete(1);
      expect(repository.find).toBeCalled();
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(repository, 'find').mockReturnValueOnce(undefined);
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('should call repository.delete', async () => {
      await service.delete(1);
      expect(repository.delete).toBeCalled();
    });
  });
});
