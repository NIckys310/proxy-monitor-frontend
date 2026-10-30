import { Fragment, useState } from 'react'
import { SERVICES } from '../api'

const labelOf = (id) => SERVICES.find((s) => s.id === id)?.label ?? id

export default function LogsTable({ page, filters, onFiltersChange, onPageChange }) {
  const [expanded, setExpanded] = useState(null)
  const set = (key) => (e) => onFiltersChange({ ...filters, [key]: e.target.value })
  const logs = page?.content ?? []

  return (
    <section className="panel">
      <div className="panel__head">
        <h3>Logs en tiempo real</h3>
        <span className="muted">actualiza cada 3 s · {page?.totalElements ?? 0} registros</span>
      </div>

      <div className="filters">
        <label>
          Servicio
          <select value={filters.service} onChange={set('service')}>
            <option value="">Todos</option>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <label>
          Estado
          <select value={filters.status} onChange={set('status')}>
            <option value="">Todos</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="ERROR">ERROR</option>
          </select>
        </label>
        <label>
          Desde
          <input type="datetime-local" value={filters.from} onChange={set('from')} />
        </label>
        <label>
          Hasta
          <input type="datetime-local" value={filters.to} onChange={set('to')} />
        </label>
        <button className="btn btn--ghost" onClick={() => onFiltersChange({ service: '', status: '', from: '', to: '' })}>
          Limpiar
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Servicio</th>
              <th>Operación</th>
              <th>Duración</th>
              <th>Estado</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={6} className="empty">Sin logs. Pulsa “Simular carga” para generar tráfico.</td></tr>
            )}
            {logs.map((log) => (
              <Fragment key={log.requestId}>
                <tr className={`row ${expanded === log.requestId ? 'row--open' : ''}`}
                    onClick={() => setExpanded(expanded === log.requestId ? null : log.requestId)}>
                  <td className="mono">{log.requestId.slice(0, 8)}…</td>
                  <td>{labelOf(log.serviceId)}</td>
                  <td className="mono">{log.operation}</td>
                  <td>{log.durationMs} ms</td>
                  <td><span className={`status status--${log.status.toLowerCase()}`}>{log.status}</span></td>
                  <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                </tr>
                {expanded === log.requestId && (
                  <tr className="details">
                    <td colSpan={6}>
                      <div className="details__grid">
                        <div>
                          <h4>Request ID</h4>
                          <pre>{log.requestId}</pre>
                          <h4>Parámetros de entrada</h4>
                          <pre>{JSON.stringify(log.params, null, 2)}</pre>
                        </div>
                        <div>
                          <h4>{log.status === 'ERROR' ? 'Error' : 'Respuesta completa'}</h4>
                          <pre className={log.status === 'ERROR' ? 'pre--error' : ''}>
                            {log.status === 'ERROR' ? log.stackTrace : JSON.stringify(log.response, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <button className="btn btn--ghost" disabled={!page || page.page === 0} onClick={() => onPageChange(page.page - 1)}>
          ← Anterior
        </button>
        <span className="muted">Página {(page?.page ?? 0) + 1} de {Math.max(page?.totalPages ?? 1, 1)}</span>
        <button className="btn btn--ghost" disabled={!page || page.page + 1 >= page.totalPages} onClick={() => onPageChange(page.page + 1)}>
          Siguiente →
        </button>
      </div>
    </section>
  )
}
