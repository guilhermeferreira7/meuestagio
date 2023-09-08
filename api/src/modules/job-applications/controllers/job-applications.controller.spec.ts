import { JobApplicationsController } from '../controllers/job-applications.controller';
import { JobApplicationsService } from '../services/job-applications.service';
import { Test, TestingModule } from '@nestjs/testing';

const oneJobApplication = {
  jobId: 1,
  studentId: 1,
  resumeId: 1,
};

describe('JobApplicationsController', () => {
  let controller: JobApplicationsController;
  let service: JobApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobApplicationsController],
      providers: [
        {
          provide: JobApplicationsService,
          useValue: {
            create: jest.fn(),
            findByJobId: jest.fn(),
            findByStudentId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobApplicationsController>(
      JobApplicationsController,
    );
    service = module.get<JobApplicationsService>(JobApplicationsService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should call service.create', async () => {
      const spyCreate = jest.spyOn(service, 'create');
      await controller.create(oneJobApplication);
      expect(spyCreate).toBeCalled();
      expect(spyCreate).toBeCalledWith(oneJobApplication);
    });
  });

  describe('findByJobId()', () => {
    it('should call service findByJobId', async () => {
      const jobId = 1;
      const spyFind = jest.spyOn(service, 'findByJobId');
      await controller.findByJobId({ query: { jobId } });

      expect(spyFind).toBeCalled();
      expect(spyFind).toBeCalledWith(jobId);
    });
  });

  describe('findByStudentId()', () => {
    it('should call service.findByStudentId', async () => {
      const studentId = 1;
      const spyFind = jest.spyOn(service, 'findByStudentId');
      await controller.findByStudentId({ query: { studentId } });
      expect(spyFind).toBeCalled();
      expect(spyFind).toBeCalledWith(studentId);
    });
  });
});
