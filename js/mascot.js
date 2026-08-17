/* =========================================================
   ZANA · La mascota zanahoria (IA)
   - SVG reutilizable
   - Asistente local por reglas (offline, gratis)
   - Conexión opcional a API gratis (Gemini / Groq)
   ========================================================= */
window.ZMASCOT = (() => {
  const S = window.ZSTORE;

  // SVG de la zanahoria (ojos divertidos + mordisco). size opcional.
  function svg(mood="happy") {
    const mouth = mood==="think" ? 'M-14 -22 Q6 -30 26 -22' : 'M-16 -28 Q4 -8 28 -26';
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden="true">
      <g transform="translate(100 104) rotate(14)">
        <g fill="#2FBF71">
          <path d="M-6 -78 C-16 -108 -36 -114 -46 -108 C-38 -94 -22 -84 -6 -80 Z"/>
          <path d="M2 -82 C0 -116 14 -134 26 -134 C28 -114 18 -94 4 -82 Z"/>
          <path d="M8 -80 C24 -106 44 -110 52 -104 C42 -90 24 -80 8 -78 Z"/>
        </g>
        <path d="M-40 -66 C-16 -84 24 -84 44 -64 C32 12 12 84 2 98 C-8 84 -30 6 -40 -66 Z" fill="#FF7A1A"/>
        <path d="M44 -64 C33 -56 25 -46 33 -34 C42 -42 48 -54 44 -64 Z" fill="#FFF8F0"/>
        <g stroke="#E8570F" stroke-width="3" stroke-linecap="round" opacity="0.5">
          <line x1="-22" y1="-38" x2="-13" y2="-34"/><line x1="17" y1="-22" x2="26" y2="-26"/>
          <line x1="-16" y1="12" x2="-7" y2="16"/>
        </g>
        <g>
          <!-- gafas de sol -->
          <rect x="-29" y="-51" width="27" height="20" rx="9" fill="#221A14"/>
          <rect x="2" y="-49" width="27" height="20" rx="9" fill="#221A14"/>
          <path d="M-2 -44 q4 -3 4 -3" stroke="#221A14" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M-40 -44 l11 -3 M29 -42 l10 -2" stroke="#221A14" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M-25 -47 l7 6" stroke="#7FD1FF" stroke-width="3" stroke-linecap="round" opacity=".85"/>
          <path d="M6 -45 l7 6" stroke="#7FD1FF" stroke-width="3" stroke-linecap="round" opacity=".85"/>
        </g>
        <path d="${mouth}" fill="none" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/>
        <circle cx="-24" cy="-20" r="6" fill="#FF5A6E" opacity="0.5"/>
        <circle cx="26" cy="-16" r="6" fill="#FF5A6E" opacity="0.5"/>
      </g>
    </svg>`;
  }

  // --- Asistente LOCAL por reglas -----------------------------------------
  const noAccent = s => (s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase();
  const L = (es,ca,en) => window.ZL ? window.ZL(es,ca,en) : es;
  function localReply(text) {
    const q = noAccent(text);
    const plan = S.activePlan();
    const t = plan?.targets;
    const name = plan?.profile?.name;
    const nm = name?` ${name}`:"";
    const has = (...w) => w.some(k => q.includes(noAccent(k)));

    // ¿Puedo comer X? / ¿es bueno X? / ¿X engorda? -> consejo sobre ese alimento
    const detected = S.detectFoods(text);
    if (detected.length && /puedo|es bueno|es sano|es saludable|engorda|adelgaza|me conviene|deberia|tomar|comer|\?/.test(q) && !has("hoy","toca")){
      return foodAdvice(window.ZDATA.FOODS[detected[0]], plan?.goal);
    }

    if (has("hola","buenas","hey","saludos","bon dia","bona","hi","hello"))
      return L(`¡Hola${nm}! 🥕 Soy Zana. Puedo ayudarte con tus calorías, macros, recetas, la compra o el ejercicio. ¿Qué necesitas?`,
               `Hola${nm}! 🥕 Soc la Zana. Et puc ajudar amb les calories, macros, receptes, la compra o l'exercici. Què necessites?`,
               `Hi${nm}! 🥕 I'm Zana. I can help with your calories, macros, recipes, shopping or exercise. What do you need?`);

    if (has("caloria","kcal","cuanto como","cuantas calor","how many cal","quantes calor") && t)
      return L(`Tu objetivo diario es de **${t.kcal} kcal** 🔥\n\nSe reparte en:\n• Proteína: ${t.protein} g\n• Carbohidratos: ${t.carbs} g\n• Grasas: ${t.fat} g\n\nY unos ${(t.water/1000).toFixed(1)} L de agua 💧`,
               `El teu objectiu diari és de **${t.kcal} kcal** 🔥\n\nEs reparteix en:\n• Proteïna: ${t.protein} g\n• Carbohidrats: ${t.carbs} g\n• Greixos: ${t.fat} g\n\nI uns ${(t.water/1000).toFixed(1)} L d'aigua 💧`,
               `Your daily target is **${t.kcal} kcal** 🔥\n\nSplit into:\n• Protein: ${t.protein} g\n• Carbs: ${t.carbs} g\n• Fats: ${t.fat} g\n\nAnd about ${(t.water/1000).toFixed(1)} L of water 💧`);

    if (has("proteina","protein") && t){
      const per = Math.round(t.protein/(plan.week[0].length||4));
      return L(`Necesitas **${t.protein} g de proteína al día** 💪. Reparte ~${per} g por comida. Fuentes top: pollo, pavo, huevos, atún, yogur griego y proteína en polvo.`,
               `Necessites **${t.protein} g de proteïna al dia** 💪. Reparteix ~${per} g per àpat. Fonts top: pollastre, gall dindi, ous, tonyina, iogurt grec i proteïna en pols.`,
               `You need **${t.protein} g of protein a day** 💪. Spread ~${per} g per meal. Top sources: chicken, turkey, eggs, tuna, Greek yogurt and protein powder.`);
    }

    if (has("agua","hidrat","water","aigua") && t){
      const times = Math.round(t.water/1000);
      return L(`Tu meta de hidratación es **${(t.water/1000).toFixed(1)} L al día** 💧. Truco: una botella de 1 L y rellénala ${times} veces. Toca 💧 en la barra inferior para ir sumando.`,
               `El teu objectiu d'hidratació és **${(t.water/1000).toFixed(1)} L al dia** 💧. Truc: una ampolla d'1 L i omple-la ${times} vegades. Toca 💧 a la barra inferior per sumar.`,
               `Your hydration goal is **${(t.water/1000).toFixed(1)} L a day** 💧. Tip: a 1 L bottle refilled ${times} times. Tap 💧 on the bottom bar to add water.`);
    }

    if (has("adelgaz","perder","definir","bajar peso","lose fat","aprimar","perdre"))
      return L(`Para perder grasa manteniendo músculo: déficit moderado, proteína alta y fuerza 3-4 días. Crea un plan con objetivo **Perder grasa** y te calculo todo.`,
               `Per perdre greix mantenint múscul: dèficit moderat, proteïna alta i força 3-4 dies. Crea un pla amb objectiu **Perdre greix** i t'ho calculo tot.`,
               `To lose fat while keeping muscle: moderate deficit, high protein and strength 3-4 days. Create a **Lose fat** plan and I'll calculate everything.`);

    if (has("masa","musculo","ganar","volumen","hipercalor","build muscle","guanyar"))
      return L(`Para ganar músculo: ligero superávit calórico, ~2 g de proteína/kg y sobrecarga progresiva 💪. Crea un plan **Ganar masa** y te monto el menú y la rutina.`,
               `Per guanyar múscul: lleuger superàvit calòric, ~2 g de proteïna/kg i sobrecàrrega progressiva 💪. Crea un pla **Guanyar massa** i et munto el menú i la rutina.`,
               `To build muscle: slight calorie surplus, ~2 g protein/kg and progressive overload 💪. Create a **Build muscle** plan and I'll set up the menu and routine.`);

    if (has("receta","cocinar","plato","comer hoy","que como","what to eat","recepta","cuinar")) {
      const meals = plan ? S.dayMeals(plan, S.todayKey()) : [];
      if (meals.length){
        const list = meals.map(m=>`• ${m.time} · ${m.emoji} ${m.name} (${m.macros.kcal} kcal)`).join("\n");
        return L(`Hoy te toca:\n${list}\n\nEntra en **Recetas** para ver el paso a paso 👩‍🍳`,
                 `Avui et toca:\n${list}\n\nEntra a **Receptes** per veure el pas a pas 👩‍🍳`,
                 `Today you have:\n${list}\n\nOpen **Recipes** for the step-by-step 👩‍🍳`);
      }
      return L(`Entra en un plan y luego en **Recetas** para ver qué cocinar.`,`Entra en un pla i després a **Receptes** per veure què cuinar.`,`Open a plan and then **Recipes** to see what to cook.`);
    }

    if (has("compra","super","lista","shopping","shop","llista"))
      return L(`En **Súper** te genero la lista con los gramos exactos y marcas recomendadas. Elige comprar cada 1, 2, 3 semanas o al mes, y marca productos en el súper. Lo que marcas entra en tu despensa 🛒`,
               `A **Súper** et genero la llista amb els grams exactes i marques recomanades. Tria comprar cada 1, 2, 3 setmanes o al mes, i marca productes al súper. El que marques va al teu rebost 🛒`,
               `In **Shop** I build your list with exact grams and suggested brands. Choose to buy every 1, 2, 3 weeks or monthly, and tick items at the store. What you tick goes to your pantry 🛒`);

    if (has("gasto","dinero","presupuesto","cuesta","precio","expense","money","despesa","diner"))
      return L(`En **Gastos** llevo la cuenta de lo que gastas en comida y hago una previsión semanal según tu plan. Marca tus comidas como hechas y voy sumando 💶`,
               `A **Despeses** porto el compte del que gastes en menjar i faig una previsió setmanal segons el teu pla. Marca els àpats com a fets i vaig sumant 💶`,
               `In **Expenses** I track your food spending and forecast it weekly from your plan. Mark meals as done and I'll add it up 💶`);

    if (has("gym","gimnasio","ejercicio","entren","rutina","workout","exercise","exercici"))
      return L(`En **Ejercicio** tienes una rutina de hoy para casa/calle, con series, reps y el botón "¿Cómo lo hago?" 🏋️. ¡Sé constante y adaptaré tu dieta a lo que entrenes!`,
               `A **Exercici** tens una rutina d'avui per a casa/carrer, amb sèries, reps i el botó "Com ho faig?" 🏋️. Sigues constant i adaptaré la teva dieta al que entrenis!`,
               `In **Exercise** you have today's home/outdoor routine, with sets, reps and the "How do I do it?" button 🏋️. Be consistent and I'll adapt your diet to your training!`);

    if (has("consejo","dieta","como mejorar","truco","recomienda","que hago","advice","tip","consell") && plan){
      const kb = window.ZKB.KNOWLEDGE[plan.goal];
      if (kb) return L(`Para **${kb.titulo.toLowerCase()}** 👇\n\n• ${kb.energia}\n• Proteína: ${kb.proteina}\n\nClaves:\n${kb.claves.slice(0,3).map(c=>"• "+c).join("\n")}`,
                       `Per **${kb.titulo.toLowerCase()}** 👇\n\n• ${kb.energia}\n• Proteïna: ${kb.proteina}\n\nClaus:\n${kb.claves.slice(0,3).map(c=>"• "+c).join("\n")}`,
                       `For **${kb.titulo.toLowerCase()}** 👇\n\n• ${kb.energia}\n• Protein: ${kb.proteina}\n\nKeys:\n${kb.claves.slice(0,3).map(c=>"• "+c).join("\n")}`);
    }

    if (has("gracias","genial","perfecto","thanks","gracies","gràcies"))
      return L(`¡A por ello! 🥕 Estoy aquí siempre que me necesites. Tú constancia, yo los números 😉`,
               `A per totes! 🥕 Soc aquí sempre que em necessitis. Tu constància, jo els números 😉`,
               `Go for it! 🥕 I'm here whenever you need me. You bring consistency, I bring the numbers 😉`);

    if (t)
      return L(`Te leo 👀. Tu plan es **${plan.name}** (${t.kcal} kcal/día). Puedo ayudarte con: calorías, proteína, agua, recetas de hoy, la compra, gastos o el ejercicio. ¿De qué hablamos?`,
               `Et llegeixo 👀. El teu pla és **${plan.name}** (${t.kcal} kcal/dia). Et puc ajudar amb: calories, proteïna, aigua, receptes d'avui, la compra, despeses o l'exercici. De què parlem?`,
               `I'm listening 👀. Your plan is **${plan.name}** (${t.kcal} kcal/day). I can help with: calories, protein, water, today's recipes, shopping, expenses or exercise. What shall we talk about?`);
    return L(`¡Hola! 🥕 Aún no tienes un plan. Cuéntame tu objetivo (perder grasa, ganar músculo, mantenerte...) y te preparo uno personalizado.`,
             `Hola! 🥕 Encara no tens cap pla. Explica'm el teu objectiu (perdre greix, guanyar múscul, mantenir-te...) i te'n preparo un de personalitzat.`,
             `Hi! 🥕 You don't have a plan yet. Tell me your goal (lose fat, build muscle, maintain...) and I'll make you a personal one.`);
  }

  // --- Comandos: el usuario cambia la app hablando con Zana -----------------
  // Devuelve un texto de confirmación si detecta una orden, o null.
  // Consejo real sobre un alimento según sus macros y el objetivo del usuario
  function foodAdvice(f, goal){
    if(!f) return localReply("");
    const {kcal,p,c,f:fat} = f.per100;
    const hiP = p>=15, hiC = c>=40, hiF = fat>=20, light = kcal<=60;
    const n = f.name.toLowerCase();
    // Frase base según macro dominante
    let tipEs, tipCa, tipEn;
    if (hiP){ tipEs=`es una gran fuente de **proteína** (${p} g/100 g), ideal para tus músculos`; tipCa=`és una gran font de **proteïna** (${p} g/100 g), ideal per als teus músculs`; tipEn=`is a great **protein** source (${p} g/100 g), ideal for your muscles`; }
    else if (hiC){ tipEs=`aporta **carbohidratos** (${c} g/100 g): energía para entrenar`; tipCa=`aporta **carbohidrats** (${c} g/100 g): energia per entrenar`; tipEn=`provides **carbs** (${c} g/100 g): energy to train`; }
    else if (hiF){ tipEs=`es rico en **grasas** (${fat} g/100 g); con moderación aporta energía y saciedad`; tipCa=`és ric en **greixos** (${fat} g/100 g); amb moderació aporta energia i sacietat`; tipEn=`is high in **fats** (${fat} g/100 g); in moderation it gives energy and satiety`; }
    else if (light){ tipEs=`es **ligero** (${kcal} kcal/100 g) y saciante, perfecto para el volumen del plato`; tipCa=`és **lleuger** (${kcal} kcal/100 g) i saciant, perfecte per al volum del plat`; tipEn=`is **light** (${kcal} kcal/100 g) and filling, perfect for plate volume`; }
    else { tipEs=`aporta ${kcal} kcal/100 g de forma equilibrada`; tipCa=`aporta ${kcal} kcal/100 g de manera equilibrada`; tipEn=`gives ${kcal} kcal/100 g in a balanced way`; }
    // Matiz según objetivo
    let goalEs="", goalCa="", goalEn="";
    if (goal==="masa"){ goalEs=hiC||kcal>=180?" 👍 Perfecto para **ganar masa**.":" Suma otras tomas energéticas para llegar a tus calorías."; goalCa=hiC||kcal>=180?" 👍 Perfecte per **guanyar massa**.":" Suma altres àpats energètics per arribar a les calories."; goalEn=hiC||kcal>=180?" 👍 Perfect for **gaining mass**.":" Add other energy-dense foods to hit your calories."; }
    else if (goal==="definir"){ goalEs=light||hiP?" 👍 Encaja muy bien en **definición**.":" 👌 En **definición**, controla la ración."; goalCa=light||hiP?" 👍 Encaixa molt bé en **definició**.":" 👌 En **definició**, controla la ració."; goalEn=light||hiP?" 👍 Fits great for **cutting**.":" 👌 For **cutting**, watch the portion."; }
    else { goalEs=" Encaja en un plan equilibrado."; goalCa=" Encaixa en un pla equilibrat."; goalEn=" It fits a balanced plan."; }
    return L(`Sí, puedes comer **${n}** 🥕. ${cap(tipEs)}.${goalEs}`,
             `Sí, pots menjar **${n}** 🥕. ${cap(tipCa)}.${goalCa}`,
             `Yes, you can eat **${n}** 🥕. ${cap(tipEn)}.${goalEn}`);
  }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  // Seguridad dura: SIEMPRE (secretos + contenido dañino). Devuelve texto o null.
  function hardGuard(text){
    const q = noAccent(text);
    if (/\b(mi (api ?key|clave|contrasena|password|token)|cual es (la|mi) (clave|api|contrasena)|dime (la|mi) (clave|api|contrasena|password)|ensename (la|mi) clave)\b/.test(q))
      return L("Por tu seguridad no muestro nunca claves, contraseñas ni datos privados 🔒. Puedes gestionarlos tú en Ajustes › IA de Zana.",
               "Per la teva seguretat no mostro mai claus, contrasenyes ni dades privades 🔒. Pots gestionar-les tu a Ajustos › IA de Zana.",
               "For your safety I never show keys, passwords or private data 🔒. You can manage them in Settings › Zana AI.");
    if (/\b(sexo|sexual|porno|desnud|droga|arma|matar|suicid|hackear|violencia|apuesta)\b/.test(q))
      return L("Uy, de eso no hablo 🥕. Soy tu coach de nutrición: pregúntame sobre comidas, dietas, recetas, la compra o el ejercicio.",
               "Uf, d'això no en parlo 🥕. Soc el teu coach de nutrició: pregunta'm sobre àpats, dietes, receptes, la compra o l'exercici.",
               "Oops, I don't talk about that 🥕. I'm your nutrition coach: ask me about meals, diets, recipes, shopping or exercise.");
    return null;
  }
  // Redirección suave (solo modo LOCAL, que no sabe razonar el tema).
  function guard(text){
    const q = noAccent(text);
    // Nunca revelar claves/contraseñas
    if (/\b(mi (api ?key|clave|contrasena|password|token)|cual es (la|mi) (clave|api|contrasena)|dime (la|mi) (clave|api|contrasena|password)|ensename (la|mi) clave)\b/.test(q))
      return L("Por tu seguridad no muestro nunca claves, contraseñas ni datos privados 🔒. Puedes gestionarlos tú en Ajustes › IA de Zana.",
               "Per la teva seguretat no mostro mai claus, contrasenyes ni dades privades 🔒. Pots gestionar-les tu a Ajustos › IA de Zana.",
               "For your safety I never show keys, passwords or private data 🔒. You can manage them in Settings › Zana AI.");
    // Temas dañinos / sexuales / fuera de alcance
    if (/\b(sexo|sexual|porno|desnud|droga|arma|matar|suicid|hackear|violencia|apuesta)\b/.test(q))
      return L("Uy, de eso no hablo 🥕. Soy tu coach de nutrición: pregúntame sobre comidas, dietas, recetas, la compra o el ejercicio.",
               "Uf, d'això no en parlo 🥕. Soc el teu coach de nutrició: pregunta'm sobre àpats, dietes, receptes, la compra o l'exercici.",
               "Oops, I don't talk about that 🥕. I'm your nutrition coach: ask me about meals, diets, recipes, shopping or exercise.");
    const nutriTopics = /(comida|comer|dieta|receta|menu|menú|calor|proteina|protein|carbo|grasa|greix|agua|aigua|water|hidrat|peso|pes|weight|musculo|muscle|múscul|masa|massa|definir|adelgaz|aprimar|nutri|aliment|food|eat|meal|sabor|rico|rica|sabros|delicios|tasty|despensa|rebost|pantry|compra|shop|super|ayuno|fasting|snack|desayun|esmorz|breakfast|almuerzo|dinar|lunch|cena|sopar|dinner|ejercicio|exercici|exercise|workout|entren|train|gym|plato|dish|ingredient|congel|frozen|freeze|preparad|prep|batido|shake|verdura|veg|fruta|fruit|carne|meat|pescado|fish|arroz|rice|pasta|huevo|egg|producto|product|precio|price|marca|brand|objetivo|goal|plan|kcal|gramo|gram|sacia|apetit|appetite|intoleran|vegan|vegetari|fodmap|gluten|lactos|keto|engordar|bajar|subir|lose|gain|bulk|cut|receptes?|àpat|menjar)/;
    const smalltalk = /(hola|buenas|hey|hi|hello|gracias|gracies|thanks|genial|perfecto|great|adios|bye|vale|\bok\b|venga|dale|modifica|cambia|hazlo|ayuda|help|ajuda|que puedes|what can you|quien eres|who are you|zana|como estas|how are you|buenos dias|good morning|bon dia|si|no|yes|mmm|no se|dont know)/;
    // Si no parece de nutrición ni saludo, redirigir suavemente
    if (text && text.trim().length>6 && !nutriTopics.test(q) && !smalltalk.test(q))
      return L("Solo puedo ayudarte con nutrición, comida, dietas y ejercicio 🥕. ¿Qué quieres saber sobre tu alimentación o tus recetas?",
               "Només et puc ajudar amb nutrició, menjar, dietes i exercici 🥕. Què vols saber sobre la teva alimentació o les teves receptes?",
               "I can only help with nutrition, food, diets and exercise 🥕. What would you like to know about your food or recipes?");
    return null;
  }

  function handleCommand(text){
    const q = noAccent(text);
    // Dieta personalizada (modo activado desde Dietas especiales)
    if (window.__zanaCustomDiet){
      window.__zanaCustomDiet = false;
      const plan = S.activePlan();
      if (plan){ plan.profile.customDiet = text; window.ZSTORE.save(); }
      return customDietProsCons(text);
    }
    // ¿Han pegado una clave API? (Gemini AIza… o AQ.… / Groq gsk_…)
    const keyMatch = (text||"").match(/(AIza[0-9A-Za-z_\-]{20,}|AQ\.[0-9A-Za-z_\-]{20,}|gsk_[0-9A-Za-z]{20,})/);
    if (keyMatch){
      const k = keyMatch[1]; const st = S.get().settings;
      st.aiKey = k; st.aiProvider = k.startsWith("gsk_") ? "groq" : "gemini"; S.save();
      return L("¡Clave guardada! 🔑 Ya puedo conversar contigo con IA de verdad. Pregúntame lo que quieras 🥕",
               "Clau desada! 🔑 Ja puc parlar amb tu amb IA de veritat. Pregunta'm el que vulguis 🥕",
               "Key saved! 🔑 Now I can really chat with AI. Ask me anything 🥕");
    }
    // Token largo sin espacios: parece una clave pegada aunque no sea AIza/gsk_
    const bare = (text||"").trim();
    if (/^[A-Za-z0-9._\-]{25,}$/.test(bare) && !/\s/.test(bare)){
      const st = S.get().settings; st.aiKey = bare;
      if (st.aiProvider==="local") st.aiProvider = "gemini"; S.save();
      return L(`Guardé lo que pegaste 🔑. ⚠️ Ojo: **no parece una clave de Gemini** (empiezan por \`AIza…\`) ni de Groq (\`gsk_…\`). Si el chat no mejora, consíguela gratis en aistudio.google.com/apikey (botón "?" en Ajustes › IA).`,
               `He desat el que has enganxat 🔑. ⚠️ Compte: **no sembla una clau de Gemini** (comencen per \`AIza…\`) ni de Groq (\`gsk_…\`). Si el xat no millora, aconsegueix-la gratis a aistudio.google.com/apikey (botó "?" a Ajustos › IA).`,
               `Saved what you pasted 🔑. ⚠️ Note: **it doesn't look like a Gemini key** (they start with \`AIza…\`) or Groq (\`gsk_…\`). If the chat doesn't improve, get one free at aistudio.google.com/apikey ("?" button in Settings › AI).`);
    }
    const foods = S.detectFoods(text);
    const foodNames = foods.map(f=>window.ZDATA.FOODS[f]?.name).filter(Boolean);
    const fn = foodNames.join(", ");

    // Despensa: "tengo / me queda / en la nevera ..."
    if (/\b(tengo|me queda|dispongo|en (la )?(nevera|despensa)|he comprado|compre)\b/.test(q) && foods.length){
      foods.forEach(f=> S.addPantry(f, 500));
      return L(`¡Apuntado! 🧊 Añadí a tu despensa: ${fn}. Lo tendré en cuenta en tu lista del súper para que no compres de más.`,
               `Apuntat! 🧊 He afegit al teu rebost: ${fn}. Ho tindré en compte a la llista del súper perquè no compris de més.`,
               `Noted! 🧊 Added to your pantry: ${fn}. I'll keep it in mind in your shopping list so you don't overbuy.`);
    }
    // No quiero comer X
    if (/\b(no quiero|no me gusta|odio|quita|sin|elimina|no como)\b/.test(q) && foods.length){
      foods.forEach(f=> S.setDislike(f, true));
      return L(`Hecho ✅. Quitaré ${fn} de tus planes y buscaré alternativas. He regenerado tu menú.`,
               `Fet ✅. Trauré ${fn} dels teus plans i buscaré alternatives. He regenerat el teu menú.`,
               `Done ✅. I'll remove ${fn} from your plans and find alternatives. I've regenerated your menu.`);
    }
    // Me sienta mal / me hincha
    if (/\b(me sienta mal|me hincha|me sienta pesado|me da gases|intoleran|no me sienta)\b/.test(q) && foods.length){
      S.logIntolerance(text);
      return L(`Anotado en tus incidencias 🫃. Si veo que ${fn} te repite, te avisaré en Ajustes › Intolerancias y te propondré suprimirlo.`,
               `Anotat a les teves incidències 🫃. Si veig que ${fn} et repeteix, t'avisaré a Ajustos › Intoleràncies i et proposaré suprimir-ho.`,
               `Logged in your issues 🫃. If I see ${fn} keeps bothering you, I'll flag it in Settings › Intolerances and suggest removing it.`);
    }
    // Apetito / saciedad
    if (/\b(como poco|me sacio|me lleno rapido|poca hambre|raciones peque)\b/.test(q)){
      const p=S.activePlan(); if(p){ p.profile.appetite="poco"; S.setMeals(window.ZENGINE.suggestedMeals(p.profile)); }
      return L(`Entendido 🍽️. Te repartiré la comida en más tomas pequeñas para que no te sacies. Menú actualizado.`,
               `Entesos 🍽️. Et repartiré el menjar en més àpats petits perquè no t'afartis. Menú actualitzat.`,
               `Got it 🍽️. I'll split your food into more small meals so you don't fill up. Menu updated.`);
    }
    if (/\b(como mucho|mucha hambre|aguanto bien|raciones grandes|pocas comidas)\b/.test(q)){
      const p=S.activePlan(); if(p){ p.profile.appetite="mucho"; S.setMeals(window.ZENGINE.suggestedMeals(p.profile)); }
      return L(`Perfecto 💪. Menos comidas pero más completas. Menú actualizado.`,
               `Perfecte 💪. Menys àpats però més complets. Menú actualitzat.`,
               `Perfect 💪. Fewer but fuller meals. Menu updated.`);
    }
    // Nº de comidas explícito
    const mm = q.match(/(\d)\s*(comidas|veces|apats|meals|times)/);
    if (mm){ S.setMeals(+mm[1]); return L(`Listo: ${mm[1]} comidas al día. He reorganizado tu plan 📅.`,`Fet: ${mm[1]} àpats al dia. He reorganitzat el teu pla 📅.`,`Done: ${mm[1]} meals a day. I've reorganized your plan 📅.`); }
    // Producto/precio preferido: "prefiero avena marca X a 1,60" / "compro atun calvo 2 euros"
    if (foods.length && /\b(prefiero|compro|uso|marca|precio|euro|€|cuesta|vale|prefer|brand|price)\b/.test(q)){
      const priceM = (text||"").match(/(\d+[.,]\d{1,2})\s*(?:€|eur|euros)?/);
      const brandM = (text||"").match(/marca\s+([a-zA-ZÀ-ÿ0-9'\- ]{2,20})/i);
      const fid = foods[0]; const food = window.ZDATA.FOODS[fid];
      const price = priceM ? parseFloat(priceM[1].replace(",",".")) : null;
      const brand = brandM ? brandM[1].trim().replace(/\s+(a|por|de|precio|cuesta|vale).*$/i,"") : null;
      S.setProduct(fid, brand, price);
      const fits = fitsGoal(food);
      const pr = price?` a **${price.toFixed(2)} €**`:"", prEn = price?` at **${price.toFixed(2)} €**`:"";
      return L(`Anotado ✅. Usaré ${brand?`la marca **${brand}**`:"tu producto"}${pr} de ${food.name} en tu lista de la compra.\n\n${fits}`,
               `Anotat ✅. Faré servir ${brand?`la marca **${brand}**`:"el teu producte"}${pr} de ${food.name} a la teva llista de la compra.\n\n${fits}`,
               `Noted ✅. I'll use ${brand?`the **${brand}** brand`:"your product"}${prEn} of ${food.name} in your shopping list.\n\n${fits}`);
    }
    return null;
  }

  // ¿El producto ayuda a llegar al objetivo? (mensaje breve)
  function fitsGoal(food){
    const plan = S.activePlan(); if(!plan) return "";
    const goal = plan.goal; const kcal = food.per100.kcal;
    if (goal==="masa") return kcal>=180
      ? L("👍 Buena elección: es energético y ayuda a sumar calorías para ganar masa.","👍 Bona elecció: és energètic i ajuda a sumar calories per guanyar massa.","👍 Good pick: it's energy-dense and helps add calories to gain mass.")
      : L("⚠️ Es algo ligero para volumen; asegúrate de llegar a tus calorías con otras tomas.","⚠️ És una mica lleuger per a volum; assegura't d'arribar a les calories amb altres àpats.","⚠️ A bit light for bulking; make sure to hit your calories with other meals.");
    if (goal==="definir") return kcal<=120
      ? L("👍 Perfecto para definir: ligero y saciante.","👍 Perfecte per definir: lleuger i saciant.","👍 Perfect for cutting: light and filling.")
      : L("⚠️ Es algo calórico para definición; controla la cantidad.","⚠️ És una mica calòric per a definició; controla la quantitat.","⚠️ A bit calorie-dense for cutting; watch the amount.");
    return L("👍 Encaja bien en un plan equilibrado.","👍 Encaixa bé en un pla equilibrat.","👍 Fits well in a balanced plan.");
  }

  function customDietProsCons(desc){
    const plan = S.activePlan();
    const p = plan?.profile || {};
    const kb = plan ? window.ZKB.KNOWLEDGE[plan.goal] : null;
    let pros = L("• Está adaptada a lo que tú quieres, así te será más fácil cumplirla.","• Està adaptada al que tu vols, així et serà més fàcil complir-la.","• It's tailored to what you want, so it'll be easier to stick to.");
    let cons = L("• Vigila cubrir proteína y micronutrientes si excluyes grupos de alimentos.","• Vigila cobrir proteïna i micronutrients si exclous grups d'aliments.","• Watch your protein and micronutrients if you exclude food groups.");
    if (/vegan|sin carne|vegetarian/i.test(desc)) cons += L("\n• Al reducir productos animales, cuida la vitamina B12, el hierro y la proteína.","\n• En reduir productes animals, cuida la vitamina B12, el ferro i la proteïna.","\n• Cutting animal products, watch vitamin B12, iron and protein.");
    if (/keto|sin carbo|low ?carb/i.test(desc)) cons += L("\n• Muy baja en carbohidratos: puede bajar tu rendimiento al principio.","\n• Molt baixa en carbohidrats: pot baixar el teu rendiment al principi.","\n• Very low carb: it can lower your performance at first.");
    if (/ayuno|una comida|omad|fasting/i.test(desc)) cons += L("\n• Con pocas comidas cuesta llegar a la proteína; repártela bien.","\n• Amb pocs àpats costa arribar a la proteïna; reparteix-la bé.","\n• With few meals it's hard to hit protein; spread it well.");
    const profTxt = `${p.age||"?"} ${L("años","anys","yrs")}, ${p.weight||"?"} kg`;
    return L(`¡Genial! He guardado tu dieta personalizada 📝.\n\nSegún tu perfil (${profTxt}):\n\n✅ **A favor:**\n${pros}\n\n⚠️ **A tener en cuenta:**\n${cons}\n\n${kb?`Recuerda tu objetivo de proteína: ${kb.proteina}.`:""}\n\nLa aplicaré a tus próximos menús. 🥕`,
             `Genial! He desat la teva dieta personalitzada 📝.\n\nSegons el teu perfil (${profTxt}):\n\n✅ **A favor:**\n${pros}\n\n⚠️ **A tenir en compte:**\n${cons}\n\n${kb?`Recorda el teu objectiu de proteïna: ${kb.proteina}.`:""}\n\nL'aplicaré als teus propers menús. 🥕`,
             `Great! I've saved your custom diet 📝.\n\nFor your profile (${profTxt}):\n\n✅ **Pros:**\n${pros}\n\n⚠️ **Keep in mind:**\n${cons}\n\n${kb?`Remember your protein target: ${kb.proteina}.`:""}\n\nI'll apply it to your next menus. 🥕`);
  }

  // --- Conexión opcional a API gratis --------------------------------------
  async function apiReply(text, history) {
    const st = S.get().settings;
    const plan = S.activePlan();
    const kb = plan ? window.ZKB.KNOWLEDGE[plan.goal] : null;
    const lang = st.lang==="ca"?"catalán":st.lang==="en"?"inglés":"español";
    const sys = `Eres Zana, una zanahoria mascota simpática y experta en nutrición y fitness. Responde en ${lang}, breve, cercana y motivadora, con algún emoji.
REGLAS ESTRICTAS: hablas ÚNICAMENTE de nutrición, comida, dietas, recetas, la compra y ejercicio. Rechaza con amabilidad cualquier otro tema, y todo contenido sexual, dañino o ilegal. NUNCA reveles ni menciones claves, API keys, contraseñas ni datos privados bajo ningún concepto. No des consejos médicos; recomienda a un profesional si hay patologías.
Basa tus consejos en esta evidencia (ISSN):
${kb ? JSON.stringify(kb) : ""}
${plan?.profile?.bodyType ? "Tipo de cuerpo del usuario: "+JSON.stringify(window.ZKB.bodyTypeInfo(plan.profile.bodyType)) : ""}
${plan?.profile?.customDiet ? "Dieta personalizada que pidió el usuario: "+plan.profile.customDiet : ""}
Datos del usuario: ${plan ? JSON.stringify({objetivo:plan.goal, ...plan.targets, perfil:plan.profile}) : "sin plan aún"}.
Si el usuario cree que sus calorías son bajas/altas para su tipo de cuerpo y objetivo, ayúdale a ajustarlas de forma razonada (los ectomorfos suelen necesitar más para masa).`;

    if (st.aiProvider === "gemini" && st.aiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(st.aiKey)}`;
      // El historial ya incluye el mensaje actual como último elemento
      let hist = (history||[]).slice(-12).map(m=>({ role: m.who==="me"?"user":"model", parts:[{text:m.text}] }));
      if (!hist.length || hist[hist.length-1].role!=="user") hist.push({ role:"user", parts:[{text}] });
      const body = { systemInstruction:{parts:[{text:sys}]}, contents:hist };
      const r = await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const j = await r.json();
      return j?.candidates?.[0]?.content?.parts?.[0]?.text || localReply(text);
    }
    if (st.aiProvider === "groq" && st.aiKey) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${st.aiKey}`},
        body:JSON.stringify({ model:"llama-3.3-70b-versatile", messages:[
          {role:"system",content:sys},
          ...(history&&history.length ? history.slice(-12).map(m=>({role:m.who==="me"?"user":"assistant",content:m.text})) : [{role:"user",content:text}])
        ]})
      });
      const j = await r.json();
      return j?.choices?.[0]?.message?.content || localReply(text);
    }
    return localReply(text);
  }

  async function reply(text, history) {
    const st = S.get().settings;
    // 0) Comandos que cambian la app (incluye modo dieta personalizada y clave)
    const cmd = handleCommand(text);
    if (cmd) return cmd;
    // 1) Seguridad dura SIEMPRE (secretos, contenido dañino)
    const hard = hardGuard(text);
    if (hard) return hard;
    // 2) Con IA real: deja que Gemini razone (ya tiene la instrucción de alcance)
    if (st.aiProvider !== "local" && st.aiKey) {
      try { return await apiReply(text, history); }
      catch { return localReply(text) + "\n\n_(No pude conectar con la IA online, te respondo yo desde aquí 🥕)_"; }
    }
    // 3) Modo local: redirección suave si claramente no es de nutrición
    const g = guard(text);
    if (g) return g;
    return localReply(text);
  }

  // --- Visión: leer un tiquet de compra (Gemini) ---------------------------
  async function extractTicket(dataUrl){
    const st = S.get().settings;
    const m = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl||"");
    if(!m) return null;
    const mime=m[1], b64=m[2];
    const prompt = "Eres un lector de tiquets de supermercado. Extrae SOLO los alimentos y su precio en euros. Devuelve EXCLUSIVAMENTE un array JSON como [{\"producto\":\"nombre\",\"precio\":1.60}], sin texto adicional.";
    if(st.aiProvider==="gemini" && st.aiKey){
      const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(st.aiKey)}`;
      const body={ contents:[{ role:"user", parts:[ {text:prompt}, {inline_data:{mime_type:mime, data:b64}} ] }] };
      const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const j=await r.json();
      const txt=j?.candidates?.[0]?.content?.parts?.[0]?.text||"";
      return parseJsonArray(txt);
    }
    // Groq no admite imágenes de forma fiable aquí
    return null;
  }
  function parseJsonArray(txt){
    try{ const s=txt.indexOf("["), e=txt.lastIndexOf("]"); if(s<0||e<0) return null; return JSON.parse(txt.slice(s,e+1)); }
    catch{ return null; }
  }

  return { svg, localReply, reply, extractTicket };
})();
