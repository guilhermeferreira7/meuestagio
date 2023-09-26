import { Book } from "lucide-react";

import withStudentAuth from "../../../services/auth/withStudentAuth";
import { Student } from "../../../types/users/student";
import { Resume } from "../../../types/resume";
import ResumeView from "../../../components/Resume/resume";
import { STUDENT_RESUME_PATH } from "../../../constants/api-routes";

interface PageProps {
  student: Student;
  resume: Resume;
}

export default function ResumePage({ student, resume }: PageProps) {
  return (
    <>
      <div className="w-11/12 my-2">
        <h2 className="flex items-center gap-1">
          <Book />
          <span className="text-2xl font-semibold">Meu Currículo</span>
        </h2>
        <p className="text-gray-500 italic">
          É assim que seu currículo aparecerá para as empresas que você se
          candidatar.
        </p>

        <ResumeView resume={resume} student={student} />
      </div>
    </>
  );
}

export const getServerSideProps = withStudentAuth(
  async (_context, student, apiClient) => {
    const resume = await apiClient.get<Resume>(STUDENT_RESUME_PATH);
    return {
      props: {
        student,
        resume: resume.data,
      },
    };
  }
);
