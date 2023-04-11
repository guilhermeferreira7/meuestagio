import { Card, Col, ColProps, Row, Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import CompanyIcon from "../../../styles/icons/company";
import ProfessorIcon from "../../../styles/icons/professor";
import StudentIcon from "../../../styles/icons/student";

import styles from "./styles.module.css";

export default function CreateAccount() {
  const router = useRouter();
  const cardsSpanSize = 7;

  return (
    <div className={styles.pageWrapper}>
      <Link href={router.pathname + "/student"}>
        <Card>
          <p>Criar conta</p>
        </Card>
      </Link>
    </div>
  );
}
