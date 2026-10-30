const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options)
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`)
  return body
}

export const SERVICES = [
  { id: 'inventory', label: 'Inventario', color: '#38bdf8' },
  { id: 'orders', label: 'Pedidos', color: '#a78bfa' },
  { id: 'payments', label: 'Pagos', color: '#f59e0b' },
]

export const ERROR_THRESHOLD = 15

export function fetchSummary() {
  return request('/api/metrics/summary')
}

export function fetchLogs({ service, status, from, to, page = 0, size = 20 }) {
  const params = new URLSearchParams({ page, size })
  if (service) params.set('service', service)
  if (status) params.set('status', status)
  if (from) params.set('from', new Date(from).toISOString())
  if (to) params.set('to', new Date(to).toISOString())
  return request(`/api/metrics/logs?${params}`)
}

export function simulateLoad() {
  return request('/api/metrics/simulate-load', { method: 'POST' })
}
