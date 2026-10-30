# Zana — app de nutricion con IA

PWA de nutricion (HTML/CSS/JS sin framework, con service worker y manifest).

## Idioma

Codigo, comentarios, commits y respuestas en **castellano**.

## Estructura

- `index.html` — entrada de la PWA.
- `js/`, `css/`, `assets/` — codigo y recursos.
- `sw.js` + `manifest.webmanifest` — service worker e instalacion como app.
- `zana-standalone.html` / `zana-artifact.html` — versiones de un solo fichero.

## Ojo con el service worker

Al tocar `sw.js` o cachear rutas nuevas, sube la version de la cache o el
navegador seguira sirviendo lo viejo.

## Trabajando desde la nube (claude.ai/code)

Es HTML/JS plano, asi que se puede editar entero desde el movil sin problema.
Para verlo funcionando hace falta servirlo (un `python -m http.server` basta);
la instalacion como PWA solo se prueba bien en el movil o en el PC.

## Pendiente (fuera de este proyecto)

Hay tareas de reordenacion de repos y cuentas que necesitan el PC. Estan en
Notion: "Pendiente · Reordenar GitHub (30-10-2026)"
<https://app.notion.com/p/409ba48cbccd81c8a871cee2316bd43d>
Borra esta nota cuando esten hechas.
