import Head from "next/head";
import { EditOutlined, PersonOutline } from "@mui/icons-material";

import { notify } from "../../../components/toasts/toast";
import { AppCard } from "../../../components";
import {
  CITIES_PATH,
  COURSES_PATH,
  INSTITUTIONS_PATH,
  PROFILE_STUDENT_PATH,
} from "../../../constants/api-routes";
import withStudentAuth from "../../../services/auth/withStudentAuth";
import { api } from "../../../services/api/api";
import { Student } from "../../../types/users/student";
import { City } from "../../../types/city";
import { Course } from "../../../types/course";
import { Institution } from "../../../types/institution";
import { errorToString } from "../../../utils/helpers/error-to-string";

import ContactInfoForm from "./_contact-form";
import EducationForm from "./_education-form";
import AddressForm from "./_address-form";

interface StudentProfileProps {
  student: Student;
  cities: City[];
  courses: Course[];
  institutions: Institution[];
}

export default function StudentProfile({
  student,
  cities,
  courses,
  institutions,
}: StudentProfileProps) {
  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const about = event.currentTarget.about.value;

    try {
      await api.patch(PROFILE_STUDENT_PATH, {
        about,
      });
      notify.success("Dados atualizados com sucesso");
    } catch (error) {
      notify.error(errorToString(error));
    }
  };
  return (
    <>
      <Head>
        <title>{student.name} | Dados pessoais</title>
      </Head>
      <div className="flex flex-col gap-2 w-11/12 mb-4">
        <AppCard>
          <h1 className="font-semibold text-2xl flex items-center gap-1">
            <PersonOutline />
            Dados pessoais
          </h1>
          <div className="divider"></div>
          <div>
            <span className="font-semibold flex gap-1 items-center mb-1">
              <EditOutlined />
              Sobre mim
            </span>
            <form className="flex gap-1" onSubmit={handleUpdate}>
              <textarea
                name="about"
                id="about"
                placeholder="Escreva algo sobre você"
                className="textarea textarea-primary w-full"
                defaultValue={student?.about}
              />
              <button className="btn btn-primary self-end">Salvar</button>
            </form>
          </div>

          <div className="divider"></div>
          <ContactInfoForm
            initialData={{
              ...student,
            }}
          />

          <div className="divider"></div>
          <EducationForm
            institutions={institutions}
            courses={courses}
            student={student}
          />

          <div className="divider"></div>
          <AddressForm cities={cities} student={student} />
        </AppCard>
      </div>
    </>
  );
}

export const getServerSideProps = withStudentAuth(
  async (_context, student, apiClient) => {
    const cities = await apiClient.get<City[]>(CITIES_PATH);
    const courses = await apiClient.get<Course[]>(COURSES_PATH, {
      params: {
        institutionId: student.institution.id,
      },
    });
    const institutions = await apiClient.get<Institution[]>(INSTITUTIONS_PATH);

    return {
      props: {
        student: student,
        cities: cities.data,
        courses: courses.data,
        institutions: institutions.data,
      },
    };
  }
);
