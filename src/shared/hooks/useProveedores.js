import { useQuery } from '@tanstack/react-query'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://supplier-hub-api-fha8daf4g7gzdhag.spaincentral-01.azurewebsites.net'
const API_URL = `${API_BASE}/api/proveedor`

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

async function fetchProveedores(page, pageSize) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  const url = `${API_URL}?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const data = await res.json()
  const list = Array.isArray(data?.proveedores) ? data.proveedores : []
  return {
    proveedores: list,
    totalProveedores: data?.totalProveedores ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.currentPage ?? 1,
  }
}

function getSearchParams() {
  const search = typeof window !== 'undefined' ? window.location.search : ''
  const params = new URLSearchParams(search)
  return {
    page: params.get('page') ?? '1',
    pageSize: params.get('pageSize') ?? '5',
  }
}

export function useProveedores() {
  const { page, pageSize } = getSearchParams()

  const query = useQuery({
    queryKey: ['proveedores', page, pageSize],
    queryFn: () => fetchProveedores(page, pageSize),
  })

  const rawList = query.data?.proveedores ?? []
  const proveedores = rawList.map(mapProveedorToRow)

  return {
    proveedores,
    totalProveedores: query.data?.totalProveedores ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    page: Number(page),
    pageSize: Number(pageSize),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
