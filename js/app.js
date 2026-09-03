/* =========================================================
   ZANA · App (router + pantallas)
   ========================================================= */
window.ZAPP = (() => {
  const S = window.ZSTORE, E = window.ZENGINE, D = window.ZDATA, U = window.ZUI, M = window.ZMASCOT;
  const app = document.getElementById("app");
  const esc = U.esc;
  const APP_VER = "v27";  // súbelo en cada despliegue (junto con index.html/sw.js)

  let route = { name:"home", params:{} };
  let prevRoute = { name:"home", params:{} };
  const navMap = { home:"home", recipes:"recipes", calendar:"calendar", super:"super", exercise:"exercise", settings:"settings" };

  function go(name, params={}) {
    if (route.name !== name) prevRoute = route;
    route = { name, params };
    render();
    window.scrollTo(0,0);
  }
  function goBackFrom(){ // vuelve a la pantalla anterior real
    const p = prevRoute && prevRoute.name && prevRoute.name!=="recipe" ? prevRoute : { name:"home", params:{} };
    go(p.name, p.params);
  }

  function render() {
    const s = S.get();
    if (!s.onboarded || !S.activePlan()) { screenOnboarding(); U.refreshChrome(null); return; }
    const map = {
      home: screenHome, plan: screenPlanHub, calendar: screenCalendar,
      recipes: screenRecipes, recipe: screenRecipeDetail, super: screenSuper,
      gastos: screenGastos, exercise: screenExercise, gym: screenExercise,
      settings: screenSettings, prep: screenRecipes, diets: screenSpecialDiets,
      spending: screenSpending,
    };
    (map[route.name] || screenHome)();
    U.refreshChrome(navMap[route.name] || (route.name==="plan"?"home":null));
  }

  function paint(html){
    app.innerHTML = `<div class="screen-in">${html}</div>`;
    window.ZI18N && ZI18N.apply(app);
    // Fotos: si una imagen no carga (artefacto/sin conexión), se oculta y se ve el emoji+color de fondo.
    app.querySelectorAll("img.zphoto").forEach(im=>{ im.onerror=()=>{ im.style.display="none"; }; });
  }

  // --- Fotos generadas por IA (sin copyright, sin atribución) --------------
  function hashStr(s){ let h=0; for(let i=0;i<(s||"").length;i++){ h=(h*31 + s.charCodeAt(i))|0; } return Math.abs(h)%100000; }
  function photoUrl(prompt, seed, w=600, h=400){
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&nologo=true&seed=${seed||1}&model=turbo`;
  }
  function recipePhoto(name, id, w, h){
    return photoUrl(`appetizing professional food photograph of ${name}, healthy home cooking, plated, top view, natural daylight, high detail`, hashStr(id||name), w, h);
  }
  function foodPhoto(fid, w=200, h=200){
    const f = D.FOODS[fid]; if(!f) return "";
    return photoUrl(`clean product photograph of ${f.name}, fresh food ingredient, on white background, studio lighting`, hashStr(fid), w, h);
  }
  // Usa la foto incrustada (base64, fiable y offline); si no, la genera por IA.
  function recipeSrc(name, id){ return (window.ZPHOTOS && window.ZPHOTOS[id]) ? window.ZPHOTOS[id] : recipePhoto(name, id); }
  function heroImg(name, id){ return `<img class="zphoto hero-photo" alt="" src="${recipeSrc(name, id)}">`; }
  function thumbImg(name, id){ return `<img class="zphoto thumb-photo" alt="" src="${recipeSrc(name, id)}">`; }
  function header(title, sub, back){
    return `<div class="h-top">
      ${back ? `<button class="back" data-back>‹</button>` : ""}
      <div class="grow"><div class="h-title">${esc(title)}</div>${sub?`<div class="h-sub">${esc(sub)}</div>`:""}</div>
    </div>`;
  }
  function wireBack(fn){ const b=app.querySelector("[data-back]"); if(b) b.onclick = fn || (()=>go("home")); }

  /* =======================================================================
     ONBOARDING
     ======================================================================= */
  let ob = null;
  const OB_STEPS = [obStepWelcome, obStepBody, obStepActivity, obStepGoal, obStepFood, obStepSchedule, obStepReview];
  function screenOnboarding(step){
    if (!ob) ob = {
      name:"", sex:"hombre", age:28, weight:75, height:175, bodyType:"meso",
      activity:"moderado", goal:"", diet:"todo", dislikes:[], dislikesText:"", mealsPref:null,
      appetite:"normal", schedule:"", cookTime:"medio", specialDiet:"ninguna", planName:"", step:0,
    };
    if (typeof step === "number") ob.step = Math.max(0, Math.min(OB_STEPS.length-1, step));
    if (typeof ob.step !== "number") ob.step = 0;
    OB_STEPS[ob.step]();
    mountLeafBtn();
  }
  // Botón hoja verde (dietas especiales) en la esquina del onboarding
  function mountLeafBtn(){
    if (ob.step===0) return;
    const b = U.h(`<button class="leaf-btn" title="Dietas especiales">🍃</button>`);
    b.onclick = ()=> screenSpecialDiets(true);
    app.appendChild(b);
  }

  function obWrap(inner, opts={}){
    const dots = Array.from({length:OB_STEPS.length},(_,i)=>`<i class="${i<=ob.step?"on":""}"></i>`).join("");
    paint(`
      <div style="padding-top:8px">
        <div class="steps-dots">${dots}</div>
        ${inner}
        <div class="mt-lg flex" style="gap:10px">
          ${opts.back!==false && ob.step>0 ? `<button class="btn ghost" style="flex:.5" data-obback>Atrás</button>`:""}
          <button class="btn primary" data-obnext>${opts.nextLabel||"Continuar"}</button>
        </div>
      </div>`);
    app.querySelector("[data-obnext]").onclick = opts.onNext || (()=>screenOnboarding(ob.step+1));
    const bk = app.querySelector("[data-obback]"); if(bk) bk.onclick = ()=>screenOnboarding(ob.step-1);
  }

  function obStepWelcome(){
    obWrap(`
      <div class="center" style="margin-top:10px">
        <div style="width:130px;height:130px;margin:0 auto">${M.svg("happy")}</div>
        <div class="h-title" style="font-size:28px;margin-top:8px">¡Hola! Soy Zana 🥕</div>
        <p class="muted" style="font-weight:700;line-height:1.5;max-width:320px;margin:10px auto 0">
          Voy a hacerte unas preguntas rápidas para calcular tus calorías y crear tu <b>plan de comidas personalizado</b>. ¡Vamos!</p>
      </div>
      <div class="field mt-lg"><label>¿Cómo te llamas?</label>
        <input class="input" id="obName" placeholder="Tu nombre" value="${esc(ob.name)}"/></div>
    `, { nextLabel:"Empezar 🚀", onNext:()=>{ ob.name = app.querySelector("#obName").value.trim(); screenOnboarding(1); } });
  }

  function obStepBody(){
    obWrap(`
      ${header("Sobre ti","Tus datos básicos")}
      <div class="field"><label>Sexo biológico <span class="muted" style="font-weight:600">(para el cálculo metabólico)</span></label>
        <div class="chips" id="obSex">
          ${["hombre","mujer"].map(x=>`<button class="chip ${ob.sex===x?"on":""}" data-sex="${x}">${x==="hombre"?"👨 Hombre":"👩 Mujer"}</button>`).join("")}
        </div></div>
      <div class="row2">
        <div class="field"><label>Edad</label>${stepper("age", ob.age, 14, 90, 1, "años")}</div>
        <div class="field"><label>Altura</label>${stepper("height", ob.height, 130, 220, 1, "cm")}</div>
      </div>
      <div class="field"><label>Peso actual</label>${stepper("weight", ob.weight, 35, 200, 1, "kg")}</div>
      <div class="field"><label>Tipo de cuerpo <span class="muted" style="font-weight:600">(ajusta tus calorías)</span></label>
        <div class="chips" id="obBody">
          ${[["ecto","🏃 Delgado (ectomorfo)"],["meso","💪 Atlético (mesomorfo)"],["endo","🧸 Tiende a engordar (endomorfo)"]].map(([k,v])=>`<button class="chip ${ob.bodyType===k?"on":""}" data-body="${k}">${v}</button>`).join("")}
        </div>
        <div class="hint">Si eres delgado y te cuesta ganar peso (hardgainer), elige ectomorfo: te subiré más las calorías.</div></div>
    `);
    app.querySelectorAll("#obSex .chip").forEach(b=> b.onclick=()=>{ ob.sex=b.dataset.sex; screenOnboarding(1); });
    app.querySelectorAll("#obBody .chip").forEach(b=> b.onclick=()=>{ ob.bodyType=b.dataset.body; screenOnboarding(1); });
    wireSteppers();
  }

  function obStepActivity(){
    obWrap(`
      ${header("Tu actividad","¿Cuánto te mueves?")}
      <div style="display:flex;flex-direction:column;gap:10px">
        ${Object.keys(E.ACTIVITY).map(k=>`
          <button class="plan-card ${ob.activity===k?"active-ring":""}" data-act="${k}">
            <div class="plan-emoji ic-leaf">${["🛋️","🚶","🏃","🔥","⚡"][Object.keys(E.ACTIVITY).indexOf(k)]}</div>
            <div class="plan-info"><div class="plan-name" style="font-size:15px">${esc(E.ACTIVITY_LABELS[k])}</div></div>
            ${ob.activity===k?'<div class="plan-chev">✓</div>':''}
          </button>`).join("")}
      </div>
    `);
    app.querySelectorAll("[data-act]").forEach(b=> b.onclick=()=>{ ob.activity=b.dataset.act; screenOnboarding(2); });
  }

  function obStepGoal(){
    obWrap(`
      ${header("Tu objetivo","¿Qué quieres conseguir?")}
      <div style="display:flex;flex-direction:column;gap:10px">
        ${Object.entries(D.GOAL_LABELS).map(([k,g])=>`
          <button class="plan-card ${ob.goal===k?"active-ring":""}" data-goal="${k}">
            <div class="plan-emoji ${g.color}">${g.emoji}</div>
            <div class="plan-info"><div class="plan-name">${esc(g.label)}</div><div class="plan-tag">${esc(g.plan)}</div></div>
            ${ob.goal===k?'<div class="plan-chev">✓</div>':''}
          </button>`).join("")}
      </div>
    `, { onNext:()=>{ if(!ob.goal){ U.toast("Elige un objetivo 🎯"); return; } screenOnboarding(4); } });
    app.querySelectorAll("[data-goal]").forEach(b=> b.onclick=()=>{ ob.goal=b.dataset.goal; screenOnboarding(3); });
  }

  function obStepFood(){
    const dietOpts = { todo:"🍽️ De todo", vegetariano:"🥗 Vegetariano", pescetariano:"🐟 Pescetariano", vegano:"🌱 Vegano" };
    const dislikeOpts = ["pollo","pescado","huevo","legumbres","lacteos"];
    const dislikeMap = { pescado:["salmon","atun","merluza","gambas"], legumbres:["lenteja","garbanzo"], lacteos:["yogur","leche","quesofresco"] };
    const sug = E.suggestedMeals(ob);
    const meals = ob.mealsPref || sug;
    const appetites = { poco:"🍽️ Poco (me lleno rápido)", normal:"😌 Normal", mucho:"🍔 Mucho (aguanto bien)" };
    obWrap(`
      ${header("Tus gustos","Para ajustar las recetas")}
      <div class="field"><label>Tipo de dieta</label>
        <div class="chips" id="obDiet">${Object.entries(dietOpts).map(([k,v])=>`<button class="chip ${ob.diet===k?"on":""}" data-diet="${k}">${v}</button>`).join("")}</div>
        <div class="hint">¿Alergias o dietas especiales (vegana, FODMAP, sin gluten...)? Toca la 🍃 arriba a la derecha.</div></div>

      <div class="field"><label>¿Algo que no quieras comer?</label>
        <div class="chips" id="obDislike">${dislikeOpts.map(k=>{
          const ids = dislikeMap[k]||[k];
          const on = ids.every(i=>ob.dislikes.includes(i));
          return `<button class="chip ${on?"on":""}" data-dislike="${k}">${k==="lacteos"?"🥛 Lácteos":k==="huevo"?"🥚 Huevo":k==="pollo"?"🍗 Pollo":k==="pescado"?"🐟 Pescado":"🫘 Legumbres"}</button>`;
        }).join("")}</div>
        <input class="input" id="obDislikeText" style="margin-top:10px" placeholder="Escríbelo: p. ej. no me gusta el brócoli, ni las gambas..." value="${esc(ob.dislikesText||"")}"/>
        <div class="hint">La zanahoria leerá esto y lo tendrá en cuenta.</div></div>

      <div class="field"><label>¿Cómo es tu apetito?</label>
        <div class="chips" id="obApp">${Object.entries(appetites).map(([k,v])=>`<button class="chip ${ob.appetite===k?"on":""}" data-app="${k}">${v}</button>`).join("")}</div></div>

      <div class="field"><label>¿Cuántas comidas al día?</label>
        <div class="stepper" id="obMealStep"><button data-mdec>−</button>
          <div class="val"><span id="obMealVal">${meals}</span> <small class="muted" style="font-size:14px">comidas</small></div>
          <button data-minc>+</button></div>
        <div class="hint">💡 Zana te sugiere <b>${sug}</b> según tu objetivo y apetito. Ajústalo con las flechas.</div></div>
    `);
    app.querySelectorAll("#obDiet .chip").forEach(b=> b.onclick=()=>{ ob.diet=b.dataset.diet; saveFoodText(); screenOnboarding(4); });
    app.querySelectorAll("#obApp .chip").forEach(b=> b.onclick=()=>{ ob.appetite=b.dataset.app; ob.mealsPref=null; saveFoodText(); screenOnboarding(4); });
    app.querySelectorAll("#obDislike .chip").forEach(b=> b.onclick=()=>{
      const ids = dislikeMap[b.dataset.dislike]||[b.dataset.dislike];
      const on = ids.every(i=>ob.dislikes.includes(i));
      if(on) ob.dislikes = ob.dislikes.filter(i=>!ids.includes(i));
      else ob.dislikes = [...new Set([...ob.dislikes,...ids])];
      saveFoodText(); screenOnboarding(4);
    });
    const setMeal = d => { const cur = ob.mealsPref || sug; ob.mealsPref = Math.max(2, Math.min(6, cur+d)); app.querySelector("#obMealVal").textContent = ob.mealsPref; };
    app.querySelector("[data-mdec]").onclick=()=>setMeal(-1);
    app.querySelector("[data-minc]").onclick=()=>setMeal(1);
    function saveFoodText(){ const el=app.querySelector("#obDislikeText"); if(el) ob.dislikesText=el.value; }
  }

  function obStepSchedule(){
    const cookOpts = { poco:"⚡ Poco (≤15 min)", medio:"⏱️ Medio (15-30 min)", mucho:"👨‍🍳 Me gusta cocinar" };
    obWrap(`
      ${header("Tu día a día","Para encajar las comidas")}
      <div class="field"><label>¿Cuánto tiempo tienes para cocinar?</label>
        <div class="chips" id="obCook">${Object.entries(cookOpts).map(([k,v])=>`<button class="chip ${ob.cookTime===k?"on":""}" data-cook="${k}">${v}</button>`).join("")}</div></div>
      <div class="field"><label>Cuéntame tus horarios</label>
        <textarea class="input" id="obSchedule" placeholder="Ej: me levanto a las 7, entreno a las 18h, ceno tarde sobre las 22h. Trabajo fuera y como en el trabajo...">${esc(ob.schedule||"")}</textarea>
        <div class="hint">Con esto Zana ajusta las horas de tus comidas y qué recetas te propone.</div></div>
      <div class="field"><label>¿A qué horas sueles poder cocinar?</label>
        <textarea class="input" id="obCookSched" placeholder="Ej: puedo cocinar sobre las 13:30 y por la noche a las 21h. Los domingos por la mañana para preparar la semana.">${esc(ob.cookSchedule||"")}</textarea>
        <div class="hint">Te avisaré 5 min antes de esas horas para que adelantes faena. 🍳</div></div>
      <div class="pill-note">🥕 Con todo lo que me has contado calcularé <b>ahora</b> tus calorías y macros exactas en el siguiente paso.</div>
    `, { nextLabel:"Calcular mi plan 🧮", onNext:()=>{
      ob.schedule = app.querySelector("#obSchedule").value;
      ob.cookSchedule = app.querySelector("#obCookSched").value;
      screenOnboarding(6);
    }});
    app.querySelectorAll("#obCook .chip").forEach(b=> b.onclick=()=>{ ob.cookTime=b.dataset.cook; ob.schedule=app.querySelector("#obSchedule").value; ob.cookSchedule=app.querySelector("#obCookSched").value; screenOnboarding(5); });
  }

  function obStepReview(){
    const t = E.targets(ob);
    const gl = D.GOAL_LABELS[ob.goal];
    if(!ob.planName) ob.planName = gl.plan;
    obWrap(`
      ${header("Tu plan está listo","Revisa y ponle nombre")}
      <div class="card pad-lg" style="background:linear-gradient(135deg,#FFF3E7,#FFE7D3);border:none">
        <div class="flex"><div class="plan-emoji ${gl.color}" style="width:52px;height:52px">${gl.emoji}</div>
          <div><div class="eyebrow">Objetivo</div><div style="font-weight:900;font-size:18px">${esc(gl.label)}</div></div></div>
        <div class="divider"></div>
        <div class="tile-grid" style="gap:10px">
          ${macroTile("Calorías", t.kcal, "kcal/día","🔥")}
          ${macroTile("Proteína", t.protein, "g","💪")}
          ${macroTile("Carbos", t.carbs, "g","🍚")}
          ${macroTile("Grasas", t.fat, "g","🥑")}
        </div>
        <div class="pill-note mt">💧 Hidratación objetivo: <b>${(t.water/1000).toFixed(1)} L al día</b> · 🍽️ ${E.mealsPerDay(ob)} comidas/día</div>
      </div>
      <div class="field mt-lg"><label>Nombre de tu plan</label>
        <input class="input" id="obPlanName" value="${esc(ob.planName)}"/>
        <div class="hint">Ej: "Dieta hipercalórica", "Operación verano"...</div></div>
      <div class="pill-note mt">${ZL(
        "🥕 Esta es una app inteligente: explícame en cualquier momento qué quieres pulsando la zanahoria, y la app se adaptará a ti.",
        "🥕 Aquesta és una app intel·ligent: explica'm en qualsevol moment què vols prement la pastanaga, i l'app s'adaptarà a tu.",
        "🥕 This is a smart app: tell me what you want anytime by tapping the carrot, and the app will adapt to you."
      )}</div>
    `, { nextLabel:"Crear mi plan 🥕", onNext:()=>{
      ob.planName = app.querySelector("#obPlanName").value.trim() || gl.plan;
      // fusiona el texto libre de "no quiero comer" con los alimentos detectados
      if (ob.dislikesText){ const det = S.detectFoods(ob.dislikesText); ob.dislikes = [...new Set([...(ob.dislikes||[]), ...det])]; }
      // aplica exclusiones de dieta especial
      if (ob.specialDiet && ob.specialDiet!=="ninguna"){
        const sd = window.ZKB.specialDietById(ob.specialDiet);
        ob.dislikes = [...new Set([...(ob.dislikes||[]), ...(sd.excludeFoods||[])])];
      }
      const plan = S.createPlanFromProfile(ob, ob.planName);
      ob = null;
      U.toast("¡Plan creado! Bienvenido 🥕");
      go("plan", { id:plan.id });
    }});
  }

  function macroTile(k,v,u,emo){
    return `<div class="tile" style="min-height:auto;padding:14px">
      <div class="flex" style="gap:8px"><span style="font-size:20px">${emo}</span><span class="tile-meta">${esc(k)}</span></div>
      <div><span style="font-size:24px;font-weight:900">${v}</span> <span class="tile-meta">${esc(u)}</span></div></div>`;
  }
  function stepper(key, val, min, max, step, unit){
    return `<div class="stepper" data-stepper="${key}" data-min="${min}" data-max="${max}" data-step="${step}">
      <button data-dec>−</button><div class="val"><span data-val>${val}</span> <small class="muted" style="font-size:14px">${unit}</small></div><button data-inc>+</button></div>`;
  }
  function wireSteppers(){
    app.querySelectorAll("[data-stepper]").forEach(st=>{
      const key=st.dataset.stepper, min=+st.dataset.min, max=+st.dataset.max, step=+st.dataset.step;
      const valEl=st.querySelector("[data-val]");
      const upd=d=>{ ob[key]=Math.max(min,Math.min(max,ob[key]+d)); valEl.textContent=ob[key]; };
      st.querySelector("[data-dec]").onclick=()=>upd(-step);
      st.querySelector("[data-inc]").onclick=()=>upd(step);
    });
  }

  /* =======================================================================
     DIETAS ESPECIALES
     ======================================================================= */
  function screenSpecialDiets(fromOnboarding){
    const cur = fromOnboarding ? (ob?.specialDiet||"ninguna") : (S.activePlan()?.profile?.specialDiet||"ninguna");
    paint(`
      ${header("Dietas especiales","Alergias y patrones concretos", true)}
      <div class="pill-note">Elige una si tienes una alergia, intolerancia o sigues una dieta específica. Zana adaptará todas tus recetas y la compra.</div>
      <div class="mt">
        ${window.ZKB.SPECIAL_DIETS.map(d=>`
          <button class="plan-card ${cur===d.id?"active-ring":""}" data-diet="${d.id}">
            <div class="plan-emoji ic-leaf" style="font-size:26px">${d.emoji}</div>
            <div class="plan-info"><div class="plan-name" style="font-size:15px">${esc(d.name)}</div>
              <div class="plan-tag">${esc(d.desc)}</div></div>
            ${cur===d.id?'<div class="plan-chev">✓</div>':''}
          </button>`).join("")}
        <button class="plan-card" data-custom style="border:2px dashed var(--carrot)">
          <div class="plan-emoji ic-carrot" style="font-size:26px">✏️</div>
          <div class="plan-info"><div class="plan-name" style="font-size:15px">Personaliza la tuya</div>
            <div class="plan-tag">Descríbele a Zana cómo quieres tu dieta</div></div>
          <div class="plan-chev">›</div>
        </button>
      </div>
      <div style="height:20px"></div>
    `);
    wireBack(()=> fromOnboarding ? screenOnboarding(ob.step) : go("settings"));
    app.querySelector("[data-custom]").onclick=()=>{
      window.__zanaCustomDiet = true;
      U.openChat(null, "Cuéntame cómo tiene que ser tu dieta 📝. Descríbela tanto como quieras (alimentos, estilo, restricciones, lo que comes, lo que evitas...) y te diré los pros y contras según tu perfil, y la aplicaré a tus menús.");
    };
    app.querySelectorAll("[data-diet]").forEach(b=> b.onclick=()=>{
      const id=b.dataset.diet;
      const sd=window.ZKB.specialDietById(id);
      if (fromOnboarding){
        ob.specialDiet=id;
        // mapea a la dieta base para el motor
        if(id==="vegana") ob.diet="vegano"; else if(id==="vegetariana") ob.diet="vegetariano";
        else if(id==="pescetariana") ob.diet="pescetariano";
        U.toast(`Dieta: ${sd.name} ✅`);
        screenOnboarding(ob.step);
      } else {
        const p=S.activePlan();
        p.profile.specialDiet=id;
        if(id==="vegana") p.profile.diet="vegano"; else if(id==="vegetariana") p.profile.diet="vegetariano";
        else if(id==="pescetariana") p.profile.diet="pescetariano";
        p.profile.dislikes=[...new Set([...(p.profile.dislikes||[]), ...(sd.excludeFoods||[])])];
        S.regeneratePlan(p.id);
        U.toast(`Dieta aplicada: ${sd.name} 🥕`);
        go("settings");
      }
    });
  }

  /* =======================================================================
     HOME · lista de planes
     ======================================================================= */
  function screenHome(){
    const s = S.get();
    const plan = S.activePlan();
    const name = plan?.profile?.name;
    const today = S.dayMeals(plan, S.todayKey());
    const dp = S.dayProgress(S.todayKey());
    const next = today.find((m,i)=>!dp.done["m"+i]) || today[0];
    const hour = new Date().getHours();
    const greet = hour<12?"Buenos días":hour<21?"Buenas tardes":"Buenas noches";

    paint(`
      <div class="between" style="padding-top:6px">
        <div><div class="eyebrow">${greet}${name?"":""}</div><div class="h-title">${esc(name||"¡Hola!")} 👋</div></div>
        <div style="width:50px;height:50px">${M.svg("happy")}</div>
      </div>

      ${next ? `
      <button class="now-hero mt ${isDue(next)?"due":""}" data-open-now style="width:100%;text-align:left;border:none;background:none;padding:0">
        <div class="now-img" style="background:${next.grad}">
          ${heroImg(next.name, next.recipeId)}
          <div class="now-badge">${isDue(next)?"🟢 ¡Toca ya!":"⏰ Ahora toca"} · ${next.time}</div>
          <div class="hero-emoji" style="position:absolute;right:14px;bottom:-6px;font-size:80px">${next.emoji}</div>
        </div>
        <div class="now-body" style="background:var(--surface)">
          <div class="eyebrow">${esc(next.slot)}</div>
          <div class="now-title">${esc(next.name)}</div>
          <div class="now-meta"><span>🔥 ${next.macros.kcal} kcal</span><span>💪 ${next.macros.p}g</span><span>🍚 ${next.macros.c}g</span></div>
        </div>
      </button>` : ""}

      <h2 class="section">Hoy</h2>
      ${todaySummary(plan, S.todayKey(), dp)}

      <h2 class="section">Tus planes</h2>
      <div id="plansList">
        ${s.plans.map(p=>planCard(p)).join("")}
      </div>
      <button class="btn ghost mt" data-newplan>➕ Crear nuevo plan</button>
      <div style="height:16px"></div>
    `);
    app.querySelector("[data-open-now]")?.addEventListener("click",()=> next && go("recipe",{id:next.recipeId, from:"home"}));
    app.querySelector("[data-newplan]").onclick = ()=>{ ob=null; S.set({onboarded:false}); render(); };
    app.querySelectorAll("[data-plan]").forEach(b=> b.onclick=()=>{ S.setActivePlan(b.dataset.plan); go("plan",{id:b.dataset.plan}); });
    app.querySelectorAll("[data-sum]").forEach(b=> b.onclick=()=>{
      const [route,arg]=b.dataset.sum.split(":");
      if(route==="recipe") go("recipe",{id:arg,from:"home"}); else go(route);
    });
    // Primer inicio sin clave: proponer activar la IA (una sola vez)
    const stg = S.get().settings;
    if (!stg.aiKey && !stg.keyPromptSeen){ stg.keyPromptSeen = true; S.save(); setTimeout(()=>promptForKey(), 700); }
  }

  // Resumen de lo pendiente HOY: comidas, ejercicios y preparación/congelados
  function todaySummary(plan, dateKey, dp){
    const meals = S.dayMeals(plan, dateKey);
    const pendingMeals = meals.map((m,i)=>({m,i})).filter(x=>!dp.done["m"+x.i]);
    const exDay = S.dayExercises(plan, dateKey);
    const exDp = S.exProgress(dateKey);
    const pendingEx = exDay.items.map((e,i)=>({e,i})).filter(x=>!exDp.ex[x.i]);
    const alerts = S.defrostAlerts();

    if(!pendingMeals.length && !pendingEx.length && !alerts.length)
      return `<div class="card center" style="padding:26px"><div style="font-size:40px">🎉</div><div style="font-weight:900;margin-top:6px">¡Todo hecho por hoy!</div><div class="tile-meta">Gran trabajo. Descansa e hidrátate 💧</div></div>`;

    let html = "";
    // Comidas
    if(pendingMeals.length){
      html += `<div class="sum-group"><div class="sum-h">🍽️ Comidas <span>${pendingMeals.length}</span></div>`;
      html += pendingMeals.map(({m})=>`
        <button class="sum-item" data-sum="recipe:${m.recipeId}">
          <div class="sum-ic" style="background:${m.grad}">${m.emoji}</div>
          <div class="grow"><div class="sum-t">${esc(m.name)}</div>
            <div class="sum-m">${m.time} · 🔥 ${m.macros.kcal} kcal · 💪 ${m.macros.p}g</div></div>
          <div class="plan-chev">›</div></button>`).join("");
      html += `</div>`;
    }
    // Preparación / congelados
    if(alerts.length){
      html += `<div class="sum-group"><div class="sum-h">🧊 Preparar / congelar <span>${alerts.length}</span></div>`;
      html += alerts.map(a=>`
        <button class="sum-item" data-sum="recipes">
          <div class="sum-ic" style="background:var(--leaf-tint);color:var(--leaf-deep)">${a.emoji}</div>
          <div class="grow"><div class="sum-t">Descongelar ${esc(a.name)}</div>
            <div class="sum-m">${esc(takeOutText(a))}</div></div>
          <div class="plan-chev">›</div></button>`).join("");
      html += `</div>`;
    }
    // Ejercicios
    if(pendingEx.length){
      html += `<div class="sum-group"><div class="sum-h">🤸 Ejercicios <span>${pendingEx.length}</span></div>`;
      html += `<button class="sum-item" data-sum="exercise">
          <div class="sum-ic" style="background:var(--surface-2);color:var(--grape)">💪</div>
          <div class="grow"><div class="sum-t">${esc(exDay.name)}</div>
            <div class="sum-m">${pendingEx.length} ejercicios pendientes</div></div>
          <div class="plan-chev">›</div></button>`;
      html += `</div>`;
    }
    return html;
  }

  // ¿Es (casi) la hora de esta comida? 15 min antes hasta 60 min después
  function isDue(meal){
    if(!meal||!meal.time) return false;
    const [h,mm]=meal.time.split(":").map(Number);
    const now=new Date(); const nowMin=now.getHours()*60+now.getMinutes();
    const t=h*60+mm;
    return nowMin>=t-15 && nowMin<=t+60;
  }

  // Horas de cocina disponibles (parseadas del texto) -> ¿es buen momento?
  function cookHours(){
    const plan = S.activePlan();
    const txt = (plan?.profile?.cookSchedule || plan?.profile?.schedule || "");
    const hours = [];
    const re = /(\d{1,2})(?::|h|\.)?(\d{2})?/g; let m;
    while((m=re.exec(txt))){ const h=+m[1], mm=m[2]?+m[2]:0; if(h>=0&&h<=23&&mm<60) hours.push(h*60+mm); }
    return hours;
  }
  function isCookTime(){
    const now = new Date().getHours()*60 + new Date().getMinutes();
    return cookHours().some(t => now>=t-5 && now<=t+30);
  }
  // Texto amigable de "cuándo sacar del congelador"
  function takeOutText(a){
    const now=new Date(); const to=new Date(a.takeOutAt);
    const hh=String(to.getHours()).padStart(2,"0")+":"+String(to.getMinutes()).padStart(2,"0");
    const sameDay = to.toDateString()===now.toDateString();
    const cuando = (to<=now) ? ZL("¡sácalo ya!","treu-ho ja!","take it out now!")
      : sameDay ? ZL(`hoy a las ${hh}`,`avui a les ${hh}`,`today at ${hh}`)
      : ZL(`mañana a las ${hh}`,`demà a les ${hh}`,`tomorrow at ${hh}`);
    return ZL(`Sácalo ${cuando} · para ${a.meal}`,`Treu-ho ${cuando} · per ${a.meal}`,`Take out ${cuando} · for ${a.meal}`);
  }

  function planCard(p){
    const active = p.id===S.get().activePlanId;
    return `<button class="plan-card ${active?"active-ring":""}" data-plan="${p.id}">
      <div class="plan-emoji ${p.color}" style="color:#fff">${p.emoji}</div>
      <div class="plan-info">
        <div class="plan-name">${esc(p.name)}</div>
        <div class="plan-tag">${esc(D.GOAL_LABELS[p.goal].label)}</div>
        <div class="plan-kcal">🔥 ${p.targets.kcal} kcal/día · 💪 ${p.targets.protein}g prot</div>
      </div>
      <div class="plan-chev">›</div>
    </button>`;
  }
  function hubTile(route,ico,name,cls){
    return `<button class="tile" data-hub="${route}">
      <div class="tile-ico ${cls}">${ico}</div>
      <div><div class="tile-name">${esc(name)}</div></div>
    </button>`;
  }

  /* =======================================================================
     PLAN HUB · el "espacio" del plan con sus botones
     ======================================================================= */
  function screenPlanHub(){
    const plan = S.planById(route.params.id) || S.activePlan();
    if(!plan) return go("home");
    S.setActivePlan(plan.id);
    const t = plan.targets;
    paint(`
      ${header(plan.name, D.GOAL_LABELS[plan.goal].label, true)}
      <div class="card pad-lg" style="background:linear-gradient(135deg,${gradFor(plan.color)});color:#fff;border:none">
        <div class="between">
          <div><div style="opacity:.85;font-weight:800;font-size:13px">Objetivo diario</div>
            <div style="font-size:34px;font-weight:900">${t.kcal} <span style="font-size:16px">kcal</span></div></div>
          <div style="width:64px;height:64px;background:rgba(255,255,255,.2);border-radius:20px;display:grid;place-items:center;font-size:34px">${plan.emoji}</div>
        </div>
        <div class="flex" style="gap:16px;margin-top:10px;font-weight:800;font-size:13px;opacity:.95">
          <span>💪 ${t.protein}g</span><span>🍚 ${t.carbs}g</span><span>🥑 ${t.fat}g</span><span>💧 ${(t.water/1000).toFixed(1)}L</span>
        </div>
      </div>

      <div class="tile-grid mt">
        ${bigTile("calendar","📅","Calendario","Horas y platos de cada día","ic-carrot")}
        ${bigTile("recipes","👩‍🍳","Recetas","¿Qué toca ahora?","ic-leaf")}
        ${bigTile("super","🛒","Súper","Tu lista de la compra","ic-sun")}
        ${bigTile("gastos","💶","Gastos","Cuentas y previsión","ic-berry")}
        ${bigTile("exercise","🤸","Ejercicio","Rutina de hoy en casa","ic-grape")}
        ${bigTile("__ai","🥕","Pregunta a Zana","Tu coach IA","ic-carrot")}
      </div>
    `);
    wireBack(()=>go("home"));
    app.querySelectorAll("[data-tile]").forEach(b=> b.onclick=()=>{
      if (b.dataset.tile==="__ai") return U.openChat();
      go(b.dataset.tile);
    });
  }
  function bigTile(route,ico,name,meta,cls){
    return `<button class="tile" data-tile="${route}">
      <div class="tile-ico ${cls}">${ico}</div>
      <div><div class="tile-name">${esc(name)}</div><div class="tile-meta">${esc(meta)}</div></div>
    </button>`;
  }
  function gradFor(color){
    const map={ "bg-carrot":"#FF9E4A,#F26419","bg-berry":"#FF7A8A,#F2445E","bg-sun":"#FFD06B,#F2A03A","bg-grape":"#9A82FF,#6B4EF2","bg-leaf":"#4FD08A,#1B998B" };
    return map[color]||map["bg-carrot"];
  }

  /* =======================================================================
     CALENDARIO
     ======================================================================= */
  let calState = { mode:"semanal", cursor:new Date(), selected:S.todayKey() };
  function screenCalendar(){
    const plan = S.activePlan();
    paint(`
      ${header("Calendario", plan.name, true)}
      <div class="cal-switch">
        <button class="${calState.mode==="semanal"?"on":""}" data-mode="semanal">Semanal</button>
        <button class="${calState.mode==="mensual"?"on":""}" data-mode="mensual">Mensual</button>
      </div>
      <div id="calBody"></div>
    `);
    wireBack(()=>go("plan",{id:plan.id}));
    app.querySelectorAll("[data-mode]").forEach(b=> b.onclick=()=>{ calState.mode=b.dataset.mode; screenCalendar(); });
    renderCalBody();
  }
  function renderCalBody(){
    const body = app.querySelector("#calBody");
    if (calState.mode==="mensual") body.innerHTML = calMonth();
    else body.innerHTML = calWeek();
    body.querySelectorAll("[data-day]").forEach(c=> c.onclick=()=>{ calState.selected=c.dataset.day; renderCalBody(); });
    body.querySelectorAll("[data-navcal]").forEach(b=> b.onclick=()=>{ shiftCursor(+b.dataset.navcal); renderCalBody(); });
    renderDayAgenda(body);
    U.renderDailyBar();
  }
  function shiftCursor(dir){
    const d = new Date(calState.cursor);
    if (calState.mode==="mensual") d.setMonth(d.getMonth()+dir);
    else d.setDate(d.getDate()+dir*7);
    calState.cursor = d;
  }
  function calWeek(){
    const base = new Date(calState.cursor);
    const dow = (base.getDay()+6)%7; // lunes=0
    const monday = new Date(base); monday.setDate(base.getDate()-dow);
    const days=[]; for(let i=0;i<7;i++){ const d=new Date(monday); d.setDate(monday.getDate()+i); days.push(d); }
    const label = `${monday.getDate()} <span>${MES[monday.getMonth()]}</span> – ${days[6].getDate()} <span>${MES[days[6].getMonth()]}</span>`;
    return `
      <div class="cal-nav"><button data-navcal="-1">‹</button><b>${label}</b><button data-navcal="1">›</button></div>
      <div class="cal-grid">
        ${DOW.map(d=>`<div class="dow">${d}</div>`).join("")}
        ${days.map(d=>calCell(d,true)).join("")}
      </div>
      <div id="agenda" class="mt"></div>`;
  }
  function calMonth(){
    const base=new Date(calState.cursor); const y=base.getFullYear(), m=base.getMonth();
    const first=new Date(y,m,1); const start=(first.getDay()+6)%7;
    const days=[]; for(let i=0;i<42;i++){ const d=new Date(y,m,1-start+i); days.push(d); }
    return `
      <div class="cal-nav"><button data-navcal="-1">‹</button><b><span>${MES[m]}</span> ${y}</b><button data-navcal="1">›</button></div>
      <div class="cal-grid">
        ${DOW.map(d=>`<div class="dow">${d}</div>`).join("")}
        ${days.map(d=>calCell(d, d.getMonth()===m)).join("")}
      </div>
      <div id="agenda" class="mt"></div>`;
  }
  function calCell(d, inMonth){
    const key=S.todayKey(d);
    const today = key===S.todayKey();
    const sel = key===calState.selected;
    const dp = S.get().progress[key];
    const done = dp && Object.values(dp.done||{}).some(Boolean);
    return `<div class="cal-cell ${inMonth?"":"out"} ${today?"today":""} ${sel?"sel":""} ${done?"hasdone":""}" data-day="${key}">
      ${d.getDate()}${done?'<span class="dot"></span>':''}</div>`;
  }
  function renderDayAgenda(body){
    const agenda = body.querySelector("#agenda"); if(!agenda) return;
    const plan = S.activePlan();
    const meals = S.dayMeals(plan, calState.selected);
    const dp = S.dayProgress(calState.selected);
    const d = new Date(calState.selected);
    const human = `<span>${DOW_LONG[(d.getDay()+6)%7]}</span> ${d.getDate()} de <span>${MES[d.getMonth()]}</span>`;
    agenda.innerHTML = `
      <h2 class="section" style="text-transform:capitalize">${human}</h2>
      ${meals.map((m,i)=>mealRow(m,i,dp)).join("")}
    `;
    agenda.querySelectorAll("[data-check]").forEach(b=> b.onclick=()=>{
      const i=+b.dataset.check; const done=S.toggleMealDone(calState.selected, "m"+i, meals[i]);
      U.toast(done?"¡Comida hecha! 🍽️ Despensa actualizada":"Comida desmarcada", done?"✅":"↩️");
      renderCalBody();
    });
    agenda.querySelectorAll("[data-recipe]").forEach(b=> b.onclick=()=> go("recipe",{id:b.dataset.recipe, from:"calendar"}));
  }
  function mealRow(m,i,dp){
    const done = dp.done["m"+i];
    const [hh,mm]=m.time.split(":");
    return `<div class="meal-row ${done?"done":""}">
      <div class="meal-time"><b>${hh}</b><span>${mm}</span></div>
      <button class="meal-main" data-recipe="${m.recipeId}" style="text-align:left;background:none">
        <div class="meal-slot">${esc(m.slot)}</div>
        <div class="meal-dish">${m.emoji} ${esc(m.name)}</div>
        <div class="meal-kcal">🔥 ${m.macros.kcal} kcal · 💪 ${m.macros.p}g · 🍚 ${m.macros.c}g</div>
      </button>
      <button class="check ${done?"done":""}" data-check="${i}">✓</button>
    </div>`;
  }

  /* =======================================================================
     RECETAS · ¿Qué toca ahora?
     ======================================================================= */
  function screenRecipes(){
    const plan = S.activePlan();
    const meals = S.dayMeals(plan, S.todayKey());
    const dp = S.dayProgress(S.todayKey());
    const now = pickNow(meals, dp);
    const rest = meals.filter((m,i)=> i!==now.idx);

    const alerts = S.defrostAlerts();
    // alimentos congelables (proteínas/pan clave) + preparados
    const freezableFoods = ["pollo","pavo","ternera","salmon","merluza","pan"].filter(f=>D.FOODS[f]);

    const cookNow = isCookTime();
    paint(`
      ${header("Recetas", "¿Qué toca ahora?", true)}
      ${now.meal && isDue(now.meal) ? `<div class="due-banner"><span class="db-time">⏰ ${now.meal.time}</span><span>¡Toca ${esc(now.meal.slot)}! Es hora de ${esc(now.meal.name)}</span></div>`:""}
      ${now.meal ? `
      <div class="now-hero ${isDue(now.meal)?"due":""}">
        <div class="now-img" style="background:${now.meal.grad}">
          ${heroImg(now.meal.name, now.meal.recipeId)}
          <div class="now-badge">${isDue(now.meal)?"🟢 ¡Toca ya!":"⏰"} ${now.meal.time} · ${esc(now.meal.slot)}</div>
          <div class="hero-emoji" style="position:absolute;right:16px;bottom:-10px;font-size:96px">${now.meal.emoji}</div>
        </div>
        <div class="now-body">
          <div class="now-title">${esc(now.meal.name)}</div>
          <div class="now-meta"><span>🔥 ${now.meal.macros.kcal} kcal</span><span>💪 ${now.meal.macros.p}g</span><span>⏱️ ${recTime(now.meal.recipeId)} min</span></div>
          ${availabilityNote(now.meal)}
          <button class="btn primary mt" data-recipe="${now.meal.recipeId}">Ver receta paso a paso 👩‍🍳</button>
        </div>
      </div>` : `<div class="empty">No hay comidas para hoy.</div>`}

      <h2 class="section">🧊 Preparados · adelanta faena</h2>
      ${cookNow ? `<div class="cook-now">👨‍🍳 <span>¡Ahora es buen momento para cocinar y adelantar faena!</span></div>`:""}
      ${alerts.length ? `
        <div class="thaw-alert">
          <div class="ta-title">⏰ Saca del congelador</div>
          <div style="margin-top:8px;font-weight:700;font-size:13.5px;line-height:1.5">
            ${alerts.map(a=>`${a.emoji} <b>${esc(a.name)}</b> — ${esc(takeOutText(a))}.<br><span style="opacity:.85;font-weight:600">${esc(a.tip)}</span>`).join("<br><br>")}
          </div>
        </div>` : ""}
      <div class="sub-h">🍳 Preparar antes de congelar</div>
      <div class="hint" style="margin-bottom:8px">Cocínalos por lotes y, al acabar, márcalos como preparados y congelados.</div>
      <div>${D.PREPARADOS.map(p=>prepCard(p)).join("")}</div>

      <div class="sub-h mt">🧊 Solo congelar</div>
      <div class="hint" style="margin-bottom:8px">Estos van directos al congelador, sin cocinar.</div>
      <div>${freezableFoods.map(fid=>freezeItem("food_"+fid, D.FOODS[fid].emoji, D.FOODS[fid].name)).join("")}</div>

      <h2 class="section">El resto del día</h2>
      ${rest.map(m=>recipeMini(m)).join("")}
      <div style="height:20px"></div>
    `);
    wireBack(()=>go("plan",{id:plan.id}));
    app.querySelectorAll("[data-recipe]").forEach(b=> b.onclick=()=> go("recipe",{id:b.dataset.recipe, from:"recipes"}));
    app.querySelectorAll("[data-prep]").forEach(b=> b.onclick=()=> openPrep(b.dataset.prep));
    app.querySelectorAll("[data-freeze]").forEach(b=> b.onclick=()=>{
      const id=b.dataset.freeze;
      const meta={ name:b.dataset.name, emoji:b.dataset.emoji };
      const now=S.toggleFrozen(id, meta);
      U.toast(now?"Marcado como congelado 🧊":"Descongelado","🧊");
      screenRecipes();
    });
  }
  function freezeItem(id, emoji, name){
    const frozen = S.isFrozen(id);
    return `<button class="freeze-item ${frozen?"frozen":""}" data-freeze="${id}" data-name="${esc(name)}" data-emoji="${emoji}" style="width:100%;text-align:left">
      <div class="check ${frozen?"done":""}" style="pointer-events:none">✓</div>
      <div class="grow"><div class="fi-name" style="font-weight:800">${emoji} ${esc(name)}</div>
        <div class="si-meta">${frozen?"En el congelador":"Toca para marcar como congelado"}</div></div>
      <div style="font-size:22px">🧊</div>
    </button>`;
  }
  function availabilityNote(meal){
    // Solo avisa si aún NO sabemos qué tiene el usuario en la despensa
    if (S.pantryKnown()) return "";
    return `<div class="pill-note mt" style="background:#FFE0E4;color:#B02840">🧊 ¿Tienes todo lo necesario? Dime en el chat qué tienes en la despensa y ajusto la receta y la compra.</div>`;
  }
  function pickNow(meals, dp){
    const nowMin = new Date().getHours()*60+new Date().getMinutes();
    let idx = meals.findIndex((m,i)=>{ const [h,mm]=m.time.split(":"); return (h*60+ +mm)>=nowMin-30 && !dp.done["m"+i]; });
    if (idx<0) idx = meals.findIndex((m,i)=>!dp.done["m"+i]);
    if (idx<0) idx = 0;
    return { idx, meal: meals[idx] };
  }
  function recipeMini(m){
    return `<button class="recipe-card" data-recipe="${m.recipeId}">
      <div class="recipe-thumb" style="background:${m.grad};position:relative;overflow:hidden;display:grid;place-items:center;font-size:36px">${thumbImg(m.name,m.recipeId)}<span style="position:relative;z-index:0">${m.emoji}</span></div>
      <div class="grow"><div class="meal-slot">${m.time} · ${esc(m.slot)}</div>
        <div class="rc-title">${esc(m.name)}</div>
        <div class="rc-meta">🔥 ${m.macros.kcal} kcal · 💪 ${m.macros.p}g</div></div>
      <div class="plan-chev">›</div>
    </button>`;
  }
  function prepCard(p){
    const frozen = S.isFrozen("prep_"+p.id);
    if (frozen)
      return `<div class="freeze-item frozen" style="margin-bottom:10px">
        <div class="check done" style="pointer-events:none">✓</div>
        <div class="grow"><div class="fi-name" style="font-weight:800">${p.emoji} ${esc(p.name)}</div>
          <div class="si-meta">En el congelador</div></div>
        <div style="font-size:22px">🧊</div>
      </div>`;
    return `<button class="card prep-card mb" data-prep="${p.id}" style="text-align:left;width:100%;margin-bottom:10px;display:flex;gap:12px;align-items:center">
      <div style="font-size:34px">${p.emoji}</div>
      <div class="grow"><div style="font-weight:900">${esc(p.name)}</div>
        <div class="tile-meta">🍳 ${esc(p.yield)} · 🧊 ${esc(p.freeze)}</div></div>
      <div class="plan-chev">›</div>
    </button>`;
  }
  function openPrep(id){
    const p = D.PREPARADOS.find(x=>x.id===id); if(!p) return;
    U.openSheet(`
      <div class="flex"><div style="font-size:40px">${p.emoji}</div>
        <div><div style="font-weight:900;font-size:19px">${esc(p.name)}</div><div class="tile-meta">🧊 ${esc(p.freeze)} · ${esc(p.yield)}</div></div></div>
      <p class="muted mt" style="font-weight:700;line-height:1.5">${esc(p.desc)}</p>
      <h2 class="section">Cómo se hace</h2>
      ${p.steps.map((s,i)=>`<div class="step-item"><div class="n">${i+1}</div><p>${esc(s)}</p></div>`).join("")}
      <button class="btn leaf mt" data-done>✅ Preparado y congelado</button>
    `, sheet=> sheet.querySelector("[data-done]").onclick=()=>{
      S.toggleFrozen("prep_"+p.id, { name:p.name, emoji:p.emoji });
      U.closeSheet();
      U.toast("¡Preparado y al congelador! 🧊","✅");
      screenRecipes();
    });
  }
  function recTime(id){ return D.RECIPES.find(r=>r.id===id)?.time || 15; }
  function todayDone(recipeId){
    const plan=S.activePlan(); const meals=S.dayMeals(plan,S.todayKey());
    const idx=meals.findIndex(m=>m.recipeId===recipeId); if(idx<0) return false;
    return !!S.dayProgress(S.todayKey()).done["m"+idx];
  }

  function screenRecipeDetail(){
    const r = D.RECIPES.find(x=>x.id===route.params.id);
    if(!r) return go("recipes");
    const plan = S.activePlan();
    // buscar la comida escalada de hoy con esta receta para mostrar gramos reales
    const meals = S.dayMeals(plan, S.todayKey());
    const meal = meals.find(m=>m.recipeId===r.id);
    const ings = (meal?.ingredients)||r.ingredients;
    const macros = meal?.macros || E.recipeMacros(r);
    paint(`
      <div class="detail-hero" style="background:${r.grad};overflow:hidden">
        ${heroImg(r.name, r.id)}
        <button class="back db" data-back style="z-index:3">‹</button>
        <div class="hero-emoji" style="position:absolute;right:18px;bottom:14px;font-size:110px">${r.emoji}</div>
      </div>
      <div class="between" style="align-items:flex-start;gap:12px">
        <div><div class="eyebrow">${esc(r.slot)}</div>
          <div class="h-title" style="margin:2px 0">${esc(r.name)}</div></div>
      </div>
      <div class="macro-chips mt">
        <span class="mchip kcal">🔥 <b>${macros.kcal}</b> kcal</span>
        <span class="mchip p">💪 <b>${macros.p}</b>g</span>
        <span class="mchip c">🍚 <b>${macros.c}</b>g</span>
        <span class="mchip f">🥑 <b>${macros.f}</b>g</span>
        <span class="mchip">⏱️ <b>${r.time}</b> min</span>
        ${r.tags.includes("easy")?'<span class="mchip">👌 Fácil</span>':''}
        ${r.tags.includes("fast")?'<span class="mchip">⚡ Rápida</span>':''}
      </div>
      <h2 class="section">🛒 Ingredientes</h2>
      <div class="card">
        ${ings.map(([fid,g])=>{ const f=D.FOODS[fid]; return `<div class="ing-item"><span>${f.emoji} ${esc(f.name)}</span><span class="g">${fmtG(fid,g)}</span></div>`; }).join("")}
      </div>
      ${(()=>{ const frozen=new Set(Object.keys(S.get().frozen||{}).filter(id=>S.isFrozen(id)));
        const tips=E.cookingTips({ingredients:ings}, frozen);
        return tips.length ? `<h2 class="section">🔥 Cocción precisa (tu ración)</h2><div class="card">${tips.map(t=>`<div class="cook-tip">${U.mdLite(t)}</div>`).join("")}</div>` : ""; })()}
      <h2 class="section">👩‍🍳 Preparación</h2>
      ${r.steps.map((s,i)=>`<div class="step-item"><div class="n">${i+1}</div><p>${esc(s)}</p></div>`).join("")}
      ${r.prep?`<div class="pill-note mt">💡 Esta receta admite <b>preparado/batch cooking</b>: haz el doble y congela para otro día.</div>`:""}
      <button class="btn ghost mt" data-ask>Preguntar a Zana sobre esta receta 🥕</button>
      ${meal ? `<button class="btn leaf mt" data-done>${todayDone(r.id)?"✅ Ya realizada — volver":"✅ Comida realizada"}</button>` : ""}
      <div style="height:20px"></div>
    `);
    wireBack(()=> go(route.params.from==="calendar"?"calendar":(route.params.from==="home"?"home":"recipes")));
    app.querySelector("[data-ask]").onclick=()=> U.openChat(`Dame un consejo para cocinar mejor "${r.name}"`);
    const dBtn=app.querySelector("[data-done]");
    if(dBtn) dBtn.onclick=()=>{
      const meals=S.dayMeals(plan,S.todayKey());
      const idx=meals.findIndex(m=>m.recipeId===r.id);
      if(idx>=0){
        const dp=S.dayProgress(S.todayKey());
        if(!dp.done["m"+idx]){ S.toggleMealDone(S.todayKey(),"m"+idx,meals[idx]); U.toast("¡Comida realizada! 🍽️ Despensa actualizada","✅"); }
      }
      goBackFrom();
    };
  }
  function fmtG(fid,g){
    const f=D.FOODS[fid];
    if(f.gPerUnit){const u=Math.round(g/f.gPerUnit); return `${u} ${f.unit==="ud"?(u===1?"ud":"uds"):f.unit}`;}
    const cf=D.COOK_FACTOR[fid];
    if(cf) return `${g} g <span style="color:var(--ink-3);font-weight:700">${ZL("en crudo","en cru","raw")} · ≈${Math.round(g*cf)} g ${ZL("cocido","cuit","cooked")}</span>`;
    return `${g} g`;
  }

  /* =======================================================================
     SÚPER · lista de la compra
     ======================================================================= */
  function screenSuper(){
    const plan = S.activePlan();
    let sh = S.get().shopping;
    if (!sh || sh.planId!==plan.id) sh = S.buildShopping();
    const items = sh.items;
    const total = E.listCost(items);
    const gotCount = items.filter(i=>sh.checked[i.fid]).length;
    const gotCost = items.filter(i=>sh.checked[i.fid]).reduce((a,i)=>a+i.price,0);
    const pct = items.length? Math.round(gotCount/items.length*100):0;

    // agrupar por pasillo
    const byAisle = {};
    items.forEach(it=>{ (byAisle[it.aisle]=byAisle[it.aisle]||[]).push(it); });

    paint(`
      <div class="h-top" style="padding-right:68px">
        <button class="back" data-back>‹</button>
        <div class="grow"><div class="h-title">Súper</div><div class="h-sub">Tu lista de la compra</div></div>
        <button class="round-btn chart" id="chartFab" title="Consumo económico">📈</button>
        <button class="round-btn cam" id="camFab" title="Escanear tiquet">📷</button>
      </div>
      <div class="super-head">
        <div class="between">
          <div><div style="opacity:.9;font-weight:800;font-size:13px">🛒 Compra de hoy</div>
            <div class="big">${gotCost.toFixed(2)} €</div></div>
          <div style="text-align:right"><div style="opacity:.9;font-weight:800;font-size:13px">Coste estimado</div>
            <div style="font-size:22px;font-weight:900">${total.toFixed(2)} €</div></div>
        </div>
        <div class="super-progress"><span style="width:${pct}%"></span></div>
        <div style="margin-top:8px;font-size:12.5px;font-weight:700;opacity:.95">${gotCount}/${items.length} en el carro · quedan ${(total-gotCost).toFixed(2)} €</div>
      </div>

      <div class="between">
        <div class="chips" id="freqChips">
          ${[1,2,3,4].map(w=>`<button class="chip ${sh.weeks===w?"on":""}" data-freq="${w}">${w===4?"Mensual":w+ " sem"}</button>`).join("")}
        </div>
        <button class="btn sm ghost" data-regen>↻</button>
      </div>

      <div id="pantryBox"></div>

      ${Object.keys(byAisle).length? Object.entries(byAisle).map(([aisle,list])=>`
        <div class="aisle-title">${D.AISLES[aisle]?.emoji||"🧺"} ${esc(D.AISLES[aisle]?.name||aisle)}</div>
        ${list.map(it=>shopItem(it, sh.checked[it.fid])).join("")}
      `).join("") : `<div class="empty">🎉 ¡Todo comprado o ya en tu despensa!</div>`}

      <button class="btn leaf mt-lg" data-finish>🛒 En el carro</button>
      <div style="height:10px"></div>
      <input type="file" id="ticketInput" accept="image/*" capture="environment" style="display:none"/>
    `);
    wireBack(()=>go("plan",{id:plan.id}));
    renderPantryBox();
    const camFab=app.querySelector("#camFab"), ticketInput=app.querySelector("#ticketInput");
    camFab.onclick=()=> ticketInput.click();
    ticketInput.onchange=e=> handleTicket(e.target.files[0]);
    app.querySelector("#chartFab").onclick=()=> go("spending");
    app.querySelectorAll("[data-freq]").forEach(b=> b.onclick=()=>{ S.get().settings.shoppingFreqWeeks=+b.dataset.freq; S.buildShopping(+b.dataset.freq); screenSuper(); });
    app.querySelector("[data-regen]").onclick=()=>{ S.buildShopping(sh.weeks); U.toast("Lista regenerada 🛒"); screenSuper(); };
    app.querySelectorAll("[data-shop]").forEach(b=> b.onclick=()=>{ S.toggleShopItem(b.dataset.shop); U.renderDailyBar(); screenSuper(); });
    app.querySelector("[data-finish]").onclick=()=>{
      const spent=S.logShoppingDone();
      U.toast(spent>0?`En el carro · ${spent.toFixed(2)} € 🛒`:"¡Guardado en tu despensa! 🥕","🛒");
      go("plan",{id:plan.id});
    };
  }
  async function handleTicket(file){
    if(!file) return;
    const st=S.get().settings;
    if(st.aiProvider==="local" || !st.aiKey){
      U.toast("Añade tu clave de IA para leer tiquets 🔑","📷");
      U.openChat(); return;
    }
    U.toast("Leyendo tu tiquet... 📷");
    try{
      const dataUrl=await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });
      const items=await M.extractTicket(dataUrl);
      if(!items||!items.length){ U.toast("No pude leer el tiquet, prueba otra foto","😕"); return; }
      let updated=0;
      // La respuesta viene de un modelo leyendo una foto: no es de fiar.
      // Solo se aceptan precios finitos y en un rango plausible de supermercado.
      items.forEach(it=>{
        const fids=S.detectFoods(it.producto||"");
        const precio=Number(it.precio);
        if(fids.length && Number.isFinite(precio) && precio>0 && precio<100){
          S.setProduct(fids[0], null, precio); updated++;
        }
      });
      S.buildShopping(S.get().shopping?.weeks||1);
      U.toast(`Tiquet leído: ${updated} precios actualizados ✅`,"📷");
      screenSuper();
    }catch(e){ U.toast("No pude procesar la foto (revisa tu conexión/clave)","😕"); }
  }

  function shopItem(it, got){
    return `<div class="shop-item ${got?"got":""}" data-shop="${it.fid}">
      <button class="check ${got?"done":""}" style="pointer-events:none">✓</button>
      <div class="si-body"><div class="si-name">${it.emoji} ${esc(it.name)}</div>
        <div class="si-meta">${it.brands?.length?"Marca: "+esc(it.brands[0]):"Sin marca concreta"}</div>
        ${it.brands?.length>1?`<div class="si-brand">También: ${esc(it.brands.slice(1).join(", "))}</div>`:""}
      </div>
      <div style="text-align:right"><div class="si-qty">${E.buyQty(it.fid, it.grams)}</div><div class="si-meta">${it.price>0?it.price.toFixed(2)+" €":""}</div></div>
    </div>`;
  }
  function renderPantryBox(){
    const box=app.querySelector("#pantryBox"); if(!box) return;
    const p=S.pantryList();
    if(!p.length){ box.innerHTML=""; return; }
    box.innerHTML = `<div class="aisle-title">🥫 Ya tienes en tu despensa</div>
      <div style="margin-bottom:6px">${p.map(x=>`<span class="pantry-pill">${x.emoji} ${esc(x.name)} · ${E.buyQty(x.fid, x.grams)}</span>`).join("")}</div>
      <div class="hint" style="margin-bottom:8px">Se descuenta solo de tu lista para no comprar de más. ✨</div>`;
  }

  /* =======================================================================
     GASTOS
     ======================================================================= */
  function screenGastos(){
    const plan = S.activePlan();
    const week = S.expensesByWeek();
    const maxV = Math.max(1, ...week.map(w=>w.amount));
    const spent7 = week.reduce((a,w)=>a+w.amount,0);
    // previsión: coste de la lista actual / semanas
    const sh = S.get().shopping;
    const weeklyForecast = sh ? +(E.listCost(sh.items)/(sh.weeks||1)).toFixed(2) : dayCostAvg(plan)*7;
    const monthForecast = +(weeklyForecast*4.33).toFixed(2);

    paint(`
      ${header("Gastos", "Comida y previsión", true)}
      <div class="stat-row">
        <div class="stat"><div class="k">Gastado (7 días)</div><div class="v">${spent7.toFixed(2)}<small> €</small></div></div>
        <div class="stat"><div class="k">Previsión semanal</div><div class="v" style="color:var(--carrot)">${weeklyForecast.toFixed(2)}<small> €</small></div></div>
      </div>
      <div class="card">
        <div class="between"><b style="font-weight:900">Últimos 7 días</b><span class="tile-meta">€/día</span></div>
        <div class="bars-week">
          ${week.map(w=>`<div class="col">
            <div class="b" style="height:${Math.max(4,Math.round(w.amount/maxV*100))}%"></div>
            <small>${w.label}</small></div>`).join("")}
        </div>
      </div>

      <div class="card mt">
        <div class="flex" style="gap:12px"><div style="font-size:32px">📅</div>
          <div class="grow"><div style="font-weight:900">Previsión mensual</div>
            <div class="tile-meta">Según tu plan y frecuencia de compra</div></div>
          <div style="font-weight:900;font-size:22px;color:var(--grape)">${monthForecast.toFixed(2)} €</div></div>
      </div>

      <h2 class="section">Añadir gasto</h2>
      <div class="card">
        <div class="row2">
          <div class="field" style="margin:0"><label>Importe (€)</label><input class="input" id="expAmt" type="number" inputmode="decimal" placeholder="0.00"/></div>
          <div class="field" style="margin:0"><label>Concepto</label><input class="input" id="expNote" placeholder="Compra semanal"/></div>
        </div>
        <button class="btn primary mt" data-addexp>Añadir gasto 💶</button>
      </div>

      <h2 class="section">Movimientos recientes</h2>
      <div>${recentExpenses()}</div>
      <div style="height:20px"></div>
    `);
    wireBack(()=>go("plan",{id:plan.id}));
    app.querySelector("[data-addexp]").onclick=()=>{
      const amt=parseFloat(app.querySelector("#expAmt").value);
      if(!amt||amt<=0){ U.toast("Pon un importe válido 💶"); return; }
      S.logExpense(amt, app.querySelector("#expNote").value||"Compra");
      U.toast("Gasto añadido 💶","✅"); screenGastos();
    };
  }
  function dayCostAvg(plan){ let s=0; plan.week.forEach(d=> s+=E.dayCost(d)); return +(s/7).toFixed(2); }
  function recentExpenses(){
    const list = S.get().expenses.slice(-8).reverse();
    if(!list.length) return `<div class="empty">Aún no hay gastos. Marca comidas como hechas o añade uno arriba.</div>`;
    return list.map(e=>`<div class="shop-item"><div style="font-size:24px">🧾</div>
      <div class="si-body"><div class="si-name">${esc(e.note)}</div><div class="si-meta">${esc(e.date)}</div></div>
      <div class="si-qty">${e.amount.toFixed(2)} €</div></div>`).join("");
  }

  /* =======================================================================
     CONSUMO ECONÓMICO · gráficos mensual y anual (compras marcadas)
     ======================================================================= */
  function screenSpending(){
    const plan = S.activePlan();
    const months = S.expensesByMonth(12);
    const tot = S.spendTotals();
    const maxV = Math.max(1, ...months.map(m=>m.amount));
    const yearMonths = months.filter(m=>m.year===new Date().getFullYear());
    const avgMonth = yearMonths.length ? tot.year/ new Date().getMonth()+1 : 0;

    paint(`
      ${header("Consumo económico", "Basado en tus compras", true)}
      <div class="stat-row">
        <div class="stat"><div class="k">Este mes</div><div class="v">${tot.month.toFixed(2)}<small> €</small></div></div>
        <div class="stat"><div class="k">Este año</div><div class="v" style="color:var(--grape)">${tot.year.toFixed(2)}<small> €</small></div></div>
      </div>

      <div class="card">
        <div class="between"><b style="font-weight:900">Gasto mensual</b><span class="tile-meta">últimos 12 meses · €</span></div>
        <div class="bars-year">
          ${months.map(m=>`<div class="col">
            <div class="b ${m.amount===0?'future':''}" style="height:${Math.max(3,Math.round(m.amount/maxV*100))}%" title="${m.amount.toFixed(2)} €"></div>
            <small>${m.label}</small></div>`).join("")}
        </div>
      </div>

      <div class="card mt">
        <div class="flex" style="gap:12px"><div style="font-size:30px">📅</div>
          <div class="grow"><div style="font-weight:900">Media mensual (este año)</div>
            <div class="tile-meta">Promedio de lo que llevas gastado</div></div>
          <div style="font-weight:900;font-size:20px;color:var(--carrot)">${(tot.year/(new Date().getMonth()+1)).toFixed(2)} €</div></div>
      </div>

      <div class="pill-note mt">📈 Estos gráficos se calculan con lo que marcas y pulsas <b>“En el carro”</b> en tu lista de la compra${plan?"":""}.</div>

      <h2 class="section">Compras recientes</h2>
      <div>${recentExpenses()}</div>
      <div style="height:20px"></div>
    `);
    wireBack(()=> go("super"));
  }

  /* =======================================================================
     EJERCICIO · rutina de HOY (casa/calle), solo el día actual
     ======================================================================= */
  function screenExercise(){
    const plan = S.activePlan();
    const kb = window.ZKB.EXERCISES[plan.goal] || window.ZKB.EXERCISES.mantener;
    const today = S.todayKey();
    const day = S.dayExercises(plan, today);
    const dp = S.exProgress(today);
    const doneN = day.items.filter((_,i)=>dp.ex[i]).length;
    const d = new Date();
    const human = `<span>${DOW_LONG[(d.getDay()+6)%7]}</span> ${d.getDate()} <span>${MES[d.getMonth()]}</span>`;
    const exWeek = S.exercisesThisWeek();

    paint(`
      ${header("Ejercicio de hoy", kb.focus, true)}
      <div class="card pad-lg" style="background:linear-gradient(135deg,#9A82FF,#6B4EF2);color:#fff;border:none">
        <div class="between">
          <div><div style="opacity:.9;font-weight:800;font-size:13px;text-transform:capitalize">${human}</div>
            <div style="font-size:22px;font-weight:900">${esc(day.name)}</div></div>
          <div style="text-align:right"><div style="font-size:26px;font-weight:900">${doneN}/${day.items.length}</div>
            <div style="opacity:.9;font-size:12px;font-weight:700">hechos</div></div>
        </div>
      </div>
      <div class="pill-note mt">🏠 Pensado para hacer en casa o en la calle, con pesas, mochila o botellas. ${exWeek} días de ejercicio esta semana — Zana adapta tu dieta a ello.</div>

      <div class="mt">
        ${day.items.map((e,i)=>exCard(e,i,dp.ex[i])).join("")}
      </div>
      <button class="btn ghost mt" data-askex>Pídele a Zana que te lo explique 🥕</button>
      <div style="height:20px"></div>
    `);
    wireBack(()=>go("plan",{id:plan.id}));
    app.querySelector("[data-askex]").onclick=()=> U.openChat("Explícame mis ejercicios de hoy y cómo hacerlos bien");
    app.querySelectorAll("[data-ex]").forEach(b=> b.onclick=()=>{
      const i=+b.dataset.ex; const on=S.toggleExerciseDone(today,i);
      U.toast(on?"¡Ejercicio hecho! 💪":"Desmarcado", on?"✅":"↩️");
      screenExercise();
    });
    app.querySelectorAll("[data-how]").forEach(b=> b.onclick=()=> openHowTo(b.dataset.how));
  }
  function exCard(e,i,done){
    // e = [pose, nombre, "series × reps/tiempo", detalle, peso]
    const parts = String(e[2]).split("×").map(s=>s.trim());
    const series = parts[0] || e[2];
    const reps = parts[1] || "";
    const isTime = /min|s\b|seg/.test(reps);
    return `<div class="ex-card ${done?"done":""}">
      <div class="ex-draw">${window.ZKB.drawExercise(e[0])}</div>
      <div class="grow">
        <div class="ex-name" style="font-weight:900;font-size:16px">${esc(e[1])}</div>
        <div class="ex-figures">
          <div class="ex-fig"><b>${esc(series)}</b><span>series</span></div>
          ${reps?`<div class="ex-fig"><b>${esc(reps)}</b><span>${isTime?"tiempo":"repeticiones"}</span></div>`:""}
          ${e[4]&&e[4]!=="—"?`<div class="ex-fig"><b style="font-size:13px">${esc(e[4])}</b><span>peso</span></div>`:""}
        </div>
        <button class="ex-how" data-how="${e[0]}">💡 ¿Cómo lo hago?</button>
      </div>
      <button class="check ${done?"done":""}" data-ex="${i}">✓</button>
    </div>`;
  }
  function openHowTo(pose){
    const ht = window.ZKB.howTo(pose);
    U.openSheet(`
      <div class="flex"><div style="width:70px;height:56px;color:var(--carrot)">${window.ZKB.drawExercise(pose)}</div>
        <div><div style="font-weight:900;font-size:19px">${esc(ht.t)}</div><div class="tile-meta">Cómo hacerlo bien</div></div></div>
      <div class="mt">${ht.s.map((s,i)=>`<div class="step-item"><div class="n">${i+1}</div><p>${esc(s)}</p></div>`).join("")}</div>
      <button class="btn ghost mt" data-close>Entendido</button>
    `, sh=> sh.querySelector("[data-close]").onclick=U.closeSheet);
  }

  /* =======================================================================
     AJUSTES
     ======================================================================= */
  function screenSettings(){
    const plan = S.activePlan();
    const st = S.get().settings;
    paint(`
      ${header("Ajustes", "Configura tu Zana", true)}

      <h2 class="section">🔔 Notificaciones</h2>
      <div class="card">
        <div class="between"><div><div style="font-weight:800">Avisos de comidas</div>
          <div class="tile-meta">Te aviso cuando toque preparar cada comida</div></div>
          <button class="btn sm ${st.notifications?"leaf":"ghost"}" data-notif>${st.notifications?"Activadas":"Activar"}</button></div>
        <div class="divider"></div>
        <button class="btn ghost sm" data-testnotif>Probar notificación 🔔</button>
      </div>

      <h2 class="section">🥕 IA de Zana</h2>
      <div class="card">
        <div class="between"><label style="font-weight:800">Motor de la IA</label>
          <button class="help-q" data-aihelp title="¿Cómo consigo una clave gratis?">?</button></div>
        <select class="input" id="aiProvider" style="margin-top:8px">
          <option value="local" ${st.aiProvider==="local"?"selected":""}>Zana local (offline, gratis)</option>
          <option value="gemini" ${st.aiProvider==="gemini"?"selected":""}>Google Gemini (API gratis)</option>
          <option value="groq" ${st.aiProvider==="groq"?"selected":""}>Groq · Llama (API gratis)</option>
        </select>
        <div class="field" id="aiKeyBox" style="margin-top:14px;${st.aiProvider==="local"?'display:none':''}">
          <label>Tu clave API</label>
          <div class="flex" style="gap:8px">
            <input class="input grow" id="aiKey" type="password" autocomplete="off" spellcheck="false"
                   placeholder="Pega aquí tu API key" value="${esc(st.aiKey)}"/>
            <button class="btn sm ghost" data-verkey type="button" style="flex:0 0 auto">Ver</button>
          </div>
          <div class="hint">${st.aiKey?`✅ Clave guardada (····${esc(st.aiKey.slice(-4))}).`:"Cada persona usa su propia clave gratuita. Pulsa el <b>?</b> para conseguirla."}</div>
        </div>
        <div class="pill-note" style="margin-top:10px">${ZL(
          "🔒 <b>Qué sale de tu móvil:</b> con Gemini o Groq activados, tus datos del plan (edad, sexo, peso, altura, objetivo, intolerancias) y tus mensajes se envían a ese proveedor para generar la respuesta. Tu nombre no se envía. Las fotos de tiquets se mandan enteras. En modo <b>Zana local</b> no sale nada del móvil.",
          "🔒 <b>Què surt del teu mòbil:</b> amb Gemini o Groq activats, les teves dades del pla (edat, sexe, pes, alçada, objectiu, intoleràncies) i els teus missatges s'envien a aquest proveïdor per generar la resposta. El teu nom no s'envia. Les fotos de tiquets s'envien senceres. En mode <b>Zana local</b> no surt res del mòbil.",
          "🔒 <b>What leaves your phone:</b> with Gemini or Groq enabled, your plan data (age, sex, weight, height, goal, intolerances) and your messages are sent to that provider to generate the reply. Your name is not sent. Receipt photos are sent in full. In <b>Zana local</b> mode nothing leaves your phone.")}</div>
        <button class="btn primary mt" data-saveai>Guardar IA</button>
      </div>

      <h2 class="section">🎨 Estilo</h2>
      <div class="card">
        <div class="field" style="margin:0"><label>Aspecto de la app</label>
          <div class="chips" id="themeChips">
            ${[["light","☀️ Claro"],["dark","🌙 Oscuro"],["orange","🥕 Orange (Zana)"]].map(([k,v])=>`<button class="chip ${st.theme===k?"on":""}" data-themeset="${k}">${v}</button>`).join("")}
          </div></div>
      </div>

      <h2 class="section">🌐 Idioma</h2>
      <div class="card">
        <div class="chips" id="langChips">
          ${[["es","🇪🇸 Español"],["ca","🌀 Català"],["en","🇬🇧 English"]].map(([k,v])=>`<button class="chip ${st.lang===k?"on":""}" data-lang="${k}">${v}</button>`).join("")}
        </div>
        <div class="hint">La app se mostrará en el idioma elegido.</div>
      </div>

      <h2 class="section">🍃 Dieta especial / alergias</h2>
      <div class="card">
        <div class="between"><div><div style="font-weight:800">${esc(window.ZKB.specialDietById(plan.profile.specialDiet||"ninguna").name)}</div>
          <div class="tile-meta">Vegana, FODMAP, sin gluten, keto...</div></div>
          <button class="btn sm ghost" data-diets>Cambiar</button></div>
      </div>

      <h2 class="section">💨 Intolerancias / incidencias</h2>
      <div class="card">
        <div class="field" style="margin:0"><label>¿Algún alimento te hincha o te sienta mal?</label>
          <textarea class="input" id="intolText" placeholder="Ej: cada vez que como lentejas me hincho mucho..."></textarea>
          <div class="hint">La IA recogerá esta información para <b>adaptar tu dieta</b>, eliminando y sustituyendo los alimentos que no te sienten bien.</div></div>
        <button class="btn primary mt" data-intol>Anotar incidencia</button>
        ${intolAnalysis()}
      </div>

      <h2 class="section">📋 Tu plan</h2>
      <div class="card">
        <div class="between"><div><div style="font-weight:800">${esc(plan.name)}</div>
          <div class="tile-meta">${esc(D.GOAL_LABELS[plan.goal].label)} · ${plan.targets.kcal} kcal</div></div>
          <button class="btn sm ghost" data-regenplan>Regenerar menú</button></div>
        <div class="divider"></div>
        <button class="btn ghost sm" data-editprofile>Editar mis datos</button>
      </div>

      <h2 class="section">Datos</h2>
      <button class="btn ghost" data-reset style="color:var(--berry)">🗑️ Borrar todo y empezar de cero</button>

      <div class="card flat mt" style="background:var(--surface-2);border:none">
        <div style="font-weight:900;margin-bottom:6px">🥕 ${ZL("Cómo trabaja Zana","Com treballa la Zana","How Zana works")}</div>
        <p class="muted" style="font-weight:600;line-height:1.55;font-size:13px;margin:0">
          ${ZL(
            "Zana es una app inteligente que combina un motor propio con IA. Sus planes se basan en información nutricional y procedimientos recomendados por y para profesionales de la salud (guías de la ISSN y evidencia contrastada). Recuerda: acompaña tu plan con <b>ejercicio físico regular</b> y sé <b>constante</b> — la constancia es lo que te lleva a tus objetivos de la forma más óptima. Zana no sustituye a un médico o dietista-nutricionista.",
            "La Zana és una app intel·ligent que combina un motor propi amb IA. Els seus plans es basen en informació nutricional i procediments recomanats per i per a professionals de la salut (guies de la ISSN i evidència contrastada). Recorda: acompanya el teu pla amb <b>exercici físic regular</b> i sigues <b>constant</b> — la constància és el que et porta als teus objectius de la manera més òptima. La Zana no substitueix un metge o dietista-nutricionista.",
            "Zana is a smart app combining its own engine with AI. Its plans are based on nutrition science and procedures recommended by and for health professionals (ISSN guidelines and solid evidence). Remember: pair your plan with <b>regular physical exercise</b> and be <b>consistent</b> — consistency is what gets you to your goals in the best way. Zana doesn't replace a doctor or dietitian."
          )}
        </p>
      </div>
      <button class="btn ghost mt" data-forceupdate style="width:100%">🔄 ${ZL("Actualizar app","Actualitzar app","Update app")}</button>
      <div class="center muted mt" style="font-size:12px">Zana ${APP_VER} · 🥕</div>
      <div style="height:20px"></div>
    `);
    wireBack(()=>go("plan",{id:plan.id}));

    app.querySelector("#aiProvider").onchange=e=>{
      app.querySelector("#aiKeyBox").style.display = e.target.value==="local"?"none":"block";
    };
    const verKeyBtn=app.querySelector("[data-verkey]");
    if(verKeyBtn) verKeyBtn.onclick=()=>{
      const campo=app.querySelector("#aiKey"); if(!campo) return;
      const oculto = campo.type==="password";
      campo.type = oculto ? "text" : "password";
      verKeyBtn.textContent = oculto ? "Ocultar" : "Ver";
    };
    app.querySelector("[data-saveai]").onclick=()=>{
      st.aiProvider=app.querySelector("#aiProvider").value;
      st.aiKey=app.querySelector("#aiKey")?.value.trim()||"";
      S.save(); U.toast("IA guardada 🥕","✅");
    };
    app.querySelector("[data-notif]").onclick=async()=>{
      if(!("Notification" in window)){ U.toast("Tu navegador no soporta notificaciones"); return; }
      const perm = await Notification.requestPermission();
      st.notifications = perm==="granted"; S.save();
      U.toast(st.notifications?"Notificaciones activadas 🔔":"Permiso denegado");
      if(st.notifications) scheduleMealNotifs();
      screenSettings();
    };
    app.querySelector("[data-testnotif]").onclick=()=> fireNotif("🥕 ¡Hola! Soy Zana","Así te avisaré cuando toque cocinar 🍽️");
    app.querySelector("[data-aihelp]").onclick=()=> openAiHelp();
    app.querySelectorAll("#themeChips .chip").forEach(b=> b.onclick=()=>{ st.theme=b.dataset.themeset; S.save(); U.applyTheme(); screenSettings(); });
    app.querySelectorAll("#langChips .chip").forEach(b=> b.onclick=()=>{ st.lang=b.dataset.lang; S.save(); U.applyTheme(); U.toast("Idioma: "+b.dataset.lang.toUpperCase()); screenSettings(); });
    app.querySelector("[data-diets]").onclick=()=> screenSpecialDiets(false);
    app.querySelector("[data-intol]").onclick=()=>{
      const t=app.querySelector("#intolText").value.trim();
      if(!t){ U.toast("Escribe qué te ha sentado mal"); return; }
      S.logIntolerance(t); U.toast("Incidencia anotada 💨","✅"); screenSettings();
    };
    app.querySelectorAll("[data-suppress]").forEach(b=> b.onclick=()=>{ S.suppressFood(b.dataset.suppress); U.toast("Alimento suprimido de tu dieta ✅"); screenSettings(); });
    app.querySelector("[data-forceupdate]").onclick=async()=>{
      U.toast(ZL("Buscando la última versión…","Cercant l'última versió…","Fetching latest…"),"🔄");
      try{
        if("caches" in window){ const ks=await caches.keys(); await Promise.all(ks.map(k=>caches.delete(k))); }
        if("serviceWorker" in navigator){ const rs=await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r=>r.unregister())); }
      }catch(e){}
      // Recarga saltándose la caché (cache-buster) para traer index.html + scripts frescos
      location.replace(location.pathname + "?fresh=" + Date.now());
    };
    app.querySelector("[data-regenplan]").onclick=()=>{ S.regeneratePlan(plan.id); U.toast("Menú regenerado ✨"); };
    app.querySelector("[data-editprofile]").onclick=()=>{ ob={...plan.profile, planName:plan.name}; S.set({onboarded:false}); screenOnboarding(1); };
    app.querySelector("[data-reset]").onclick=()=>{
      U.openSheet(`<div class="center"><div style="font-size:44px">🗑️</div>
        <div class="h-title mt">¿Borrar todo?</div>
        <p class="muted" style="font-weight:700">Se eliminarán tus planes, progreso y datos. No se puede deshacer.</p>
        <button class="btn primary mt" style="background:var(--berry)" data-confirm>Sí, borrar todo</button>
        <button class="btn ghost mt" data-cancel>Cancelar</button></div>`,
        sh=>{ sh.querySelector("[data-cancel]").onclick=U.closeSheet;
          sh.querySelector("[data-confirm]").onclick=()=>{ S.reset(); U.closeSheet(); ob=null; go("home"); }; });
    };
  }

  function openAiHelp(){
    U.openSheet(`
      <div class="flex"><div style="font-size:40px">🔑</div>
        <div><div style="font-weight:900;font-size:19px">Tu clave de IA gratis</div>
          <div class="tile-meta">Para que la zanahoria converse contigo</div></div></div>
      <p class="muted mt" style="font-weight:700;line-height:1.55">Cada persona usa su <b>propia clave gratuita</b> (así tus amigos no gastan la tuya). Es gratis y tarda 1 minuto:</p>
      <div class="card" style="margin-top:10px">
        <div style="font-weight:900">🟢 Google Gemini (recomendada)</div>
        <div class="step-item mt"><div class="n">1</div><p>Entra en <b>aistudio.google.com/apikey</b> e inicia sesión con Google.</p></div>
        <div class="step-item"><div class="n">2</div><p>Pulsa <b>“Create API key”</b> y copia la clave (empieza por <code>AIza…</code> o <code>AQ…</code>).</p></div>
        <div class="step-item"><div class="n">3</div><p>Pégala aquí en Ajustes › IA de Zana y ¡listo!</p></div>
        <a class="btn leaf" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Abrir Google AI Studio ↗</a>
      </div>
      <div class="card mt">
        <div style="font-weight:900">⚡ Alternativa: Groq (Llama)</div>
        <div class="hint" style="margin-top:6px">Regístrate en <b>console.groq.com/keys</b>, crea una key (empieza por <code>gsk_...</code>) y pégala aquí.</div>
        <a class="btn ghost mt" href="https://console.groq.com/keys" target="_blank" rel="noopener">Abrir Groq ↗</a>
      </div>
      <div class="pill-note mt">🔒 Tu clave se guarda <b>solo en tu móvil</b>, nunca se comparte.</div>
      <button class="btn ghost mt" data-close>Cerrar</button>
    `, sh=> sh.querySelector("[data-close]").onclick=U.closeSheet);
  }

  function promptForKey(){
    const st = S.get().settings;
    U.openSheet(`
      <div class="flex"><div style="width:58px;height:58px">${M.svg("happy")}</div>
        <div><div style="font-weight:900;font-size:19px">${ZL("Activa mi cerebro 🧠","Activa el meu cervell 🧠","Turn on my brain 🧠")}</div>
          <div class="tile-meta">${ZL("Chatea conmigo con IA de verdad","Xateja amb mi amb IA de veritat","Chat with real AI")}</div></div></div>
      <p class="muted mt" style="font-weight:600;line-height:1.55">${ZL(
        "Para responderte de verdad a cualquier pregunta necesito tu clave gratuita de Google Gemini (es gratis y tarda 1 minuto). Sin ella funciono en modo básico.",
        "Per respondre't de veritat a qualsevol pregunta necessito la teva clau gratuïta de Google Gemini (és gratis i triga 1 minut). Sense ella funciono en mode bàsic.",
        "To really answer any question I need your free Google Gemini key (it's free and takes 1 minute). Without it I run in basic mode.")}</p>
      <div class="field mt" style="margin-bottom:8px"><input class="input" id="kpKey" type="password" autocomplete="off" spellcheck="false" placeholder="AIza… o AQ…" value="${esc(st.aiKey||"")}"/></div>
      <div class="pill-note" style="margin-bottom:10px;text-align:left">${ZL(
        "🔒 Con la IA activada, tus datos del plan y tus mensajes se envían a Google para generar la respuesta. Tu nombre no. Sin clave, Zana funciona entera dentro del móvil.",
        "🔒 Amb la IA activada, les teves dades del pla i els teus missatges s'envien a Google per generar la resposta. El teu nom no. Sense clau, la Zana funciona sencera dins del mòbil.",
        "🔒 With AI enabled, your plan data and messages are sent to Google to generate the reply. Your name is not. Without a key, Zana runs entirely on your phone.")}</div>
      <button class="btn primary" data-save>${ZL("Guardar clave","Desar clau","Save key")}</button>
      <button class="btn ghost mt" data-help>${ZL("¿Cómo consigo una? (gratis)","Com n'aconsegueixo una? (gratis)","How do I get one? (free)")}</button>
      <button class="btn ghost mt" data-skip>${ZL("Seguir sin clave (modo básico)","Continuar sense clau (mode bàsic)","Continue without key (basic mode)")}</button>
    `, sh=>{
      sh.querySelector("[data-save]").onclick=()=>{
        const k=sh.querySelector("#kpKey").value.trim();
        if(k){ st.aiKey=k; if(st.aiProvider==="local") st.aiProvider="gemini"; S.save(); U.toast("Clave guardada 🔑","✅"); }
        U.closeSheet();
      };
      sh.querySelector("[data-help]").onclick=()=>{ U.closeSheet(); openAiHelp(); };
      sh.querySelector("[data-skip]").onclick=U.closeSheet;
    });
  }

  function intolAnalysis(){
    const pats = S.analyzeIntolerances();
    const log = S.get().intolerances;
    if(!log.length) return "";
    if(!pats.length) return `<div class="divider"></div><div class="tile-meta">Llevas ${log.length} incidencia(s) anotada(s). Necesito ver un patrón (mismo alimento ≥2 veces) para darte un análisis.</div>`;
    return `<div class="divider"></div>
      <div class="pill-note" style="background:#FFF0CE;color:#8A5A00">
        🔎 <b>Análisis de Zana:</b> he detectado que ${pats.map(p=>`${p.emoji} <b>${esc(p.name)}</b> (${p.n} veces)`).join(", ")} te repite(n). Podría ser una sensibilidad a ese alimento o a cómo lo cocinas.
      </div>
      <div style="margin-top:10px;font-weight:800;font-size:13.5px">¿Quieres que lo suprima de tu dieta?</div>
      <div class="chips mt">${pats.map(p=>`<button class="chip" data-suppress="${p.fid}">Suprimir ${p.emoji} ${esc(p.name)}</button>`).join("")}</div>`;
  }

  /* =======================================================================
     NOTIFICACIONES
     ======================================================================= */
  function fireNotif(title, body){
    if(window.ZI18N){ title=ZI18N.translate(title); body=ZI18N.translate(body); }
    if(!("Notification" in window) || Notification.permission!=="granted"){ U.toast(title+" — "+body,"🔔"); return; }
    try{ new Notification(title,{ body, icon:"assets/icon.svg", badge:"assets/icon.svg" }); }
    catch{ U.toast(title,"🔔"); }
  }
  let notifTimers=[];
  function scheduleMealNotifs(){
    notifTimers.forEach(clearTimeout); notifTimers=[];
    if(!S.get().settings.notifications) return;
    const plan=S.activePlan(); if(!plan) return;
    const meals=S.dayMeals(plan,S.todayKey());
    const now=new Date();
    meals.forEach(m=>{
      const [h,mm]=m.time.split(":");
      const t=new Date(); t.setHours(+h,+mm,0,0);
      const delay=t-now;
      if(delay>0 && delay<24*3600*1000){
        notifTimers.push(setTimeout(()=> fireNotif(`⏰ ¡Toca ${m.slot}!`, `${m.emoji} ${m.name} · ${m.macros.kcal} kcal`), delay));
      }
    });
    // Avisos de descongelación a la hora exacta (mientras la app esté abierta)
    S.defrostAlerts().forEach(a=>{
      const delay = new Date(a.takeOutAt) - now;
      if(delay>0 && delay<26*3600*1000){
        notifTimers.push(setTimeout(()=> fireNotif(`🧊 Saca ${a.name} del congelador`, `${a.tip} (para tu ${a.meal})`), delay));
      }
    });
  }

  const MES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const DOW=["L","M","X","J","V","S","D"];
  const DOW_LONG=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

  /* =======================================================================
     BOOT
     ======================================================================= */
  function boot(){
    // splash mascota
    const sm=document.getElementById("splashMascot"); if(sm) sm.innerHTML=M.svg("happy");
    setTimeout(()=>{
      const sp=document.getElementById("splash");
      sp.classList.add("out");
      setTimeout(()=> sp.remove(), 500);
      render();
      if(S.get().settings.notifications) scheduleMealNotifs();
    }, 1100);
  }

  return { go, render, boot };
})();

document.addEventListener("DOMContentLoaded", ()=> window.ZAPP.boot());
