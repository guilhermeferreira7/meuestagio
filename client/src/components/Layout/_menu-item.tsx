import React, { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

  const SubMenu = ({ title, items }: { title: string; items: MenuProps[] }) => {
    return (
      <details
        className="hover:bg-base-100"
        open={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <summary className="flex items-center justify-between hover:bg-gray-200">
          {icon}
          {title}
          {isOpen ? <ChevronDown /> : <ChevronRight />}
        </summary>
        <ul className="flex flex-col gap-1">
          <li>
            {items.map((item: any, key: any) => (
              <MenuItem {...item} key={key} />
            ))}
          </li>
        </ul>
      </details>
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
