import { ERROR_THRESHOLD, SERVICES } from '../api'

export default function ServiceCards({ summary }) {
  const byId = Object.fromEntries((summary?.services ?? []).map((s) => [s.serviceId, s]))

  return (
    <section className="cards">
      {SERVICES.map(({ id, label, color }) => {
        const s = byId[id] ?? { totalCalls: 0, successRate: 0, errorRate: 0, avgResponseMs: 0 }
        const unhealthy = s.errorRate > ERROR_THRESHOLD
        return (
          <article key={id} className={`card ${unhealthy ? 'card--danger' : ''}`}>
            <header>
              <span className="dot" style={{ background: color }} />
              <h2>{label}</h2>
              <span className={`badge ${unhealthy ? 'badge--danger' : 'badge--ok'}`}>
                {unhealthy ? 'Con problemas' : 'Saludable'}
              </span>
            </header>
            <dl>
              <div>
                <dt>Total llamadas</dt>
                <dd>{s.totalCalls}</dd>
              </div>
              <div>
                <dt>Tasa de éxito</dt>
                <dd>{s.successRate.toFixed(1)}%</dd>
              </div>
              <div>
                <dt>Tiempo promedio</dt>
                <dd>{Math.round(s.avgResponseMs)} ms</dd>
              </div>
            </dl>
            <p className="card__foot">Tasa de error: {s.errorRate.toFixed(1)}%</p>
          </article>
        )
      })}
    </section>
  )
}
