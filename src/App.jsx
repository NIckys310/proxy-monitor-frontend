import { useCallback, useEffect, useState } from 'react'
import { fetchLogs, fetchSummary, SERVICES, simulateLoad } from './api'
import ServiceCards from './components/ServiceCards'
import LatencyChart from './components/LatencyChart'
import LogsTable from './components/LogsTable'

const POLL_MS = 3000

export default function App() {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState({})
  const [logsPage, setLogsPage] = useState(null)
  const [filters, setFilters] = useState({ service: '', status: '', from: '', to: '' })
  const [page, setPage] = useState(0)
  const [error, setError] = useState(null)
  const [simulating, setSimulating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const [s, logs, ...perService] = await Promise.all([
        fetchSummary(),
        fetchLogs({ ...filters, page }),
        ...SERVICES.map(({ id }) => fetchLogs({ service: id, size: 20 })),
      ])
      setSummary(s)
      setLogsPage(logs)
      setRecent(Object.fromEntries(SERVICES.map(({ id }, i) => [id, perService[i].content])))
      setLastUpdate(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }, [filters, page])

  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, POLL_MS)
    return () => clearInterval(timer)
  }, [refresh])

  const onSimulate = async () => {
    setSimulating(true)
    try {
      await simulateLoad()
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setSimulating(false)
    }
  }

  const onFiltersChange = (next) => {
    setFilters(next)
    setPage(0)
  }

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <h1>Proxy Monitor</h1>
          <p className="muted">Observabilidad de microservicios vía LoggingProxy</p>
        </div>
        <div className="topbar__actions">
          <span className={`live ${error ? 'live--off' : ''}`}>
            {error ? 'Sin conexión' : `En vivo · ${lastUpdate ? lastUpdate.toLocaleTimeString() : '...'}`}
          </span>
          <button className="btn" onClick={onSimulate} disabled={simulating}>
            {simulating ? 'Simulando…' : 'Simular carga'}
          </button>
        </div>
      </header>

      {error && <div className="alert">No se pudo contactar el backend: {error}</div>}

      <ServiceCards summary={summary} />
      <LatencyChart recent={recent} />
      <LogsTable page={logsPage} filters={filters} onFiltersChange={onFiltersChange} onPageChange={setPage} />
    </main>
  )
}
