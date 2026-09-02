/* =========================================================
   ZANA · Estado persistente (localStorage)
   ========================================================= */
window.ZSTORE = (() => {
  const KEY = "zana.state.v1";
  const E = window.ZENGINE;

  const DEFAULT = {
    onboarded: false,
    profile: null,
    plans: [],
    activePlanId: null,
    progress: {},          // 'YYYY-MM-DD' -> { done:{key:true}, water:ml, ex:{i:true} }
    pantry: {},            // fid -> gramos disponibles
    shopping: null,        // { planId, weeks, checked:{fid:true}, generatedAt }
    expenses: [],          // { date, amount, note }
    frozen: {},            // id -> { name, emoji, aisle, frozen:bool, forDate }
    intolerances: [],      // { date, text, foods:[fid] }
    suppressed: [],        // fids que el usuario decidió suprimir
    products: {},          // fid -> { brand, price } preferencias del usuario
    pantryTouched: false,  // ¿el usuario ya nos dijo qué tiene?
    settings: {
      shoppingFreqWeeks: 1,
      notifications: false,
      aiProvider: "gemini", // local | gemini | groq  (gemini por defecto)
      aiKey: "",
      theme: "light",       // light | dark
      lang: "es",           // es | ca | en
    },
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULT);
      const guardado = JSON.parse(raw);
      // Object.assign usa [[Set]]: una clave __proto__ en el JSON cambiaria el
      // prototipo del estado. Se descarta antes de mezclar.
      if (guardado && typeof guardado === "object") delete guardado.__proto__;
      return Object.assign(structuredClone(DEFAULT), guardado);
    } catch { return structuredClone(DEFAULT); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

  function get() { return state; }
  function set(patch) { Object.assign(state, patch); save(); }

  // --- Fechas --------------------------------------------------------------
  function todayKey(d = new Date()) {
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  }

  // --- Planes --------------------------------------------------------------
  function createPlanFromProfile(profile, customName) {
    const gl = window.ZDATA.GOAL_LABELS[profile.goal];
    const t = E.targets(profile);
    const week = E.generateWeek(profile, t, { pantry: state.pantry });
    const plan = {
      id: "plan_" + Date.now(),
      goal: profile.goal,
      name: customName || gl.plan,
      emoji: gl.emoji,
      color: gl.bg,
      profile: structuredClone(profile),
      targets: t,
      week,
      createdAt: Date.now(),
    };
    state.plans.push(plan);
    state.activePlanId = plan.id;
    state.profile = structuredClone(profile);
    state.onboarded = true;
    save();
    return plan;
  }

  function activePlan() { return state.plans.find(p => p.id === state.activePlanId) || state.plans[0] || null; }
  function planById(id) { return state.plans.find(p => p.id === id) || null; }
  function setActivePlan(id) { state.activePlanId = id; save(); }
  function deletePlan(id) {
    state.plans = state.plans.filter(p => p.id !== id);
    if (state.activePlanId === id) state.activePlanId = state.plans[0]?.id || null;
    save();
  }
  function regeneratePlan(id) {
    const p = planById(id); if (!p) return;
    p.targets = E.targets(p.profile);
    p.week = E.generateWeek(p.profile, p.targets, { pantry: state.pantry });
    save();
  }

  // --- Menú de un día concreto (determinista por fecha) --------------------
  // Devuelve el array de comidas del plan activo para una fecha dada.
  function dayMeals(plan, dateKey) {
    if (!plan) return [];
    // índice de día estable: días desde createdAt
    const created = new Date(plan.createdAt); created.setHours(0,0,0,0);
    const d = new Date(dateKey); d.setHours(0,0,0,0);
    const idx = Math.floor((d - created) / 86400000);
    const day = plan.week[((idx % 7) + 7) % 7];
    return day || plan.week[0] || [];
  }

  // --- Progreso diario -----------------------------------------------------
  function dayProgress(dateKey) {
    if (!state.progress[dateKey]) state.progress[dateKey] = { done:{}, water:0 };
    return state.progress[dateKey];
  }
  function toggleMealDone(dateKey, mealKey, meal) {
    const dp = dayProgress(dateKey);
    dp.done[mealKey] = !dp.done[mealKey];
    // Al marcar como hecha, descuenta de la despensa
    if (meal) {
      const sign = dp.done[mealKey] ? -1 : +1;
      for (const [fid, g] of meal.ingredients) {
        state.pantry[fid] = Math.max(0, (state.pantry[fid]||0) + sign*g);
      }
    }
    save();
    return dp.done[mealKey];
  }
  function addWater(dateKey, ml) {
    const dp = dayProgress(dateKey);
    dp.water = Math.max(0, dp.water + ml);
    save();
    return dp.water;
  }

  // Consumo de macros del día según comidas marcadas
  function consumedMacros(plan, dateKey) {
    const meals = dayMeals(plan, dateKey);
    const dp = dayProgress(dateKey);
    let kcal=0,p=0,c=0,f=0;
    meals.forEach((m,i) => {
      if (dp.done["m"+i]) { kcal+=m.macros.kcal; p+=m.macros.p; c+=m.macros.c; f+=m.macros.f; }
    });
    return { kcal,p,c,f, water:dp.water };
  }

  // --- Despensa ------------------------------------------------------------
  function pantryList() {
    return Object.entries(state.pantry)
      .filter(([,g]) => g > 0)
      .map(([fid,g]) => ({ fid, grams:Math.round(g), ...window.ZDATA.FOODS[fid] }));
  }
  function addToPantryFromShopping() {
    // Al terminar la compra, lo comprado (checked) entra en despensa
    const s = state.shopping; if (!s) return;
    for (const it of (s.items||[])) {
      if (s.checked[it.fid]) state.pantry[it.fid] = (state.pantry[it.fid]||0) + it.grams;
    }
    save();
  }

  // --- Lista de la compra --------------------------------------------------
  function buildShopping(weeks) {
    const plan = activePlan(); if (!plan) return null;
    const w = weeks || state.settings.shoppingFreqWeeks || 1;
    const items = E.shoppingList(plan.week, { weeks:w, pantry: state.pantry });
    // aplica precios/marcas preferidos por el usuario
    items.forEach(it=>{
      const pr = state.products[it.fid];
      if(pr){
        if(pr.brand) it.brands = [pr.brand, ...(it.brands||[])];
        if(pr.price!=null){ it.price = window.ZENGINE.itemCost(it.fid, it.grams, pr.price); it.userPrice=true; }
      }
    });
    state.shopping = {
      planId: plan.id, weeks:w, items,
      checked: {}, generatedAt: Date.now(),
    };
    save();
    return state.shopping;
  }
  function toggleShopItem(fid) {
    if (!state.shopping) return;
    state.shopping.checked[fid] = !state.shopping.checked[fid];
    // sincroniza con despensa en tiempo real
    const it = state.shopping.items.find(i => i.fid === fid);
    if (it) {
      if (state.shopping.checked[fid]) state.pantry[fid] = (state.pantry[fid]||0) + it.grams;
      else state.pantry[fid] = Math.max(0, (state.pantry[fid]||0) - it.grams);
    }
    save();
  }

  // --- Gastos --------------------------------------------------------------
  function logMealExpense(dateKey, meal) {
    let amount = 0;
    for (const [fid,g] of meal.ingredients){
      const food = window.ZDATA.FOODS[fid];
      if (food && food.price) amount += food.price * g/1000;
    }
    state.expenses.push({ date:dateKey, amount:+amount.toFixed(2), note: meal.name });
    save();
  }
  function logExpense(amount, note) {
    state.expenses.push({ date: todayKey(), amount:+(+amount).toFixed(2), note: note||"Compra" });
    save();
  }
  // Registra como gasto lo que se ha marcado "en el carro" al cerrar la compra
  function logShoppingDone(){
    const s = state.shopping; if(!s) return 0;
    const bought = (s.items||[]).filter(it=> s.checked[it.fid]);
    const total = +bought.reduce((a,it)=>a+(it.price||0),0).toFixed(2);
    if(total>0) state.expenses.push({ date: todayKey(), amount: total, note:"Compra", type:"shop" });
    save();
    return total;
  }
  // Gasto por mes (últimos n meses) para las gráficas
  function expensesByMonth(n=12){
    const MON=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const out=[]; const now=new Date();
    for(let i=n-1;i>=0;i--){
      const d=new Date(now.getFullYear(), now.getMonth()-i, 1);
      const key=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
      const sum=state.expenses.filter(e=> (e.date||"").startsWith(key)).reduce((a,e)=>a+e.amount,0);
      out.push({ key, label:MON[d.getMonth()], year:d.getFullYear(), month:d.getMonth(), amount:+sum.toFixed(2) });
    }
    return out;
  }
  function spendTotals(){
    const now=new Date();
    const mKey=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0");
    const yKey=String(now.getFullYear());
    const month=state.expenses.filter(e=>(e.date||"").startsWith(mKey)).reduce((a,e)=>a+e.amount,0);
    const year=state.expenses.filter(e=>(e.date||"").startsWith(yKey)).reduce((a,e)=>a+e.amount,0);
    return { month:+month.toFixed(2), year:+year.toFixed(2) };
  }
  function expensesByWeek() {
    // agrupa por semana ISO relativa: devuelve últimos 7 días como columnas
    const days = [];
    for (let i=6; i>=0; i--){
      const d = new Date(); d.setDate(d.getDate()-i);
      const key = todayKey(d);
      const sum = state.expenses.filter(e => e.date===key).reduce((a,e)=>a+e.amount,0);
      days.push({ key, label:["D","L","M","X","J","V","S"][d.getDay()], amount:+sum.toFixed(2), future:false });
    }
    return days;
  }

  // --- Ejercicio -----------------------------------------------------------
  function exProgress(dateKey){
    const dp = dayProgress(dateKey);
    if (!dp.ex) dp.ex = {};
    return dp;
  }
  function dayExercises(plan, dateKey){
    if (!plan) return { name:"", items:[] };
    const kb = window.ZKB.EXERCISES[plan.goal] || window.ZKB.EXERCISES.mantener;
    const created = new Date(plan.createdAt); created.setHours(0,0,0,0);
    const d = new Date(dateKey); d.setHours(0,0,0,0);
    const idx = Math.floor((d-created)/86400000);
    // reparte los días de entreno a lo largo de la semana
    return kb.days[((idx % kb.days.length)+kb.days.length)%kb.days.length];
  }
  function toggleExerciseDone(dateKey, i){
    const dp = exProgress(dateKey);
    dp.ex[i] = !dp.ex[i];
    save();
    return dp.ex[i];
  }
  // ¿Cuántos días de ejercicio se han hecho esta semana? (para adaptar dieta)
  function exercisesThisWeek(){
    let n=0;
    for(let i=0;i<7;i++){ const d=new Date(); d.setDate(d.getDate()-i);
      const dp=state.progress[todayKey(d)];
      if(dp && dp.ex && Object.values(dp.ex).some(Boolean)) n++;
    }
    return n;
  }

  // --- Congelados / descongelación ----------------------------------------
  function toggleFrozen(id, meta){
    if(!state.frozen[id]) state.frozen[id] = Object.assign({ frozen:false }, meta||{});
    state.frozen[id].frozen = !state.frozen[id].frozen;
    save();
    return state.frozen[id].frozen;
  }
  function isFrozen(id){ return !!(state.frozen[id] && state.frozen[id].frozen); }
  // Avisos de descongelación: mira las comidas de mañana y qué hay congelado
  // Para cada alimento congelado, busca la PRÓXIMA comida que lo usa y calcula
  // a qué hora hay que sacarlo (hora de la comida − tiempo de descongelación).
  function defrostAlerts(){
    const plan = activePlan(); if(!plan) return [];
    const now = new Date();
    const upcoming = [];
    for(let off=0; off<=1; off++){
      const d = new Date(); d.setDate(d.getDate()+off);
      dayMeals(plan, todayKey(d)).forEach(m=>{
        const [h,mm]=m.time.split(":").map(Number);
        const at = new Date(d); at.setHours(h,mm,0,0);
        if(at > now) upcoming.push({ meal:m, at });
      });
    }
    upcoming.sort((a,b)=>a.at-b.at);
    const seen = new Set(); const alerts=[];
    for(const u of upcoming){
      for(const [fid] of u.meal.ingredients){
        if(seen.has(fid)) continue;
        if(isFrozen("food_"+fid)){
          seen.add(fid);
          const info = window.ZKB.defrostFor(fid);
          const takeOutAt = new Date(u.at.getTime() - (info.hours||8)*3600*1000);
          alerts.push({ fid, name:window.ZDATA.FOODS[fid].name, emoji:window.ZDATA.FOODS[fid].emoji,
            hours:info.hours, tip:info.tip, meal:u.meal.name, mealAt:u.at, takeOutAt });
        }
      }
    }
    return alerts;
  }

  // --- Intolerancias / incidencias ----------------------------------------
  function logIntolerance(text){
    const foods = detectFoods(text);
    state.intolerances.push({ date: todayKey(), text, foods });
    save();
  }
  const _na = s => (s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase();
  const FOOD_ALIASES = {
    pollo:["pollo","pechuga de pollo"], pavo:["pavo"], ternera:["ternera","carne picada","carne magra"],
    salmon:["salmon"], atun:["atun"], merluza:["merluza"], gambas:["gamba","gambas","langostino"],
    arroz:["arroz blanco","arroz "], arrozint:["arroz integral"], pasta:["pasta","macarron","espagueti","fideos"],
    avena:["avena","copos de avena"], pan:["pan"], patata:["patata","papa"], boniato:["boniato","batata"],
    lenteja:["lenteja"], garbanzo:["garbanzo"], brocoli:["brocoli"], espinaca:["espinaca"], tomate:["tomate"],
    pimiento:["pimiento"], cebolla:["cebolla"], zanahoria:["zanahoria"], aguacate:["aguacate"],
    platano:["platano","banana"], manzana:["manzana"], fresa:["fresa"], arandano:["arandano"],
    yogur:["yogur","yogurt"], leche:["leche"], quesofresco:["queso","queso fresco"],
    proteina:["proteina","whey","polvos de proteina","polvo de proteina","batido de proteina"],
    aceite:["aceite de oliva","aceite"], almendra:["almendra"], mantequillacacahuete:["cacahuete","crema de cacahuete","mantequilla de cacahuete"],
    miel:["miel"], tomatefrito:["tomate triturado","tomate frito","tomate frito"],
    lomo:["lomo","cerdo"], bacalao:["bacalao"], sardinas:["sardina"], tofu:["tofu"], tempeh:["tempeh"],
    edamame:["edamame"], sojatext:["soja texturizada","soja"], alubias:["alubia","judia blanca","judias blancas"],
    guisantes:["guisante"], bebidasoja:["bebida de soja","leche de soja"], bebidaavena:["bebida de avena","leche de avena"],
    requeson:["requeson"], quesocurado:["queso curado"], quinoa:["quinoa"], tortitasarroz:["tortitas de arroz","tortita de arroz"],
    nueces:["nuez","nueces"], aceitunas:["aceituna","oliva"], chia:["chia","semillas de chia"], chocolatenegro:["chocolate negro","chocolate"],
    calabacin:["calabacin"], berenjena:["berenjena"], champinon:["champiñon","champiñones","seta","setas"], lechuga:["lechuga"],
    pepino:["pepino"], judiaverde:["judia verde","judias verdes"], coliflor:["coliflor"], ajo:["ajo"],
    naranja:["naranja"], kiwi:["kiwi"], pera:["pera"], uvas:["uva","uvas"], pina:["piña","pina"], frambuesa:["frambuesa"],
    salsasoja:["salsa de soja","soja"], mostaza:["mostaza"], nata:["nata","crema para cocinar"], pesto:["pesto"],
    lechecoco:["leche de coco","coco"], tortillatrigo:["tortilla de trigo","tortillas de trigo","wrap","wraps","fajita"], curry:["curry"],
  };
  function detectFoods(text){
    const q = " " + _na(text) + " ";
    const hits=[];
    for(const [fid,aliases] of Object.entries(FOOD_ALIASES)){
      if(aliases.some(a => q.includes(_na(a)))) hits.push(fid);
    }
    return [...new Set(hits)];
  }
  // Analiza patrones: alimentos que aparecen en >=2 incidencias
  function analyzeIntolerances(){
    const count={};
    for(const it of state.intolerances) for(const fid of it.foods) count[fid]=(count[fid]||0)+1;
    return Object.entries(count).filter(([,n])=>n>=2)
      .sort((a,b)=>b[1]-a[1])
      .map(([fid,n])=>({ fid, n, name:window.ZDATA.FOODS[fid]?.name||fid, emoji:window.ZDATA.FOODS[fid]?.emoji||"⚠️" }));
  }
  function suppressFood(fid){
    if(!state.suppressed.includes(fid)) state.suppressed.push(fid);
    // añade a dislikes del perfil activo y regenera
    const p = activePlan();
    if(p){ p.profile.dislikes = [...new Set([...(p.profile.dislikes||[]), fid])]; regeneratePlan(p.id); }
    save();
  }

  // --- Productos/precios preferidos ---------------------------------------
  function setProduct(fid, brand, price){
    if(!fid) return;
    const cur = state.products[fid] || {};
    if(brand) cur.brand = brand;
    if(price!=null && !isNaN(price)) cur.price = price;
    state.products[fid] = cur;
    save();
  }
  function foodPrice(fid){ return (state.products[fid]?.price) ?? window.ZDATA.FOODS[fid]?.price ?? 0; }
  function foodBrands(fid){
    const b = state.products[fid]?.brand;
    if(b) return [b, ...(window.ZDATA.FOODS[fid]?.brands||[])];
    return window.ZDATA.FOODS[fid]?.brands || [];
  }

  // --- Despensa manual (desde el chat) ------------------------------------
  function addPantry(fid, grams){
    state.pantry[fid] = (state.pantry[fid]||0) + (grams||0);
    state.pantryTouched = true;
    save();
  }
  function pantryKnown(){ return state.pantryTouched || Object.keys(state.pantry).some(k=>state.pantry[k]>0); }
  function setDislike(fid, on){
    const p = activePlan(); if(!p) return;
    const set = new Set(p.profile.dislikes||[]);
    if(on) set.add(fid); else set.delete(fid);
    p.profile.dislikes = [...set];
    regeneratePlan(p.id);
    save();
  }
  function setMeals(n){
    const p = activePlan(); if(!p) return;
    p.profile.mealsPref = Math.max(2, Math.min(6, n));
    regeneratePlan(p.id);
    save();
  }

  function reset() { state = structuredClone(DEFAULT); save(); }

  return {
    get, set, save, todayKey,
    createPlanFromProfile, activePlan, planById, setActivePlan, deletePlan, regeneratePlan,
    dayMeals, dayProgress, toggleMealDone, addWater, consumedMacros,
    pantryList, addToPantryFromShopping,
    buildShopping, toggleShopItem,
    logExpense, expensesByWeek, logShoppingDone, expensesByMonth, spendTotals,
    dayExercises, exProgress, toggleExerciseDone, exercisesThisWeek,
    toggleFrozen, isFrozen, defrostAlerts,
    logIntolerance, analyzeIntolerances, suppressFood,
    addPantry, pantryKnown, setDislike, setMeals, detectFoods,
    setProduct, foodPrice, foodBrands,
    reset,
  };
})();
