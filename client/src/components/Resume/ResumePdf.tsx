import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Degree, LanguageLevel, Resume, SkillLevel } from "../../types/resume";
import { Student } from "../../types/users/student";
import { formatDate } from "../../utils/helpers/date-helpers";

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

        <View style={styles.info}>
          <Text style={styles.title}>Habilidades</Text>
          {resume.skills.length === 0 && <Text>Não cadastrado</Text>}
          {resume.skills.map((skill) => (
            <Text key={skill.id}>
              {skill.name} - {formatSkillLevel(skill.level)}
            </Text>
          ))}
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>Formação</Text>
          {resume.educations.length === 0 && <Text>Não cadastrado</Text>}
          {resume.educations.map((education) => (
            <div key={education.id}>
              <Text>{education.school}</Text>
              <Text>{formatDegree(education.degree)}</Text>
              <Text>{education.fieldOfStudy}</Text>
              <Text>
                {formatDate(education.startDate)} -{" "}
                {formatDate(education.endDate)}
              </Text>
            </div>
          ))}
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>Experiência</Text>
          {resume.experiences.length === 0 && <Text>Não cadastrado</Text>}
          {resume.experiences.map((experience) => (
            <div key={experience.id}>
              <Text>
                {experience.company} - {experience.company}
              </Text>
              <Text>{experience.description}</Text>
              <Text>
                {formatDate(experience.startDate)} -{" "}
                {experience.endDate
                  ? formatDate(experience.endDate)
                  : "Trabalho atual"}
              </Text>
            </div>
          ))}
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>Idiomas</Text>
          {resume.languages.length === 0 && <Text>Não cadastrado</Text>}
          {resume.languages.map((language) => (
            <Text key={language.id}>
              {language.name} - {formatLanguageLevel(language.level)}
            </Text>
          ))}
        </View>
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

  title: {
    fontSize: 20,
    marginTop: 5,
  },

  info: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    marginBottom: 10,
  },
});

function formatDegree(degree: Degree) {
  switch (degree) {
    case Degree.HighSchool:
      return "Ensino médio";
    case Degree.Undergraduate:
      return "Ensino Superior";
    case Degree.Technical:
      return "Ensino Técnico";
    case Degree.Postgraduate:
      return "Pós-graduação";
  }
}

function formatLanguageLevel(level: LanguageLevel) {
  switch (level) {
    case LanguageLevel.Basic:
      return "Básico";
    case LanguageLevel.Intermediate:
      return "Intermediário";
    case LanguageLevel.Advanced:
      return "Avançado";
    case LanguageLevel.Fluent:
      return "Fluente";
  }
}

function formatSkillLevel(level: SkillLevel) {
  switch (level) {
    case SkillLevel.Basic:
      return "Iniciante";
    case SkillLevel.Intermediate:
      return "Intermediário";
    case SkillLevel.Advanced:
      return "Avançado";
  }
}
