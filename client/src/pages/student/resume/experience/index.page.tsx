import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  EXPERIENCE_PATH,
  STUDENT_RESUME_EXPERIENCES_PATH,
  STUDENT_RESUME_PATH,
} from "app-constants";
import { Error, Form, notify } from "components";
import { CreateExperienceSchema } from "schemas";
import { api, serverApi, withStudentAuth } from "services";
import { Experience, Resume } from "types";
import { errorToString } from "utils";

type ExperiencePageProps = {
  resumeId: number;
  experiences: Experience[];
};

export default function ExperiencePage({
  resumeId,
  experiences,
}: ExperiencePageProps) {
  const [experiencesUpdated, setExperiences] =
    useState<Experience[]>(experiences);
  const createExperienceForm = useForm<CreateExperienceSchema>({
    mode: "all",
    resolver: zodResolver(CreateExperienceSchema),
  });
  const { handleSubmit } = createExperienceForm;

  const createExperience = async (data: CreateExperienceSchema) => {
    try {
      const experience = await api.post<Experience>(
        STUDENT_RESUME_EXPERIENCES_PATH,
        {
          resumeId,
          ...data,
        }
      );
      notify.success("Experiência adicionada com sucesso!");
      setExperiences([experience.data, ...experiencesUpdated]);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  const deleteExperience = async (experience: Experience) => {
    try {
      await api.delete(EXPERIENCE_PATH(experience.id));
      setExperiences(
        experiencesUpdated.filter((exp) => exp.id !== experience.id)
      );
      notify.success("Formação excluída com sucesso");
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

  const ExperienceItem = ({ experience }: { experience: Experience }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    return (
      <div
        className="text-lg flex items-center justify-between border-b p-2 border-b-gray-300"
        key={experience.id}
      >
        <span>
          {experience.company} - {experience.position}
        </span>
        {isDeleting ? (
          <button
            className="btn btn-error"
            onClick={() => deleteExperience(experience)}
          >
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
          Cadastrar nova experiência
        </h2>
        <FormProvider {...createExperienceForm}>
          <form
            onSubmit={handleSubmit(createExperience)}
            className="flex flex-col w-full gap-1"
          >
            <Form.Field>
              <Form.Label htmlFor="company">Nome da empresa</Form.Label>
              <Form.InputText name="company" placeholder="Nome da empresa" />
              <Form.ErrorMessage field="company" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="position">Cargo</Form.Label>
              <Form.InputText name="position" placeholder="Cargo" />
              <Form.ErrorMessage field="position" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="description">Descrição</Form.Label>
              <Form.InputText name="description" placeholder="Cargo" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="startDate">Data de início</Form.Label>
              <Form.InputText name="startDate" type="date" />
              <Form.ErrorMessage field="startDate" />
            </Form.Field>
            <Form.Field>
              <Form.InputCheckbox name="currentJob" label="Trabalho atual?" />
              <Form.ErrorMessage field="currentJob" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="endDate">Data de término</Form.Label>
              <Form.InputText
                disabled={createExperienceForm.watch("currentJob")}
                name="endDate"
                type="date"
              />
              <Form.ErrorMessage field="endDate" />
            </Form.Field>

            <button
              type="submit"
              className="btn btn-primary w-2/3 my-2 self-center"
            >
              Salvar
            </button>
          </form>
        </FormProvider>
      </div>
      <div className="w-11/12 my-3 flex flex-col gap-2 border-l border-l-gray-300">
        {experiencesUpdated.length < 1 && (
          <span>Nenhuma formação cadastrada</span>
        )}
        {!experiencesUpdated ? (
          <p className="text-center">Nenhuma habilidade cadastrada</p>
        ) : (
          experiencesUpdated.map((experience) => (
            <ExperienceItem key={experience.id} experience={experience} />
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
        experiences: resume.experiences || [],
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return {
      props: {},
    };
  }
});
