import { prisma } from '../prisma';

export const createResume = async (studentId: number) => {
  return prisma.resume.create({
    data: {
      studentId,
    },
  });
};
