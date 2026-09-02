/* =========================================================
   ZANA · Componentes de interfaz (helpers + chat IA)
   ========================================================= */
window.ZUI = (() => {
  const S = window.ZSTORE;
  const M = window.ZMASCOT;

  // --- Helpers DOM ---------------------------------------------------------
  const $ = sel => document.querySelector(sel);
  function h(html){ const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; }
  // Escapa tambien la comilla simple: sin ella, un atributo escrito con
  // comillas simples (data-x='${esc(v)}') seria una via de inyeccion.
  const esc = s => String(s??"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  // --- Toast ---------------------------------------------------------------
  function toast(msg, icon="🥕"){
    const box = $("#toasts");
    if (window.ZI18N) msg = ZI18N.translate(msg);
    const t = h(`<div class="toast"><span>${icon}</span><span>${esc(msg)}</span></div>`);
    box.appendChild(t);
    setTimeout(()=>{ t.style.opacity="0"; t.style.transform="translateY(10px)"; t.style.transition="all .3s"; }, 2200);
    setTimeout(()=> t.remove(), 2600);
  }

  // --- Barra de progreso diario -------------------------------------------
  function renderDailyBar(){
    const bar = $("#dailyBar");
    const plan = S.activePlan();
    if (!plan){ bar.classList.add("hidden"); return; }
    bar.classList.remove("hidden");
    const t = plan.targets;
    const c = S.consumedMacros(plan, S.todayKey());
    const pct = (a,b)=> Math.min(100, Math.round((a/(b||1))*100));
    const seg = (label, val, tgt, color, unit="g") => `
      <div class="macro-mini">
        <div class="lbl"><span>${label}</span><b>${Math.round(val)}/${tgt}${unit}</b></div>
        <div class="bar"><span style="width:${pct(val,tgt)}%;background:${color}"></span></div>
      </div>`;
    bar.innerHTML =
      seg("Kcal", c.kcal, t.kcal, "linear-gradient(90deg,#FF7A1A,#F26419)","") +
      seg("Prot", c.p, t.protein, "#2FBF71") +
      seg("Carb", c.c, t.carbs, "#FFC24B") +
      `<div class="macro-mini" id="waterSeg" style="cursor:pointer">
        <div class="lbl"><span>Agua +250</span><b>${Math.round(c.water)}/${t.water}ml</b></div>
        <div class="bar"><span style="width:${pct(c.water,t.water)}%;background:#4A97F2"></span></div>
      </div>`;
    const ws = bar.querySelector("#waterSeg");
    if (ws) ws.onclick = () => {
      S.addWater(S.todayKey(), 250);
      renderDailyBar();
      toast("¡+250 ml de agua! 💧","💧");
    };
  }

  // --- Navbar --------------------------------------------------------------
  const NAV = [
    { id:"home", ico:"🏠", label:"Inicio" },
    { id:"recipes", ico:"👩‍🍳", label:"Recetas" },
    { id:"calendar", ico:"📅", label:"Calendario" },
    { id:"super", ico:"🛒", label:"Súper" },
    { id:"exercise", ico:"🤸", label:"Ejercicio" },
    { id:"settings", ico:"⚙️", label:"Ajustes" },
  ];
  function renderNavbar(active){
    const nav = $("#navbar");
    const plan = S.activePlan();
    if (!plan){ nav.classList.add("hidden"); return; }
    nav.classList.remove("hidden");
    nav.innerHTML = NAV.map(n =>
      `<button data-nav="${n.id}" class="${active===n.id?"on":""}"><span class="ni">${n.ico}</span>${n.label}</button>`
    ).join("");
    nav.querySelectorAll("[data-nav]").forEach(b=>{
      b.onclick = () => window.ZAPP.go(b.dataset.nav);
    });
  }

  // --- FAB mascota (burbuja azul arrastrable) ------------------------------
  let fabPos = null;
  function renderFab(){
    const fab = $("#mascotFab");
    const plan = S.activePlan();
    fab.classList.toggle("hidden", !plan);
    fab.innerHTML = M.svg("happy");
    // Por defecto arranca en la esquina superior derecha (no se restaura posición previa).
    fab.style.left=""; fab.style.top=""; fab.style.right=""; fab.style.bottom="";
    makeDraggable(fab);
  }
  function makeDraggable(fab){
    let sx, sy, ox, oy, moved=false, dragging=false;
    const down = e => {
      dragging=true; moved=false;
      const p = e.touches? e.touches[0] : e;
      const r = fab.getBoundingClientRect();
      ox = r.left; oy = r.top; sx = p.clientX; sy = p.clientY;
      fab.style.transition="none";
    };
    const move = e => {
      if(!dragging) return;
      const p = e.touches? e.touches[0] : e;
      const dx = p.clientX - sx, dy = p.clientY - sy;
      if(Math.abs(dx)>4||Math.abs(dy)>4) moved=true;
      let x = Math.max(6, Math.min(window.innerWidth-68, ox+dx));
      let y = Math.max(6, Math.min(window.innerHeight-68, oy+dy));
      fab.style.left=x+"px"; fab.style.top=y+"px"; fab.style.right="auto"; fab.style.bottom="auto";
      if(e.cancelable) e.preventDefault();
    };
    const up = () => {
      if(!dragging) return; dragging=false; fab.style.transition="";
      if(moved){ const r=fab.getBoundingClientRect(); localStorage.setItem("zana.fab", JSON.stringify({x:r.left,y:r.top})); }
    };
    fab.ontouchstart=down; fab.ontouchmove=move; fab.ontouchend=up;
    fab.onmousedown=down; window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
    fab.onclick = e => { if(!moved) openChat(); };
  }

  // --- Tema / idioma -------------------------------------------------------
  function applyTheme(){
    const st = S.get().settings;
    const t = ["dark","orange"].includes(st.theme) ? st.theme : "light";
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.setAttribute("lang", st.lang||"es");
  }

  // --- Chat con la zanahoria ----------------------------------------------
  let chatHistory = [];
  function openChat(prefill, intro){
    if (intro){ chatHistory = []; }
    const sheet = $("#mascotSheet");
    sheet.classList.remove("hidden");
    sheet.innerHTML = `
      <div class="sheet-panel" style="height:82vh">
        <div class="sheet-grab"></div>
        <div class="sheet-head">
          <div class="m">${M.svg("happy")}</div>
          <div class="grow"><div style="font-weight:900;font-size:17px">Zana</div><div class="h-sub">tu coach nutricional 🥕</div></div>
          <button class="back" data-close style="width:38px;height:38px">✕</button>
        </div>
        <div class="chat-scroll" id="chatScroll"></div>
        <div class="chat-suggest" id="chatSuggest"></div>
        <div class="chat-input">
          <input id="chatInput" placeholder="Escríbele a Zana..." autocomplete="off"/>
          <button data-send>➤</button>
        </div>
      </div>`;
    sheet.querySelector("[data-close]").onclick = closeChat;
    sheet.onclick = e => { if (e.target===sheet) closeChat(); };

    const st = S.get().settings;
    const needKey = st.aiProvider!=="local" && !st.aiKey;
    const scroll = sheet.querySelector("#chatScroll");
    const T = s => window.ZI18N ? ZI18N.translate(s) : s;
    if (intro && !chatHistory.length){
      pushMsg("bot", T(intro));
    } else if (!chatHistory.length){
      if (needKey)
        pushMsg("bot", T("¡Hola! 🥕 Soy Zana. Ya te puedo ayudar aquí mismo. Para que converse con más soltura, añade tu **clave de IA gratuita** con el botón 🔑 de abajo. No la escribas en el chat: guárdala en Ajustes, que es donde está a salvo."));
      else
        pushMsg("bot", T("¡Hola! 🥕 Soy Zana. Pregúntame lo que quieras sobre tu dieta, recetas, la compra o el ejercicio."));
    } else {
      chatHistory.forEach(m => renderMsg(m.who, m.text));
    }

    const sugg = sheet.querySelector("#chatSuggest");
    if (needKey){
      const b = h(`<button style="background:var(--leaf-tint);color:var(--leaf-deep)">🔑 Añadir mi clave IA</button>`);
      b.onclick = ()=>{ closeChat(); window.ZAPP.go("settings"); };
      sugg.appendChild(b);
    }
    ["¿Cuántas calorías como?","¿Qué toca comer hoy?","¿Cuánta proteína?","Consejo para hoy"].forEach(s=>{
      const b = h(`<button>${esc(s)}</button>`); b.onclick = ()=> send(s); sugg.appendChild(b);
    });

    const input = sheet.querySelector("#chatInput");
    sheet.querySelector("[data-send]").onclick = ()=> send(input.value);
    input.onkeydown = e => { if (e.key==="Enter") send(input.value); };
    window.ZI18N && ZI18N.apply(sheet);
    setTimeout(()=> scroll.scrollTop = scroll.scrollHeight, 50);
    if (prefill) send(prefill);
  }
  function closeChat(){ $("#mascotSheet").classList.add("hidden"); $("#mascotSheet").innerHTML=""; }

  function renderMsg(who, text){
    const scroll = document.querySelector("#chatScroll"); if(!scroll) return null;
    const m = h(`<div class="msg ${who}"></div>`);
    m.innerHTML = mdLite(text);
    scroll.appendChild(m);
    scroll.scrollTop = scroll.scrollHeight;
    return m;
  }
  function pushMsg(who, text){ chatHistory.push({who,text}); renderMsg(who,text); }

  // Si el usuario pega una clave en el chat, se borra del historial y de la
  // pantalla: el historial se envia al proveedor de IA en cada mensaje, asi que
  // una clave ahi acabaria dentro del prompt (y de los logs del proveedor).
  function redactFromChat(secreto){
    if (!secreto || secreto.length < 12) return;
    const MARCA = "🔑 ••••••";
    chatHistory.forEach(m => {
      if (m.text && m.text.includes(secreto)) m.text = m.text.split(secreto).join(MARCA);
    });
    const scroll = document.querySelector("#chatScroll");
    if (!scroll) return;
    scroll.querySelectorAll(".msg").forEach(el => {
      if (el.textContent && el.textContent.includes(secreto))
        el.innerHTML = mdLite(el.textContent.split(secreto).join(MARCA));
    });
  }

  async function send(text){
    text = (text||"").trim(); if(!text) return;
    const input = document.querySelector("#chatInput"); if(input) input.value="";
    pushMsg("me", text);
    const scroll = document.querySelector("#chatScroll");
    const typing = h(`<div class="msg bot"><span class="typing"><i></i><i></i><i></i></span></div>`);
    if (scroll){ scroll.appendChild(typing); scroll.scrollTop = scroll.scrollHeight; }
    const ans = await M.reply(text, chatHistory);
    typing.remove();
    pushMsg("bot", ans);
  }

  // Mini-markdown: **negrita**, saltos de línea, _cursiva_
  function mdLite(t){
    return esc(t)
      .replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")
      .replace(/_(.+?)_/g,"<i>$1</i>")
      .replace(/\n/g,"<br>");
  }

  // --- Sheet genérico ------------------------------------------------------
  function openSheet(innerHTML, onMount){
    const sheet = $("#mascotSheet");
    sheet.classList.remove("hidden");
    sheet.innerHTML = `<div class="sheet-panel"><div class="sheet-grab"></div><div class="sheet-body">${innerHTML}</div></div>`;
    sheet.onclick = e => { if (e.target===sheet) closeSheet(); };
    window.ZI18N && ZI18N.apply(sheet);
    if (onMount) onMount(sheet);
  }
  function closeSheet(){ const s=$("#mascotSheet"); s.classList.add("hidden"); s.innerHTML=""; s.onclick=null; }

  function refreshChrome(active){ applyTheme(); renderDailyBar(); renderNavbar(active); renderFab(); window.ZI18N && ZI18N.apply($("#navbar")); window.ZI18N && ZI18N.apply($("#dailyBar")); }

  return { $, h, esc, toast, renderDailyBar, renderNavbar, renderFab, refreshChrome, applyTheme,
           openChat, closeChat, openSheet, closeSheet, mdLite, redactFromChat };
})();
