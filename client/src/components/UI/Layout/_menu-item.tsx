import { ReactNode } from "react";
import Link from "next/link";

interface MenuProps {
  icon: ReactNode;
  href: string;
  label: string;
  subMenu?: {
    title: string;
    menuItems: MenuProps[];
  };
}

export default function MenuItem({ icon, href, label, subMenu }: MenuProps) {
  const SubMenu = ({ title, items }: { title: string; items: MenuProps[] }) => {
    return (
      <div className="hover:bg-base-100 flex flex-col items-start">
        <div className="w-full  flex items-center gap-2 hover:cursor-default">
          {icon}
          {title}
        </div>
        <ul className="flex flex-col gap-1 w-full">
          <li>
            {items.map((item: any, key: any) => (
              <MenuItem {...item} key={key} />
            ))}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {subMenu ? (
        <SubMenu title={subMenu.title} items={subMenu.menuItems} />
      ) : (
        <Link className="w-full flex" href={href}>
          <span className="w-1/6">{icon}</span>
          <span className="w-5/6">{label}</span>
        </Link>
      )}
    </>
  );
}
