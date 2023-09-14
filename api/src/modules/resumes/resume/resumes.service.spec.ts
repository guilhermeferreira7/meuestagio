import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ResumesService } from './resumes.service';
import { Skill } from '../skills/skill.entity';
import { Resume } from './resume.entity';

const mockRepository = {
  findOne: jest.fn((resume) => resume),
  update: jest.fn((resume) => resume),
};
const mockSkillRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((skill) => Promise.resolve(skill)),
  find: jest.fn(() => []),
  delete: jest.fn((skill) => skill),
  findOneBy: jest.fn(),
};

describe('ResumesService', () => {
  let service: ResumesService;
  let repository: Repository<Resume>;
  let skillRepository: Repository<Skill>;

  const REPOSITORY_TOKEN = getRepositoryToken(Resume);
  const SKILL_REPOSITORY_TOKEN = getRepositoryToken(Skill);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumesService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: SKILL_REPOSITORY_TOKEN,
          useValue: mockSkillRepository,
        },
      ],
    }).compile();

    service = module.get<ResumesService>(ResumesService);
    repository = module.get<Repository<Resume>>(REPOSITORY_TOKEN);
    skillRepository = module.get<Repository<Skill>>(SKILL_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(skillRepository).toBeDefined();
  });

  describe('update()', () => {
    it('should call repository.update', async () => {
      const spyUpdate = jest.spyOn(repository, 'update');

      await service.update(1, {
        id: 1,
        title: 'John Doe',
        about: 'Lorem ipsum dolor sit amet',
      });
      expect(spyUpdate).toBeCalled();
    });
  });
});
