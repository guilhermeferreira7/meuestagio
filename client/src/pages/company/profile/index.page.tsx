import { InfoOutlined } from "@mui/icons-material";
import { useState } from "react";

import { CITIES_PATH, PROFILE_COMPANY_PATH } from "app-constants";
import { AppCard } from "components";
import { serverApi, withCompanyAuth } from "services";
import { City, Company } from "types";
import { errorToString } from "utils";

import ImageForm from "./_image-form";
import InfoForm from "./_info-form";

type CompanyProfileProps = {
  company: Company;
  states: string[];
  initialCities: City[];
};

export default function CompanyProfile({
  company,
  states,
  initialCities,
}: CompanyProfileProps) {
  const [companyUpdated, setCompany] = useState<Company>(company);

  return (
    <>
      <div className="w-11/12">
        <h2 className="flex items-center gap-1 pb-2 text-2xl font-semibold">
          <InfoOutlined /> Perfil da empresa
        </h2>
        <div className="flex flex-col gap-2">
          <AppCard>
            <ImageForm company={companyUpdated} setCompany={setCompany} />
          </AppCard>
          <AppCard>
            <InfoForm
              company={companyUpdated}
              setCompany={setCompany}
              states={states}
              initialCities={initialCities}
            />
          </AppCard>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withCompanyAuth(async (context, _user) => {
  const apiClient = serverApi(context);
  try {
    const { data: company } = await apiClient.get<Company>(
      PROFILE_COMPANY_PATH
    );

    const cities = await apiClient.get(CITIES_PATH);
    const states = new Set<string>(cities.data.map((city: any) => city.state));
    const initialCities = cities.data.filter(
      (city: City) => city.state === company.city.state
    );

    return {
      props: {
        company,
        states: Array.from(states),
        initialCities,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return { props: {} };
  }
});
