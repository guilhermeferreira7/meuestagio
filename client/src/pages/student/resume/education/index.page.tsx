import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Degree } from "../../../../types/resume";
import {
  FormAddEducation,
  createEducationSchema,
} from "../../../../utils/validators/edit-resume-schema";
import { getMonths, getYears } from "../../../../utils/helpers/date-helpers";

import { Form } from "../../../../components/Form";
import AppCard from "../../../../components/AppCard";

export default function PageAddEducation() {
  const createEducationForm = useForm<FormAddEducation>({
    mode: "all",
    resolver: zodResolver(createEducationSchema),
  });
  const { handleSubmit } = createEducationForm;

  const createEducation = async (data: FormAddEducation) => {
    console.log(data);
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
    </>
  );
}
