import React from "react";

import { JobApplication } from "../../../../types/job-application";
import { AppCard } from "../../../../components";

type CandidateProps = {
  jobApplication: JobApplication;
  setCurrentCandidate: (jobApplication: JobApplication) => void;
};

export default function Candidate({
  jobApplication,
  setCurrentCandidate,
}: CandidateProps) {
  return (
    <AppCard key={jobApplication.id}>
      <div className="flex flex-col gap-1">
        <span className="text-xl font-semibold">
          Candidato: {jobApplication.student.name}
        </span>
        <span>Mensagem: {jobApplication.message}</span>
        <div className="flex items-center gap-1">
          <span>Habilidades: </span>
          {jobApplication.resume.skills &&
            jobApplication.resume.skills.map((skill) => (
              <span key={skill.id} className="p-1 bg-base-200 rounded-md">
                {skill.name}
              </span>
            ))}
        </div>
        <span>Sobre: {jobApplication.student.about}</span>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentCandidate(jobApplication)}
        >
          Currículo completo
        </button>
      </div>
    </AppCard>
  );
}
