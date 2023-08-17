import React, { useState } from "react";
import { Student } from "../../../utils/types/users/student";
import { Institution } from "../../../utils/types/institution";
import { Course } from "../../../utils/types/course";
import { City } from "../../../utils/types/city";
import { User } from "lucide-react";
import AddressForm from "./forms/_address-form";
import ContactInfoForm from "./forms/_contact-form";
import EducationForm from "./forms/_education-form";
import AppCard from "../../../components/AppCard";

interface ProfileProps {
  student: Student;
  institutions: Institution[];
  courses: Course[];
  cities: City[];
}

export default function Profile({
  student,
  institutions,
  courses,
  cities,
}: ProfileProps) {
  return (
    <>
      <AppCard>
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl flex items-center gap-1">
            <User />
            Dados pessoais
          </h1>
        </div>

        <div className="divider"></div>
        <ContactInfoForm
          initialData={{
            ...student,
          }}
        />

        <div className="divider"></div>
        <EducationForm
          initialData={{
            institution: student.institution.id,
            course: {
              id: student.course.id,
              name: student.course.name,
            },
          }}
          courses={courses}
          institutions={institutions}
        />

        <div className="divider"></div>
        <AddressForm
          initialData={{
            city: student.city.name,
            state: student.city.state,
          }}
          cities={cities}
        />
      </AppCard>
    </>
  );
}
