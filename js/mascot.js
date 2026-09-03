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

    // Hambre, antojos y picoteo
    if (has("hambre","antojo","picar","picoteo","ansiedad por comer","gusanillo","gana","gola","craving","snack")){
      return L(`Lo primero: bebe un vaso de agua y espera 10 min, muchas veces es sed 💧. Si sigue el hambre, tira de volumen y proteína: yogur griego con canela, palitos de zanahoria con hummus, una lata de atún, fruta con un puñado de frutos secos o gelatina sin azúcar. Lo que sacia es **proteína + fibra + agua**, no las calorías.\n\nY si es por aburrimiento o estrés, no es hambre: sal a dar una vuelta o hazte una infusión 🍵`,
               `Primer de tot: beu un got d'aigua i espera 10 min, moltes vegades és set 💧. Si segueix la gana, tira de volum i proteïna: iogurt grec amb canyella, pastanaga amb hummus, una llauna de tonyina, fruita amb un grapat de fruits secs o gelatina sense sucre. El que sacia és **proteïna + fibra + aigua**, no les calories.\n\nI si és per avorriment o estrès, no és gana: surt a fer una volta o fes-te una infusió 🍵`,
               `First: drink a glass of water and wait 10 min — it's often thirst 💧. If you're still hungry, go for volume and protein: Greek yogurt with cinnamon, carrot sticks with hummus, a tin of tuna, fruit with a handful of nuts, or sugar-free jelly. What fills you up is **protein + fibre + water**, not calories.\n\nAnd if it's boredom or stress, that's not hunger: go for a walk or make a herbal tea 🍵`);
    }

    // Alcohol, comer fuera y eventos sociales
    if (has("cerveza","alcohol","vino","copa","birra","resaca","restaurante","comer fuera","cumplea","boda","navidad","fiesta","salir a cenar","cervesa","vi ","beure")){
      return L(`Claro que puedes 🍻. Un par de cervezas no te tiran el plan: lo que cuenta es la semana entera, no un día.\n\nPara que salga barato: come normal el resto del día (nada de "ahorrar" calorías, llegas con hambre y picas más), prioriza proteína en esa comida, alterna cada bebida con un vaso de agua y al día siguiente vuelve a tu plan sin castigos ni ayunos de compensación.\n\nSi puedes elegir: cerveza o vino antes que combinados 👌`,
               `És clar que pots 🍻. Un parell de cerveses no et tomben el pla: el que compta és tota la setmana, no un dia.\n\nPerquè surti barat: menja normal la resta del dia (res d'"estalviar" calories, hi arribes amb gana i pica més), prioritza proteïna en aquell àpat, alterna cada beguda amb un got d'aigua i l'endemà torna al pla sense càstigs ni dejunis de compensació.\n\nSi pots triar: cervesa o vi abans que combinats 👌`,
               `Of course you can 🍻. A couple of beers won't wreck your plan — the whole week counts, not one day.\n\nTo keep the damage low: eat normally the rest of the day (don't "save" calories, you'll arrive starving and snack more), put protein first at that meal, alternate each drink with a glass of water, and go back to your plan the next day — no punishment fasting.\n\nIf you get to pick: beer or wine over spirits 👌`);
    }

    // Sueño y descanso
    if (has("dormir","duerm","dorm","sueno","sueño","descans","insomnio","me despierto","sleep") && !has("serie","entren","rutina","gym")){
      return L(`El descanso es parte del plan 😴. Duerme 7-9 h: durmiendo poco sube el hambre y te cuesta más perder grasa y ganar músculo.\n\nPara la cena: cena 2-3 h antes de acostarte y que no sea enorme ni muy grasa. Nada de cafeína a partir de media tarde, y ojo con el alcohol, que te duerme pero te rompe el sueño de madrugada. Si te da hambre al acostarte, un yogur o un vaso de leche va bien 🥛`,
               `El descans és part del pla 😴. Dorm 7-9 h: dormint poc puja la gana i costa més perdre greix i guanyar múscul.\n\nPer al sopar: sopa 2-3 h abans d'anar a dormir i que no sigui enorme ni molt greixós. Res de cafeïna a partir de mitja tarda, i compte amb l'alcohol, que t'adorm però et trenca el son de matinada. Si tens gana en anar a dormir, un iogurt o un got de llet va bé 🥛`,
               `Rest is part of the plan 😴. Sleep 7-9 h: sleeping badly raises hunger and makes fat loss and muscle gain harder.\n\nFor dinner: eat 2-3 h before bed and keep it moderate, not huge or very fatty. No caffeine from mid-afternoon on, and watch alcohol — it knocks you out but wrecks your sleep later. If you're hungry at bedtime, a yogurt or a glass of milk works fine 🥛`);
    }

    // Motivación, recaídas y culpa
    if (has("desmotiv","sin ganas","no puedo mas","me rindo","he dejado","lo he dejado","tirar la toalla","culpa","fracas","no avanzo","estancad","atascad","cansad","aburrid","give up","motivat")){
      return L(`Eh, tranquilo, esto le pasa a todo el mundo 🫂. Saltarse unos días no borra lo que llevas hecho: lo que arruina un plan es abandonarlo, no fallarlo.\n\nHazlo fácil: vuelve mañana con **una sola cosa** (desayuno del plan, o 8.000 pasos, o la proteína del día). Una. Cuando lleves tres días seguidos, añade la siguiente.\n\nY si el plan te está costando demasiado, no eres tú: es el plan. Dime qué parte se te hace cuesta arriba y lo ajustamos 🥕`,
               `Ei, tranquil, això li passa a tothom 🫂. Saltar-te uns dies no esborra el que portes fet: el que arruïna un pla és abandonar-lo, no fallar-lo.\n\nFes-ho fàcil: torna demà amb **una sola cosa** (l'esmorzar del pla, o 8.000 passes, o la proteïna del dia). Una. Quan portis tres dies seguits, afegeix la següent.\n\nI si el pla et costa massa, no ets tu: és el pla. Digue'm quina part se't fa costa amunt i l'ajustem 🥕`,
               `Hey, easy — this happens to everyone 🫂. Missing a few days doesn't erase what you've done: what ruins a plan is quitting it, not slipping.\n\nMake it easy: come back tomorrow with **one single thing** (the plan's breakfast, or 8,000 steps, or your protein). One. Once you've strung three days together, add the next.\n\nAnd if the plan feels too hard, it's not you — it's the plan. Tell me which part is a grind and we'll adjust it 🥕`);
    }

    // Volumen de entrenamiento: series, repeticiones, frecuencia
    if (has("serie","repeticion","repes","reps","press","sentadilla","dominada","peso muerto","cuanto peso","frecuencia","cuantas veces entren","banca","curl","fallo muscular")){
      return L(`Como referencia general de fuerza 🏋️: **3-4 series de 6-12 repeticiones** por ejercicio, dejando 1-2 repes en recámara (que no llegues al fallo siempre), con 1,5-3 min de descanso entre series.\n\nCada músculo, 2 veces por semana, y sube el peso o una repetición cuando completes todas las series cómodas: esa **sobrecarga progresiva** es lo que hace crecer, no matarte un día suelto.\n\nEn **Ejercicio** tienes la rutina de hoy con sus series y reps ya marcadas 💪`,
               `Com a referència general de força 🏋️: **3-4 sèries de 6-12 repeticions** per exercici, deixant 1-2 repes a la recambra (que no arribis sempre a la fallada), amb 1,5-3 min de descans entre sèries.\n\nCada múscul, 2 cops per setmana, i puja el pes o una repetició quan completis totes les sèries còmodes: aquesta **sobrecàrrega progressiva** és el que fa créixer, no matar-te un dia solt.\n\nA **Exercici** tens la rutina d'avui amb les sèries i reps ja marcades 💪`,
               `As a general strength guideline 🏋️: **3-4 sets of 6-12 reps** per exercise, leaving 1-2 reps in reserve (don't always go to failure), resting 1.5-3 min between sets.\n\nHit each muscle twice a week, and add weight or a rep once all your sets feel comfortable: that **progressive overload** is what makes you grow, not destroying yourself one random day.\n\nIn **Exercise** you've got today's routine with sets and reps already set 💪`);
    }

    // Suplementos y cafeína
    if (has("creatina","suplement","multivitamin","omega","cafeina","cafe","pre entreno","preentreno","quemagrasa","bcaa","colageno")){
      return L(`Con suplementos, poco y con cabeza 💊. Lo único con evidencia sólida y barato es la **creatina monohidrato: 3-5 g al día**, a cualquier hora, todos los días (también los que no entrenas). No retiene grasa ni daña el riñón en gente sana.\n\nLa proteína en polvo es comodidad, no magia: útil si no llegas a tu proteína con comida. La cafeína (200-300 mg) rinde antes de entrenar, pero no después de media tarde.\n\nLos quemagrasas no funcionan. Eso lo hace el déficit 🥕`,
               `Amb suplements, poc i amb cap 💊. L'únic amb evidència sòlida i barat és la **creatina monohidrat: 3-5 g al dia**, a qualsevol hora, tots els dies (també els que no entrenes). No reté greix ni fa mal al ronyó en gent sana.\n\nLa proteïna en pols és comoditat, no màgia: útil si no arribes a la teva proteïna amb menjar. La cafeïna (200-300 mg) va bé abans d'entrenar, però no després de mitja tarda.\n\nEls cremagreixos no funcionen. Això ho fa el dèficit 🥕`,
               `Keep supplements few and sensible 💊. The one with solid evidence, and cheap: **creatine monohydrate, 3-5 g a day**, any time, every day (including rest days). It doesn't make you fat or harm healthy kidneys.\n\nProtein powder is convenience, not magic — useful if you can't hit your protein with food. Caffeine (200-300 mg) helps before training, but not after mid-afternoon.\n\nFat burners don't work. The deficit does 🥕`);
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

  // --- Claves de API: formatos conocidos y redaccion ------------------------
  // Solo se reconocen (y guardan) estos formatos. Cualquier otra cadena larga
  // podria ser otra contrasena del usuario y no se toca.
  const KEY_FORMATS_ONE = /(AIza[0-9A-Za-z_\-]{20,}|AQ\.[0-9A-Za-z_\-]{20,}|gsk_[0-9A-Za-z]{20,})/;
  const KEY_FORMATS_ALL = /(AIza[0-9A-Za-z_\-]{20,}|AQ\.[0-9A-Za-z_\-]{20,}|gsk_[0-9A-Za-z]{20,})/g;

  // Ultima red de seguridad antes de enviar nada al proveedor de IA: aunque una
  // clave se cuele en el historial por otra via, nunca sale dentro del prompt.
  function sinClaves(txt, claveActual){
    let out = String(txt ?? "").replace(KEY_FORMATS_ALL, "[clave redactada]");
    if (claveActual && claveActual.length >= 12) out = out.split(claveActual).join("[clave redactada]");
    return out;
  }

  // --- Seguridad y alcance -------------------------------------------------
  // Zana es un coach, no un portero: todo lo que se pueda mirar desde la
  // comida, el entrenamiento o los hábitos se responde. Solo se corta lo que
  // hace daño de verdad, y cuidando de no bloquear frases normales de cocina.

  // Frases cotidianas que llevan palabras "sensibles" pero son inofensivas
  // ("matar el hambre", el sexo como variable del metabolismo, "armar el plato").
  const SAFE_PHRASES = /(matar (el|la|los|las) (hambre|gusanillo|ansiedad|antojo|antojos|nervios)|mata el hambre|sexo (biologico|masculino|femenino)|segun (el|mi|tu) sexo|por edad y sexo|armar? (el|un|la|mi|tu) (plato|menu|dieta|rutina|semana)|apuesta por|drogueria|matarme (a|en) (entrenar|correr|el gym|el gimnasio|hacer)|matarme a )/;

  // Contenido que sí se rechaza: sexual explícito, violencia real, drogas ilegales.
  const HARMFUL = /\b(porno|pornografi|desnud|masturb|sexting|sexo (explicito|oral|anal|duro)|contenido sexual|cocaina|heroina|metanfetamina|comprar (droga|drogas|coca|speed)|drogarme|fabricar (una? )?(droga|drogas|explosivo|explosivos|bomba|arma)|arma de fuego|matar a (alguien|una persona|mi|un|una)|hacer dano a alguien)\b/;

  // Autolesión: no es un tema prohibido, es un tema que se trata con cuidado.
  const SELF_HARM = /\b(suicid\w*|quitarme la vida|matarme|autolesion\w*|hacerme dano|no quiero vivir)\b/;

  const SECRETS = /\b(mi (api ?key|clave|contrasena|password|token)|cual es (la|mi) (clave|api|contrasena)|dime (la|mi) (clave|api|contrasena|password)|ensename (la|mi) clave)\b/;

  function secretsMsg(){
    return L("Por tu seguridad no muestro nunca claves, contraseñas ni datos privados 🔒. Puedes gestionarlos tú en Ajustes › IA de Zana.",
             "Per la teva seguretat no mostro mai claus, contrasenyes ni dades privades 🔒. Pots gestionar-les tu a Ajustos › IA de Zana.",
             "For your safety I never show keys, passwords or private data 🔒. You can manage them in Settings › Zana AI.");
  }

  // Seguridad dura: SIEMPRE (secretos + contenido dañino). Devuelve texto o null.
  function hardGuard(text){
    const q = noAccent(text);
    if (SECRETS.test(q)) return secretsMsg();
    if (SELF_HARM.test(q) && !SAFE_PHRASES.test(q))
      return L("Siento que estés pasando por esto 🧡 Eso se me escapa, pero no tienes que llevarlo solo: en España puedes llamar al **024**, gratis y 24 h, o al 112. Habla con alguien de confianza. Y cuando quieras, aquí sigo para tu comida y tu día a día 🥕",
               "Sento que estiguis passant per això 🧡 Això se m'escapa, però no ho has de portar sol: a Espanya pots trucar al **024**, gratis i 24 h, o al 112. Parla amb algú de confiança. I quan vulguis, aquí segueixo per al teu menjar i el teu dia a dia 🥕",
               "I'm sorry you're going through this 🧡 That's beyond me, but you don't have to carry it alone: call your local crisis line (988 in the US, 116 123 in the UK) or emergency services. Talk to someone you trust. I'll be here for your food and daily habits 🥕");
    if (HARMFUL.test(q) && !SAFE_PHRASES.test(q))
      return L("Uy, de eso no hablo 🥕. Soy tu coach: pregúntame sobre comidas, dietas, recetas, la compra, el entrenamiento o tus hábitos.",
               "Uf, d'això no en parlo 🥕. Soc el teu coach: pregunta'm sobre àpats, dietes, receptes, la compra, l'entrenament o els teus hàbits.",
               "Oops, I don't talk about that 🥕. I'm your coach: ask me about meals, diets, recipes, shopping, training or your habits.");
    return null;
  }

  // Detecta y guarda gustos/preferencias (efecto lateral; no corta la respuesta)
  function capturePreference(text){
    const q = noAccent(text);
    if (/\b(no me gusta|no me gustan|odio)\b/.test(q)) return false; // eso es "no quiero"
    if (/\b(me gusta|me gustan|me encanta|me encantan|me chifla|me chiflan|adoro|soy fan|me apetec|mi comida favorita|mis comidas favoritas|mi plato favorito|mis platos favoritos|prefiero (comer|los? platos?|las? comidas?|comidas|platos)|suelo comer|me flipa|me flipan|i like|i love|m'agrada|m'encanta)\b/.test(q)){
      S.addPreference(text); return true;
    }
    return false;
  }
  function prefAck(){
    return L("¡Anotado! 🥕 Recordaré tus gustos para adaptarte los menús y consejos. Si quieres, dime qué NO te gusta y lo evito.",
             "Apuntat! 🥕 Recordaré els teus gustos per adaptar-te els menús i consells. Si vols, digues-me què NO t'agrada i ho evito.",
             "Noted! 🥕 I'll remember your tastes to tailor your menus and tips. If you want, tell me what you DON'T like and I'll avoid it.");
  }

  // Redirección suave (solo modo LOCAL, que no sabe razonar el tema).
  // Antes hacía falta una palabra "permitida" para contestar; ahora es al revés:
  // se contesta siempre salvo que el mensaje sea claramente de otro mundo.
  function guard(text){
    const q = noAccent(text);
    if (SECRETS.test(q)) return secretsMsg();

    // Todo esto es terreno de Zana, aunque no sea "nutrición" en sentido estricto.
    const inScope = /(comida|comer|menj|apat|dieta|receta|recept|menu|calor|kcal|proteina|protein|carbo|grasa|greix|fibra|azucar|sal |sodio|agua|aigua|water|hidrat|peso|pes |weight|bascula|cintura|musculo|muscle|muscul|masa|massa|definir|adelgaz|aprimar|engordar|nutri|aliment|food|eat|meal|sabor|rico|sabros|delicios|tasty|despensa|rebost|pantry|compra|shop|super|mercado|ayuno|fasting|snack|picar|antojo|desayun|esmorz|breakfast|almuerzo|dinar|lunch|cena|sopar|dinner|merienda|ejercicio|exercici|exercise|workout|entren|train|gym|gimnasio|pesas|serie|repes|reps|press|sentadilla|dominada|calistenia|yoga|pilates|cardio|correr|running|bici|nadar|natacion|padel|pasos|caminar|estirar|agujetas|lesion|descans|recuperac|sueno|dormir|siesta|estres|ansiedad|animo|motivac|constan|habito|rutina|energia|cansad|fatiga|rendimiento|plato|dish|ingredient|cocin|cuinar|horno|sarten|congel|frozen|freeze|preparad|prep|tupper|batido|shake|suplement|creatina|cafeina|cafe|infusion|alcohol|cerveza|vino|resaca|restaurante|fuera de casa|cumpleanos|navidad|verdura|veg|fruta|fruit|carne|meat|pescado|fish|arroz|rice|pasta|huevo|egg|legumbre|lenteja|garbanzo|pan |leche|yogur|queso|producto|product|precio|price|marca|brand|tiquet|ticket|objetivo|goal|plan|gramo|gram|sacia|apetit|appetite|intoleran|alergia|vegan|vegetari|fodmap|gluten|lactos|keto|colesterol|diabet|tension|anemia|hierro|vitamina|digest|hinch|estrenim|transito|menstrua|regla|embaraz|lactancia|metabol|tdee|imc|bajar|subir|lose|gain|bulk|cut)/;

    // Claramente otro tema: ahí sí redirijo, pero sin dar un portazo.
    const offTopic = /(politic|elecciones|presidente del gobierno|guerra en|resultado del partido|pelicula|netflix|videojuego|programar en|codigo fuente|javascript|python|bitcoin|cripto|bolsa de valores|traduceme|deberes|examen de|capital de|que tiempo hace|meteorolog|horoscopo|cuentame un chiste|escribeme un poema)/;

    if (text && text.trim().length > 8 && offTopic.test(q) && !inScope.test(q))
      return L("Eso se me escapa un poco 🥕. Pero si tiene que ver con lo que comes, lo que entrenas, la compra o cómo te sientes, cuéntamelo y te echo un cable.",
               "Això se m'escapa una mica 🥕. Però si té a veure amb el que menges, el que entrenes, la compra o com et sents, explica-m'ho i t'ajudo.",
               "That one's a bit out of my lane 🥕. But if it's about what you eat, how you train, your shopping or how you feel, tell me and I'll help.");
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
    const keyMatch = (text||"").match(KEY_FORMATS_ONE);
    if (keyMatch){
      const k = keyMatch[1]; const st = S.get().settings;
      st.aiKey = k; st.aiProvider = k.startsWith("gsk_") ? "groq" : "gemini"; S.save();
      // Borrarla del chat: el historial viaja al proveedor en cada mensaje.
      window.ZUI?.redactFromChat?.(k);
      return L("¡Clave guardada! 🔑 La he borrado del chat para que no viaje en los mensajes. Ya puedo conversar contigo con IA de verdad 🥕",
               "Clau desada! 🔑 L'he esborrat del xat perquè no viatgi als missatges. Ja puc parlar amb tu amb IA de veritat 🥕",
               "Key saved! 🔑 I removed it from the chat so it doesn't travel in your messages. Now I can really chat with AI 🥕");
    }
    // Token largo sin espacios que NO es una clave conocida: no se guarda nada.
    // Antes se guardaba cualquier cosa (una contraseña, un token de otro sitio)
    // y acababa enviándose al proveedor de IA.
    const bare = (text||"").trim();
    if (/^[A-Za-z0-9._\-]{25,}$/.test(bare) && !/\s/.test(bare)){
      window.ZUI?.redactFromChat?.(bare);
      return L(`No he guardado eso 🔒. **No parece una clave de Gemini** (empiezan por \`AIza…\`) ni de Groq (\`gsk_…\`), y no guardo cadenas que no reconozca por si es otra contraseña tuya. Si es tu clave de IA, pégala en **Ajustes › IA de Zana**.`,
               `No ho he desat 🔒. **No sembla una clau de Gemini** (comencen per \`AIza…\`) ni de Groq (\`gsk_…\`), i no deso cadenes que no reconegui per si és una altra contrasenya teva. Si és la teva clau d'IA, enganxa-la a **Ajustos › IA de la Zana**.`,
               `I didn't save that 🔒. **It doesn't look like a Gemini key** (they start with \`AIza…\`) or a Groq one (\`gsk_…\`), and I don't store strings I can't recognise in case it's another password of yours. If it is your AI key, paste it in **Settings › Zana AI**.`);
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
    // Volver a permitir algo rechazado: "vuelve a poner el pescado", "ya me gusta el queso"
    if (/\b(vuelve a (poner|incluir|meter)|volver a (poner|incluir)|ya me gusta|si me gusta|ahora me gusta|me gusta otra vez|vuelve a darme|quita la restriccion|quita el veto|readmite)\b/.test(q)){
      const dev = S.undoDislike(text);
      if (dev.length){
        const names = dev.map(f=>window.ZDATA.FOODS[f]?.name).filter(Boolean).join(", ");
        return L(`¡Hecho! ✅ Vuelvo a incluir: ${names}. Regenero tu menú con ellos 🥕`,
                 `Fet! ✅ Torno a incloure: ${names}. Regenero el teu menú amb ells 🥕`,
                 `Done! ✅ Adding back: ${names}. Regenerating your menu with them 🥕`);
      }
      return L("No tenía nada de eso rechazado 🤔. Dime el alimento tal cual (p. ej. \"vuelve a poner el pescado\") y lo devuelvo a tus menús.",
               "No tenia res d'això rebutjat 🤔. Digues-me l'aliment tal qual (p. ex. \"torna a posar el peix\") i el retorno als teus menús.",
               "I didn't have that on your no-go list 🤔. Name the food (e.g. \"add fish back\") and I'll return it to your menus.");
    }
    // No quiero comer X (incluye categorías: "no me gusta el queso" quita TODOS los quesos)
    if (/\b(no quiero|no me gusta|no me gustan|odio|detesto|no soporto|quita|quitar|elimina|eliminar|no como|no tomo|nada de)\b/.test(q)){
      const dis = S.expandDislike(text);
      if (dis.length){
        dis.forEach(f=> S.setDislike(f, true));
        const names = dis.map(f=>window.ZDATA.FOODS[f]?.name).filter(Boolean).join(", ");
        return L(`Hecho ✅. Quito de tus planes: ${names}. Regenero tu menú con alternativas 🥕\n\n_Si me he pasado, dime "vuelve a poner ${names.split(", ")[0]}" y lo devuelvo._`,
                 `Fet ✅. Trec dels teus plans: ${names}. Regenero el teu menú amb alternatives 🥕\n\n_Si m'he passat, digues "torna a posar ${names.split(", ")[0]}" i el retorno._`,
                 `Done ✅. Removing from your plans: ${names}. Regenerating your menu with alternatives 🥕\n\n_If I went too far, say "add ${names.split(", ")[0]} back" and I'll restore it._`);
      }
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
    // El modelo no necesita el nombre para calcular nada: se queda en el móvil.
    const { name:_nombreFuera, preferences:_prefsAparte, ...perfilSinNombre } = plan?.profile || {};
    const sys = `Eres Zana, una zanahoria mascota simpática y experta en nutrición, cocina y entrenamiento. Responde en ${lang}, cercana y motivadora, con algún emoji. Sé breve salvo que te pidan detalle.
TU TERRENO ES AMPLIO: alimentación y nutrición, cocina y recetas, la compra y el presupuesto, suplementación, hidratación, alcohol y comer fuera, entrenamiento y deporte, descanso y sueño, digestiones, energía y rendimiento, hábitos, motivación y constancia, y cómo el usuario se siente con su cuerpo y su plan. Si la pregunta se puede enfocar desde la comida, el movimiento o los hábitos, AYÚDALE DE VERDAD: no te escudes en que "no es tu tema" ni devuelvas la pregunta.
Da respuestas concretas y aplicables (cantidades, gramos, ejemplos de platos, alternativas reales), no generalidades. Asume buena fe: si el usuario pregunta por un capricho, una cerveza, un cumpleaños o saltarse el plan, encájalo en su semana sin sermones ni culpa.
Habla con naturalidad de temas de salud del día a día (colesterol, diabetes, intolerancias, anemia, embarazo, menstruación, lesiones): explica pautas generales de alimentación y entrenamiento y sugiere consultar a un médico o dietista-nutricionista cuando haga falta. No diagnostiques ni sustituyas a un profesional.
SOLO DECLINA: contenido sexual explícito, ilegal o violento, y temas claramente ajenos (política, criptomonedas, código...). Si te piden algo extremo o poco seguro (ayunos muy largos, calorías muy bajas, purgas, pérdidas de peso muy rápidas), no lo rechaces sin más: explica en una frase el riesgo y ofrécele la versión que sí funciona.
IMPORTANTE — tú NO puedes editar el plan de comidas por tu cuenta (eso lo hace la app). Si el usuario quiere quitar un alimento, NO digas "ya te he regenerado el menú"; dile que lo escriba claro, p. ej. "no me gusta el queso" o "quita el pescado", y la app lo eliminará y regenerará el plan al instante. Puedes sugerir sustituciones, pero el cambio real lo aplica la app.
NUNCA reveles ni menciones claves, API keys, contraseñas ni datos privados bajo ningún concepto.
Basa tus consejos en esta evidencia (ISSN):
${kb ? JSON.stringify(kb) : ""}
${plan?.profile?.bodyType ? "Tipo de cuerpo del usuario: "+JSON.stringify(window.ZKB.bodyTypeInfo(plan.profile.bodyType)) : ""}
${plan?.profile?.preferences ? "Gustos y comidas favoritas del usuario (tenlos en cuenta al aconsejar y proponer): "+sinClaves(plan.profile.preferences, st.aiKey) : ""}
${plan?.profile?.customDiet ? "Dieta personalizada que pidió el usuario: "+sinClaves(plan.profile.customDiet, st.aiKey) : ""}
Datos del usuario: ${plan ? sinClaves(JSON.stringify({objetivo:plan.goal, ...plan.targets, perfil:perfilSinNombre}), st.aiKey) : "sin plan aún"}.
Si el usuario cree que sus calorías son bajas/altas para su tipo de cuerpo y objetivo, ayúdale a ajustarlas de forma razonada (los ectomorfos suelen necesitar más para masa).`;

    if (st.aiKey && !st.aiKey.startsWith("gsk_")) {  // Gemini (AIza… / AQ.…): por formato de clave
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
      // El historial ya incluye el mensaje actual como último elemento
      let hist = (history||[]).slice(-12).map(m=>({ role: m.who==="me"?"user":"model", parts:[{text:sinClaves(m.text, st.aiKey)}] }));
      if (!hist.length || hist[hist.length-1].role!=="user") hist.push({ role:"user", parts:[{text:sinClaves(text, st.aiKey)}] });
      const body = { systemInstruction:{parts:[{text:sys}]}, contents:hist };
      // La clave va en cabecera, no en la URL: las query strings acaban en logs.
      const r = await fetch(url,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":st.aiKey},body:JSON.stringify(body)});
      const j = await r.json();
      const txt = j?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (txt) return txt;
      // Si Gemini no devolvió texto (error de clave, cuota, etc.), no engañes con una respuesta local:
      throw new Error("Gemini: " + (j?.error?.message || j?.candidates?.[0]?.finishReason || "respuesta vacía"));
    }
    if (st.aiKey && st.aiKey.startsWith("gsk_")) {  // Groq (gsk_…)
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${st.aiKey}`},
        body:JSON.stringify({ model:"llama-3.3-70b-versatile", messages:[
          {role:"system",content:sys},
          ...(history&&history.length ? history.slice(-12).map(m=>({role:m.who==="me"?"user":"assistant",content:sinClaves(m.text, st.aiKey)})) : [{role:"user",content:sinClaves(text, st.aiKey)}])
        ]})
      });
      const j = await r.json();
      const txt = j?.choices?.[0]?.message?.content;
      if (txt) return txt;
      throw new Error("Groq: " + (j?.error?.message || "respuesta vacía"));
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
    // 2) Guarda gustos/preferencias (efecto lateral, para que la IA los recuerde)
    const isPref = capturePreference(text);
    // 3) Con IA real: deja que Gemini razone (ya tiene la instrucción de alcance)
    if (st.aiKey) {  // Si hay clave, usa la IA de verdad (sin depender del "proveedor")
      try { return await apiReply(text, history); }
      catch (e) {
        // Distinguir "no hay internet" de "la API ha rechazado la petición": decir
        // "no pude conectar" cuando la clave es inválida deja al usuario sin pistas.
        const msg = String(e?.message||"");
        const esRed = (e instanceof TypeError) || /failed to fetch|networkerror|load failed/i.test(msg);
        const nota = esRed
          ? L("_(Sin conexión con la IA; te respondo yo desde aquí 🥕)_",
              "_(Sense connexió amb la IA; et responc jo des d'aquí 🥕)_",
              "_(No connection to the AI; answering from here 🥕)_")
          : /clave|api key|api_key|invalid|permission|denied|unauthorized|401|403/i.test(msg)
            ? L("_(⚠️ Tu clave de IA no es válida o no tiene permiso. Revísala en Ajustes › IA. Mientras, te respondo yo 🥕)_",
                "_(⚠️ La teva clau d'IA no és vàlida o no té permís. Revisa-la a Ajustos › IA. Mentrestant, et responc jo 🥕)_",
                "_(⚠️ Your AI key is invalid or lacks permission. Check it in Settings › AI. Meanwhile, I'll answer 🥕)_")
            : /quota|rate|429|exhaust|limit/i.test(msg)
              ? L("_(⚠️ Has agotado la cuota gratuita de la IA por ahora. Vuelve a intentarlo más tarde; mientras, te respondo yo 🥕)_",
                  "_(⚠️ Has esgotat la quota gratuïta de la IA per ara. Torna-ho a provar més tard; mentrestant, et responc jo 🥕)_",
                  "_(⚠️ You've used up the free AI quota for now. Try again later; meanwhile, I'll answer 🥕)_")
              : L("_(La IA no me ha respondido esta vez; te contesto yo desde aquí 🥕)_",
                  "_(La IA no m'ha respost aquesta vegada; et contesto jo des d'aquí 🥕)_",
                  "_(The AI didn't answer this time; here's my own reply 🥕)_");
        return localReply(text) + "\n\n" + nota;
      }
    }
    // 4) Modo local: si expresó gustos, confírmalo; si no, redirección suave
    if (isPref) return prefAck();
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
    if(st.aiKey && !st.aiKey.startsWith("gsk_")){  // Gemini por formato de clave, igual que el chat
      const url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
      const body={ contents:[{ role:"user", parts:[ {text:prompt}, {inline_data:{mime_type:mime, data:b64}} ] }] };
      const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":st.aiKey},body:JSON.stringify(body)});
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
