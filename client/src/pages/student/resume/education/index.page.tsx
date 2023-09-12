import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Degree, Education, Resume } from "../../../../types/resume";
import {
  FormAddEducation,
  createEducationSchema,
} from "../../../../utils/validators/edit-resume-schema";
import { getMonths, getYears } from "../../../../utils/helpers/date-helpers";

import { Form } from "../../../../components/Form";
import AppCard from "../../../../components/AppCard";
import { api } from "../../../../services/api/api";
import { notify } from "../../../../components/toasts/toast";
import { isAxiosError } from "axios";
import { ToastContainer } from "react-toastify";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../../../services/api/clientApi";
import { Student } from "../../../../types/users/student";
import { Trash } from "lucide-react";

type PageAddEducationProps = {
  resumeId: number;
  educations: Education[];
};

export default function PageAddEducation({
  resumeId,
  educations,
}: PageAddEducationProps) {
  const [educationsUpdated, setEducations] = useState<Education[]>(
    educations || []
  );
  const createEducationForm = useForm<FormAddEducation>({
    mode: "all",
    resolver: zodResolver(createEducationSchema),
  });
  const { handleSubmit } = createEducationForm;

  const createEducation = async (data: FormAddEducation) => {
    try {
      const education = await api.post<Education>("/resumes/me/educations", {
        resumeId,
        ...data,
      });
      notify.success("Formação adicionada com sucesso!");
      setEducations([education.data, ...educationsUpdated]);
    } catch (error) {
      if (isAxiosError(error)) {
        return notify.error(error.response?.data.message);
      } else {
        notify.error("Ocorreu um erro inesperado.");
      }
    }
  };

  const deleteEducation = async (education: Education) => {
    try {
      await api.delete(`resumes/me/educations/${education.id}`);
      setEducations(educationsUpdated.filter((s) => s.id !== education.id));
      notify.success("Formação excluída com sucesso");
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

  const EducationItem = ({ education }: { education: Education }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    return (
      <div
        className="text-lg flex items-center justify-between border-b p-2 border-b-gray-300"
        key={education.id}
      >
        <span>
          {education.school} - {education.degree} - {education.fieldOfStudy}
        </span>
        {isDeleting ? (
          <button
            className="btn btn-error"
            onClick={() => deleteEducation(education)}
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
      <div className="w-11/12">
        <AppCard>
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
                  <option value={Degree.HighSchool}>{Degree.HighSchool}</option>
                  <option value={Degree.Technical}>{Degree.Technical}</option>
                  <option value={Degree.Undergraduate}>
                    {Degree.Undergraduate}
                  </option>
                  <option value={Degree.Postgraduate}>
                    {Degree.Postgraduate}
                  </option>
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
              <div className="flex gap-1">
                <div className="w-1/2">
                  <Form.Field>
                    <Form.Label htmlFor="startMonth">Mes de início</Form.Label>
                    <Form.InputSelect name="startMonth" defaultValue="">
                      <option value="" disabled>
                        Mês
                      </option>
                      {getMonths().map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </Form.InputSelect>
                    <Form.ErrorMessage field="startMonth" />
                  </Form.Field>
                </div>
                <div className="w-1/2">
                  <Form.Field>
                    <Form.Label htmlFor="startYear">Ano de início</Form.Label>
                    <Form.InputSelect name="startYear" defaultValue={2023}>
                      {getYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Form.InputSelect>
                    <Form.ErrorMessage field="startYear" />
                  </Form.Field>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-1/2">
                  <Form.Field>
                    <Form.Label htmlFor="endMonth">
                      Mes de conclusão (ou esperado)
                    </Form.Label>
                    <Form.InputSelect name="endMonth" defaultValue="">
                      <option value="" disabled>
                        Mês
                      </option>
                      {getMonths().map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </Form.InputSelect>
                    <Form.ErrorMessage field="endMonth" />
                  </Form.Field>
                </div>
                <div className="w-1/2">
                  <Form.Field>
                    <Form.Label htmlFor="endYear">
                      Ano de conclusão (ou esperado)
                    </Form.Label>
                    <Form.InputSelect name="endYear" defaultValue={2023}>
                      {getYears(2033).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Form.InputSelect>
                    <Form.ErrorMessage field="endYear" />
                  </Form.Field>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-2/3 my-2 self-center"
              >
                Salvar
              </button>
            </form>
          </FormProvider>
        </AppCard>
      </div>
      <div className="w-11/12 my-3 flex flex-col gap-2 border-l border-l-gray-300">
        {educationsUpdated.length < 1 && (
          <span>Nenhuma formação cadastrada</span>
        )}
        {!educationsUpdated ? (
          <p className="text-center">Nenhuma habilidade cadastrada</p>
        ) : (
          educationsUpdated.map((education) => (
            <EducationItem key={education.id} education={education} />
          ))
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    return {
      props: {
        resumeId: student.data.resume.id,
        educations: student.data.resume.educations || [],
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
