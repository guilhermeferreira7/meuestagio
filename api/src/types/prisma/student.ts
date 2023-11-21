import { Prisma } from '@prisma/client';

export type StudentWithAllRelations = Prisma.StudentGetPayload<{
  include: {
    city: true;
    institution: true;
    course: true;
    resume: true;
  };
}>;
