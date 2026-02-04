import './Table.css'

const DEFAULT_ACTION_LABEL = 'Editar | Eliminar'

export function Table({
  title,
  columns,
  rows,
  isLoading,
  renderAction = () => DEFAULT_ACTION_LABEL,
}) {
  return (
    <div className="Table">
      <header>
        <h6>{title}</h6>
      </header>
      <div className="Table__scroll">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key ?? col.label}
                  {...(col.center && { 'data-center': true })}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>Cargando</td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
              <tr key={row?.id ?? rowIndex}>
                {columns.map((col) => {
                  if (col.key === 'actions') {
                    return (
                      <td key="actions" data-center>
                        {typeof renderAction === 'function'
                          ? renderAction(row, rowIndex)
                          : DEFAULT_ACTION_LABEL}
                      </td>
                    )
                  }
                  const value = row[col.key] ?? ''
                  return <td key={col.key}>{value}</td>
                })}
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
