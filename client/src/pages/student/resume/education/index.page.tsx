import { FormProvider } from "react-hook-form";

import {
  STUDENT_RESUME_EDUCATIONS_PATH,
  STUDENT_RESUME_PATH,
} from "app-constants";
import { Form, notify } from "components";
import { CreateEducationSchema } from "schemas";
import { api, serverApi, withStudentAuth } from "services";
import { Degree, Education, Resume } from "types";
import { errorToString } from "utils";

import EducationItem from "./_education-item";
import { useEducationForm } from "./_useEducationForm";

type PageAddEducationProps = {
  resumeId: number;
  educations: Education[];
};

export default function PageAddEducation({
  resumeId,
  educations,
}: PageAddEducationProps) {
  const {
    createEducationForm,
    educationsUpdated,
    handleSubmit,
    setEducations,
  } = useEducationForm(educations);

  const createEducation = async (data: CreateEducationSchema) => {
    try {
      const education = await api.post<Education>(
        STUDENT_RESUME_EDUCATIONS_PATH,
        {
          resumeId,
          ...data,
        }
      );
      notify.success("Formação adicionada com sucesso!");
      setEducations([education.data, ...educationsUpdated]);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  return (
    <>
      <div className="w-full px-4">
        <h2 className="text-xl text-primary font-bold mb-2 justify-between">
          Cadastrar nova formação
        </h2>
        <FormProvider {...createEducationForm}>
          <form
            onSubmit={handleSubmit(createEducation)}
            className="flex flex-col w-full gap-1"
          >
            <Form.Field>
              <Form.Label htmlFor="school">Insitituição</Form.Label>
              <Form.InputText name="school" placeholder="Instituição" />
              <Form.ErrorMessage field="school" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="degree">Grau</Form.Label>
              <Form.InputSelect name="degree">
                <option value={Degree.HighSchool}>Ensino Médio</option>
                <option value={Degree.Technical}>Ensino Técnico</option>
                <option value={Degree.Undergraduate}>Ensino Superior</option>
                <option value={Degree.Postgraduate}>Pos Graduação</option>
              </Form.InputSelect>
              <Form.ErrorMessage field="degree" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="fieldOfStudy">Área de estudo</Form.Label>
              <Form.InputText
                name="fieldOfStudy"
                placeholder="Área de estudo"
              />
              <Form.ErrorMessage field="fieldOfStudy" />
            </Form.Field>
            <div className="grid md:grid-cols-2 gap-1">
              <Form.Field>
                <Form.Label htmlFor="startDate">Data de início</Form.Label>
                <Form.InputText name="startDate" type="date" />
                <Form.ErrorMessage field="startDate" />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="endDate">Data de fim</Form.Label>
                <Form.InputText name="endDate" type="date" />
                <Form.ErrorMessage field="endDate" />
              </Form.Field>
            </div>

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
        {educationsUpdated.length < 1 && (
          <span>Nenhuma formação cadastrada</span>
        )}
        {!educationsUpdated ? (
          <p className="text-center">Nenhuma habilidade cadastrada</p>
        ) : (
          educationsUpdated.map((education) => (
            <EducationItem
              key={education.id}
              educations={educationsUpdated}
              education={education}
              setEducations={setEducations}
            />
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
        educations: resume.educations || [],
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return {
      props: {},
    };
  }
});
