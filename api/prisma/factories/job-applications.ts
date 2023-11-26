import { JobApplication } from '@prisma/client';
import { createResume } from './resume';
import { createStudent } from './student';
import { prisma } from '../prisma';

export const createJobApplications = async (length: number, jobId: number) => {
  const student = await createStudent();
  const resume = await createResume();

  const jobApplications: JobApplication[] = [];
  for (let i = 0; i < length; i++) {
    const jobApp = await prisma.jobApplication.create({
      data: {
        jobId: jobId,
        resumeId: resume.id,
        studentId: student.id,
      },
    });
    jobApplications.push(jobApp);
  }

  return jobApplications;
};
