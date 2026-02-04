export function useScreening() {
  const apiBase = import.meta.env.VITE_API_BASE || ''

  const executeScreening = async (sourceId, providerName) => {
    if (sourceId === 'fuente3') {
      // OFAC
      return executeOFAC(providerName)
    } else if (sourceId === 'fuente2') {
      // World Bank
      return executeWorldBank(providerName)
    } else if (sourceId === 'fuente1') {
      // OffShore Leaks
      return executeOffShoreLeaks(providerName)
    }
  }

  const executeOFAC = async (providerName) => {
    const url = `${apiBase}/api/proveedor/external/ofac/${providerName}`
    console.log('[useScreening] OFAC request URL:', url, 'providerName:', providerName)

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error(`Error: ${response.statusText}`)
    const data = await response.json()
    console.log('[useScreening] OFAC response:', data)

    // Mapear respuesta OFAC al formato esperado por la UI
    if (data.results && Array.isArray(data.results)) {
      return {
        items: data.results.map((item) => ({
          entidad: item.name,
          direccion: item.address,
          tipo: item.type,
          programa: item.program,
          lista: item.list,
          score: item.score,
        })),
        numHits: data.numHits || data.results.length,
      }
    }

    return { items: [], numHits: 0 }
  }

  const executeWorldBank = async (providerName) => {
    // Consulta a World Bank API local - instancia en localhost:8080
    const worldbankBaseUrl = import.meta.env.VITE_WORLDBANK_API || 'http://localhost:8080'
    const url = `${worldbankBaseUrl}/api/worldbank?entity=${providerName}`
    console.log('[useScreening] World Bank request URL:', url, 'providerName:', providerName)

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error(`Error: ${response.statusText}`)
    const data = await response.json()
    console.log('[useScreening] World Bank response:', data)

    // Mapear respuesta World Bank al formato esperado por la UI
    if (data.results && Array.isArray(data.results)) {
      return {
        items: data.results.map((item) => ({
          entidad: item.firmName,
          direccion: item.address,
          pais: item.country,
          desde: item.fromDate,
          hasta: item.toDate,
          grounds: item.grounds,
        })),
        numHits: data.numHits || data.results.length,
      }
    }

    return { items: [], numHits: 0 }
  }

  const executeOffShoreLeaks = async (providerName) => {
    const url = `${apiBase}/api/proveedor/external/offshoreleaks/${providerName}`
    console.log('[useScreening] OffShore Leaks request URL:', url, 'providerName:', providerName)

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) throw new Error(`Error: ${response.statusText}`)
    const data = await response.json()
    console.log('[useScreening] OffShore Leaks response:', data)

    // Mapear respuesta OffShore Leaks al formato esperado por la UI
    if (data.results && Array.isArray(data.results)) {
      return {
        items: data.results.map((item) => ({
          entidad: item.entity,
          jurisdiccion: item.jurisdiction,
          linkedTo: item.linkedTo,
          fuenteDatos: item.dataFrom,
        })),
        numHits: data.numHits || data.results.length,
      }
    }

    return { items: [], numHits: 0 }
  }

  return { executeScreening }
}
