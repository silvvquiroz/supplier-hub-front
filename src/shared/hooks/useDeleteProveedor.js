const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const API_URL = `${API_BASE}/api/proveedor`

export function useDeleteProveedor() {
  const deleteProveedor = async (providerId) => {
    const url = `${API_URL}/${providerId}`
    console.log('[useDeleteProveedor] DELETE request URL:', url)

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (response.status === 204) {
      console.log('[useDeleteProveedor] DELETE success (204)')
      return null
    }

    if (!response.ok) throw new Error(`Error: ${response.statusText}`)
    
    const data = await response.json()
    console.log('[useDeleteProveedor] DELETE response:', data)
    return data
  }

  return { deleteProveedor }
}
