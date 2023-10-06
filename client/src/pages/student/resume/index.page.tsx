import { Book } from "lucide-react";
import { Share } from "@mui/icons-material";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import { Modal, ResumeView } from "../../../components";
import { STUDENT_RESUME_PATH } from "../../../constants/api-routes";
import withStudentAuth from "../../../services/auth/withStudentAuth";
import { Student } from "../../../types/users/student";
import { Resume } from "../../../types/resume";

interface PageProps {
  student: Student;
  resume: Resume;
}

export default function ResumePage({ student, resume }: PageProps) {
  return (
    <>
      <div className="w-11/12 my-2">
        <h2 className="flex justify-between">
          <div className="flex items-center gap-1">
            <Book />
            <span className="text-2xl font-semibold">Meu Currículo</span>
          </div>
          <Modal.Button id="share-buttons">
            Compartilhar
            <Share />
          </Modal.Button>
        </h2>
        <p className="text-gray-500 italic">
          É assim que seu currículo aparecerá para as empresas que você se
          candidatar.
        </p>
        <ResumeView resume={resume} student={student} />
      </div>

      <Modal.Content id="share-buttons">
        <div className="flex items-center justify-center gap-2">
          <FacebookShareButton url="http://localhost:3000/student/resume">
            <FacebookIcon size={64} className="rounded-md" />
          </FacebookShareButton>
          <TwitterShareButton url="http://localhost:3000/student/resume">
            <TwitterIcon size={64} className="rounded-md" />
          </TwitterShareButton>
          <EmailShareButton url="http://localhost:3000/student/resume">
            <EmailIcon size={64} className="rounded-md" />
          </EmailShareButton>
          <LinkedinShareButton url="http://localhost:3000/student/resume">
            <LinkedinIcon size={64} className="rounded-md" />
          </LinkedinShareButton>
          <WhatsappShareButton url="http://localhost:3000/student/resume">
            <WhatsappIcon size={64} className="rounded-md" />
          </WhatsappShareButton>
        </div>
      </Modal.Content>
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
