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

## Pendiente — relevo de la sesion del 30-10-2026

> Tareas que quedaron a medias y necesitan el PC. **Borra esta seccion cuando
> esten hechas.** La cuenta buena es `bskmaker` (id 55361115); `baseek` no es
> nuestra, solo recibe la autoria por un `user.email` mal puesto.

1. **Identidad de git.** Los commits del PC se atribuyen a `baseek`. Arreglar:
   ```
   git config --global user.name  "bskmaker"
   git config --global user.email "55361115+bskmaker@users.noreply.github.com"
   gh auth status      # debe decir bskmaker
   ```
   No usar el email real: quedaria en claro para siempre en los repos publicos.

2. **Sacar el escaner de portadas de `tracklist-sesiones`.** Su rama
   `claude/album-cover-title-reader-z678uq` es otra aplicacion distinta (paquete
   `portadas/`, 7 buscadores, 2 lectores, GUI). No comparte ni un fichero con
   `main`; se bifurcaron en `7137562`. Crear `bskmaker/escaner-portadas` privado
   y empujar esa rama ahi como `main`.

3. **Sacar el script de Notion de este repo.** La rama
   `claude/notion-whatsapp-transcribe-hy8eym` tiene `tools/retranscribir-inbox.mjs`,
   que es del pipeline WhatsApp -> n8n -> Supadata -> Notion del servidor Oracle,
   no de la PWA. Es el unico codigo que existe de ese montaje. Crear
   `bskmaker/servidor-n8n` privado y extraerlo con
   `git subtree split --prefix=tools` para no arrastrar el historial de Zana.

4. **Borrar la rama muerta** `claude/zana-assistant-less-restrictive-klk7db`:
   su commit `0e5d1c6` ya esta dentro de `main`, comprobado.

5. **Limpiar las ramas de origen** de los puntos 2 y 3, pero **solo despues** de
   verificar que el contenido nuevo llego completo. Son la unica copia hasta
   entonces.

6. **Subir lo que sigue fuera de GitHub:**
   - El **contador de compases**: no esta en ningun repo ni artifact. Buscarlo en
     el PC.
   - **TR-8S Direct Loader**: vive solo como artifact de Claude.
   - Los demas proyectos locales sin identificar.

   Revisar secretos antes de subir nada (`.env`, claves de Gemini). Una clave
   subida se queda en el historial aunque se borre despues.
