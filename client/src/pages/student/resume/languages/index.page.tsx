import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Language, LanguageLevel, Resume } from "../../../../types/resume";

import { WorkHistoryOutlined } from "@mui/icons-material";
import { getAPIClient } from "@services/api/clientApi";
import { Form, PageDefaults } from "../../../../components";
import { notify } from "../../../../components/toasts/toast";
import {
  LANGUAGE_PATH,
  STUDENT_RESUME_LANGUAGES_PATH,
  STUDENT_RESUME_PATH,
} from "../../../../constants/api-routes";
import { api } from "../../../../services/api/api";
import withStudentAuth from "../../../../services/auth/withStudentAuth";
import { errorToString } from "../../../../utils/helpers/error-to-string";
import {
  FormAddLanguage,
  createLanguageSchema,
} from "../../../../utils/validators/language-schema";

type LanguagePageProps = {
  resumeId: number;
  languages: Language[];
};

export default function LanguagesPage({
  resumeId,
  languages,
}: LanguagePageProps) {
  const [languagesUpdated, setLanguages] = useState<Language[]>(languages);
  const createLanguageForm = useForm<FormAddLanguage>({
    mode: "all",
    resolver: zodResolver(createLanguageSchema),
  });
  const { handleSubmit } = createLanguageForm;

  const createLanguage = async (data: FormAddLanguage) => {
    try {
      const language = await api.post<Language>(STUDENT_RESUME_LANGUAGES_PATH, {
        resumeId,
        ...data,
      });
      notify.success("Idioma adicionado com sucesso!");
      setLanguages([language.data, ...languagesUpdated]);
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  const deleteLanguage = async (language: Language) => {
    try {
      await api.delete(LANGUAGE_PATH(language.id));
      setLanguages(languagesUpdated.filter((exp) => exp.id !== language.id));
      notify.success("Formação excluída com sucesso");
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

  const LanguageItem = ({ language }: { language: Language }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    return (
      <div
        className="text-lg flex items-center justify-between border-b p-2 border-b-gray-300"
        key={language.id}
      >
        <span>
          {language.name} - {language.level}
        </span>
        {isDeleting ? (
          <button
            className="btn btn-error"
            onClick={() => deleteLanguage(language)}
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
      <PageDefaults
        currentPage="Idiomas"
        linksTree={[
          {
            name: "Currículo",
            href: "/student/resume",
            icon: <WorkHistoryOutlined />,
          },
        ]}
      />

      <div className="w-full px-4">
        <h2 className="text-xl text-primary font-bold mb-2 justify-between">
          Cadastrar novo idioma
        </h2>
        <FormProvider {...createLanguageForm}>
          <form
            onSubmit={handleSubmit(createLanguage)}
            className="flex flex-col w-full gap-1"
          >
            <Form.Field>
              <Form.Label htmlFor="name">Idioma</Form.Label>
              <Form.InputText name="name" placeholder="Idioma" />
              <Form.ErrorMessage field="name" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="level">Nível</Form.Label>
              <Form.InputSelect
                name="level"
                placeholder="Nível"
                defaultValue={LanguageLevel.Basic}
              >
                <option value={LanguageLevel.Basic}>Básico</option>
                <option value={LanguageLevel.Intermediate}>
                  Intermediário
                </option>
                <option value={LanguageLevel.Advanced}>Avançado</option>
                <option value={LanguageLevel.Fluent}>Fluente</option>
              </Form.InputSelect>
              <Form.ErrorMessage field="level" />
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
        {languagesUpdated.length < 1 && (
          <span>Nenhuma formação cadastrada</span>
        )}
        {!languagesUpdated ? (
          <p className="text-center">Nenhuma habilidade cadastrada</p>
        ) : (
          languagesUpdated.map((language) => (
            <LanguageItem key={language.id} language={language} />
          ))
        )}
      </div>
    </>
  );
}

export const getServerSideProps = withStudentAuth(async (context, _user) => {
  const apiClient = getAPIClient(context);
  const { data: resume } = await apiClient.get<Resume>(STUDENT_RESUME_PATH);
  return {
    props: {
      resumeId: resume.id,
      languages: resume.languages || [],
    },
  };
});
