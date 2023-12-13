import { prisma } from '../prisma';
import { createArea } from './area';
import { createCity } from './city';
import { createCompany } from './company';
import { createRegion } from './region';

export const createJob = async (companyId?: number) => {
  const city = await createCity();
  const area = await createArea();
  const region = await createRegion();
  const company = await createCompany();

  const job = await prisma.job.create({
    data: {
      title: 'Job Title',
      description: 'Job description',
      keywords: 'keyword1, keyword2',
      state: 'Paraná',
      remote: false,
      salary: '1000',
      companyId: companyId || company.id,
      areaId: area.id,
      cityId: city.id,
      regionId: region.id,
    },
  });

  return job;
};

export const createManyJobs = async (lenght: number, companyId?: number) => {
  const jobs = [];
  for (let i = 0; i < lenght; i++) {
    const job = await createJob(companyId);
    jobs.push(job);
  }

  return jobs;
};
