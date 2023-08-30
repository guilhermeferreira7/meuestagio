import { GetServerSideProps } from "next";
import React from "react";
import { getAPIClient } from "../../../services/api/clientApi";
import { Student } from "../../../utils/types/users/student";
import { JobApplication } from "../../../utils/types/job-application";
import AppCard from "../../../components/AppCard";
import Link from "next/link";

interface JobApplicationsProps {
  student: Student;
  jobApplications: JobApplication[];
}

export default function JobApplicationsPage({
  student,
  jobApplications,
}: JobApplicationsProps) {
  return (
    <>
      <h2 className="text-xl">Minhas candidaturas</h2>
      <div className="flex flex-col gap-1 w-11/12">
        {jobApplications.map((jobApplication) => {
          return (
            <AppCard key={jobApplication.id}>
              <div className="flex justify-between items-center">
                <div className="w-1/2 flex flex-col gap-1 ">
                  <h2>Vaga: {jobApplication.vacancy.title}</h2>
                  <h2>Empresa: {jobApplication.vacancy.company.name}</h2>
                </div>
                <div className="w-1/2 flex flex-col gap-1 ">
                  <Link
                    href={`vacancy/${jobApplication.vacancy.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Detalhes
                  </Link>
                  <button className="btn btn-sm btn-error">Desistir</button>
                </div>
              </div>
            </AppCard>
          );
        })}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  try {
    const student = await apiClient.get<Student>("/students/profile");
    const jobApplications = await apiClient.get("/job-applications/student", {
      params: {
        studentId: student.data.id,
      },
    });

    return {
      props: {
        student: student.data,
        jobApplications: jobApplications.data,
      },
    };
  } catch (error: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
