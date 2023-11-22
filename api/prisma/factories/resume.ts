import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';

export const createResume = async () => {
  return prisma.resume.create({});
};
