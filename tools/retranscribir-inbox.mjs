#!/usr/bin/env node
/**
 * Re-transcribe las entradas fallidas o sin procesar de la base de Notion
 * "Inbox WhatsApp", replicando el formato que escribe el flujo de n8n.
 *
 * Pensado para ejecutarse en el servidor Oracle (donde hay red y vive n8n).
 * Sin dependencias: requiere Node 18+ por el fetch nativo.
 *
 * Por defecto va en SIMULACRO: enumera lo que haria y no toca nada.
 * Para escribir en Notion hay que pasar --aplicar de forma explicita.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const FICHERO_ESTADO = join(AQUI, ".retranscribir-estado.json");

// Base "Inbox WhatsApp". Se puede sobrescribir con NOTION_DATABASE_ID.
const BASE_POR_DEFECTO = "27b3c87e-38d5-4424-8482-8888d785d5a6";

const NOTION = "https://api.notion.com/v1";
const VERSION_NOTION = "2022-06-28";
const SUPADATA = "https://api.supadata.ai/v1";
const ANTHROPIC = "https://api.anthropic.com/v1/messages";
const MODELO = process.env.MODELO_RESUMEN || "claude-sonnet-5";

// Notion parte cada fragmento de texto enriquecido en trozos de 2000 caracteres.
const TOPE_TROZO = 1900;

// ---------------------------------------------------------------- argumentos

function leerArgumentos(argv) {
  const o = {
    aplicar: false,
    limite: 25,
    tipos: [],
    soloFallidas: false,
    sinResumen: false,
    reemplazarContenido: false,
    idioma: "es",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--aplicar") o.aplicar = true;
    else if (a === "--limite") o.limite = Number(argv[++i]);
    else if (a === "--tipo") o.tipos.push(argv[++i]);
    else if (a === "--solo-fallidas") o.soloFallidas = true;
    else if (a === "--sin-resumen") o.sinResumen = true;
    else if (a === "--reemplazar-contenido") o.reemplazarContenido = true;
    else if (a === "--idioma") o.idioma = argv[++i];
    else if (a === "--ayuda" || a === "-h") { ayuda(); process.exit(0); }
    else { console.error(`Opcion desconocida: ${a}`); ayuda(); process.exit(1); }
  }
  if (!Number.isInteger(o.limite) || o.limite < 1) {
    console.error("--limite tiene que ser un entero positivo");
    process.exit(1);
  }
  return o;
}

function ayuda() {
  console.log(`
Uso: node tools/retranscribir-inbox.mjs [opciones]

  --aplicar                Escribe en Notion. Sin esto solo simula.
  --limite N               Maximo de entradas a procesar (por defecto 25).
                           Es el freno de gasto de creditos de Supadata.
  --tipo T                 Filtra por Tipo ("Instagram Reel", "YouTube"...). Repetible.
  --solo-fallidas          Solo las que fallaron con error; deja las nunca procesadas.
  --sin-resumen            No llama a Anthropic; guarda solo la transcripcion.
  --reemplazar-contenido   Borra los bloques viejos de la pagina antes de escribir.
                           Por defecto los bloques nuevos se AÑADEN al final.
  --idioma es              Idioma preferido de la transcripcion (por defecto es).

Variables de entorno:
  NOTION_TOKEN         (obligatoria) token de integracion interna de Notion
  SUPADATA_API_KEY     (obligatoria) clave de Supadata
  ANTHROPIC_API_KEY    (obligatoria salvo con --sin-resumen)
  NOTION_DATABASE_ID   (opcional) por defecto la base Inbox WhatsApp
  MODELO_RESUMEN       (opcional) por defecto claude-sonnet-5
`);
}

// ------------------------------------------------------------------ utilidades

const dormir = ms => new Promise(r => setTimeout(r, ms));

function trocear(texto, tope = TOPE_TROZO) {
  const trozos = [];
  for (let i = 0; i < texto.length; i += tope) trozos.push(texto.slice(i, i + tope));
  return trozos.length ? trozos : [""];
}

// Notion rechaza un rich_text con mas de 2000 caracteres por fragmento, y como
// mucho admite 100 fragmentos por propiedad. Si la transcripcion se pasa, la
// recortamos aqui y dejamos aviso: el texto integro queda igualmente en los
// bloques del cuerpo de la pagina, que no tienen ese tope.
const TOPE_FRAGMENTOS = 100;

function aRichText(texto) {
  let trozos = trocear(texto);
  if (trozos.length > TOPE_FRAGMENTOS) {
    trozos = trozos.slice(0, TOPE_FRAGMENTOS - 1);
    trozos.push("\n\n[...] Transcripcion recortada; el texto completo esta en la pagina.");
  }
  return trozos.map(t => ({ type: "text", text: { content: t } }));
}

const parrafo = texto => ({
  object: "block",
  type: "paragraph",
  paragraph: { rich_text: aRichText(texto) },
});

function textoPlano(prop) {
  if (!prop) return "";
  const arr = prop.title || prop.rich_text;
  return Array.isArray(arr) ? arr.map(t => t.plain_text || "").join("") : "";
}

class ErrorCreditos extends Error {}

async function pedir(url, opciones, intentos = 4) {
  for (let n = 1; ; n++) {
    let res;
    try {
      res = await fetch(url, opciones);
    } catch (e) {
      if (n >= intentos) throw e;
      await dormir(1000 * 2 ** n);
      continue;
    }
    // 429/5xx: reintento con espera creciente.
    if ((res.status === 429 || res.status >= 500) && n < intentos) {
      const espera = Number(res.headers.get("retry-after")) * 1000 || 1000 * 2 ** n;
      await dormir(espera);
      continue;
    }
    return res;
  }
}

// -------------------------------------------------------------------- Notion

function cabecerasNotion() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": VERSION_NOTION,
    "Content-Type": "application/json",
  };
}

async function leerTodaLaBase(baseId) {
  const paginas = [];
  let cursor;
  do {
    const res = await pedir(`${NOTION}/databases/${baseId}/query`, {
      method: "POST",
      headers: cabecerasNotion(),
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!res.ok) throw new Error(`Notion query ${res.status}: ${await res.text()}`);
    const datos = await res.json();
    paginas.push(...datos.results);
    cursor = datos.has_more ? datos.next_cursor : null;
    await dormir(350); // Notion limita a ~3 peticiones/segundo
  } while (cursor);
  return paginas;
}

async function actualizarPropiedades(pageId, propiedades) {
  const res = await pedir(`${NOTION}/pages/${pageId}`, {
    method: "PATCH",
    headers: cabecerasNotion(),
    body: JSON.stringify({ properties: propiedades }),
  });
  if (!res.ok) throw new Error(`Notion patch ${res.status}: ${await res.text()}`);
}

async function borrarBloques(pageId) {
  const res = await pedir(`${NOTION}/blocks/${pageId}/children?page_size=100`, {
    headers: cabecerasNotion(),
  });
  if (!res.ok) throw new Error(`Notion children ${res.status}: ${await res.text()}`);
  const { results } = await res.json();
  for (const bloque of results) {
    await pedir(`${NOTION}/blocks/${bloque.id}`, { method: "DELETE", headers: cabecerasNotion() });
    await dormir(350);
  }
}

async function anadirBloques(pageId, bloques) {
  // Notion acepta como mucho 100 bloques hijos por peticion.
  for (let i = 0; i < bloques.length; i += 100) {
    const res = await pedir(`${NOTION}/blocks/${pageId}/children`, {
      method: "PATCH",
      headers: cabecerasNotion(),
      body: JSON.stringify({ children: bloques.slice(i, i + 100) }),
    });
    if (!res.ok) throw new Error(`Notion append ${res.status}: ${await res.text()}`);
    if (i + 100 < bloques.length) await dormir(350);
  }
}

// ------------------------------------------------------------------ Supadata

/**
 * Devuelve { estado, texto, idioma }. estado es "completed" o "failed".
 * Lanza ErrorCreditos si Supadata dice que se acabaron: ahi paramos del todo,
 * porque seguir solo gasta llamadas que van a fallar igual.
 */
async function transcribir(url, idioma) {
  const consulta = new URLSearchParams({ url, text: "true", lang: idioma });
  const res = await pedir(`${SUPADATA}/transcript?${consulta}`, {
    headers: { "x-api-key": process.env.SUPADATA_API_KEY },
  });

  if (res.status === 402 || res.status === 403) throw new ErrorCreditos(await res.text());

  if (!res.ok) {
    const cuerpo = await res.text();
    if (/limit|credit|quota/i.test(cuerpo)) throw new ErrorCreditos(cuerpo);
    return { estado: "failed", texto: "", error: `HTTP ${res.status}: ${cuerpo.slice(0, 300)}` };
  }

  const datos = await res.json();

  // Sincrono: la transcripcion viene en la misma respuesta.
  if (res.status === 200 && typeof datos.content === "string") {
    return { estado: "completed", texto: datos.content, idioma: datos.lang };
  }

  // Asincrono: 202 con jobId; hay que sondear hasta completed o failed.
  if (datos.jobId) return await sondearTrabajo(datos.jobId);

  return { estado: "failed", texto: "", error: "Respuesta de Supadata no reconocida" };
}

async function sondearTrabajo(jobId, maxSegundos = 300) {
  for (let s = 0; s < maxSegundos; s++) {
    await dormir(1000); // la documentacion recomienda sondear cada segundo
    const res = await pedir(`${SUPADATA}/transcript/${jobId}`, {
      headers: { "x-api-key": process.env.SUPADATA_API_KEY },
    });
    if (res.status === 404) return { estado: "failed", texto: "", error: "Trabajo caducado (404)" };
    if (!res.ok) continue;
    const d = await res.json();
    if (d.status === "completed") {
      const texto = typeof d.content === "string" ? d.content : (d.result?.content ?? "");
      return { estado: "completed", texto, idioma: d.lang || d.result?.lang };
    }
    if (d.status === "failed") {
      return { estado: "failed", texto: "", error: JSON.stringify(d.error ?? d).slice(0, 300) };
    }
  }
  return { estado: "failed", texto: "", error: "Tiempo de sondeo agotado" };
}

// ----------------------------------------------------------------- Anthropic

const PROMPT = `Eres un asistente que resume contenido para una base de conocimiento personal en castellano.

Te doy la transcripcion de un video. Devuelve EXACTAMENTE este formato, sin nada mas:

TITULO: <titulo descriptivo de como mucho 70 caracteres>
RESUMEN:
<una o dos frases describiendo el contenido>
- Ideas clave: <ideas principales>
- Herramientas/personas mencionadas: <listado, o "Ninguna">
- Posibles acciones: <que puede hacer el lector con esto>`;

async function resumir(transcripcion) {
  const res = await pedir(ANTHROPIC, {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 1024,
      system: PROMPT,
      messages: [{ role: "user", content: `Transcripcion:\n\n${transcripcion.slice(0, 60000)}` }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const datos = await res.json();
  const salida = (datos.content || []).map(b => b.text || "").join("").trim();

  const m = salida.match(/^TITULO:\s*(.+?)\s*\nRESUMEN:\s*\n?([\s\S]*)$/);
  if (!m) return { titulo: "", resumen: salida };
  return { titulo: m[1].trim().slice(0, 200), resumen: m[2].trim() };
}

// ----------------------------------------------------------- clasificacion

const esUrl = t => /^https?:\/\//i.test(t.trim());
const FALLO = /\(failed\)|transcripci[oó]n fall|no ha sido posible|no es posible generar|cr[eé]ditos/i;

/**
 * Decide si una entrada hay que reprocesarla, y por que.
 * Nunca marca las que ya tienen una transcripcion buena: esas no se tocan.
 */
function clasificar(pagina) {
  const p = pagina.properties || {};
  const titulo = textoPlano(p["Título"]);
  const notas = textoPlano(p["Notas"]);
  const url = p["URL"]?.url || "";

  if (!url) return null;                                  // sin enlace no hay nada que transcribir
  if (FALLO.test(notas)) return "fallida";                // el flujo dejo constancia del error
  if (!notas.trim()) return esUrl(titulo) ? "sin-procesar" : "sin-notas";
  if (esUrl(titulo)) return "sin-titulo";                 // tiene notas pero nunca se le puso titulo
  return null;                                            // correcta: no se toca
}

// Supadata transcribe video. Estos tipos no son video y los dejamos fuera.
const TIPOS_NO_VIDEO = new Set(["Transfer", "Nota", "Web"]);

// ---------------------------------------------------------------- principal

async function principal() {
  const op = leerArgumentos(process.argv.slice(2));

  const faltan = ["NOTION_TOKEN", "SUPADATA_API_KEY"].filter(v => !process.env[v]);
  if (!op.sinResumen && !process.env.ANTHROPIC_API_KEY) faltan.push("ANTHROPIC_API_KEY");
  if (faltan.length) {
    console.error(`Faltan variables de entorno: ${faltan.join(", ")}`);
    process.exit(1);
  }

  const baseId = process.env.NOTION_DATABASE_ID || BASE_POR_DEFECTO;
  const hechas = existsSync(FICHERO_ESTADO)
    ? new Set(JSON.parse(readFileSync(FICHERO_ESTADO, "utf8")).hechas || [])
    : new Set();

  console.log(`Leyendo la base ${baseId}...`);
  const paginas = await leerTodaLaBase(baseId);
  console.log(`  ${paginas.length} entradas en total.`);

  let candidatas = [];
  const recuento = {};
  for (const pag of paginas) {
    const motivo = clasificar(pag);
    if (!motivo) continue;
    recuento[motivo] = (recuento[motivo] || 0) + 1;
    const tipo = pag.properties?.Tipo?.select?.name || "";
    if (op.soloFallidas && motivo !== "fallida") continue;
    if (op.tipos.length && !op.tipos.includes(tipo)) continue;
    if (TIPOS_NO_VIDEO.has(tipo)) continue;
    if (hechas.has(pag.id)) continue;
    candidatas.push({ pagina: pag, motivo, tipo });
  }

  console.log("Reparto por motivo (antes de filtros):");
  for (const [k, v] of Object.entries(recuento)) console.log(`  ${k.padEnd(14)} ${v}`);
  console.log(`Candidatas tras filtros: ${candidatas.length}`);

  candidatas = candidatas.slice(0, op.limite);
  console.log(`A procesar en esta pasada: ${candidatas.length}${op.aplicar ? "" : "  (SIMULACRO)"}\n`);

  let ok = 0, fallos = 0;

  for (const [i, c] of candidatas.entries()) {
    const url = c.pagina.properties["URL"].url;
    const etiqueta = `[${i + 1}/${candidatas.length}] ${c.motivo} · ${c.tipo || "sin tipo"}`;

    if (!op.aplicar) {
      console.log(`${etiqueta}\n    ${url}`);
      continue;
    }

    try {
      const t = await transcribir(url, op.idioma);
      if (t.estado !== "completed" || !t.texto.trim()) {
        console.log(`${etiqueta}\n    FALLO: ${t.error || "sin texto"}\n    ${url}`);
        fallos++;
        continue;
      }

      let titulo = "";
      let resumen = "";
      if (!op.sinResumen) {
        const r = await resumir(t.texto);
        titulo = r.titulo;
        resumen = r.resumen;
      }

      const notas = resumen
        ? `${resumen}\n\nTranscripcion (completed):\n${t.texto}`
        : `Transcripcion (completed):\n${t.texto}`;

      const propiedades = {
        Notas: { rich_text: aRichText(notas) },
        "Notas 1": { rich_text: aRichText(notas) },
      };
      // Solo ponemos titulo nuevo si el que hay es la URL pelada.
      const tituloActual = textoPlano(c.pagina.properties["Título"]);
      if (titulo && esUrl(tituloActual)) {
        propiedades["Título"] = { title: [{ type: "text", text: { content: titulo } }] };
      }

      await actualizarPropiedades(c.pagina.id, propiedades);

      if (op.reemplazarContenido) await borrarBloques(c.pagina.id);
      await anadirBloques(c.pagina.id, [
        parrafo(`URL: ${url}\nTipo: ${c.tipo}\nProveedor: supadata\nEstado transcripcion: completed`),
        ...(resumen ? [parrafo(`RESUMEN:\n${resumen}`)] : []),
        ...trocear(t.texto, 1800).map((trozo, n) =>
          parrafo(n === 0 ? `TRANSCRIPCION COMPLETA:\n${trozo}` : trozo)),
      ]);

      hechas.add(c.pagina.id);
      writeFileSync(FICHERO_ESTADO, JSON.stringify({ hechas: [...hechas] }, null, 2));
      ok++;
      console.log(`${etiqueta}\n    OK: ${titulo || tituloActual.slice(0, 60)}`);
      await dormir(400);
    } catch (e) {
      if (e instanceof ErrorCreditos) {
        console.error(`\nSupadata sin creditos. Paro aqui para no gastar mas llamadas.`);
        console.error(`  ${String(e.message).slice(0, 300)}`);
        break;
      }
      console.error(`${etiqueta}\n    ERROR: ${e.message}`);
      fallos++;
    }
  }

  console.log(`\nResumen: ${ok} correctas, ${fallos} con fallo.`);
  if (op.aplicar) console.log(`Progreso guardado en ${FICHERO_ESTADO}`);
  else console.log("Simulacro: no se ha tocado nada. Añade --aplicar para escribir.");
}

principal().catch(e => { console.error(e); process.exit(1); });
