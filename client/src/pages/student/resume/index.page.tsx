import { GetServerSideProps } from "next";
import img from "@public/avatar.png";

import { Student } from "@customTypes/users/student";
import { Resume } from "@customTypes/resume";
import { getAPIClient } from "@services/api/clientApi";

import Image from "next/image";
import AppCard from "../../../components/AppCard";
import { Book } from "lucide-react";

interface PageProps {
  student: Student;
  resume: Resume;
}

export default function ResumePage({ student, resume }: PageProps) {
  type ResumeItemProps = {
    title: string;
    children: React.ReactNode;
  };
  const ResumeItem = ({ title, children }: ResumeItemProps) => {
    return (
      <>
        <div className="divider"></div>
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex flex-col gap-1 p-2">{children}</div>
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
        <div></div>
        <AppCard>
          <div className="flex items-center">
            <div className="w-2/5 flex flex-col gap-1 p-2 items-center justify-center">
              <Image src={img} alt={student.name} width={100} />
              <p className="font-semibold text-lg">{student.name}</p>
            </div>
            <div className="w-3/5 flex flex-col gap-1 p-2">
              <p>Email: {student.email}</p>
              <p>
                Telefone: {student.phone ? student.phone : "Não cadastrado"}
              </p>
              <p>
                Curso: {student.course.name} - {student.institution.name}
              </p>
              <p>
                Cidade: {student.city.name} - {student.city.state}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <p className="flex items-center gap-1 my-2 text-lg">
              {resume.title}
            </p>
            <div className="flex gap-1 text-center">{student.about}</div>
          </div>

          <ResumeItem title="Habilidades">
            {resume.skills?.length > 0 ? (
              resume.skills.map((skill, index) => (
                <div className="flex items-center gap-1" key={index}>
                  <p>
                    {skill.name} - {skill.level}
                  </p>
                </div>
              ))
            ) : (
              <p>Não cadastrado</p>
            )}
          </ResumeItem>

          <ResumeItem title="Formação">
            {resume.educations?.length > 0 ? (
              resume.educations.map((education, index) => (
                <div className="flex items-center gap-1" key={index}>
                  <p>
                    {education.school} - {education.degree} -{" "}
                    {education.fieldOfStudy}
                  </p>
                </div>
              ))
            ) : (
              <p>Nada cadastrado</p>
            )}
          </ResumeItem>

          <ResumeItem title="Experiência">
            {resume.experiences?.length > 0 ? (
              resume.experiences.map((exp, index) => (
                <div className="flex items-center gap-1" key={index}>
                  <p>
                    {exp.company} - {exp.position} - {exp.description}
                  </p>
                </div>
              ))
            ) : (
              <p>Nada cadastrado</p>
            )}
          </ResumeItem>

          <ResumeItem title="Idiomas">
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

          <ResumeItem title="Projetos">
            {resume.projects?.length > 0 ? (
              resume.projects.map((project, index) => (
                <div className="flex items-center gap-1" key={index}>
                  {project.name} - {project.description}
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

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    return {
      props: {
        student: student.data,
        resume: student.data.resume,
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
