import { useQuery } from '@tanstack/react-query'

// In dev, Vite proxies /api to the backend (avoids CORS). In production, either
// configure your host to proxy /api to the same backend or set VITE_API_BASE.
const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const API_URL = `${API_BASE}/api/proveedor/all`

function formatFecha(isoString) {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return isoString
  }
}

function mapProveedorToRow(proveedor) {
  return {
    id: proveedor.id,
    razonSocial: proveedor.razonSocial ?? '',
    nombreComercial: proveedor.nombreComercial ?? '',
    nif: proveedor.identificacionTributaria ?? '',
    telefono: proveedor.numeroTelefonico ?? '',
    email: proveedor.correoElectronico ?? '',
    pais: proveedor.pais ?? '',
    facturacionAnual:
      proveedor.facturacionAnual != null
        ? Number(proveedor.facturacionAnual).toLocaleString()
        : '',
    fechaEdicion: formatFecha(proveedor.fechaUltimaEdicion),
  }
}

async function fetchProveedores() {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const data = await res.json()
  console.log(data)
  return Array.isArray(data) ? data : []
}

export function useProveedores() {
  const query = useQuery({
    queryKey: ['proveedores'],
    queryFn: fetchProveedores,
  })

  const proveedores = Array.isArray(query.data)
    ? query.data.map(mapProveedorToRow)
    : []

  return {
    proveedores,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
