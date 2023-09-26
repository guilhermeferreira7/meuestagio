import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { ReactNode, useState } from "react";

type MenuListItem = {
  label: string;
  action?: () => void;
  href?: string;
  btnType?: "primary" | "error" | "success" | "warning";
};

type DropDownProps = {
  title: string;
  menuList: MenuListItem[];
};

export default function DropDown({ menuList, title }: DropDownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="border rounded border-primary text-primary p-2"
      >
        {title}
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menuList.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.action && item.action();
              handleClose();
            }}
          >
            {item.href ? (
              <Link href={item.href} className={`text-${item.btnType}`}>
                {item.label}
              </Link>
            ) : (
              <button className={`text-${item.btnType}`}>{item.label}</button>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
