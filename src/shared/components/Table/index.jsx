import './Table.css'

const DEFAULT_ACTION_LABEL = 'Editar | Eliminar'

export function Table({
  title,
  columns,
  rows,
  isLoading,
  renderAction = () => DEFAULT_ACTION_LABEL,
  totalPages = 0,
  currentPage = 1,
  pageSize,
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
      {(totalPages > 0 || pageSize != null) && (
        <div className="Table__pagination">
          {Array.from({ length: Math.max(0, totalPages) }, (_, i) => {
            const page = i + 1
            const search = new URLSearchParams()
            search.set('page', String(page))
            if (pageSize != null) search.set('pageSize', String(pageSize))
            const href = `/?${search.toString()}`
            const isCurrent = page === currentPage
            return (
              <a
                key={page}
                className={`Button PrimaryButton Gray2BorderedButton${isCurrent ? ' Table__pagination-current' : ''}`}
                href={href}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {page}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
