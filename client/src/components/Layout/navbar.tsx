import React from "react";

export default function LayoutNavbar({ menuItems }: any) {
  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <aside className="bg-base-200 p-2 w-60">
        <div className="menu h-full w-56 flex flex-col ">
          <ul className="bg-base-200 flex flex-col ">
            {menuItems.map((item: any, key: any) => (
              <li key={key} className="flex flex-row">
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-1 items-end">
            <button
              className="btn border-0 bg-base-300 w-full"
              data-toggle-theme="dark,cupcake"
              data-act-class="ACTIVECLASS"
            >
              ativar/desativar modo escuro
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
