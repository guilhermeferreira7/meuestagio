import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';
import { createArea } from './area';
import { createCity } from './city';
import { createCompany } from './company';
import { createRegion } from './region';
import { faker } from '@faker-js/faker';

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
    include: {
      company: { select: { name: true, imageUrl: true } },
      city: { select: { name: true } },
      area: { select: { title: true } },
      region: { select: { name: true } },
    },
  });

  return job;
};

export async function createJobWith(data?: Partial<Prisma.JobCreateInput>) {
  const company = await createCompany();
  const area = await createArea();
  const city = company.city;
  const regionId = company.city.regionId;

  return await prisma.job.create({
    data: {
      title: data?.title ? data.title : faker.word.noun(),
      description: data?.description ? data.description : faker.word.noun(),
      keywords: data?.keywords ? data.keywords : 'keyword1, keyword2',
      state: data?.state ? data.state : faker.word.noun(),
      remote: data?.remote ? data.remote : false,
      salary: data?.salary ? data.salary : faker.string.numeric(4),
      company: data?.company ? data.company : { connect: company },
      area: data?.area ? data.area : { connect: area },
      city: data?.city ? data.city : { connect: city },
      region: data?.region ? data.region : { connect: { id: regionId } },
    },
    include: {
      company: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
      city: {
        select: {
          name: true,
        },
      },
      area: {
        select: {
          title: true,
        },
      },
      region: {
        select: {
          name: true,
        },
      },
    },
  });
}

export const createManyJobs = async (lenght: number, companyId?: number) => {
  const jobs = [];
  for (let i = 0; i < lenght; i++) {
    jobs.push(createJob(companyId));
  }

  return await Promise.all(jobs);
};
