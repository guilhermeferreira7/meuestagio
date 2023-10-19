export const STUDENTS_PATH = "/students";
export const STUDENT_PROFILE_PICTURE_PATH = "/students/profile/image";
export const COMPANIES_PATH = "/companies";
export const COMPANY_PROFILE_PICTURE_PATH = "/companies/profile/image";

export const PROFILE_STUDENT_PATH = "/students/profile";
export const PROFILE_COMPANY_PATH = "/companies/profile";
export const PROFILE_ADMIN_PATH = "/admin/profile";

export const JOBS_PATH = "/jobs";
export const JOB_PATH = (id: number) => `/jobs/${id}`;
export const JOB_CLOSE_PATH = (id: number) => `/jobs/${id}/close`;
export const JOBS_BY_COMPANY_PATH = (id: number) => `jobs/company/${id}`;

export const JOB_APPLICATIONS_COMPANY_PATH = "/job-applications/company";
export const JOB_APPLICATIONS_STUDENT_PATH = "/job-applications/student";
export const JOB_APPLICATIONS_FINISH_PATH = "/job-applications/finish";
export const JOB_APPLICATIONS_INTERVIEW_PATH = "/job-applications/interview";
export const JOB_APPLICATIONS_APPLY = "/job-applications/apply";

export const CITIES_PATH = "/cities";
export const REGIONS_PATH = "/cities/regions";

export const AREAS_PATH = "/areas";

export const COURSES_PATH = "/courses";
export const COURSE_PATH = (id: number) => `/courses/${id}`;

export const INSTITUTIONS_PATH = "/institutions";
export const INSTITUTION_PATH = (id: number) => `/institutions/${id}`;

export const STUDENT_RESUME_PATH = "/resumes/me";

export const STUDENT_RESUME_EDUCATIONS_PATH = "/resumes/me/educations";
export const EDUCATION_PATH = (id: number) => `/resumes/me/educations/${id}`;

export const STUDENT_RESUME_EXPERIENCES_PATH = "/resumes/me/experiences";
export const EXPERIENCE_PATH = (id: number) => `/resumes/me/experiences/${id}`;

export const STUDENT_RESUME_LANGUAGES_PATH = "/resumes/me/languages";
export const LANGUAGE_PATH = (id: number) => `/resumes/me/languages/${id}`;

export const STUDENT_RESUME_SKILLS_PATH = "/resumes/me/skills";
export const SKILL_PATH = (id: number) => `/resumes/me/skills/${id}`;
