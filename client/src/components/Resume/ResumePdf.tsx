import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Resume } from "../../types/resume";
import { Student } from "../../types/users/student";

type ResumePdfProps = {
  student: Student;
  resume: Resume;
};

export default function ResumePdf({ student, resume }: ResumePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.info}>
          <Text>Candidato: {student.name}</Text>
          <Text>Email: {student.email}</Text>
          <Text>
            Telefone: {student.phone ? student.phone : "Não cadastrado"}
          </Text>
          <Text>
            Instituição: {student.institution.name} - {student.course.name}
          </Text>
          <Text>
            Endereço: {student.city.name} - {student.city.state}
          </Text>
          <Text>Sobre: {student.about}</Text>
        </View>

        <Text>Habilidades</Text>
        {resume.skills.length === 0 && <Text>Não cadastrado</Text>}
        {resume.skills.map((skill) => (
          <Text key={skill.id}>
            - {skill.name} - {skill.level}
          </Text>
        ))}

        <Text>Formação</Text>
        {resume.educations.length === 0 && <Text>Não cadastrado</Text>}
        {resume.educations.map((education) => (
          <div key={education.id}>
            <Text>{education.school}</Text>
            <Text>{education.degree}</Text>
            <Text>{education.fieldOfStudy}</Text>
            <Text>{education.startDate}</Text>
            <Text>{education.endDate}</Text>
          </div>
        ))}

        <Text>Experiência</Text>
        {resume.experiences.length === 0 && <Text>Não cadastrado</Text>}
        {resume.experiences.map((experience) => (
          <div key={experience.id}>
            <Text>
              {experience.company} - {experience.company}
            </Text>
            <Text>{experience.description}</Text>
            <Text>
              {experience.startDate} -{" "}
              {experience.endDate ? experience.endDate : "Trabalho atual"}
            </Text>
          </div>
        ))}

        <Text>Idiomas</Text>
        {resume.languages.length === 0 && <Text>Não cadastrado</Text>}
        {resume.languages.map((language) => (
          <Text key={language.id}>
            {language.name} - {language.level}
          </Text>
        ))}
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginLeft: 20,
    marginTop: 20,
  },

  info: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
});
