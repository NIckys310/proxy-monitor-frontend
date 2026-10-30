import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SERVICES } from '../api'

/** recent: { inventory: LogEntry[], orders: [...], payments: [...] } — más reciente primero. */
export default function LatencyChart({ recent }) {
  const data = Array.from({ length: 20 }, (_, i) => {
    const point = { call: i + 1 }
    for (const { id } of SERVICES) {
      const logs = [...(recent[id] ?? [])].reverse()
      if (logs[i]) point[id] = logs[i].durationMs
    }
    return point
  })

  return (
    <section className="panel">
      <h3>Últimas 20 llamadas por servicio · tiempo de respuesta (ms)</h3>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis dataKey="call" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} unit="ms" />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
              labelFormatter={(v) => `Llamada #${v}`}
              formatter={(v, name) => [`${v} ms`, SERVICES.find((s) => s.id === name)?.label ?? name]}
            />
            <Legend formatter={(name) => SERVICES.find((s) => s.id === name)?.label ?? name} />
            {SERVICES.map(({ id, color }) => (
              <Line key={id} type="monotone" dataKey={id} stroke={color} strokeWidth={2} dot={{ r: 2 }}
                    connectNulls isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
