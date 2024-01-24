interface ErrorProps {
  error: string;
}

export function Error({ error }: ErrorProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className=" text-lg font-bold">Algo inesperado aconteceu</h1>
        <p>Erro: {error}</p>
      </div>
    </>
  );
}
