# tools

Utilidades que **no** forman parte de la PWA. No se cachean en el service
worker ni se sirven al navegador: son scripts de mantenimiento que se ejecutan
a mano desde un servidor con red.

## retranscribir-inbox.mjs

Re-transcribe las entradas fallidas o sin procesar de la base de Notion
**📥 Inbox WhatsApp**, replicando el formato que escribe el flujo de n8n
(`Proveedor: supadata`, `Estado transcripcion: completed`, `RESUMEN:` y
`TRANSCRIPCION COMPLETA:`).

Requiere Node 18 o superior. No tiene dependencias.

### Por que existe

El flujo de n8n dejo de transcribir cuando se agotaron los creditos de
Supadata. Las entradas afectadas se quedaron con la URL como titulo y, en el
mejor de los casos, una nota explicando el fallo. Este script las localiza y
las vuelve a procesar por lotes, sin tocar las que si salieron bien.

### Estado de la base (auditoria del 03-09-2026)

| Situacion | Entradas |
|---|---|
| Fallidas: titulo = URL + nota de error | 52 |
| Fallidas: titulo correcto + nota de error | 38 |
| Nunca procesadas: titulo = URL, sin notas | 414 |
| Titulo correcto pero notas vacias | 72 |
| **Total recuperable** | **576** |
| Correctas con resumen | 520 |

De las 466 con titulo-URL: 314 Instagram Reel, 51 Web, 46 Instagram,
33 Instagram Post, 17 Transfer, 5 YouTube. Los tipos `Web`, `Nota` y
`Transfer` se saltan siempre: no son video y Supadata no los transcribe.

### Uso

```bash
export NOTION_TOKEN=secret_...        # integracion interna de Notion
export SUPADATA_API_KEY=...
export ANTHROPIC_API_KEY=sk-ant-...   # para generar titulo y resumen

# 1. Ver que haria, sin tocar nada (comportamiento por defecto)
node tools/retranscribir-inbox.mjs

# 2. Una pasada corta de verdad, para comprobar el resultado en Notion
node tools/retranscribir-inbox.mjs --aplicar --limite 5

# 3. Ya en serio, por lotes segun los creditos que tengas
node tools/retranscribir-inbox.mjs --aplicar --limite 100
```

### Opciones

| Opcion | Que hace |
|---|---|
| `--aplicar` | Escribe en Notion. **Sin esto solo simula.** |
| `--limite N` | Maximo de entradas por pasada (25 por defecto). Es el freno de gasto. |
| `--tipo T` | Filtra por Tipo (`"Instagram Reel"`, `"YouTube"`...). Se puede repetir. |
| `--solo-fallidas` | Solo las que dejaron nota de error; ignora las nunca procesadas. |
| `--sin-resumen` | No llama a Anthropic; guarda solo la transcripcion. |
| `--reemplazar-contenido` | Borra los bloques viejos de la pagina antes de escribir. |
| `--idioma es` | Idioma preferido de la transcripcion. |

### Que toca y que no

- **Nunca** modifica una entrada que ya tiene transcripcion buena.
- **Nunca** borra nada salvo que pases `--reemplazar-contenido`; por defecto
  los bloques nuevos se **añaden** al final de la pagina.
- El titulo solo se sobrescribe si el actual es la URL pelada.
- No toca la propiedad `Estado`.

### Reanudacion y creditos

Cada entrada completada se apunta en `tools/.retranscribir-estado.json`
(ignorado por git), asi que se puede parar y retomar sin repetir trabajo ni
gastar creditos dos veces. Si Supadata responde que no quedan creditos, el
script para en seco en vez de seguir quemando llamadas que van a fallar.

### Referencias

- API de transcripcion: <https://docs.supadata.ai/get-transcript>
- Notion API `2022-06-28`: <https://developers.notion.com/reference/post-database-query>
