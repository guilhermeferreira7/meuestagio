interface TableRowProps {
  dataCells: string[];
  actions?: React.ReactNode;
}

export default function TableRow({ dataCells, actions }: TableRowProps) {
  return (
    <>
      <tr>
        {dataCells.map((dataCell, index) => (
          <td key={index} className="text-center">
            {dataCell}
          </td>
        ))}
        {actions && <td>{actions}</td>}
      </tr>
    </>
  );
}
