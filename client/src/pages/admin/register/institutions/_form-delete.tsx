import { Trash } from "lucide-react";

import { Institution } from "@customTypes/institution";
import { api } from "@services/api/api";

import { notify } from "@components/toasts/toast";
import { useRouter } from "next/router";

interface DeleteInstitutionFormProps {
  institution: Institution;
}

export default function DeleteInstitutionForm({
  institution,
}: DeleteInstitutionFormProps) {
  const router = useRouter();
  const handleDelete = async (id: number) => {
    if (!confirm(`Deseja excluir a instituição ${institution.name}?`)) {
      return;
    }
    try {
      await api.delete<Institution>(`/institutions/${id}`);
      notify.success(`Instituição ${institution.name} excluída com sucesso!`);
      router.reload();
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };
  return (
    <>
      <tr>
        <td className="text-center">{institution.id}</td>
        <td className="text-center">{institution.city.name}</td>

        <td className="text-center">{institution.name}</td>
        <td className="text-center">
          <button
            className="btn btn-error flex items-center gap-1 w-full"
            onClick={() => handleDelete(institution.id)}
          >
            <Trash /> Excluir
          </button>
        </td>
      </tr>
    </>
  );
}
