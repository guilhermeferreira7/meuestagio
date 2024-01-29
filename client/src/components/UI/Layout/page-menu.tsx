import MenuItem from "./_menu-item";

export default function PageMenu({ menuItems }: any) {
  return (
    <ul className="menu w-56 flex flex-col items-center border-r">
      {menuItems?.map((item: any, key: any) => (
        <li key={key} className="w-full border-b-2">
          <MenuItem {...item} />
        </li>
      ))}
    </ul>
  );
}
