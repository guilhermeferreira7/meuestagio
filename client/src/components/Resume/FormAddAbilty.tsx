import React, { useState } from "react";
import { set, z } from "zod";
import { createSkillSchema } from "../../utils/validators/edit-resume-schema";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../Form";
import { Skill, SkillLevel } from "../../utils/types/resume";
import { api } from "../../services/api/api";
import { notifySuccess } from "../Toasts/toast";
import { Trash } from "lucide-react";
import { Modal } from "../AppModal/Modal";

type FormAddSkill = z.infer<typeof createSkillSchema>;

interface FormAddSkillProps {
  resumeId: number;
  skills: Skill[];
}

export default function FormAddSkill({ resumeId, skills }: FormAddSkillProps) {
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
      createSkillForm.reset();
      notifySuccess("Habilidade adicionada com sucesso");
      setSkills([response.data, ...skillsUpdated]);
    } catch (error: any) {
      console.log(error.response?.data?.message);
    }
  };

  const deleteSkill = async (skill: Skill) => {
    try {
      await api.delete(`resumes/me/skills/${skill.id}`);
      notifySuccess("Habilidade excluída com sucesso");
      setSkills(skillsUpdated.filter((s) => s.id !== skill.id));
    } catch (error: any) {
      console.log(error.response?.data?.message);
    } finally {
      document.getElementById("deleteSkill")?.click();
    }
  };

  return (
    <>
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
              <option value={SkillLevel.Advanced}>{SkillLevel.Advanced}</option>
            </Form.InputSelect>
            <Form.ErrorMessage field="level" />
          </Form.Field>
          <button className="lg:w-3/12 btn btn-primary">Adicionar</button>
        </form>
      </FormProvider>
      <div className="w-full mt-3">
        {skillsUpdated.length === 0 ? (
          <p className="text-center">Nenhuma habilidade cadastrada</p>
        ) : (
          skillsUpdated.map((skill) => (
            <>
              <p className="text-lg flex items-center justify-between gap-1">
                {skill.name} - {skill.level}{" "}
                <Modal.Button type="error" id="deleteSkill" size="sm">
                  <Trash />
                </Modal.Button>
              </p>
              <div className="divider"></div>

              <Modal.Content
                id="deleteSkill"
                cancelText="Não"
                confirmAction={() => deleteSkill(skill)}
                confirmText="Sim"
              >
                <p className="w-full text-center">
                  Excluir a habilidade {skill.name} ?
                </p>
              </Modal.Content>
            </>
          ))
        )}
      </div>
    </>
  );
}
