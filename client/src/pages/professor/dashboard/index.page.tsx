import { Visibility } from "@mui/icons-material";
import { withProfessorAuth } from "services";

export default function _page() {
  return (
    <>
      <h1 className="text-xl font-bold text-primary py-2">Visualizar alunos</h1>

      <table className="table w-4/5">
        <thead>
          <tr>
            <th className="cursor-pointer underline">Aluno </th>
            <th className="cursor-pointer underline">Empresa atual</th>
            <th className="cursor-pointer underline">Tempo de estágio</th>
            <th className="text-center">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Aluno 1</td>
            <td>Empresa X</td>
            <td>1 ano</td>
            <td className="flex items-center justify-center">
              <button className="text-primary">
                <Visibility />
              </button>
            </td>
          </tr>
          <tr>
            <td>Aluno 2</td>
            <td>Empresa Y</td>
            <td>2 meses</td>
            <td className="flex items-center justify-center">
              <button className="text-primary">
                <Visibility />
              </button>
            </td>
          </tr>
          <tr>
            <td>Aluno 3</td>
            <td>Empresa Z</td>
            <td>4 meses</td>
            <td className="flex items-center justify-center">
              <button className="text-primary">
                <Visibility />
              </button>
            </td>
          </tr>
          <tr>
            <td>Aluno 4</td>
            <td>Empresa A</td>
            <td>Menos de um mês</td>
            <td className="flex items-center justify-center">
              <button className="text-primary">
                <Visibility />
              </button>
            </td>
          </tr>
          <tr>
            <td>Aluno 5</td>
            <td>Empresa B</td>
            <td>1 ano e 4 meses</td>
            <td className="flex items-center justify-center">
              <button className="text-primary">
                <Visibility />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export const getServerSideProps = withProfessorAuth(
  async (_context, professor) => {
    return {
      props: {},
    };
  }
);
