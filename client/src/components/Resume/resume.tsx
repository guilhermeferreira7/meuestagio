import React from "react";
import Image from "next/image";
import {
  HistoryEdu,
  InfoOutlined,
  Language,
  MailOutline,
  MapOutlined,
  PhoneOutlined,
  SchoolOutlined,
  TipsAndUpdatesOutlined,
  WorkOutline,
} from "@mui/icons-material";
import img from "../../../public/avatar.png";

import AppCard from "../AppCard";
import { Student } from "../../types/users/student";
import { Resume } from "../../types/resume";
import { formatDate } from "../../utils/helpers/date-helpers";

type ResumeProps = {
  student: Student;
  resume: Resume;
};

export default function ResumeView({ student, resume }: ResumeProps) {
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
    <AppCard>
      <section className="flex items-start">
        <div className="w-1/5 flex justify-center p-3">
          <Image src={img} alt={student.name} width={150} />
        </div>
        <div className="flex flex-1 flex-col gap-3 pl-2">
          <h2 className="text-2xl font-semibold">{student.name}</h2>
          <div className="text-xl flex flex-col gap-1">
            <span className="flex gap-1 items-center">
              <MailOutline />
              Email: {student.email}
            </span>
            <span className="flex gap-1 items-center">
              <PhoneOutlined />
              Telefone: {student.phone ? student.phone : "Não cadastrado"}
            </span>
            <span className="flex gap-1 items-center">
              <SchoolOutlined />
              Instituição: {student.course.name} - {student.institution.name}
            </span>
            <span className="flex gap-1 items-center">
              <MapOutlined />
              Endereço: {student.city.name} - {student.city.state}
            </span>
          </div>
        </div>
      </section>
      <div className="flex flex-col my-2 text-lg">
        <div className="flex flex-col gap-1 items-start">
          <p className="text-xl font-semibold">
            {" "}
            <InfoOutlined /> Sobre:{" "}
          </p>
          <p>{student.about}</p>
        </div>
      </div>

      <ResumeItem title="Habilidades" icon={<TipsAndUpdatesOutlined />}>
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

      <ResumeItem title="Formação" icon={<HistoryEdu />}>
        {resume.educations?.length > 0 ? (
          resume.educations.map((education, index) => (
            <div className="flex items-center gap-1" key={index}>
              <>
                <div className="flex flex-col">
                  <span>Instituição: {education.school}</span>
                  <span>Grau: {education.degree}</span>
                  <span>Área de estudo: {education.fieldOfStudy}</span>
                  <span>
                    Período: De {formatDate(education.startDate)} até{" "}
                    {formatDate(education.endDate)}
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

      <ResumeItem title="Experiência" icon={<WorkOutline />}>
        {resume.experiences?.length > 0 ? (
          resume.experiences.map((exp, index) => (
            <div className="flex items-center gap-1" key={index}>
              <div className="flex flex-col">
                <span>Empresa: {exp.company}</span>
                <span>Cargo: {exp.position}</span>
                <span>
                  De {formatDate(exp.startDate)} até{" "}
                  {exp.currentJob ? (
                    <span>o momento</span>
                  ) : (
                    <span>{formatDate(exp.endDate)}</span>
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

      <ResumeItem title="Idiomas" icon={<Language />}>
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
  );
}
