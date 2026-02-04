import { useEffect, useState } from 'react'

export function useProvedoresCount() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setIsLoading(true)
        const apiBase = import.meta.env.VITE_API_BASE || ''
        const url = `${apiBase}/api/proveedor/count`
        
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Error: ${response.statusText}`)
        
        const data = await response.json()
        setCount(typeof data === 'number' ? data : (data.count ?? 0))
      } catch (err) {
        setError(err)
        console.error('Error fetching proveedor count:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCount()
  }, [])

  return { count, isLoading, error }
}
