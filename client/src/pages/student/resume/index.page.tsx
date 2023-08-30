import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Book, ChevronLeft } from "lucide-react";

import { getAPIClient } from "../../../services/api/clientApi";
import { Student } from "../../../utils/types/users/student";
import { Resume } from "../../../utils/types/resume";
import ResumeForm from "./_form";
import ResumeView from "./_view";
import { api } from "../../../services/api/api";
import { useRouter } from "next/router";

interface PageProps {
  student: Student;
  resume: Resume;
}

export default function ResumePage({ student, resume }: PageProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [resumeUpdated, setResumeUpdated] = useState<Resume>(resume);
  const router = useRouter();

  const vacancyId = router.query.vacancy;

  async function updateResume() {
    setEditMode(!editMode);
    const updatedResume = await api.get<Resume>("/resumes/me", {
      params: {
        studentId: student.id,
      },
    });
    setResumeUpdated(updatedResume.data);
  }

  return (
    <>
      <div className="w-11/12">
        {vacancyId && (
          <button
            onClick={() => {
              router.push(`/student/vacancy/${vacancyId}`);
            }}
            className="flex items-center gap-1 underline text-blue-400"
          >
            <ChevronLeft /> Voltar
          </button>
        )}
        <h1 className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Book />
            <span className="text-2xl font-semibold">Meu Currículo</span>
          </div>
          <button
            onClick={() => {
              updateResume();
            }}
            className="btn btn-primary"
          >
            {editMode ? "Visualizar" : "Editar"}
          </button>
        </h1>
      </div>
      {editMode ? (
        <ResumeForm resume={resumeUpdated} />
      ) : (
        <ResumeView student={student} resume={resumeUpdated} />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    const resume = await apiClient.get<Resume>("/resumes/me", {
      params: {
        studentId: student.data.id,
      },
    });
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
