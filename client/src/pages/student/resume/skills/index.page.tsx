import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  SKILL_PATH,
  STUDENT_RESUME_PATH,
  STUDENT_RESUME_SKILLS_PATH,
} from "app-constants";
import { Form, notify } from "components";
import { CreateSkillSchema } from "schemas";
import { api, serverApi, withStudentAuth } from "services";
import { Resume, Skill, SkillLevel } from "types";
import { errorToString } from "utils";

interface FormAddSkillProps {
  resumeId: number;
  skills: Skill[];
}

export default function PageAddSkill({ resumeId, skills }: FormAddSkillProps) {
  const [skillsUpdated, setSkills] = useState<Skill[]>(skills);
  const createSkillForm = useForm<CreateSkillSchema>({
    mode: "onTouched",
    resolver: zodResolver(CreateSkillSchema),
  });
  const { handleSubmit } = createSkillForm;

  const createSkill = async (data: CreateSkillSchema) => {
    try {
      const response = await api.post<Skill>(STUDENT_RESUME_SKILLS_PATH, {
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
      await api.delete(SKILL_PATH(skill.id));
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
      <div className="w-full px-4">
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
                <option value={SkillLevel.Basic}>Básico</option>
                <option value={SkillLevel.Intermediate}>Intermediário</option>
                <option value={SkillLevel.Advanced}>Avançado</option>
              </Form.InputSelect>
              <Form.ErrorMessage field="level" />
            </Form.Field>
            <button className="lg:w-3/12 btn btn-primary">Adicionar</button>
          </form>
        </FormProvider>
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

export const getServerSideProps = withStudentAuth(async (context) => {
  const apiClient = serverApi(context);
  try {
    const { data: resume } = await apiClient.get<Resume>(STUDENT_RESUME_PATH);

    return {
      props: {
        resumeId: resume.id,
        skills: resume.skills || [],
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return {
      props: {},
    };
  }
});
