import React from "react";

export default function SearchBox() {
  return (
    <>
      <div className="flex flex-row justify-center my-4 ">
        <div className="flex flex-col items-center gap-2 mx-2">
          <div className="w-96 flex flex-col items-center gap-2">
            <input
              type="text"
              placeholder="Pesquisar vagas"
              className="w-full pl-2 input input-primary"
            />
            <div className="flex justify-center items-center gap-1">
              <span>Vagas remotas?</span>
              <input type="checkbox" className="checkbox checkbox-primary" />
              <button className="btn btn-primary w-5/6">Buscar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
