import { AddProviderDialog, Metric, ScreeningDialog, Table } from './shared/components'
import { useProveedores } from './shared/hooks/useProveedores'
import { useState } from 'react'

const SUPPLIER_COLUMNS = [
  { key: 'razonSocial', label: 'Razon social' },
  { key: 'nombreComercial', label: 'Nombre comercial' },
  { key: 'nif', label: 'NIF' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Correo electrónico' },
  { key: 'pais', label: 'País' },
  { key: 'facturacionAnual', label: 'Facturación anual en USD' },
  { key: 'fechaEdicion', label: 'Fecha última de edición' },
  { key: 'actions', label: 'Acciones', center: true },
]

function App() {
  const { proveedores, isLoading, isError, error, totalPages, currentPage, pageSize } = useProveedores()
  const [selectedProvider, setSelectedProvider] = useState({ id: null, name: null })

  const handleScreening = (provider) => {
    setSelectedProvider(provider)
    document.getElementById('ScreeningDialog')?.showPopover?.()
  }

  const handleScreeningSubmit = async (payload) => {
    // Aquí puedes llamar a tu endpoint de screening
    console.log('Screening payload:', payload)
  }

  const renderAction = (row) => (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      <button
        className="Button PrimaryButton Gray2BorderedButton"
        popoverTarget="EditProviderDialog"
        onClick={() => console.log('Edit:', row)}
        title="Editar proveedor"
      >
        Editar
      </button>
      <button
        className="Button PrimaryButton Gray2BorderedButton"
        onClick={() => console.log('Delete:', row)}
        title="Eliminar proveedor"
      >
        Eliminar
      </button>
      <button
        className="Button PrimaryButton BlueButton"
        onClick={() => handleScreening({ id: row.id, name: row.razonSocial })}
        title="Ejecutar screening"
      >
        Screening
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
          <AddProviderDialog />
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
        <div className="Section__content" data-scroll-x>
          <Metric
            title="Proveedores Totales"
            value={isLoading ? '…' : String(proveedores.length)}
            description="Proveedores activos en el sistema"
          />
          <Metric
            title="Proveedores Totales"
            value="100"
            description="Proveedires activos en el sistema"
          />
          <Metric
            title="Proveedores Totales"
            value="100"
            description="Proveedires activos en el sistema"
          />
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
