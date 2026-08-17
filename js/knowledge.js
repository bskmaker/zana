/* =========================================================
   ZANA · Base de conocimiento (evidencia) + ejercicios casa/calle
   + tiempos de descongelación + dietas especiales
   Fuentes: ISSN Position Stands (protein & exercise, diets & body
   composition), meta-análisis de recomposición corporal.
   ========================================================= */
window.ZKB = (() => {

  // ---- Conocimiento nutricional por objetivo (basado en evidencia) --------
  const KNOWLEDGE = {
    masa: {
      titulo:"Ganar masa muscular y peso",
      energia:"Superávit moderado: +10–20% sobre tu mantenimiento (≈ +250 a +500 kcal/día). Subir de peso ~0,25–0,5% del peso corporal por semana; más rápido solo añade grasa.",
      proteina:"1,6–2,2 g/kg/día (hasta 2,4 en avanzados). Reparte en dosis de 20–40 g cada 3–4 h.",
      grasas:"0,8–1 g/kg/día como mínimo para hormonas.",
      carbos:"El resto de calorías; clave para entrenar fuerte y recuperar.",
      claves:[
        "La sobrecarga progresiva (subir peso/reps) es el motor: la comida solo construye lo que el entreno estimula.",
        "Superávit pequeño y constante > superávit grande (menos grasa).",
        "Proteína repartida en 4–5 tomas mejora la síntesis proteica.",
        "Dormir 7–9 h y controlar el estrés multiplican resultados.",
      ],
    },
    definir: {
      titulo:"Perder grasa / definir manteniendo músculo",
      energia:"Déficit moderado: −10–20% (≈ −300 a −500 kcal/día). Perder 0,5–1% del peso por semana; déficits agresivos hacen perder músculo.",
      proteina:"2,0–3,1 g/kg/día en déficit para retener músculo (cuanto mayor el déficit, más proteína).",
      grasas:"0,6–0,8 g/kg/día mínimo.",
      carbos:"El resto; priorízalos alrededor del entreno.",
      claves:[
        "Proteína alta + entreno de fuerza = pierdes grasa, no músculo.",
        "El ritmo lento (0,5–1%/sem) conserva rendimiento y músculo.",
        "Prioriza alimentos saciantes: proteína magra, verdura, fibra.",
        "Los pasos diarios (NEAT) y el sueño mandan más de lo que crees.",
      ],
    },
    recomp: {
      titulo:"Recomposición (ganar músculo y perder grasa a la vez)",
      energia:"Cerca del mantenimiento (déficit pequeño <300 kcal o eucalórico). Funciona mejor en principiantes, tras un parón o con grasa 20–30%+.",
      proteina:"2,2–3,1 g/kg/día — es el factor más importante aquí.",
      grasas:"0,8 g/kg/día.",
      carbos:"El resto, en torno al entreno.",
      claves:[
        "Es lenta: paciencia y constancia máxima.",
        "Entrena fuerza 3–4 días con sobrecarga progresiva.",
        "Mantén proteína muy alta aunque las calorías estén ajustadas.",
      ],
    },
    mantener: {
      titulo:"Mantenimiento y salud",
      energia:"Calorías de mantenimiento (tu gasto total). Ajusta ±100–150 kcal según el peso semanal.",
      proteina:"1,6 g/kg/día para salud y masa muscular.",
      grasas:"0,8–1 g/kg/día, prioriza insaturadas (aceite oliva, pescado, frutos secos).",
      carbos:"El resto; base de verdura, fruta, integrales y legumbre.",
      claves:[
        "Patrón mediterráneo: mucha planta, proteína de calidad, poco ultraprocesado.",
        "Regla del plato: ½ verdura, ¼ proteína, ¼ carbo integral.",
        "Hidratación ~35 ml/kg y 25–35 g de fibra al día.",
      ],
    },
  };

  const HIDRATACION = "Bebe ~35 ml por kg de peso al día (más si entrenas o hace calor). El color claro de la orina es buena señal.";

  // ---- Tipos de cuerpo (somatotipo) — ajuste calórico práctico ------------
  // Basado en la práctica clínica/deportiva: los hardgainers (ectomorfos)
  // necesitan más energía; los endomorfos, superávit más contenido.
  const BODY_TYPES = {
    ecto: { label:"Ectomorfo (delgado, hardgainer)", neat:"+5% (NEAT alto)",
      guia:"Metabolismo rápido y muy movido; el gasto real suele superar a las fórmulas. Para GANAR MASA usa superávit alto (~+20-25% sobre el gasto) y no temas los carbohidratos. Si no sube el peso en 2-3 semanas, añade 200-300 kcal." },
    meso: { label:"Mesomorfo (atlético)", neat:"normal",
      guia:"Responde bien: gana músculo y pierde grasa con facilidad. Superávit (+15%) y déficit (-20%) estándar funcionan." },
    endo: { label:"Endomorfo (tiende a engordar)", neat:"-5%",
      guia:"Acumula grasa con facilidad. Para masa, superávit contenido (~+10%) y mucha proteína/fibra; para definir, déficit algo mayor (-22%). Controla los carbohidratos refinados." },
  };
  function bodyTypeInfo(bt){ return BODY_TYPES[bt] || BODY_TYPES.meso; }

  // ---- Tiempos de descongelación (por pasillo/tipo) -----------------------
  // hours = antelación recomendada para sacar del congelador (nevera).
  // Tiempo = método RÁPIDO y seguro (agua fría), que es lo práctico para el día a día.
  // Cada tip incluye también la opción lenta (nevera) y avisa de no hacerlo a temperatura ambiente.
  const DEFROST = {
    pollo:    { hours:1.5, tip:"Rápido: en agua fría (bolsa cerrada), ~1 h por cada 500 g, cambiando el agua cada 30 min. Lento: nevera la noche anterior (~12 h, sin vigilar). Nunca a temperatura ambiente. Cocínalo el mismo día." },
    carne:    { hours:1.5, tip:"Rápido: en agua fría (bolsa cerrada), ~1 h por cada 500 g. Lento: nevera la noche anterior. Nunca a temperatura ambiente." },
    pescado:  { hours:1,   tip:"Rápido: en agua fría (bolsa cerrada), ~45 min–1 h. Lento: nevera 5–6 h. Nunca a temperatura ambiente." },
    salsa:    { hours:1.5, tip:"Al micro en modo descongelar, o en agua fría ~1,5 h, o a la nevera la noche anterior." },
    guiso:    { hours:1.5, tip:"Directo a fuego lento tapado desde congelado, o a la nevera la noche anterior." },
    arroz:    { hours:0,   tip:"Directo del congelador al micro/sartén con unas gotas de agua (sin descongelar)." },
    verdura:  { hours:0,   tip:"Se cocina directa desde congelada, sin descongelar." },
    legumbre: { hours:0,   tip:"Directas al guiso o al micro desde congeladas." },
    pan:      { hours:0,   tip:"Directo a la tostadora, o 1–2 h a temperatura ambiente." },
    default:  { hours:1,   tip:"En agua fría (bolsa cerrada) ~1 h, o a la nevera la noche anterior." },
  };
  function defrostFor(fid){
    const f = window.ZDATA.FOODS[fid];
    const aisle = f?.aisle;
    if (fid==="pollo"||fid==="pavo") return DEFROST.pollo;
    if (aisle==="carne") return DEFROST.carne;
    if (aisle==="pescado") return DEFROST.pescado;
    if (aisle==="verduras"||aisle==="fruta") return DEFROST.verdura;
    if (fid==="arroz"||fid==="arrozint"||fid==="pasta") return DEFROST.arroz;
    if (fid==="lenteja"||fid==="garbanzo") return DEFROST.legumbre;
    if (aisle==="panaderia") return DEFROST.pan;
    return DEFROST.default;
  }

  // ---- Dibujos de ejercicios (SVG claros, casa/calle) ---------------------
  function fig(inner){
    return `<svg viewBox="0 0 120 96" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <line x1="8" y1="86" x2="112" y2="86" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".28"/>
      <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  }
  const H = 'r="9" fill="currentColor" stroke="none"'; // cabeza
  const POSES = {
    // Sentadilla (vista lateral, rodillas flexionadas)
    squat: fig('<circle cx="52" cy="20" '+H+'/><path d="M52 29 l4 22"/><path d="M56 51 l-16 6 l0 29"/><path d="M56 51 l14 10 l0 25"/><path d="M52 34 l18 6"/>'),
    // Flexión (plancha con brazos)
    pushup: fig('<circle cx="24" cy="52" '+H+'/><path d="M33 55 l60 6"/><path d="M46 57 l-2 29 M86 61 l0 25"/><path d="M33 55 l-6 31"/>'),
    // Plancha (cuerpo recto sobre antebrazos)
    plank: fig('<circle cx="22" cy="50" '+H+'/><path d="M31 53 l64 8"/><path d="M40 55 l-8 31 M40 55 l0 31 M90 62 l0 24"/>'),
    // Zancada
    lunge: fig('<circle cx="56" cy="18" '+H+'/><path d="M56 27 l0 26"/><path d="M56 53 l-22 10 l0 23"/><path d="M56 53 l20 20 l0 13"/><path d="M56 33 l-14 8 M56 33 l14 4"/>'),
    // Puente de glúteo (tumbado, cadera arriba)
    bridge: fig('<circle cx="98" cy="60" '+H+'/><path d="M24 84 l30 -26 l38 8"/><path d="M24 84 l0 2 M54 58 l0 26"/>'),
    // Abdominal (crunch)
    crunch: fig('<circle cx="34" cy="46" '+H+'/><path d="M34 55 l22 20 l30 8"/><path d="M56 75 l-6 11 M56 75 l24 6 l8 -10"/>'),
    // Correr
    run: fig('<circle cx="66" cy="16" '+H+'/><path d="M66 25 l-6 26"/><path d="M60 51 l-18 8 M60 51 l20 16 l-4 15"/><path d="M62 32 l-20 -2 M62 32 l20 12"/>'),
    // Jumping jack (estrella)
    jump: fig('<circle cx="60" cy="16" '+H+'/><path d="M60 25 l0 26"/><path d="M60 51 l-20 30 M60 51 l20 30"/><path d="M60 30 l-28 -12 M60 30 l28 -12"/>'),
    // Burpee (salto con brazos arriba)
    burpee: fig('<circle cx="60" cy="14" '+H+'/><path d="M60 23 l0 22"/><path d="M60 45 l-16 26 M60 45 l16 26"/><path d="M60 27 l-20 -14 M60 27 l20 -14"/>'),
    // Descanso / estiramiento
    rest: fig('<circle cx="60" cy="26" '+H+'/><path d="M60 35 l0 22"/><path d="M60 57 l-16 24 M60 57 l16 24"/><path d="M60 40 q22 -8 30 6"/>'),
  };
  function drawExercise(pose){ return POSES[pose] || POSES.rest; }

  // Cómo hacer cada ejercicio correctamente (breve)
  const HOWTO = {
    squat:{ t:"Sentadilla", s:["Pies al ancho de los hombros, puntas ligeramente hacia fuera.","Baja como si te sentaras en una silla, pecho arriba y espalda recta.","Rodillas en línea con las puntas (no hacia dentro).","Baja hasta que los muslos queden paralelos al suelo y sube apretando glúteos."] },
    pushup:{ t:"Flexiones", s:["Manos algo más anchas que los hombros, cuerpo recto de cabeza a talones.","Baja doblando los codos hacia atrás (no en cruz) hasta casi tocar el suelo.","Empuja para subir sin arquear la espalda.","¿Muy difícil? Apoya las rodillas."] },
    plank:{ t:"Plancha", s:["Antebrazos en el suelo, codos bajo los hombros.","Cuerpo en línea recta: no subas ni hundas la cadera.","Aprieta abdomen y glúteos.","Respira con normalidad y aguanta el tiempo indicado."] },
    lunge:{ t:"Zancadas", s:["Da un paso largo al frente.","Baja doblando ambas rodillas ~90°; la de atrás casi toca el suelo.","La rodilla delantera no pasa la punta del pie.","Empuja con el talón delantero para volver y cambia de pierna."] },
    bridge:{ t:"Puente de glúteo", s:["Túmbate boca arriba, rodillas dobladas y pies apoyados.","Sube la cadera apretando los glúteos hasta alinear rodillas-cadera-hombros.","Aguanta 1 segundo arriba.","Baja despacio sin apoyar del todo."] },
    crunch:{ t:"Abdominales", s:["Boca arriba, rodillas dobladas, manos en el pecho o nuca sin tirar.","Sube los hombros del suelo con el abdomen (no con el cuello).","Exhala al subir, aguanta un instante.","Baja controlando, sin dejarte caer."] },
    run:{ t:"Carrera / trote", s:["Postura erguida, mirada al frente, hombros relajados.","Pisada suave bajo el cuerpo, no adelantada.","Brazos a 90° acompañando el movimiento.","Respira de forma rítmica; ve a un ritmo que te deje hablar."] },
    jump:{ t:"Jumping jacks", s:["De pie, brazos a los lados.","Salta abriendo piernas y subiendo los brazos por encima de la cabeza.","Salta de nuevo cerrando a la posición inicial.","Mantén un ritmo constante y cae con las rodillas algo flexionadas."] },
    burpee:{ t:"Burpees", s:["De pie, baja a cuclillas y apoya las manos.","Lleva los pies atrás a posición de plancha (opcional: una flexión).","Recoge los pies y salta hacia arriba con los brazos estirados.","Cae suave y encadena la siguiente repetición."] },
    rest:{ t:"Descanso activo / estiramiento", s:["Respira profundo y relaja la musculatura.","Estira suavemente cuello, espalda y piernas.","Sin rebotes: mantén cada estiramiento 20-30 s.","Hidrátate."] },
  };
  function howTo(pose){ return HOWTO[pose] || HOWTO.rest; }

  // ---- Planes de ejercicio (casa/calle) por objetivo ----------------------
  // Cada ejercicio: [pose, nombre, series/tiempo, detalle, "peso/intensidad"]
  const EXERCISES = {
    masa: {
      focus:"Fuerza en casa para ganar músculo", perWeek:4,
      days:[
        { name:"Tren superior (empuje)", items:[
          ["pushup","Flexiones","4 × 8-12","Cuerpo recto, baja el pecho al suelo","Peso corporal / mochila"],
          ["pushup","Flexiones diamante","3 × 8-10","Manos juntas, trabaja tríceps","Peso corporal"],
          ["jump","Pica hombros (pike push-up)","3 × 8","Cadera arriba, baja la cabeza","Peso corporal"],
          ["plank","Plancha","3 × 45 s","Core firme, sin hundir cadera","—"],
        ]},
        { name:"Tren inferior", items:[
          ["squat","Sentadilla","4 × 12-15","Baja hasta muslos paralelos","Mochila cargada opcional"],
          ["lunge","Zancadas","3 × 12/pierna","Rodilla no pasa la punta del pie","Botellas de agua"],
          ["bridge","Puente de glúteo","4 × 15","Aprieta glúteo arriba 1 s","Peso en cadera opcional"],
          ["squat","Sentadilla búlgara","3 × 10/pierna","Pie trasero en silla","Mochila"],
        ]},
        { name:"Tirón + core", items:[
          ["run","Remo con mochila/goma","4 × 12","Lleva codos atrás, aprieta espalda","Goma o mochila"],
          ["crunch","Encogimientos","3 × 15","Sube con el abdomen, no el cuello","—"],
          ["plank","Plancha lateral","3 × 30 s/lado","Cadera alta","—"],
          ["burpee","Burpees","3 × 10","Explosivo, controla la bajada","Peso corporal"],
        ]},
        { name:"Full-body", items:[
          ["squat","Sentadilla salto","3 × 12","Explota arriba, cae suave","Peso corporal"],
          ["pushup","Flexiones","3 × máx","Hasta casi el fallo","Peso corporal"],
          ["lunge","Zancadas caminando","3 × 20 pasos","Ritmo constante","Mochila"],
          ["plank","Plancha","3 × 60 s","Aguanta firme","—"],
        ]},
      ]
    },
    definir: {
      focus:"Grasa fuera: fuerza + cardio en casa/calle", perWeek:4,
      days:[
        { name:"Circuito full-body", items:[
          ["burpee","Burpees","4 × 12","Sin pausa, ritmo alto","Peso corporal"],
          ["squat","Sentadilla salto","4 × 15","Explosivo","Peso corporal"],
          ["pushup","Flexiones","4 × 10","Controladas","Peso corporal"],
          ["plank","Plancha","3 × 45 s","Core firme","—"],
        ]},
        { name:"Cardio calle", items:[
          ["run","Carrera continua","1 × 30 min","Ritmo cómodo, puedes hablar","Suave (LISS)"],
          ["run","Sprints","8 × 20 s","Al máximo, 40 s andando","Alta intensidad"],
          ["crunch","Abdominales","3 × 20","Al volver a casa","—"],
        ]},
        { name:"Tren inferior + core", items:[
          ["lunge","Zancadas","4 × 15/pierna","Ritmo alto","Botellas"],
          ["bridge","Puente de glúteo","4 × 20","Aprieta arriba","—"],
          ["jump","Jumping jacks","4 × 40","Cardio + coordinación","Peso corporal"],
          ["plank","Plancha lateral","3 × 30 s/lado","—","—"],
        ]},
        { name:"HIIT casa", items:[
          ["burpee","Burpees","6 × 30 s","30 s on / 30 s off","Máx intensidad"],
          ["squat","Sentadilla salto","6 × 30 s","Alterna con burpees","—"],
          ["run","Rodillas al pecho","6 × 30 s","Mountain climbers de pie","—"],
          ["rest","Descanso activo","5 min","Estira y respira","—"],
        ]},
      ]
    },
    recomp: {
      focus:"Fuerza + algo de cardio en casa", perWeek:4,
      days:[
        { name:"Empuje", items:[
          ["pushup","Flexiones","4 × 10-12","Controladas","Mochila opcional"],
          ["jump","Pike push-up","3 × 8","Hombros","—"],
          ["plank","Plancha","3 × 45 s","—","—"],
        ]},
        { name:"Pierna", items:[
          ["squat","Sentadilla","4 × 15","Profunda","Mochila"],
          ["lunge","Zancadas","3 × 12/pierna","—","Botellas"],
          ["bridge","Puente glúteo","4 × 15","—","—"],
        ]},
        { name:"Tirón + core", items:[
          ["run","Remo con goma","4 × 12","Aprieta espalda","Goma"],
          ["crunch","Abdominales","3 × 20","—","—"],
          ["burpee","Burpees","3 × 10","—","—"],
        ]},
        { name:"Cardio suave", items:[
          ["run","Caminar rápido/trote","1 × 30 min","Suave","LISS"],
          ["plank","Plancha","3 × 60 s","—","—"],
        ]},
      ]
    },
    mantener: {
      focus:"Estar en forma en casa/calle", perWeek:3,
      days:[
        { name:"Full-body A", items:[
          ["squat","Sentadilla","3 × 15","Técnica limpia","Peso corporal"],
          ["pushup","Flexiones (rodillas si hace falta)","3 × 10","—","—"],
          ["bridge","Puente glúteo","3 × 15","—","—"],
          ["plank","Plancha","3 × 40 s","—","—"],
        ]},
        { name:"Cardio + movilidad", items:[
          ["run","Caminar/correr","1 × 30 min","A tu ritmo","Suave"],
          ["jump","Jumping jacks","3 × 30","Calienta","—"],
          ["rest","Estiramientos","10 min","Cuello, espalda, piernas","—"],
        ]},
        { name:"Full-body B", items:[
          ["lunge","Zancadas","3 × 12/pierna","—","—"],
          ["pushup","Flexiones","3 × 10","—","—"],
          ["crunch","Abdominales","3 × 15","—","—"],
          ["plank","Plancha lateral","3 × 30 s/lado","—","—"],
        ]},
      ]
    },
  };

  // ---- Dietas especiales --------------------------------------------------
  // excludeFoods: ids a evitar; note: aviso para el usuario/IA
  const SPECIAL_DIETS = [
    { id:"ninguna", emoji:"🍽️", name:"Sin restricción", desc:"Como de todo.", excludeFoods:[] },
    { id:"vegetariana", emoji:"🥗", name:"Vegetariana", desc:"Sin carne ni pescado; sí huevo y lácteos.", excludeFoods:["pollo","pavo","ternera","salmon","atun","merluza","gambas"] },
    { id:"vegana", emoji:"🌱", name:"Vegana", desc:"Sin ningún producto animal.", excludeFoods:["pollo","pavo","ternera","salmon","atun","merluza","gambas","huevo","yogur","leche","quesofresco","proteina","miel"] },
    { id:"pescetariana", emoji:"🐟", name:"Pescetariana", desc:"Sin carne; sí pescado, huevo y lácteos.", excludeFoods:["pollo","pavo","ternera"] },
    { id:"sin_gluten", emoji:"🌾", name:"Sin gluten (celiaquía)", desc:"Evita trigo, cebada y centeno.", excludeFoods:["pan","pasta","avena"], note:"Usa avena certificada sin gluten, arroz, patata, legumbre y maíz." },
    { id:"sin_lactosa", emoji:"🥛", name:"Sin lactosa", desc:"Evita lácteos con lactosa.", excludeFoods:["leche","yogur","quesofresco"], note:"Opción: bebidas vegetales y yogures sin lactosa." },
    { id:"fodmap", emoji:"🫃", name:"Baja en FODMAP", desc:"Para intestino sensible/SII. Reduce fermentables.", excludeFoods:["cebolla","garbanzo","lenteja","manzana","miel"], note:"Evita cebolla, ajo, legumbre, manzana, miel; usa aceite de ajo infusionado, plátano poco maduro, zanahoria, patata, arroz." },
    { id:"keto", emoji:"🥑", name:"Cetogénica (keto)", desc:"Muy baja en carbohidratos, alta en grasa.", excludeFoods:["arroz","arrozint","pasta","pan","avena","patata","boniato","platano","miel","manzana"], note:"Base de huevo, carne, pescado, aguacate, aceite, verdura de hoja y frutos secos." },
    { id:"mediterranea", emoji:"🫒", name:"Mediterránea", desc:"Patrón cardiosaludable y sostenible.", excludeFoods:[], note:"Prioriza verdura, legumbre, pescado, aceite de oliva y fruta; poca carne roja y ultraprocesados." },
    { id:"dash", emoji:"❤️", name:"DASH (tensión alta)", desc:"Para bajar la presión arterial.", excludeFoods:[], note:"Baja en sal y ultraprocesados; rica en verdura, fruta, lácteos desnatados y grano integral." },
    { id:"diabetica", emoji:"🩸", name:"Control glucémico", desc:"Para diabetes/resistencia a la insulina.", excludeFoods:["miel"], note:"Carbohidratos integrales y con fibra, repartidos; combina siempre con proteína y grasa." },
    { id:"sin_frutos_secos", emoji:"🥜", name:"Alergia a frutos secos", desc:"Evita frutos secos y derivados.", excludeFoods:["almendra","mantequillacacahuete"], note:"Revisa etiquetas por trazas." },
  ];
  function specialDietById(id){ return SPECIAL_DIETS.find(d=>d.id===id) || SPECIAL_DIETS[0]; }

  return { KNOWLEDGE, HIDRATACION, BODY_TYPES, bodyTypeInfo, DEFROST, defrostFor, drawExercise, howTo, EXERCISES, SPECIAL_DIETS, specialDietById };
})();
