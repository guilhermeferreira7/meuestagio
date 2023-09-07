import { Test, TestingModule } from '@nestjs/testing';
import { ResumesService } from './resumes.service';
import { Repository } from 'typeorm';
import { Resume } from './entities/resume.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Skill, SkillLevel } from './skills/skill.entity';

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

  describe('findByStudentId()', () => {
    it('should call repository.findOne', async () => {
      const spyFindOne = jest.spyOn(repository, 'findOne');
      await service.findByStudentId(1);
      expect(spyFindOne).toBeCalled();
    });
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

  describe('addSkill()', () => {
    it('should call skillRepository.create', async () => {
      const spyCreate = jest.spyOn(skillRepository, 'create');
      await service.addSkill({
        name: 'React',
        resumeId: 1,
        level: SkillLevel.Basic,
      });
      expect(spyCreate).toBeCalled();
    });

    it('should call skillRepository.save', async () => {
      const spySave = jest.spyOn(skillRepository, 'save');
      await service.addSkill({
        name: 'React',
        resumeId: 1,
        level: SkillLevel.Basic,
      });
      expect(spySave).toBeCalled();
    });
  });

  describe('deleteSkill()', () => {
    it('should call skillRepository.find', async () => {
      const spyFind = jest.spyOn(skillRepository, 'find');
      await service.deleteSkill(1);
      expect(spyFind).toBeCalled();
    });

    it('should call skillRepository.delete', async () => {
      const spyDelete = jest.spyOn(skillRepository, 'delete');
      await service.deleteSkill(1);
      expect(spyDelete).toBeCalled();
    });

    it('should throw an error if skill is not found', async () => {
      jest.spyOn(skillRepository, 'find').mockImplementationOnce(() => null);
      await expect(service.deleteSkill(1)).rejects.toThrowError(
        'Skill not found',
      );
    });
  });
});
