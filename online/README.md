# Servidor online de Chronosvisor

Repetidor (relay) para jugar por Internet. Corre en Cloudflare Workers con Durable Objects (cabe en el plan gratuito).
No simula nada: reenvía los mensajes entre el anfitrión y los invitados con el mismo protocolo que la red local.

## Publicarlo (una vez)
```
cd online
npm install
npx wrangler login      # abre el navegador: autoriza con tu cuenta de Cloudflare
npx wrangler deploy     # muestra la dirección: https://chronosvisor-online.<tu-subdominio>.workers.dev
```
Después pon esa dirección (con `wss://`) en `online.json`, en la raíz del repositorio, y súbelo a GitHub:
```json
{"server":"wss://chronosvisor-online.<tu-subdominio>.workers.dev"}
```
El juego lee `online.json` desde GitHub cada vez que se abre el multijugador, así que no hace falta publicar otra versión.

## Probarlo en local
`npx wrangler dev --port 8787` y en la consola del juego: `ImperiaNet.server='ws://127.0.0.1:8787';ImperiaNet.cfgOK=true`.

## Rutas
- `GET /rooms` → salas públicas abiertas
- `WS /host?name=…&pub=1` → crea sala y devuelve `{type:'hosted',code}`
- `WS /join/CODIGO?name=…` → se une a la sala
