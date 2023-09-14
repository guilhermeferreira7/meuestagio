import React, { useState } from "react";
import {
  Album,
  Briefcase,
  Crosshair,
  FolderCog,
  GraduationCap,
  Languages,
  Pencil,
  Plus,
} from "lucide-react";

import AppCard from "../../../components/AppCard";
import { Resume, Skill } from "../../../utils/types/resume";
import { ToastContainer } from "react-toastify";
import { notifySuccess } from "../../../components/Toasts/toast";
import { api } from "../../../services/api/api";
import { Modal } from "../../../components/AppModal/Modal";
import FormAddSkill from "../../../components/Resume/FormAddAbilty";

interface ResumeFormProps {
  resume: Resume;
}

export default function ResumeForm({ resume }: ResumeFormProps) {
  const [title, setTitle] = useState<string>(resume.title);
  const [about, setAbout] = useState<string>(resume.about);

  const updateTitle = async () => {
    try {
      await api.put("/resumes/me", {
        id: resume?.id,
        title,
      });
      notifySuccess("Titulo atualizado com sucesso");
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  const updateAbout = async () => {
    try {
      await api.put("/resumes/me", {
        id: resume?.id,
        about,
      });
      notifySuccess("Resumo atualizado com sucesso");
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className="w-11/12">
        <div className="my-3">
          <AppCard>
            <div>
              <h2 className="flex items-center gap-1 font-semibold text-lg mb-2">
                <Pencil size={20} />
                <span>Título</span>
              </h2>
              <div className="w-full flex items-center gap-1">
                <input
                  name="title"
                  className="w-4/6 p-3 border border-gray-400 rounded-md"
                  defaultValue={resume?.title}
                  placeholder={
                    resume?.title
                      ? resume.title
                      : "Escreva um título para seu currículo"
                  }
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button className="w-2/6 btn btn-primary" onClick={updateTitle}>
                  Salvar
                </button>
              </div>
            </div>
            <div>
              <div className="my-3">
                <h2 className="flex items-center gap-1 font-semibold text-lg mb-2">
                  <Album size={20} />
                  <span>Sobre</span>
                </h2>
                <div className="w-full flex flex-col gap-1">
                  <textarea
                    name="about"
                    className="p-3 border border-gray-400 rounded-md h-24"
                    onChange={(e) => setAbout(e.target.value)}
                    defaultValue={resume?.about}
                    placeholder={
                      resume?.about
                        ? resume.about
                        : "Escreva um pouco sobre você"
                    }
                  />
                  <button
                    onClick={updateAbout}
                    className="btn btn-sm btn-primary"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <div className="my-3">
          <AppCard>
            <h2 className="flex items-center justify-between gap-1 font-semibold text-xl mb-2">
              <div className="flex items-center gap-1">
                <Crosshair />
                <span>Habilidades</span>
              </div>
            </h2>
            <div className="w-full flex flex-col items-start gap-1">
              <FormAddSkill resumeId={resume.id} skills={resume.skills} />
            </div>
          </AppCard>
        </div>

        <div className="my-3">
          <AppCard>
            <h2 className="flex items-center justify-between gap-1 font-semibold text-xl mb-2">
              <div className="flex items-center gap-1">
                <GraduationCap />
                <span>Formação</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="btn btn-warning btn-sm">
                  <Pencil />
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus />
                </button>
              </div>
            </h2>
            <div className="w-full flex items-center gap-1">
              {resume?.educations?.length === 0 ? (
                resume?.educations.map((education, index) => (
                  <div key={index}>
                    <p>{education.school}</p>
                    <p>{education.degree}</p>
                  </div>
                ))
              ) : (
                <p>Nenhuma formação cadastrada</p>
              )}
            </div>
          </AppCard>
        </div>

        <div className="my-3">
          <AppCard>
            <h2 className="flex items-center justify-between gap-1 font-semibold text-xl mb-2">
              <div className="flex items-center gap-1">
                <Briefcase />
                <span>Experiências</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="btn btn-warning btn-sm">
                  <Pencil />
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus />
                </button>
              </div>
            </h2>
            <div>
              {resume?.experiences?.length === 0 ? (
                resume?.experiences.map((experience, index) => (
                  <div key={index}>
                    <p>{experience.company}</p>
                    <p>{experience.position}</p>
                  </div>
                ))
              ) : (
                <p>Nenhuma experiência cadastrada</p>
              )}
            </div>
          </AppCard>
        </div>

        <div className="my-3">
          <AppCard>
            <h2 className="flex items-center justify-between gap-1 font-semibold text-xl mb-2">
              <div className="flex items-center gap-1">
                <Languages />
                <span>Idiomas</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="btn btn-warning btn-sm">
                  <Pencil />
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus />
                </button>
              </div>
            </h2>
            <div>
              {resume?.languages?.length === 0 ? (
                resume?.languages.map((language, index) => (
                  <div key={index}>
                    <p>{language.name}</p>
                    <p>{language.level}</p>
                  </div>
                ))
              ) : (
                <p>Nenhum idioma cadastrado</p>
              )}
            </div>
          </AppCard>
        </div>

        <div className="my-3">
          <AppCard>
            <h2 className="flex items-center justify-between gap-1 font-semibold text-xl mb-2">
              <div className="flex items-center gap-1">
                <FolderCog />
                <span>Projetos</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="btn btn-warning btn-sm">
                  <Pencil />
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus />
                </button>
              </div>
            </h2>
            <div>
              {resume?.experiences?.length === 0 ? (
                resume?.experiences.map((experience, index) => (
                  <div key={index}>
                    <p>{experience.company}</p>
                    <p>{experience.position}</p>
                  </div>
                ))
              ) : (
                <p>Nenhum projeto cadastrado</p>
              )}
            </div>
          </AppCard>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
