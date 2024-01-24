import { useEffect, useState } from "react";

import { JobApplication } from "types";

type Props = {
  jobApplications: JobApplication[];
  defaultTab: string;
};

export function useJobApplications({ jobApplications, defaultTab }: Props) {
  const [jobs, setJobs] = useState(jobApplications);
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const filteredJobs = jobApplications.filter(
      (jobApplication) => jobApplication.status === activeTab
    );
    setJobs(filteredJobs);
  }, [activeTab, jobApplications]);

  return { jobs, activeTab, setActiveTab, setJobs };
}
