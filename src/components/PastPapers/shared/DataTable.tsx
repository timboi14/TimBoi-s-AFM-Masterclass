interface Props {
  headers: string[];
  rows: string[][];
  highlightLastRow?: boolean;
}

export function DataTable({ headers, rows, highlightLastRow = false }: Props) {
  const lastIdx = rows.length - 1;
  return (
    <div className="data-table__wrap">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={highlightLastRow && ri === lastIdx ? 'data-table__row--total' : ''}
            >
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
