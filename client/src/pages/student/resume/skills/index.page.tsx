import React, { useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";

import { Resume, Skill, SkillLevel } from "@customTypes/resume";
import { notify } from "@components/toasts/toast";
import { Form } from "@components/Form";
import { api } from "@services/api/api";
import { createSkillSchema } from "@utils/validators/edit-resume-schema";
import AppCard from "../../../../components/AppCard";
import withStudentAuth from "../../../../services/auth/withStudentAuth";
import { errorToString } from "../../../../utils/helpers/error-to-string";

type FormAddSkill = z.infer<typeof createSkillSchema>;

interface FormAddSkillProps {
  resumeId: number;
  skills: Skill[];
}

export default function PageAddSkill({ resumeId, skills }: FormAddSkillProps) {
  const [skillsUpdated, setSkills] = useState<Skill[]>(skills);
  const createSkillForm = useForm<FormAddSkill>({
    mode: "onTouched",
    resolver: zodResolver(createSkillSchema),
  });
  const { handleSubmit } = createSkillForm;

  const createSkill = async (data: FormAddSkill) => {
    try {
      const response = await api.post("resumes/me/skills", {
        ...data,
        resumeId,
      });
      setSkills([response.data, ...skillsUpdated]);
      notify.success("Habilidade adicionada com sucesso");
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  const deleteSkill = async (skill: Skill) => {
    try {
      await api.delete(`resumes/me/skills/${skill.id}`);
      setSkills(skillsUpdated.filter((s) => s.id !== skill.id));
      notify.success("Habilidade excluída com sucesso");
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

  const SkillItem = ({ skill }: { skill: Skill }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    return (
      <div
        className="text-lg flex items-center justify-between border-b p-2 border-b-gray-300"
        key={skill.id}
      >
        <span>
          {skill.name} - {skill.level}
        </span>
        {isDeleting ? (
          <button className="btn btn-error" onClick={() => deleteSkill(skill)}>
            Clique para excluir
          </button>
        ) : (
          <button className="btn btn-error" onClick={() => setIsDeleting(true)}>
            <Trash />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="w-11/12">
        <AppCard>
          <h2 className="text-xl text-primary font-bold mb-2 justify-between">
            Cadastrar nova habilidade
          </h2>
          <FormProvider {...createSkillForm}>
            <form
              onSubmit={handleSubmit(createSkill)}
              className="flex flex-col lg:flex-row w-full gap-1"
            >
              <Form.Field className="lg:w-6/12 flex flex-col">
                <Form.InputText
                  name="name"
                  autoComplete="off"
                  placeholder="Habilidade..."
                />
                <Form.ErrorMessage field="name" />
              </Form.Field>
              <Form.Field className="lg:w-3/12 flex flex-col">
                <Form.InputSelect name="level" defaultValue={SkillLevel.Basic}>
                  <option value={SkillLevel.Basic}>{SkillLevel.Basic}</option>
                  <option value={SkillLevel.Intermediate}>
                    {SkillLevel.Intermediate}
                  </option>
                  <option value={SkillLevel.Advanced}>
                    {SkillLevel.Advanced}
                  </option>
                </Form.InputSelect>
                <Form.ErrorMessage field="level" />
              </Form.Field>
              <button className="lg:w-3/12 btn btn-primary">Adicionar</button>
            </form>
          </FormProvider>
        </AppCard>
      </div>
      <div className="w-11/12 my-3 flex flex-col gap-2 border-l border-l-gray-300">
        {skillsUpdated.length < 1 && <span>Nenhuma habilidade cadastrada</span>}
        {!skillsUpdated ? (
          <p className="text-center">Nenhuma habilidade cadastrada</p>
        ) : (
          skillsUpdated.map((skill) => (
            <SkillItem key={skill.id} skill={skill} />
          ))
        )}
      </div>
    </>
  );
}

export const getServerSideProps = withStudentAuth(
  async (_context, student, serverApi) => {
    const resume = await serverApi.get<Resume>("resumes/me");
    return {
      props: {
        resumeId: student.resumeId,
        skills: resume.data.skills,
      },
    };
  }
);
