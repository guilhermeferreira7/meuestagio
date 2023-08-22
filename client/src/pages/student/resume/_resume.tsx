import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState } from "react";
import { Session } from "../../../components/AppSessionCard";
import { Book, Contact, Crosshair, Pencil } from "lucide-react";
import { Student } from "../../../utils/types/users/student";
import { Resume } from "../../../utils/types/resume";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

interface PageProps {
  student: Student;
  resume?: Resume;
}

export default function ResumeComponent({ student, resume }: PageProps) {
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [edit, setEdit] = useState(false);

  const editMode = () => {
    setEdit(!edit);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Book />
            Currículo
          </div>
          {/* <button onClick={editMode} className="btn btn-primary btn-sm w-1/2">
            Editar Currículo
          </button> */}
        </h1>
        <Session.Wrapper>
          <Session.Title>
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <Contact />
                Informações pessoais
              </div>
              {/* <Link href="/student/profile" className="text-primary underline">
                Editar informações
              </Link> */}
            </div>
          </Session.Title>
          <Session.Content>
            <p>Nome: {student.name}</p>
            <p>Email: {student.email}</p>
            <p>Telefone: {student.phone ? student.phone : "Não cadastrado"}</p>
            <p>
              Endereço: {student.city.name} - {student.city.state}
            </p>
            <p>
              Insituição: {student.course.name} - {student.institution.name}
            </p>
          </Session.Content>
        </Session.Wrapper>
        <Link href="/student/profile" className="text-primary underline">
          Editar informações
        </Link>
        <Session.Wrapper>
          <Session.Title>
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <Pencil />
                Sobre
              </div>
            </div>
          </Session.Title>
          <Session.Content>
            {edit ? (
              <QuillNoSSRWrapper
                theme="snow"
                value={about}
                onChange={setAbout}
                className="h-32 mb-16 sm:mb-10"
                placeholder="Escreva sobre você..."
                defaultValue={resume?.about}
              />
            ) : (
              <p>
                {resume?.about
                  ? resume.about
                  : "Escreva um pouco sobre você..."}
              </p>
            )}
          </Session.Content>
        </Session.Wrapper>
        <Session.Wrapper>
          <Session.Title>
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <Crosshair />
                Habilidades
              </div>
            </div>
          </Session.Title>
          <Session.Content>
            {edit ? (
              <QuillNoSSRWrapper
                theme="snow"
                value={skills}
                onChange={setSkills}
                className="h-32 mb-16 sm:mb-10"
                placeholder="Escreva quais habilidades possui..."
                defaultValue={resume?.skills}
              />
            ) : (
              <p>
                {resume?.skills
                  ? resume.skills
                  : "Escreva quais habilidades possui..."}
              </p>
            )}
          </Session.Content>
        </Session.Wrapper>
        <Link href="/student/profile" className="text-primary underline">
          Editar informações
        </Link>

        {/* <h2 className="font-semibold text-xl">Educação</h2> */}
        {/* <h2 className="font-semibold text-xl">Idiomas</h2> */}
        {/* <h2 className="font-semibold text-xl">Experiências</h2> */}
      </div>
    </>
  );
}
