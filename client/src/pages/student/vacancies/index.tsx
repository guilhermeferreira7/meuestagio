import { GetServerSideProps } from "next";
import React from "react";
import { parseCookies } from "nookies";
import { Card, Col, Form, Input, Row, Select, theme } from "antd";

import styles from "./styles.module.css";
import { getVacancies } from "../../../../services/vacancies/vacancy-service";

const { useToken } = theme;
const { Search } = Input;

export default function StudentVacancies({ vacancies }: any) {
  const { token: designToken } = useToken();

  const VacancyCard = ({ vacancy }: any) => {
    return (
      <Col md={24} lg={12}>
        <Card
          hoverable={true}
          title={vacancy.company.name}
          className={styles.vacancyCard}
          headStyle={{ backgroundColor: designToken.colorPrimary }}
        >
          <div className={styles.vacancyTitle}>{vacancy.title}</div>
          <div>Descrição: {vacancy.description}</div>
          <div>Salário: {vacancy.salary}</div>
        </Card>
      </Col>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <h1>
          Ainda preciso de uma ideia para escrever aqui. Ou coloco o header da
          página aqui de novo?
        </h1>

        <Row className={styles.searchArea}>
          <Col span={24}>
            <Search
              className={styles.searchBar}
              placeholder="O que você está procurando?"
            />
          </Col>
          <Col span={24} className={styles.filterBox}>
            <Select
              className={styles.filterSelect}
              placeholder="Filtrar por"
              options={[
                { value: 1, label: "Todas as vagas" },
                { value: 2, label: "Minha área" },
              ]}
            ></Select>
          </Col>
        </Row>
      </header>

      <Row className={styles.mainContent}>
        {vacancies?.map((vacancy: any) => {
          return <VacancyCard vacancy={vacancy} />;
        })}
      </Row>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["next.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const vacancies = await getVacancies();

  return {
    props: {
      vacancies,
    },
  };
};
