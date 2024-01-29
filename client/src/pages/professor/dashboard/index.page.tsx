import { withProfessorAuth } from "services";

export default function _page() {
  return (
    <>
      <div>professor dashboard</div>
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
