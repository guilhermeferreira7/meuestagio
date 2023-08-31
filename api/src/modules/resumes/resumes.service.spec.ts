import { Test, TestingModule } from '@nestjs/testing';
import { ResumesService } from './resumes.service';
import { Repository } from 'typeorm';
import { Resume } from './entities/resume.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';

const mockRepository = {};
const mockSkillRepository = {};

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
});
