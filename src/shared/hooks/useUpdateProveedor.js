import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddProviderSchema } from '../schemas/addProviderSchema'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const API_URL = `${API_BASE}/api/Proveedor`

function validateAddProviderPayload(raw) {
  const payload = {
    ...raw,
    facturacionAnual:
      typeof raw.facturacionAnual === 'number'
        ? raw.facturacionAnual
        : Number(raw.facturacionAnual) || 0,
  }
  const result = AddProviderSchema.safeParse(payload)
  if (!result.success) {
    const issues = result.error.issues
    const first = Array.isArray(issues) && issues.length > 0 ? issues[0] : null
    const message = first?.message ?? 'Datos inválidos.'
    throw new Error(message)
  }
  return result.data
}

async function putProveedor(id, body) {
  const url = `${API_URL}/${id}`
  console.log('[useUpdateProveedor] PUT request URL:', url, 'body:', body)

  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: id,
      razonSocial: body.razonSocial,
      nombreComercial: body.nombreComercial,
      identificacionTributaria: body.identificacionTributaria,
      numeroTelefonico: body.numeroTelefonico,
      correoElectronico: body.correoElectronico,
      sitioWeb: body.sitioWeb ?? '',
      direccionFisica: body.direccionFisica ?? '',
      pais: body.pais,
      facturacionAnual: body.facturacionAnual,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export function useUpdateProveedor() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, raw }) => {
      const body = validateAddProviderPayload(raw)
      return putProveedor(id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })

  return {
    updateProveedor: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
