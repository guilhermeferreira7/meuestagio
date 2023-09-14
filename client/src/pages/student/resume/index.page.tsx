import {
  Book,
  Briefcase,
  Crosshair,
  GraduationCap,
  LanguagesIcon,
  Mail,
  Map,
  Phone,
  School,
} from "lucide-react";
import Image from "next/image";
import img from "../../../../public/avatar.png";

import AppCard from "../../../components/AppCard";
import withStudentAuth from "../../../services/auth/withStudentAuth";
import { Student } from "../../../types/users/student";
import { Resume } from "../../../types/resume";

interface PageProps {
  student: Student;
  resume: Resume;
}

export default function ResumePage({ student, resume }: PageProps) {
  const ResumeItem = ({
    title,
    children,
    icon,
  }: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
  }) => {
    return (
      <>
        <div className="divider"></div>
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-semibold flex items-center gap-1">
            {icon} {title}
          </h2>
          <div className="flex flex-col gap-2 p-2">{children}</div>
        </div>
      </>
    );
  };

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
        <AppCard>
          <div className="flex items-start">
            <div className="w-2/5 flex justify-center p-3">
              <Image src={img} alt={student.name} width={150} />
            </div>
            <div className="flex flex-1 flex-col gap-3 pl-2">
              <h2 className="text-2xl font-semibold">{student.name}</h2>
              <div className="text-xl flex flex-col gap-1">
                <span className="flex gap-1 items-center">
                  <Mail />
                  Email: {student.email}
                </span>
                <span className="flex gap-1 items-center">
                  <Phone />
                  Telefone: {student.phone ? student.phone : "Não cadastrado"}
                </span>
                <span className="flex gap-1 items-center">
                  <GraduationCap />
                  Instituição: {student.course.name} -{" "}
                  {student.institution.name}
                </span>
                <span className="flex gap-1 items-center">
                  <Map />
                  Endereço: {student.city.name} - {student.city.state}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center my-2 text-lg">
            <div className="flex flex-col gap-1 items-start">
              <p className="text-xl font-semibold">Sobre: </p>
              <p>{student.about}</p>
            </div>
          </div>

          <ResumeItem title="Habilidades" icon={<Crosshair />}>
            {resume.skills?.length > 0 ? (
              resume.skills.map((skill, index) => (
                <div className="flex items-center gap-1" key={index}>
                  <span>
                    {skill.name} - {skill.level}
                  </span>
                </div>
              ))
            ) : (
              <p>Não cadastrado</p>
            )}
          </ResumeItem>

          <ResumeItem title="Formação" icon={<School />}>
            {resume.educations?.length > 0 ? (
              resume.educations.map((education, index) => (
                <div className="flex items-center gap-1" key={index}>
                  <>
                    <div className="flex flex-col">
                      <span>Instituição: {education.school}</span>
                      <span>Grau: {education.degree}</span>
                      <span>Área de estudo: {education.fieldOfStudy}</span>
                      <span>
                        Período: De {new Date(education.startDate).getMonth()}/
                        {new Date(education.startDate).getFullYear()} até{" "}
                        {new Date(education.endDate).getMonth()}/
                        {new Date(education.endDate).getFullYear()}
                        {index < resume.educations.length - 1 && (
                          <div className="divider my-0"></div>
                        )}
                      </span>
                    </div>
                  </>
                </div>
              ))
            ) : (
              <p>Nada cadastrado</p>
            )}
          </ResumeItem>

          <ResumeItem title="Experiência" icon={<Briefcase />}>
            {resume.experiences?.length > 0 ? (
              resume.experiences.map((exp, index) => (
                <div className="flex items-center gap-1" key={index}>
                  <div className="flex flex-col">
                    <span>Empresa: {exp.company}</span>
                    <span>Cargo: {exp.position}</span>
                    <span>
                      De {new Date(exp.startDate).getMonth()}/
                      {new Date(exp.startDate).getFullYear()} até{" "}
                      {exp.currentJob ? (
                        <span>Atualmente</span>
                      ) : (
                        <span>
                          {new Date(exp.endDate).getMonth()}/
                          {new Date(exp.endDate).getFullYear()}
                        </span>
                      )}
                    </span>
                    {index < resume.educations.length - 1 && (
                      <div className="divider my-0"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Nada cadastrado</p>
            )}
          </ResumeItem>

          <ResumeItem title="Idiomas" icon={<LanguagesIcon />}>
            {resume.languages?.length > 0 ? (
              resume.languages.map((language, index) => (
                <div className="flex items-center gap-1" key={index}>
                  <p>
                    {language.name} - {language.level}
                  </p>
                </div>
              ))
            ) : (
              <p>Nada cadastrado</p>
            )}
          </ResumeItem>
        </AppCard>
      </div>
    </>
  );
}

export const getServerSideProps = withStudentAuth(
  async (_context, student, apiClient) => {
    const resume = await apiClient.get<Resume>("/resumes/me");
    return {
      props: {
        student,
        resume: resume.data,
      },
    };
  }
);
