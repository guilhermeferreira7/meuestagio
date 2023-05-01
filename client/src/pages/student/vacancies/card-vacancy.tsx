import React, { useState } from "react";
import { Button, Modal } from "antd";

export default function CardVacancy({ vacancy }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-base-200 card card-bordered">
      <div className="card-body">
        <div className="card-title">
          <h2>{vacancy.title}</h2>
        </div>
        <p>{vacancy.company.name}</p>
        <p className="line-clamp-3">Descrição: {vacancy.description}</p>
        <p>Bolsa: R$ {vacancy.salary},00</p>
        <div className="card-actions flex flex-row justify-end">
          <button className="bg-accent btn btn-sm md:btn-md text-accent-content">
            Candidatar-se
          </button>
          <button
            className="bg-accent btn btn-sm md:btn-md text-accent-content"
            onClick={showModal}
          >
            Ver mais
          </button>
        </div>

        <Modal
          title={vacancy.title}
          open={isModalOpen}
          onCancel={handleOk}
          footer={[
            <button className="bg-accent btn btn-sm md:btn-md text-accent-content">
              Candidatar-se
            </button>,
          ]}
        >
          <div className="flex flex-col gap-2">
            <div>Descrição completa: {vacancy.description}</div>
            <div className="self-end">Publicado em: 20/04/2023</div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
