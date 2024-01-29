import { Download, Share, WorkHistoryOutlined } from "@mui/icons-material";
import { PDFDownloadLink } from "@react-pdf/renderer";
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

import { PROFILE_STUDENT_PATH, STUDENT_RESUME_PATH } from "app-constants";
import { Modal, ResumePdf, ResumeView } from "components";
import { useClient } from "hooks";
import { serverApi, withStudentAuth } from "services";
import { Resume, Student } from "types";
import { errorToString } from "utils";

interface PageProps {
  student: Student;
  resume: Resume;
}

export default function ResumePage({ student, resume }: PageProps) {
  const isClient = useClient();

  return (
    <>
      <div className="w-11/12 my-2">
        <h2 className="flex justify-between">
          <div className="flex items-center gap-1">
            <WorkHistoryOutlined fontSize="large" />
            <span className="text-2xl font-semibold">Meu Currículo</span>
          </div>
          <div className="flex gap-1">
            {isClient && (
              <PDFDownloadLink
                document={<ResumePdf student={student} resume={resume} />}
                fileName={`${student.name}-curriculo.pdf`}
              >
                <button className="btn btn-info">
                  Gerar pdf
                  <Download />
                </button>
              </PDFDownloadLink>
            )}
            <Modal.Button id="share-buttons">
              Compartilhar
              <Share />
            </Modal.Button>
          </div>
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

export const getServerSideProps = withStudentAuth(async (context) => {
  const apiClient = serverApi(context);
  try {
    const { data: student } = await apiClient.get<Student>(
      PROFILE_STUDENT_PATH
    );

    const { data: resume } = await apiClient.get<Resume>(STUDENT_RESUME_PATH);
    return {
      props: {
        student,
        resume,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return { props: {} };
  }
});
