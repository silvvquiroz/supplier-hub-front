import { AddProviderDialog, Metric, ScreeningDialog, Table } from './shared/components'
import { useProveedores } from './shared/hooks/useProveedores'
import { useProvedoresCount } from './shared/hooks/useProvedoresCount'
import { useDeleteProveedor } from './shared/hooks/useDeleteProveedor'
import { EditIcon } from './shared/icons/EditIcon'
import { DeleteIcon } from './shared/icons/DeleteIcon'
import { ScreeningIcon } from './shared/icons/ScreeningIcon'
import { useState } from 'react'

const SUPPLIER_COLUMNS = [
  { key: 'razonSocial', label: 'Razon social' },
  { key: 'nombreComercial', label: 'Nombre comercial' },
  { key: 'nif', label: 'NIF' },
  { key: 'pais', label: 'País' },
  { key: 'facturacionAnual', label: 'Facturación anual en USD' },
  { key: 'fechaEdicion', label: 'Fecha última de edición' },
  { key: 'actions', label: 'Acciones', center: true },
]

function App() {
  const { proveedores, isLoading, isError, error, totalPages, currentPage, pageSize, refetch } = useProveedores()
  const { count: totalCount, isLoading: isLoadingCount } = useProvedoresCount()
  const { deleteProveedor } = useDeleteProveedor()
  const [selectedProvider, setSelectedProvider] = useState({ id: null, name: null })
  const [editingProvider, setEditingProvider] = useState(null)

  const handleEditProveedor = (row) => {
    setEditingProvider(row)
    document.getElementById('AddProviderDialog')?.showPopover?.()
  }

  const handleAddProveedor = () => {
    setEditingProvider(null)
    document.getElementById('AddProviderDialog')?.showPopover?.()
  }

  const handleDeleteProveedor = async (row) => {
    if (!window.confirm(`¿Está seguro que desea eliminar a ${row.razonSocial}?`)) {
      return
    }

    try {
      await deleteProveedor(row.id)
      await refetch()
      console.log('Proveedor eliminado y tabla refrescada')
    } catch (err) {
      console.error('Error al eliminar proveedor:', err)
      alert('Error al eliminar el proveedor')
    }
  }

  const handleScreening = (provider) => {
    setSelectedProvider(provider)
    document.getElementById('ScreeningDialog')?.showPopover?.()
  }

  const handleScreeningSubmit = async (payload) => {
    console.log('Screening payload:', payload)
  }

  const renderAction = (row) => (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      <button
        className="Button PrimaryButton Gray2BorderedButton"
        onClick={() => handleEditProveedor(row)}
        title="Editar proveedor"
        style={{ padding: '6px 10px' }}
      >
        <EditIcon />
      </button>
      <button
        className="Button PrimaryButton Gray2BorderedButton"
        onClick={() => handleDeleteProveedor(row)}
        title="Eliminar proveedor"
        style={{ padding: '6px 10px' }}
      >
        <DeleteIcon />
      </button>
      <button
        className="Button PrimaryButton BlueButton"
        onClick={() => handleScreening({ id: row.id, name: row.razonSocial })}
        title="Ejecutar screening"
        style={{ padding: '6px 10px' }}
      >
        <ScreeningIcon />
      </button>
    </div>
  )

  return (
    <main>
      <menu>
        <button className="Button">
          <img src="/vite.svg" width={24} height={24} alt="logo" />
          <span>Logo</span>
        </button>
        <button className="UserButton">S</button>
      </menu>
      <section>
        <header>
          <h1 className="h3">Lista de Proveedores</h1>
          <p>Gestión integral de todos los proveedores registrados</p>
        </header>
        <div className="Section__content">
          <button
            type="button"
            className="Button PrimaryButton BlueButton"
            onClick={handleAddProveedor}
          >
            <span>Añadir Proveedor</span>
          </button>
          <form>
            <input type="search" placeholder="Buscar proveedor" />
            <select>
              <option value="" disabled defaultValue="">
                Filtrar por país
              </option>
              <option value="1">Perú</option>
              <option value="2">USA</option>
              <option value="3">España</option>
            </select>
          </form>
        </div>
        <div className="Section__content">
          <div className="ProvidersSummary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Proveedores activos en el sistema:</span>
            <strong>{isLoadingCount ? '…' : String(totalCount)}</strong>
          </div>
        </div>
        <div className="Section__content">
          {isError && (
            <p style={{ color: 'var(--color-red)' }}>
              Error al cargar proveedores: {error?.message ?? 'Error desconocido'}
            </p>
          )}
          <Table
            title="Detalle de Proveedores"
            columns={SUPPLIER_COLUMNS}
            rows={proveedores}
            isLoading={isLoading}
            totalPages={totalPages}
            currentPage={currentPage}
            pageSize={pageSize}
            renderAction={renderAction}
          />
        </div>
        <AddProviderDialog proveedor={editingProvider} onClose={() => setEditingProvider(null)} />
        <ScreeningDialog provider={selectedProvider} onSubmit={handleScreeningSubmit} />
      </section>
      <footer>
        <p>
          <small>2026 © All rights reserved</small>
        </p>
      </footer>
    </main>
  )
}

export default App
