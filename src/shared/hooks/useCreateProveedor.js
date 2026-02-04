import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddProviderSchema } from '../schemas/addProviderSchema'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const API_URL = `${API_BASE}/api/proveedor`

/**
 * Validates raw form data with AddProviderSchema. Never calls the API.
 * @throws {Error} With user-facing message when validation fails.
 */
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

/**
 * @param {z.infer<typeof AddProviderSchema>} body
 */
async function postProveedor(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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

export function useCreateProveedor() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (raw) => {
      const body = validateAddProviderPayload(raw)
      return postProveedor(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })

  return {
    createProveedor: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
