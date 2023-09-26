import { Test, TestingModule } from '@nestjs/testing';
import { ExperiencesService } from './experiences.service';
import { Experience } from './experiences.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateExperienceDto } from './create-experience.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

const experience: CreateExperienceDto = {
  resumeId: 1,
  company: 'Test company',
  position: 'Test position',
  description: 'Test description',
  currentJob: false,
  startDate: new Date(),
  endDate: '2020-01-01',
};

describe('ExperiencesService', () => {
  let service: ExperiencesService;
  let repository: Repository<Experience>;

  const REPOSITORY_TOKEN = getRepositoryToken(Experience);
  const mockExperiencesRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperiencesService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: mockExperiencesRepository,
        },
      ],
    }).compile();

    service = module.get<ExperiencesService>(ExperiencesService);
    repository = module.get<Repository<Experience>>(REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('add()', () => {
    it('should call repository.save', async () => {
      await service.add(experience);
      expect(repository.save).toBeCalledWith(experience);
    });

    it('should throw an error if experience already exists', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(new Experience()));
      await expect(service.add(experience)).rejects.toThrow(ConflictException);
    });
  });

  describe('getAll()', () => {
    it('should call repository.find', async () => {
      await service.getAll(1);
      expect(repository.find).toBeCalled();
    });
  });

  describe('delete()', () => {
    it('should throw an error if experience does not exist', async () => {
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('should delete experience if it exists', async () => {
      jest
        .spyOn(repository, 'find')
        .mockReturnValue(Promise.resolve([new Experience()]));
      await service.delete(1);
      expect(repository.delete).toBeCalled();
    });
  });
});
