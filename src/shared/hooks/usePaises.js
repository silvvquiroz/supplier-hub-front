import { useEffect, useState } from 'react'

export function usePaises() {
  const [paises, setPaises] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        setIsLoading(true)
        const apiBase = import.meta.env.VITE_API_BASE || ''
        const url = `${apiBase}/api/helper/paises`
        console.log('[usePaises] Fetching from:', url)

        const response = await fetch(url)
        if (!response.ok) throw new Error(`Error: ${response.statusText}`)

        const data = await response.json()
        console.log('[usePaises] Response:', data)
        const paisList = Array.isArray(data) ? data : (data.paises ?? [])
        setPaises(paisList)
      } catch (err) {
        setError(err)
        console.error('Error fetching paises:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaises()
  }, [])

  return { paises, isLoading, error }
}
