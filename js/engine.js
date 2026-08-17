/* =========================================================
   ZANA · Motor nutricional (offline, sin claves)
   Mifflin-St Jeor + factores de actividad + reparto de macros
   ========================================================= */
window.ZENGINE = (() => {
  const D = window.ZDATA;

  const ACTIVITY = {
    sedentario: 1.2, ligero: 1.375, moderado: 1.55, alto: 1.725, atleta: 1.9,
  };
  const ACTIVITY_LABELS = {
    sedentario:"Sedentario (poco o nada de ejercicio)",
    ligero:"Ligero (1-2 días/semana)",
    moderado:"Moderado (3-4 días/semana)",
    alto:"Alto (5-6 días/semana)",
    atleta:"Muy alto (2x día / trabajo físico)",
  };

  // --- Metabolismo basal (Mifflin-St Jeor) ---------------------------------
  function bmr({ sex, weight, height, age }) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return Math.round(sex === "mujer" ? base - 161 : base + 5);
  }

  // --- Gasto total + objetivo calórico -------------------------------------
  function targets(profile) {
    const b = bmr(profile);
    // Tipo de cuerpo (somatotipo): ajusta NEAT y el superávit/déficit.
    // Ectomorfo (delgado/hardgainer) gasta más y necesita más superávit;
    // endomorfo (tiende a engordar) al revés.
    const somato = profile.bodyType || "meso";
    const neat = { ecto:1.05, meso:1.0, endo:0.95 }[somato] || 1.0;
    const tdee = Math.round(b * (ACTIVITY[profile.activity] || 1.375) * neat);
    const surplus = { ecto:0.22, meso:0.15, endo:0.10 }[somato] || 0.15;
    const cutdef  = { ecto:0.12, meso:0.20, endo:0.22 }[somato] || 0.20;
    const adj = { masa: surplus, definir: -cutdef, mantener:0, recomp:-0.05 };
    let kcal = Math.round(tdee * (1 + (adj[profile.goal] ?? 0)));

    // Proteína por kg de peso según objetivo
    const pPerKg = { masa:2.0, definir:2.2, mantener:1.6, recomp:2.2 }[profile.goal] ?? 1.8;
    const protein = Math.round(pPerKg * profile.weight);
    // Grasa 25% de las kcal
    const fat = Math.round((kcal * 0.25) / 9);
    // Resto a carbohidratos
    const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
    // Hidratación (ml): 35 ml/kg + extra por actividad
    const waterBonus = { sedentario:0, ligero:250, moderado:500, alto:750, atleta:1000 }[profile.activity] ?? 250;
    const water = Math.round(profile.weight * 35 + waterBonus);

    return { bmr:b, tdee, kcal, protein, carbs, fat, water };
  }

  // --- Nº de comidas recomendado (sugerencia de la IA) ---------------------
  // Tiene en cuenta objetivo y apetito/saciedad del usuario.
  function suggestedMeals(profile){
    let n = profile.goal==="masa" ? 5 : 4;
    if (profile.appetite==="poco") n += 1;   // se sacia rápido -> más tomas pequeñas
    if (profile.appetite==="mucho") n -= 1;  // aguanta bien -> menos tomas grandes
    return Math.max(3, Math.min(6, n));
  }
  function mealsPerDay(profile) {
    if (profile.mealsPref) return Math.max(2, Math.min(6, profile.mealsPref));
    return suggestedMeals(profile);
  }

  // Estructura de slots según nº de comidas
  function slotPlan(n) {
    const map = {
      2: [["comida","14:00"],["cena","21:00"]],
      3: [["desayuno","08:00"],["comida","14:00"],["cena","21:00"]],
      4: [["desayuno","08:00"],["comida","14:00"],["snack","18:00"],["cena","21:00"]],
      5: [["desayuno","08:00"],["snack","11:00"],["comida","14:00"],["snack","18:00"],["cena","21:00"]],
      6: [["desayuno","07:30"],["snack","10:30"],["comida","13:30"],["snack","17:00"],["cena","20:30"],["snack","22:30"]],
    };
    return map[n] || map[4];
  }

  // --- Macros de una receta (según ingredientes) ---------------------------
  function recipeMacros(recipe) {
    let kcal=0,p=0,c=0,f=0;
    for (const [fid, grams] of recipe.ingredients) {
      const food = D.FOODS[fid]; if (!food) continue;
      const k = grams / 100;
      kcal += food.per100.kcal*k; p += food.per100.p*k; c += food.per100.c*k; f += food.per100.f*k;
    }
    const s = recipe.servings || 1;
    return { kcal:Math.round(kcal/s), p:Math.round(p/s), c:Math.round(c/s), f:Math.round(f/s) };
  }

  // --- Escala una receta a un objetivo de kcal para ese slot ---------------
  function scaleRecipe(recipe, targetKcal) {
    const base = recipeMacros(recipe);
    let factor = targetKcal / (base.kcal || targetKcal);
    factor = Math.max(0.6, Math.min(1.6, factor)); // límites sensatos
    const ing = recipe.ingredients.map(([fid,g]) => [fid, Math.round(g*factor)]);
    const scaled = { kcal:Math.round(base.kcal*factor), p:Math.round(base.p*factor), c:Math.round(base.c*factor), f:Math.round(base.f*factor) };
    return { ingredients:ing, macros:scaled, factor:+factor.toFixed(2) };
  }

  // Reparto de kcal por slot (% del total diario)
  const SLOT_SHARE = { desayuno:0.25, comida:0.35, cena:0.28, snack:0.12 };

  // Fracción de ingredientes (por gramos) disponibles en la despensa (0..1)
  function availability(recipe, pantry){
    if (!pantry) return 1;
    let need=0, have=0;
    for (const [fid,g] of recipe.ingredients){ need+=g; have+=Math.min(g, pantry[fid]||0); }
    return need? have/need : 1;
  }
  // Candidatos válidos para un slot según objetivo/dieta/gustos
  function poolFor(slot, profile){
    const dislikes = new Set((profile.dislikes||[]));
    const diet = profile.diet || "todo";
    let pool = D.RECIPES.filter(r =>
      r.slot===slot && r.goals.includes(profile.goal) && dietOk(r,diet) &&
      !r.ingredients.some(([fid]) => dislikes.has(fid)));
    if (!pool.length) pool = D.RECIPES.filter(r => r.slot===slot && dietOk(r,diet) && !r.ingredients.some(([fid])=>dislikes.has(fid)));
    if (!pool.length) pool = D.RECIPES.filter(r => r.slot===slot);
    return pool;
  }

  // --- Genera el menú de un día --------------------------------------------
  // opts.pantry: si se pasa, prioriza recetas con ingredientes disponibles.
  function generateDay(profile, t, seed=0, opts={}) {
    const n = mealsPerDay(profile);
    const slots = slotPlan(n);
    const rawShares = slots.map(([slot]) => SLOT_SHARE[slot] || 0.15);
    const sum = rawShares.reduce((a,b)=>a+b,0);
    // Solo consideramos la despensa si realmente tiene alimentos.
    const pantry = (opts.pantry && Object.keys(opts.pantry).some(k=>opts.pantry[k]>0)) ? opts.pantry : null;

    const meals = slots.map(([slot, time], i) => {
      const targetKcal = Math.round(t.kcal * (rawShares[i]/sum));
      const pool = poolFor(slot, profile);
      let pick;
      if (pantry){
        // prioriza recetas cuyos ingredientes ya tienes; a igualdad, rota por día
        const scored = pool.map((r,idx)=>({ r, av:availability(r,pantry), idx }))
          .sort((a,b)=> b.av-a.av || (idxRot(a.idx,seed,i,pool.length) - idxRot(b.idx,seed,i,pool.length)));
        pick = scored[0].av>0 ? scored[0].r : pool[idxRot(0,seed,i,pool.length)];
      } else {
        // variedad: cada día y slot rota por el pool
        pick = pool[idxRot(0,seed,i,pool.length)] || pool[0];
      }
      const sc = scaleRecipe(pick, targetKcal);
      return { slot, time, recipeId: pick.id, name: pick.name, emoji: pick.emoji, grad: pick.grad,
               ingredients: sc.ingredients, macros: sc.macros, factor: sc.factor };
    });
    return meals;
  }
  // Índice rotado para variedad entre días/slots
  function idxRot(base, seed, slotIdx, len){ if(!len) return 0; return (base + seed*2 + slotIdx*5 + seed*slotIdx) % len; }

  // Alternativa para un slot con lo que SÍ hay en la despensa (con lógica de slot)
  function altRecipe(slot, profile, pantry, targetKcal, avoidId){
    const pool = poolFor(slot, profile).filter(r=>r.id!==avoidId);
    if(!pool.length) return null;
    const scored = pool.map(r=>({ r, av:availability(r,pantry) })).sort((a,b)=>b.av-a.av);
    const best = scored[0];
    if(!best || best.av<=0) return null;
    const sc = scaleRecipe(best.r, targetKcal||scaleRecipe(best.r, recipeMacros(best.r).kcal).macros.kcal);
    return { recipeId:best.r.id, name:best.r.name, emoji:best.r.emoji, grad:best.r.grad, slot,
             ingredients:sc.ingredients, macros:sc.macros, availability:best.av };
  }
  // Ingredientes que faltan de una comida concreta según despensa
  function missingIngredients(meal, pantry){
    if(!pantry) return [];
    return meal.ingredients.filter(([fid,g]) => (pantry[fid]||0) < g*0.5)
      .map(([fid,g]) => ({ fid, name:D.FOODS[fid].name, emoji:D.FOODS[fid].emoji }));
  }

  function dietOk(recipe, diet) {
    if (diet === "todo") return true;
    const meats = new Set(["pollo","pavo","ternera","lomo","salmon","atun","merluza","gambas","bacalao","sardinas"]);
    const fish = new Set(["salmon","atun","merluza","gambas","bacalao","sardinas"]);
    const animal = new Set([...meats,"huevo","yogur","leche","quesofresco","proteina","miel","requeson","quesocurado","nata","pesto"]);
    const ids = recipe.ingredients.map(([f])=>f);
    if (diet === "vegetariano") return !ids.some(i => meats.has(i));
    if (diet === "vegano") return !ids.some(i => animal.has(i));
    if (diet === "pescetariano") return !ids.some(i => (meats.has(i) && !fish.has(i)));
    return true;
  }

  // --- Genera el plan semanal (7 días) -------------------------------------
  function generateWeek(profile, t, opts={}) {
    const days = [];
    for (let d=0; d<7; d++) days.push(generateDay(profile, t, d, opts));
    return days;
  }

  // --- Agrega la lista de la compra a partir de N días de menú -------------
  // weekDays: array de días (cada uno array de meals). doneMap opcional para descontar despensa.
  function shoppingList(weekDays, opts={}) {
    const weeks = opts.weeks || 1;
    const totals = {}; // fid -> grams
    for (let w=0; w<weeks; w++){
      for (const day of weekDays) {
        for (const meal of day) {
          for (const [fid, g] of meal.ingredients) {
            totals[fid] = (totals[fid]||0) + g;
          }
        }
      }
    }
    // Descontar lo que ya hay en despensa
    const pantry = opts.pantry || {};
    const items = Object.entries(totals).map(([fid, grams]) => {
      const food = D.FOODS[fid];
      const have = pantry[fid] || 0;
      const need = Math.max(0, grams - have);
      const price = itemCost(fid, need);
      return {
        fid, name:food.name, emoji:food.emoji, aisle:food.aisle,
        grams:need, totalGrams:grams, price,
        brands:food.brands||[], unit:food.unit, gPerUnit:food.gPerUnit,
      };
    }).filter(it => it.grams > 0);
    return items;
  }

  // Coste estimado de la lista
  function listCost(items){ return +items.reduce((a,it)=>a+it.price,0).toFixed(2); }

  // --- Coste diario del menú (para la sección Gastos) ----------------------
  function dayCost(day){
    let c=0;
    for (const meal of day) for (const [fid,g] of meal.ingredients){
      const food=D.FOODS[fid]; if(food&&food.price) c += food.price*g/1000;
    }
    return +c.toFixed(2);
  }

  // Cantidad de compra realista: packs / unidades contables / peso
  function plural(name, n){
    if(n===1) return name;
    if(/z$/.test(name)) return name.slice(0,-1)+"ces"; // (por si acaso)
    return name + "s";
  }
  function buyQty(fid, grams){
    const b = D.BUY[fid];
    const wt = () => grams>=1000 ? `${(grams/1000).toFixed(grams%1000?1:0)} kg` : `${Math.round(grams)} g`;
    if(!b) return wt();
    if(b.type==="count"){
      let n = Math.max(1, Math.round(grams/b.avg));
      if(b.packOf) n = Math.ceil(n/b.packOf)*b.packOf;
      return `${n} ${plural(b.name, n)}`;
    }
    if(b.type==="pack"){
      const packs = Math.max(1, Math.ceil(grams/b.g));
      return `${packs} ${plural(b.name, packs)}`;
    }
    return wt();
  }

  // Gramos que realmente compras (redondeado a packs/unidades enteras)
  function purchasedGrams(fid, grams){
    const b = D.BUY[fid];
    if(!b) return grams;
    if(b.type==="count"){ let n=Math.max(1,Math.round(grams/b.avg)); if(b.packOf) n=Math.ceil(n/b.packOf)*b.packOf; return n*b.avg; }
    if(b.type==="pack"){ const packs=Math.max(1,Math.ceil(grams/b.g)); return packs*b.g; }
    return grams;
  }
  // Coste realista: se paga por el pack/unidad entero, no por gramos sueltos
  function itemCost(fid, grams, priceOverride){
    const f = D.FOODS[fid]; const price = priceOverride ?? (f && f.price);
    if(!price) return 0;
    return +((purchasedGrams(fid, grams)/1000) * price).toFixed(2);
  }

  // Formatea gramos a algo legible (g o unidades)
  function fmtQty(item){
    if (item.gPerUnit){
      const u = Math.round(item.grams/item.gPerUnit);
      const uname = item.unit==="ud" ? (u===1?"ud":"uds") : item.unit;
      return `${u} ${uname}`;
    }
    if (item.grams>=1000) return `${(item.grams/1000).toFixed(item.grams%1000?1:0)} kg`;
    return `${item.grams} g`;
  }

  // --- Cocción precisa: agua, tiempos y uso de congelados ------------------
  // meal: comida escalada; frozen: Set de fids congelados disponibles.
  function cookingTips(meal, frozen){
    frozen = frozen || new Set();
    const g = fid => { const it = meal.ingredients.find(x=>x[0]===fid); return it? it[1] : 0; };
    const has = fid => g(fid) > 0;
    const tips = [];
    const L = ml => (ml/1000).toFixed(ml%1000?1:0);

    if (has("arroz")){
      const q=g("arroz"), w=Math.round(q*2.3), cocido=Math.round(q*3);
      tips.push(frozen.has("food_arroz")
        ? `🍚 Arroz: usa el que tienes **congelado** (sácalo la noche antes a la nevera). Caliéntalo 2 min con unas gotas de agua.`
        : `🍚 Arroz: pesa **${q} g en crudo** (quedarán **~${cocido} g ya cocidos** 🍚). Calienta **${w} ml de agua** con sal; cuando **hierva**, echa el arroz y cuece **12-14 min**. Escurre.`);
    }
    if (has("arrozint")){
      const q=g("arrozint"), w=Math.round(q*2.6), cocido=Math.round(q*2.7);
      tips.push(`🍚 Arroz integral: pesa **${q} g en crudo** (~${cocido} g cocidos). **${w} ml de agua** con sal; al hervir cuece **30-35 min**.`);
    }
    if (has("pasta")){
      const q=g("pasta"), w=Math.max(1000, q*10), cocido=Math.round(q*2.3);
      tips.push(`🍝 Pasta: pesa **${q} g en crudo** (~${cocido} g cocidos). Hierve **${L(w)} L de agua** con sal; echa la pasta y cuece **9-11 min** (al dente). Escurre.`);
    }
    if (has("patata")){ tips.push(`🥔 Patata: cuece **${g("patata")} g** en dados **12-15 min** desde que hierva (pincha para comprobar).`); }
    if (has("boniato")){ tips.push(`🍠 Boniato: cuece **${g("boniato")} g** en dados en el micro tapado **6-7 min** (o en cazo 15 min).`); }
    if (has("huevo")){ const u=Math.round(g("huevo")/60); tips.push(`🥚 Huevos: ${u} ud — duros **10 min** desde que hierva, o a la plancha **3-4 min**.`); }
    if (has("lenteja")||has("garbanzo")){ tips.push(`🫘 Legumbre: de bote, escurre y calienta **5 min**. Seca, cuece **20-25 min** (con remojo previo).`); }
    ["pollo","pavo","ternera"].forEach(fid=>{ if(has(fid)){ const n=D.FOODS[fid].name.toLowerCase();
      tips.push(frozen.has("food_"+fid)
        ? `🍗 ${D.FOODS[fid].name}: usa el que tienes **descongelado**; a la plancha **3-4 min por lado** (hasta que no quede rosa).`
        : `🍗 ${D.FOODS[fid].name}: **${g(fid)} g** a la plancha **3-4 min por lado** (hasta que no quede rosa).`);
    }});
    ["salmon","merluza","bacalao"].forEach(fid=>{ if(has(fid)){ tips.push(`🐟 ${D.FOODS[fid].name}: a la plancha **3-4 min por lado** (o al micro tapado 2-3 min).`); }});
    if (has("brocoli")){ tips.push(`🥦 Brócoli: al vapor **6-7 min** (al dente, verde vivo).`); }
    if (has("espinaca")){ tips.push(`🥬 Espinacas: saltea **2 min** hasta que bajen.`); }
    return tips;
  }

  return {
    ACTIVITY, ACTIVITY_LABELS, bmr, targets, mealsPerDay, suggestedMeals, slotPlan, cookingTips,
    recipeMacros, scaleRecipe, generateDay, generateWeek, buyQty, purchasedGrams, itemCost,
    availability, altRecipe, missingIngredients, poolFor,
    shoppingList, listCost, dayCost, fmtQty, dietOk,
  };
})();
