import React from "react";
import AppCard from "../../../components/AppCard";
import { Student } from "../../../utils/types/users/student";
import { Resume } from "../../../utils/types/resume";
import img from "../../../../public/avatar.png";
import Image from "next/image";
import { Crosshair, Info, Pen, Type } from "lucide-react";

interface ResumeViewProps {
  student: Student;
  resume: Resume;
}

export default function ResumeView({ student, resume }: ResumeViewProps) {
  return (
    <>
      <div className="w-11/12 my-2">
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
            <div className="flex gap-1 text-center">{resume.about}</div>
          </div>

          <div className="divider"></div>
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-semibold">Habilidades</h2>
            <div className="flex flex-col gap-1 p-2">
              {resume.skills.length > 0 ? (
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
            </div>
          </div>

          <div className="divider"></div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Formações</h2>
            <div className="w-3/5 flex flex-col gap-1 p-2">
              {resume.skills ? <>habilidades</> : <p>Não cadastrado</p>}
            </div>
          </div>

          <div className="divider"></div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Experiencias</h2>
            <div className="w-3/5 flex flex-col gap-1 p-2">
              {resume.skills ? <>habilidades</> : <p>Não cadastrado</p>}
            </div>
          </div>

          <div className="divider"></div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Idiomas</h2>
            <div className="w-3/5 flex flex-col gap-1 p-2">
              {resume.skills ? <>habilidades</> : <p>Não cadastrado</p>}
            </div>
          </div>

          <div className="divider"></div>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Projetos</h2>
            <div className="w-3/5 flex flex-col gap-1 p-2">
              {resume.skills ? <>habilidades</> : <p>Não cadastrado</p>}
            </div>
          </div>
        </AppCard>
      </div>
    </>
  );
}
