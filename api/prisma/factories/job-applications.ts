import { JobApplication } from '@prisma/client';
import { createStudent } from './student';
import { prisma } from '../prisma';

export const createJobApplications = async (length: number, jobId: number) => {
  const student = await createStudent();

  const jobApplications: JobApplication[] = [];

  for (let i = 0; i < length; i++) {
    const jobApp = await prisma.jobApplication.create({
      data: {
        jobId: jobId,
        resumeId: student.resumeId,
        studentId: student.id,
      },
    });
    jobApplications.push(jobApp);
  }

  return await Promise.all(jobApplications);
};
