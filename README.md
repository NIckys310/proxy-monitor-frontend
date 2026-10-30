# Proxy Monitor · Frontend

Dashboard de observabilidad en tiempo real para el sistema de microservicios con Proxy de logging (React + Vite + Recharts).

## Funcionalidades

- 3 tarjetas de servicio (Inventario, Pedidos, Pagos): total de llamadas, tasa de éxito, tiempo promedio.
- Indicador visual: si la tasa de error supera el **15%**, la tarjeta se resalta en rojo.
- Gráfica de líneas con las últimas 20 llamadas por servicio y su tiempo de respuesta.
- Tabla de logs con polling cada 3 segundos: requestId, servicio, operación, duración, estado.
- Filtros por servicio, estado (SUCCESS/ERROR) y rango de fechas, con paginación.
- Clic en un log: parámetros de entrada y respuesta completa (o stack trace si falló).
- Botón **Simular carga** que llama a `POST /api/metrics/simulate-load` y refresca el dashboard.

## Ejecutar

```bash
npm install
npm run dev
```

Configura la URL del backend en `.env.local` (ver `.env.example`):

```
VITE_API_URL=http://localhost:8080
```

## Despliegue

Vercel, con la variable de entorno `VITE_API_URL` apuntando al backend en producción.
