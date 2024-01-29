import {
  Add,
  ArrowBack,
  ArrowForward,
  Delete,
  Edit,
} from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";

import { INSTITUTIONS_PATH } from "app-constants";
import { Modal } from "components";
import { serverApi, withAdminAuth } from "services";
import { Institution } from "types";
import { errorToString } from "utils";

import { useActions } from "./_useActions";

interface CreateCourseFormProps {
  institutions: Institution[];
}

export default function RegisterInstitutions({
  institutions,
}: CreateCourseFormProps) {
  const { institutionsUpdated, nextPage, prevPage, page, handleDelete } =
    useActions(institutions);

  const [institutionSelected, setInstitutionSelected] = useState<
    Institution | undefined
  >();

  return (
    <>
      <h2 className="text-xl font-bold mb-2 flex justify-between items-center w-full px-10">
        <span className="text-primary">Instituições cadastradas</span>
        <Link
          href="institutions/new"
          className="btn btn-primary btn-md flex items-center"
        >
          <Add /> Nova instituição
        </Link>
      </h2>

      <div className="w-4/5">
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Instituição</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {institutionsUpdated.map((institution) => (
              <tr key={institution.id}>
                <td>{institution.id}</td>
                <td>{institution.name}</td>
                <td>{institution.city.name}</td>
                <td className="flex gap-2">
                  <Modal.Button id="edit" type="warning" size="sm">
                    <Edit />
                  </Modal.Button>
                  <Modal.Button
                    id="delete"
                    type="error"
                    size="sm"
                    onClick={() => {
                      setInstitutionSelected(institution);
                    }}
                  >
                    <Delete />
                  </Modal.Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="col-span-3 flex justify-center items-center">
        <button className="btn btn-sm btn-primary" onClick={prevPage}>
          <ArrowBack />
        </button>
        <span className="p-2">{page}</span>
        <button className="btn btn-sm btn-primary" onClick={nextPage}>
          <ArrowForward />
        </button>
      </div>

      <Modal.Content
        id="delete"
        confirmText="Excluir"
        confirmAction={() => handleDelete(institutionSelected!)}
        buttonType="error"
      >
        <span>
          Tem certeza que deseja excluir a instituição{" "}
          {institutionSelected?.name}
        </span>
      </Modal.Content>
    </>
  );
}

export const getServerSideProps = withAdminAuth(async (context, _user) => {
  const apiServer = serverApi(context);

  try {
    const institutions = await apiServer.get<Institution[]>(INSTITUTIONS_PATH, {
      params: {
        page: 0,
        limit: 10,
        orderBy: "name",
        order: "ASC",
      },
    });

    return {
      props: {
        institutions: institutions.data,
      },
    };
  } catch (error) {
    console.log(errorToString(error));

    return {
      props: {},
    };
  }
});
