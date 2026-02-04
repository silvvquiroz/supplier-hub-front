import { Dialog } from '../Dialog'
import { useState } from 'react'
import { useScreening } from '../../hooks/useScreening'
import './ScreeningDialog.css'

const SCREENING_DIALOG_ID = 'ScreeningDialog'

const SCREENING_SOURCES = [
  { 
    id: 'fuente1', 
    label: 'OffShore Leaks', 
    columns: [
      { key: 'entidad', label: 'Entidad' },
      { key: 'jurisdiccion', label: 'Jurisdicción' },
      { key: 'linkedTo', label: 'Relación' },
      { key: 'fuenteDatos', label: 'Fuente de Datos' },
    ]
  },
  { 
    id: 'fuente2', 
    label: 'World Bank', 
    columns: [
      { key: 'entidad', label: 'Entidad' },
      { key: 'direccion', label: 'Dirección' },
      { key: 'pais', label: 'País' },
      { key: 'desde', label: 'Desde' },
      { key: 'hasta', label: 'Hasta' },
      { key: 'grounds', label: 'Motivo' },
    ]
  },
  { 
    id: 'fuente3', 
    label: 'OFAC', 
    columns: [
      { key: 'entidad', label: 'Entidad' },
      { key: 'direccion', label: 'Dirección' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'programa', label: 'Programa' },
      { key: 'lista', label: 'Lista' },
      { key: 'score', label: 'Score' },
    ]
  },
]

export function ScreeningDialog({ provider, onSubmit }) {
  const [activeTab, setActiveTab] = useState('fuente3') // Default a OFAC
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState({})
  const [errors, setErrors] = useState({})
  const { executeScreening } = useScreening()

  const handleExecuteScreening = async (sourceId) => {
    if (!provider?.name) {
      setErrors((prev) => ({ ...prev, [sourceId]: 'Proveedor no seleccionado' }))
      return
    }

    console.log('[ScreeningDialog] executeScreening', { sourceId, providerName: provider.name })

    setLoading((prev) => ({ ...prev, [sourceId]: true }))
    setErrors((prev) => ({ ...prev, [sourceId]: null }))
    try {
      const data = await executeScreening(sourceId, provider.name)
      setResults((prev) => ({ ...prev, [sourceId]: data }))
    } catch (err) {
      setErrors((prev) => ({ ...prev, [sourceId]: err.message }))
      console.error(`Error en ${sourceId}:`, err)
    } finally {
      setLoading((prev) => ({ ...prev, [sourceId]: false }))
    }
  }

  const handleClose = () => {
    document.getElementById(SCREENING_DIALOG_ID)?.hidePopover?.()
  }

  const getResultCount = (sourceId) => {
    const result = results[sourceId]
    if (!result) return 0
    // Nueva estructura: { items, numHits }
    if (result.numHits !== undefined) return result.numHits
    // Fallback a estructura antigua
    if (Array.isArray(result)) return result.length
    if (result.data && Array.isArray(result.data)) return result.data.length
    return 1
  }

  const renderResults = (sourceId, data, columns) => {
    if (!data) return null
    
    // Nueva estructura: { items, numHits }
    const items = data.items ? data.items : (Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : [data]))
    
    if (items.length === 0) return null

    return (
      <div className="ScreeningDialog__table">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>{item[col.key] ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <Dialog id={SCREENING_DIALOG_ID} title="Screening de Proveedor" largeSize>
      <div className="ScreeningDialog">
        <div className="ScreeningDialog__tabs">
          {SCREENING_SOURCES.map((source) => (
            <button
              key={source.id}
              className={`ScreeningDialog__tab ${activeTab === source.id ? 'ScreeningDialog__tab--active' : ''}`}
              onClick={() => setActiveTab(source.id)}
              type="button"
            >
              {source.label}
            </button>
          ))}
        </div>

        <div className="ScreeningDialog__content">
          {SCREENING_SOURCES.map((source) => (
            <div
              key={source.id}
              className={`ScreeningDialog__panel ${activeTab === source.id ? 'ScreeningDialog__panel--active' : ''}`}
            >
              <div className="ScreeningDialog__header">
                <div className="ScreeningDialog__resultCount">
                  {results[source.id] && !errors[source.id] && (
                    <span>Resultados encontrados: {getResultCount(source.id)}</span>
                  )}
                </div>
                <button
                  className="Button PrimaryButton BlueButton ScreeningDialog__executeButton"
                  onClick={() => handleExecuteScreening(source.id)}
                  disabled={loading[source.id]}
                  type="button"
                >
                  {loading[source.id] ? 'Ejecutando...' : `Ejecutar`}
                </button>
              </div>

              <div className="ScreeningDialog__results">
                {errors[source.id] && (
                  <div className="ScreeningDialog__error">
                    <p>Error: {errors[source.id]}</p>
                  </div>
                )}

                {results[source.id] && !errors[source.id] && results[source.id].sourceUnavailable && (
                  <div className="ScreeningDialog__unavailable">
                    <p>{results[source.id].sourceMessage ?? 'Fuente no disponible debido a fallas externas'}</p>
                  </div>
                )}

                {results[source.id] && !errors[source.id] && results[source.id].noMatches && (
                  <div className="ScreeningDialog__noMatches">
                    <p>{results[source.id].noMatchesMessage ?? 'No se encontraron coincidencias'}</p>
                  </div>
                )}

                {results[source.id] && !errors[source.id] && !results[source.id].sourceUnavailable && (
                  renderResults(source.id, results[source.id], source.columns)
                )}

                {!results[source.id] && !errors[source.id] && !loading[source.id] && (
                  <p className="ScreeningDialog__placeholder">
                    Haz click en "Ejecutar" para ver los resultados
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="ScreeningDialog__actions">
          <button
            type="button"
            className="Button PrimaryButton Gray2BorderedButton"
            onClick={handleClose}
          >
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </Dialog>
  )
}
