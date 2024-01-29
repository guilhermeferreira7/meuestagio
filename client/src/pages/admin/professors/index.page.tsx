import { Add } from "@mui/icons-material";
import Link from "next/link";

export default function _screen() {
  return (
    <>
      <h2 className="text-xl font-bold mb-2 flex justify-between items-center w-full px-10">
        <span className="text-primary">Professores cadastrados</span>
        <Link
          href="professors/new"
          className="btn btn-primary btn-md flex items-center"
        >
          <Add /> Novo professor
        </Link>
      </h2>
    </>
  );
}
