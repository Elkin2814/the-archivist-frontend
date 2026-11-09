# The Archivist · Frontend

React 19 + Vite. Panel de estadísticas de Halo Wars 2 (líderes, jugadores, rankings).

## Arranque

```bash
pnpm install        # instala react-router y lucide-react (nuevas)
pnpm dev            # http://localhost:5173
```

El backend (Spring Boot) debe estar corriendo en `http://localhost:8080`.
Vite reenvía todo lo que empieza por `/api` al backend, así que no hace falta CORS en desarrollo.
Para otro puerto: `VITE_BACKEND_URL=http://localhost:9090 pnpm dev`.

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Inicio: búsqueda rápida y tarjetas del meta (vacías hasta tener datos) |
| `/leaders` | Los 16 líderes por facción |
| `/leaders/:líder/overview` · `matchups` · `builds` · `strategy` | Ficha del líder (estructura lista, datos pendientes) |
| `/players` | Buscador de gamertag |
| `/players/:gamertag/overview` | Resumen real (`GET /players/{gamertag}/summary`) |
| `/players/:gamertag/history` | Historial real paginado (`GET /players/{gamertag}/history`) |
| `/rankings/top` · `distribution` · `records` | Rankings (estructura) |
| `/stats/leaders` · `maps` · `units` · `modes` | Estadísticas (estructura) |
| `/synergy` | Combinaciones (estructura) |
| `/guides` | Formulario del motor de guías (motor pendiente) |

## Estructura

```
src/
  api/          cliente HTTP, hook useApi y datos de referencia (líderes, mapas, rangos)
  components/   Layout (menú + barra), NeonTabs, tarjetas, anillos, avatares
  i18n/         textos ES/EN (messages.js) y selector de idioma
  pages/        una carpeta por sección
  index.css     sistema visual: tokens, tarjetas de vidrio, tablas, pestañas
```

Textos nuevos: agrégalos en `src/i18n/messages.js` en los dos idiomas.
Los nombres de líderes no se traducen aquí: los entrega el backend (`/leaders?lang=`).
