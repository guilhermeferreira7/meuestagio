import { withAdminAuth } from "services";

export default function AdminProfile() {
  return (
    <>
      <h1 className="font-bold text-2xl">Logado como admin</h1>
    </>
  );
}
export const getServerSideProps = withAdminAuth(async () => {
  return {
    props: {},
  };
});
