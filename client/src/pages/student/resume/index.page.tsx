import React from "react";
import AppCard from "../../../components/AppCard";
import { Book } from "lucide-react";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../../services/api/clientApi";
import { Student } from "../../../utils/types/users/student";
import ResumeComponent from "./_resume";
import { Resume } from "../../../utils/types/resume";

interface PageProps {
  student: Student;
  resume?: Resume;
}

export default function ResumePage({ student, resume }: PageProps) {
  return (
    <>
      <div className="w-11/12">
        <AppCard>
          <ResumeComponent student={student} resume={resume} />
        </AppCard>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    const resume = await apiClient.get<Resume>("/resumes");
    return {
      props: {
        student: student.data,
        resume: resume.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
