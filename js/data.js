/* =========================================================
   ZANA · Base de datos (alimentos, recetas, preparados, gym)
   Macros por 100 g salvo que se indique. Precios €/kg aprox (España).
   ========================================================= */
window.ZDATA = (() => {

  // ---- Alimentos -----------------------------------------------------------
  // aisle: pasillo del súper para agrupar la lista de la compra
  const FOODS = {
    pollo:      { name: "Pechuga de pollo", emoji: "🍗", per100:{kcal:120,p:23,c:0,f:2.6}, aisle:"carne",   price:6.5,  brands:["Coren","El Pozo"] },
    pavo:       { name: "Pechuga de pavo",  emoji: "🦃", per100:{kcal:110,p:24,c:0.5,f:1.5}, aisle:"carne", price:8.0,  brands:["Coren"] },
    ternera:    { name: "Ternera magra",    emoji: "🥩", per100:{kcal:158,p:26,c:0,f:6}, aisle:"carne",     price:12.0, brands:[] },
    huevo:      { name: "Huevos",           emoji: "🥚", per100:{kcal:143,p:13,c:1.1,f:9.5}, aisle:"nevera", price:3.2, unit:"ud", gPerUnit:60, brands:["Camperos"] },
    salmon:     { name: "Salmón",           emoji: "🐟", per100:{kcal:208,p:20,c:0,f:13}, aisle:"pescado",  price:16.0, brands:[] },
    atun:       { name: "Atún al natural",  emoji: "🐟", per100:{kcal:116,p:26,c:0,f:1}, aisle:"conservas",  price:9.0,  brands:["Isabel","Calvo"] },
    merluza:    { name: "Merluza",          emoji: "🐠", per100:{kcal:90,p:18,c:0,f:2}, aisle:"pescado",     price:10.0, brands:[] },
    gambas:     { name: "Gambas",           emoji: "🦐", per100:{kcal:99,p:24,c:0,f:0.3}, aisle:"pescado",   price:14.0, brands:[] },
    arroz:      { name: "Arroz",            emoji: "🍚", per100:{kcal:350,p:7,c:78,f:0.9}, aisle:"despensa", price:1.6,  brands:["SOS","Brillante"] },
    arrozint:   { name: "Arroz integral",   emoji: "🍚", per100:{kcal:340,p:8,c:72,f:2.5}, aisle:"despensa", price:2.2, brands:["Brillante"] },
    pasta:      { name: "Pasta",            emoji: "🍝", per100:{kcal:355,p:12,c:71,f:1.5}, aisle:"despensa", price:1.5, brands:["Gallo","Barilla"] },
    avena:      { name: "Copos de avena",   emoji: "🥣", per100:{kcal:375,p:13,c:60,f:7}, aisle:"despensa",  price:2.0,  brands:["Quaker","Hacendado"] },
    pan:        { name: "Pan integral",     emoji: "🍞", per100:{kcal:247,p:9,c:41,f:3.5}, aisle:"panaderia", price:2.5, brands:["Bimbo"] },
    patata:     { name: "Patata",           emoji: "🥔", per100:{kcal:77,p:2,c:17,f:0.1}, aisle:"verduras",  price:1.2,  brands:[] },
    boniato:    { name: "Boniato",          emoji: "🍠", per100:{kcal:86,p:1.6,c:20,f:0.1}, aisle:"verduras", price:2.2, brands:[] },
    lenteja:    { name: "Lentejas",         emoji: "🫘", per100:{kcal:116,p:9,c:20,f:0.4}, aisle:"despensa", price:2.0,  brands:["Luengo"] },
    garbanzo:   { name: "Garbanzos",        emoji: "🫘", per100:{kcal:164,p:9,c:27,f:2.6}, aisle:"despensa", price:2.0,  brands:["Luengo"] },
    brocoli:    { name: "Brócoli",          emoji: "🥦", per100:{kcal:34,p:2.8,c:7,f:0.4}, aisle:"verduras", price:2.8,  brands:[] },
    espinaca:   { name: "Espinacas",        emoji: "🥬", per100:{kcal:23,p:2.9,c:3.6,f:0.4}, aisle:"verduras", price:3.0, brands:[] },
    tomate:     { name: "Tomate",           emoji: "🍅", per100:{kcal:18,p:0.9,c:3.9,f:0.2}, aisle:"verduras", price:2.0, brands:[] },
    pimiento:   { name: "Pimiento",         emoji: "🫑", per100:{kcal:31,p:1,c:6,f:0.3}, aisle:"verduras",   price:2.5,  brands:[] },
    cebolla:    { name: "Cebolla",          emoji: "🧅", per100:{kcal:40,p:1.1,c:9,f:0.1}, aisle:"verduras", price:1.3,  brands:[] },
    zanahoria:  { name: "Zanahoria",        emoji: "🥕", per100:{kcal:41,p:0.9,c:10,f:0.2}, aisle:"verduras", price:1.2, brands:[] },
    aguacate:   { name: "Aguacate",         emoji: "🥑", per100:{kcal:160,p:2,c:9,f:15}, aisle:"verduras",   price:5.0,  brands:[] },
    platano:    { name: "Plátano",          emoji: "🍌", per100:{kcal:89,p:1.1,c:23,f:0.3}, aisle:"fruta",   price:1.8,  brands:[] },
    manzana:    { name: "Manzana",          emoji: "🍎", per100:{kcal:52,p:0.3,c:14,f:0.2}, aisle:"fruta",   price:2.0,  brands:[] },
    fresa:      { name: "Fresas",           emoji: "🍓", per100:{kcal:33,p:0.7,c:8,f:0.3}, aisle:"fruta",    price:4.0,  brands:[] },
    arandano:   { name: "Arándanos",        emoji: "🫐", per100:{kcal:57,p:0.7,c:14,f:0.3}, aisle:"fruta",   price:12.0, brands:[] },
    yogur:      { name: "Yogur griego",     emoji: "🥛", per100:{kcal:97,p:9,c:4,f:5}, aisle:"nevera",       price:3.5,  brands:["Fage","Hacendado"] },
    leche:      { name: "Leche semi",       emoji: "🥛", per100:{kcal:47,p:3.2,c:4.8,f:1.6}, aisle:"nevera", price:0.9,  brands:["Pascual"] },
    quesofresco:{ name: "Queso fresco batido", emoji:"🧀", per100:{kcal:70,p:11,c:4,f:0.5}, aisle:"nevera",  price:2.5,  brands:["Burgo de Arias"] },
    proteina:   { name: "Proteína whey",    emoji: "🥤", per100:{kcal:390,p:80,c:6,f:6}, aisle:"suplementos", price:22.0, unit:"scoop", gPerUnit:30, brands:["MyProtein","HSN"] },
    aceite:     { name: "Aceite de oliva",  emoji: "🫒", per100:{kcal:884,p:0,c:0,f:100}, aisle:"despensa",  price:9.0,  brands:["Carbonell"] },
    almendra:   { name: "Almendras",        emoji: "🌰", per100:{kcal:579,p:21,c:22,f:50}, aisle:"despensa", price:12.0, brands:[] },
    mantequillacacahuete:{ name:"Crema de cacahuete", emoji:"🥜", per100:{kcal:588,p:25,c:20,f:50}, aisle:"despensa", price:8.0, brands:["MyProtein"] },
    miel:       { name: "Miel",             emoji: "🍯", per100:{kcal:304,p:0.3,c:82,f:0}, aisle:"despensa",  price:8.0,  brands:[] },
    tomatefrito:{ name: "Tomate triturado", emoji: "🥫", per100:{kcal:35,p:1.5,c:6,f:0.5}, aisle:"conservas", price:1.5, brands:["Orlando"] },

    // ---- Ampliación: más opciones y dietas especiales --------------------
    lomo:       { name: "Lomo de cerdo",     emoji: "🥩", per100:{kcal:143,p:21,c:0,f:6}, aisle:"carne",   price:8.0,  brands:[] },
    bacalao:    { name: "Bacalao",           emoji: "🐟", per100:{kcal:82,p:18,c:0,f:0.7}, aisle:"pescado", price:12.0, brands:[] },
    sardinas:   { name: "Sardinas en lata",  emoji: "🐟", per100:{kcal:208,p:24,c:0,f:12}, aisle:"conservas", price:9.0, brands:["Isabel","Calvo"] },
    tofu:       { name: "Tofu",              emoji: "⬜", per100:{kcal:76,p:8,c:1.9,f:4.8}, aisle:"nevera", price:6.0, brands:["Hacendado"] },
    tempeh:     { name: "Tempeh",            emoji: "🟫", per100:{kcal:193,p:19,c:9,f:11}, aisle:"nevera",  price:10.0, brands:[] },
    edamame:    { name: "Edamame",           emoji: "🫛", per100:{kcal:121,p:11,c:9,f:5}, aisle:"verduras", price:6.0, brands:[] },
    sojatext:   { name: "Soja texturizada",  emoji: "🌱", per100:{kcal:340,p:50,c:30,f:1.5}, aisle:"despensa", price:8.0, brands:[] },
    alubias:    { name: "Alubias blancas",   emoji: "🫘", per100:{kcal:110,p:7,c:17,f:0.5}, aisle:"despensa", price:2.0, brands:["Luengo"] },
    guisantes:  { name: "Guisantes",         emoji: "🟢", per100:{kcal:81,p:5,c:14,f:0.4}, aisle:"verduras", price:3.0, brands:["Bonduelle"] },
    bebidasoja: { name: "Bebida de soja",    emoji: "🥛", per100:{kcal:43,p:3.3,c:2.5,f:1.8}, aisle:"nevera", price:1.2, brands:["Alpro"] },
    bebidaavena:{ name: "Bebida de avena",   emoji: "🥛", per100:{kcal:45,p:1,c:7,f:1.5}, aisle:"nevera",   price:1.5, brands:["Alpro","Oatly"] },
    requeson:   { name: "Requesón",          emoji: "🧀", per100:{kcal:98,p:11,c:3,f:4.3}, aisle:"nevera",  price:3.0, brands:[] },
    quesocurado:{ name: "Queso curado",      emoji: "🧀", per100:{kcal:390,p:25,c:1.4,f:32}, aisle:"nevera", price:12.0, brands:[] },
    quinoa:     { name: "Quinoa",            emoji: "🌾", per100:{kcal:368,p:14,c:64,f:6}, aisle:"despensa", price:5.0, brands:["Brillante"] },
    tortitasarroz:{ name:"Tortitas de arroz",emoji: "🍘", per100:{kcal:387,p:8,c:81,f:3}, aisle:"despensa", price:2.0, brands:["Bicentury"] },
    nueces:     { name: "Nueces",            emoji: "🌰", per100:{kcal:654,p:15,c:14,f:65}, aisle:"despensa", price:14.0, brands:[] },
    aceitunas:  { name: "Aceitunas",         emoji: "🫒", per100:{kcal:115,p:0.8,c:6,f:11}, aisle:"conservas", price:4.0, brands:["La Española"] },
    chia:       { name: "Semillas de chía",  emoji: "⚫", per100:{kcal:486,p:17,c:42,f:31}, aisle:"despensa", price:8.0, brands:[] },
    chocolatenegro:{ name:"Chocolate negro 85%", emoji:"🍫", per100:{kcal:530,p:10,c:30,f:43}, aisle:"despensa", price:12.0, brands:["Valor","Lindt"] },
    calabacin:  { name: "Calabacín",         emoji: "🥒", per100:{kcal:17,p:1.2,c:3,f:0.3}, aisle:"verduras", price:2.0, brands:[] },
    berenjena:  { name: "Berenjena",         emoji: "🍆", per100:{kcal:25,p:1,c:6,f:0.2}, aisle:"verduras",  price:2.2, brands:[] },
    champinon:  { name: "Champiñones",       emoji: "🍄", per100:{kcal:22,p:3,c:3.3,f:0.3}, aisle:"verduras", price:4.0, brands:[] },
    lechuga:    { name: "Lechuga",           emoji: "🥬", per100:{kcal:15,p:1.4,c:2.9,f:0.2}, aisle:"verduras", price:1.5, brands:[] },
    pepino:     { name: "Pepino",            emoji: "🥒", per100:{kcal:15,p:0.7,c:3.6,f:0.1}, aisle:"verduras", price:1.8, brands:[] },
    judiaverde: { name: "Judías verdes",     emoji: "🫛", per100:{kcal:31,p:1.8,c:7,f:0.2}, aisle:"verduras", price:3.5, brands:[] },
    coliflor:   { name: "Coliflor",          emoji: "🥦", per100:{kcal:25,p:1.9,c:5,f:0.3}, aisle:"verduras", price:2.5, brands:[] },
    ajo:        { name: "Ajo",               emoji: "🧄", per100:{kcal:149,p:6,c:33,f:0.5}, aisle:"verduras", price:6.0, brands:[] },
    naranja:    { name: "Naranja",           emoji: "🍊", per100:{kcal:47,p:0.9,c:12,f:0.1}, aisle:"fruta",   price:1.8, brands:[] },
    kiwi:       { name: "Kiwi",              emoji: "🥝", per100:{kcal:61,p:1.1,c:15,f:0.5}, aisle:"fruta",   price:4.0, brands:[] },
    pera:       { name: "Pera",              emoji: "🍐", per100:{kcal:57,p:0.4,c:15,f:0.1}, aisle:"fruta",   price:2.0, brands:[] },
    uvas:       { name: "Uvas",             emoji: "🍇", per100:{kcal:69,p:0.7,c:18,f:0.2}, aisle:"fruta",   price:3.0, brands:[] },
    pina:       { name: "Piña",             emoji: "🍍", per100:{kcal:50,p:0.5,c:13,f:0.1}, aisle:"fruta",   price:2.0, brands:[] },
    frambuesa:  { name: "Frambuesas",        emoji: "🍓", per100:{kcal:52,p:1.2,c:12,f:0.7}, aisle:"fruta",   price:12.0, brands:[] },

    // ---- Salsas y bases para dar sabor ----------------------------------
    salsasoja:  { name: "Salsa de soja",     emoji: "🍶", per100:{kcal:53,p:8,c:5,f:0.6}, aisle:"conservas", price:3.0, brands:["Kikkoman"] },
    mostaza:    { name: "Mostaza",           emoji: "🟡", per100:{kcal:66,p:4,c:5,f:4}, aisle:"conservas",   price:2.0, brands:["Maille"] },
    nata:       { name: "Nata para cocinar", emoji: "🥛", per100:{kcal:195,p:2.5,c:3.5,f:19}, aisle:"nevera", price:2.0, brands:["President"] },
    pesto:      { name: "Pesto",             emoji: "🌿", per100:{kcal:450,p:5,c:6,f:45}, aisle:"conservas", price:3.5, brands:["Barilla"] },
    lechecoco:  { name: "Leche de coco",     emoji: "🥥", per100:{kcal:180,p:2,c:3,f:19}, aisle:"conservas", price:2.5, brands:[] },
    tortillatrigo:{ name:"Tortillas de trigo", emoji:"🌯", per100:{kcal:300,p:8,c:50,f:7}, aisle:"panaderia", price:2.0, brands:["Old El Paso"] },
    curry:      { name: "Curry en polvo",    emoji: "🍛", per100:{kcal:325,p:13,c:56,f:14}, aisle:"despensa", price:3.0, brands:[] },
  };

  // ---- Recetas -------------------------------------------------------------
  // slot: desayuno | comida | cena | snack ; tags: easy, fast
  // ingredients en gramos (o unidades vía food.gPerUnit)
  const RECIPES = [
    {
      id:"avena-proteica", name:"Avena proteica con plátano", emoji:"🥣", grad:"linear-gradient(135deg,#FFD27A,#FF9E4A)",
      slot:"desayuno", time:8, servings:1, tags:["easy","fast"], prep:false,
      goals:["masa","mantener","recomp"],
      ingredients:[["avena",60],["leche",200],["platano",100],["proteina",30],["mantequillacacahuete",15]],
      steps:["Calienta la leche con la avena 2 min al micro o en cazo.","Añade el plátano en rodajas y la crema de cacahuete.","Deja templar y mezcla la proteína (para que no se corte).","Remata con un puñado de arándanos si tienes."]
    },
    {
      id:"tostada-aguacate-huevo", name:"Tostada de aguacate y huevo", emoji:"🥑", grad:"linear-gradient(135deg,#B6E3A0,#4FBF7B)",
      slot:"desayuno", time:10, servings:1, tags:["easy","fast"], prep:false,
      goals:["definir","mantener","recomp"],
      ingredients:[["pan",80],["aguacate",70],["huevo",120],["tomate",50]],
      steps:["Tuesta el pan integral.","Machaca el aguacate con sal y unas gotas de limón.","Haz los huevos a la plancha o pochados.","Monta: aguacate, tomate en rodajas y el huevo encima."]
    },
    {
      id:"yogur-frutos", name:"Bowl de yogur griego y frutos rojos", emoji:"🫐", grad:"linear-gradient(135deg,#C9B6FF,#8A6BFF)",
      slot:"desayuno", time:5, servings:1, tags:["easy","fast"], prep:false,
      goals:["definir","mantener","recomp","masa"],
      ingredients:[["yogur",200],["arandano",60],["fresa",60],["avena",30],["miel",10]],
      steps:["Pon el yogur griego en un bol.","Añade los frutos rojos y la avena por encima.","Un hilo de miel y listo."]
    },
    {
      id:"pollo-arroz-brocoli", name:"Pollo con arroz y brócoli", emoji:"🍗", grad:"linear-gradient(135deg,#FFB05C,#F26419)",
      slot:"comida", time:20, servings:1, tags:["easy"], prep:false,
      goals:["masa","recomp","mantener"],
      ingredients:[["pollo",180],["arroz",70],["brocoli",150],["aceite",10]],
      steps:["Cuece el arroz (usa la salsa base preparada si la tienes).","Saltea el pollo en dados con un poco de aceite y sal.","Cuece el brócoli al vapor 6-7 min para que quede al dente.","Emplata y aliña con un hilo de aceite de oliva."]
    },
    {
      id:"salmon-boniato", name:"Salmón a la sartén con boniato", emoji:"🐟", grad:"linear-gradient(135deg,#FF9E7A,#F2607A)",
      slot:"comida", time:25, servings:1, tags:["easy"], prep:false,
      goals:["definir","recomp","mantener","masa"],
      ingredients:[["salmon",160],["boniato",200],["espinaca",80],["aceite",8]],
      steps:["Cuece el boniato en dados en el micro tapado 6-7 min (o en cazo 15 min).","Haz el salmón a la sartén 3-4 min por lado.","Saltea las espinacas 2 min.","Sirve todo junto con un chorrito de aceite y limón."]
    },
    {
      id:"lentejas-verduras", name:"Lentejas con verduras", emoji:"🫘", grad:"linear-gradient(135deg,#E0A96D,#B4703A)",
      slot:"comida", time:30, servings:2, tags:["easy"], prep:true,
      goals:["mantener","definir","recomp"],
      ingredients:[["lenteja",160],["zanahoria",100],["cebolla",80],["pimiento",80],["tomatefrito",100],["aceite",10]],
      steps:["Sofríe cebolla, zanahoria y pimiento con la salsa base.","Añade el tomate y las lentejas (bote o cocidas).","Cubre con agua/caldo y cuece 15 min.","Rectifica de sal. Mejora de un día para otro."]
    },
    {
      id:"pasta-atun", name:"Pasta con atún y tomate", emoji:"🍝", grad:"linear-gradient(135deg,#FFC24B,#F2884B)",
      slot:"comida", time:15, servings:1, tags:["easy","fast"], prep:false,
      goals:["masa","mantener","recomp"],
      ingredients:[["pasta",90],["atun",80],["tomatefrito",120],["cebolla",50],["aceite",8]],
      steps:["Cuece la pasta al dente.","Calienta la salsa base de tomate con el atún.","Mezcla todo y sirve."]
    },
    {
      id:"pollo-wok", name:"Wok de pollo y verduras", emoji:"🥡", grad:"linear-gradient(135deg,#8FD694,#3FA76A)",
      slot:"cena", time:18, servings:1, tags:["easy","fast"], prep:false,
      goals:["definir","recomp","mantener"],
      ingredients:[["pollo",160],["pimiento",80],["brocoli",100],["zanahoria",80],["aceite",8]],
      steps:["Corta todo en tiras.","Saltea el pollo a fuego fuerte 3 min.","Añade las verduras y saltea 5 min más.","Un toque de salsa de soja al final."]
    },
    {
      id:"tortilla-espinacas", name:"Tortilla de espinacas y queso", emoji:"🍳", grad:"linear-gradient(135deg,#B6E3A0,#5BBF7B)",
      slot:"cena", time:12, servings:1, tags:["easy","fast"], prep:false,
      goals:["definir","recomp","mantener","masa"],
      ingredients:[["huevo",180],["espinaca",100],["quesofresco",60],["aceite",6]],
      steps:["Saltea las espinacas 2 min.","Bate los huevos, añade las espinacas y el queso.","Cuaja la tortilla a fuego medio por ambos lados."]
    },
    {
      id:"merluza-verduras", name:"Merluza a la plancha con verduras", emoji:"🐠", grad:"linear-gradient(135deg,#9AD0F5,#4A97F2)",
      slot:"cena", time:18, servings:1, tags:["easy","fast"], prep:false,
      goals:["definir","mantener","recomp"],
      ingredients:[["merluza",180],["pimiento",80],["cebolla",60],["patata",120],["aceite",8]],
      steps:["Cuece la patata en dados 10 min.","Haz la merluza a la plancha 3-4 min por lado.","Saltea el pimiento y la cebolla.","Sirve todo junto con sal y limón."]
    },
    {
      id:"batido-post", name:"Batido post-entreno", emoji:"🥤", grad:"linear-gradient(135deg,#FFB6C1,#FF6B9D)",
      slot:"snack", time:3, servings:1, tags:["easy","fast"], prep:false,
      goals:["masa","recomp"],
      ingredients:[["proteina",30],["platano",120],["leche",250],["avena",30]],
      steps:["Echa todo en la batidora.","Tritura 30 segundos y a beber."]
    },
    {
      id:"yogur-nueces", name:"Yogur con almendras y manzana", emoji:"🍎", grad:"linear-gradient(135deg,#FFD8A8,#FF9E4A)",
      slot:"snack", time:4, servings:1, tags:["easy","fast"], prep:false,
      goals:["definir","mantener","recomp"],
      ingredients:[["yogur",150],["almendra",20],["manzana",120]],
      steps:["Corta la manzana en dados.","Mezcla con el yogur y las almendras."]
    },
    {
      id:"hummus-crudites", name:"Hummus casero con crudités", emoji:"🥕", grad:"linear-gradient(135deg,#F5D06F,#E0A83A)",
      slot:"snack", time:8, servings:2, tags:["easy"], prep:true,
      goals:["definir","mantener","recomp","masa"],
      ingredients:[["garbanzo",150],["aceite",15],["zanahoria",100],["pimiento",80]],
      steps:["Tritura los garbanzos con aceite, ajo, limón y comino.","Corta zanahoria y pimiento en bastones.","Moja y disfruta. El hummus aguanta 4 días en nevera."]
    },
    {
      id:"tostada-pavo", name:"Tostada de pavo y queso", emoji:"🥪", grad:"linear-gradient(135deg,#FFD27A,#FFAE5C)",
      slot:"snack", time:5, servings:1, tags:["easy","fast"], prep:false,
      goals:["masa","recomp","mantener"],
      ingredients:[["pan",60],["pavo",80],["quesofresco",40],["tomate",40]],
      steps:["Tuesta el pan.","Monta con queso, pavo y tomate."]
    },

    // ===== Recetas variadas y sabrosas (fogón / micro, sin horno) =====
    {
      id:"pollo-teriyaki", name:"Pollo teriyaki con arroz", emoji:"🍗", grad:"linear-gradient(135deg,#F2884B,#D64500)",
      slot:"comida", time:18, servings:1, tags:["easy","fast"], prep:false, goals:["masa","recomp","mantener"],
      ingredients:[["pollo",170],["arroz",70],["salsasoja",20],["miel",12],["brocoli",120],["aceite",6]],
      steps:["Cuece el arroz (o usa el que tengas preparado).","Saltea el pollo en dados a fuego fuerte 4-5 min.","Baja el fuego, añade la salsa de soja y la miel y remueve 1-2 min hasta que brille y se glasee 🍯.","Cuece el brócoli tapado en el micro con un chorrito de agua 3-4 min.","Monta el bol: arroz, pollo teriyaki y brócoli. Sésamo por encima si tienes."]
    },
    {
      id:"wok-ternera", name:"Wok de ternera con soja", emoji:"🥢", grad:"linear-gradient(135deg,#B4703A,#7A4A1E)",
      slot:"comida", time:18, servings:1, tags:["easy","fast"], prep:false, goals:["masa","recomp","mantener"],
      ingredients:[["ternera",160],["pimiento",80],["cebolla",60],["zanahoria",70],["salsasoja",18],["arroz",70],["aceite",7]],
      steps:["Cuece el arroz.","Corta la ternera y las verduras en tiras finas.","Saltea la ternera a fuego fuerte 3 min y reserva.","Saltea las verduras 5 min, devuelve la carne y añade la salsa de soja.","Sirve sobre el arroz."]
    },
    {
      id:"pollo-curry", name:"Pollo al curry con arroz", emoji:"🍛", grad:"linear-gradient(135deg,#FFC24B,#E0A83A)",
      slot:"comida", time:20, servings:1, tags:["easy"], prep:false, goals:["masa","recomp","mantener"],
      ingredients:[["pollo",170],["lechecoco",120],["curry",8],["cebolla",70],["arroz",70],["aceite",6]],
      steps:["Cuece el arroz.","Sofríe la cebolla picada 3 min.","Añade el pollo en dados y dóralo.","Incorpora el curry, remueve 1 min, y vierte la leche de coco.","Cuece a fuego lento 8 min hasta que espese. Sirve con el arroz."]
    },
    {
      id:"pasta-bolo", name:"Pasta boloñesa", emoji:"🍝", grad:"linear-gradient(135deg,#F2607A,#C0392B)",
      slot:"comida", time:20, servings:1, tags:["easy"], prep:true, goals:["masa","mantener","recomp"],
      ingredients:[["pasta",90],["ternera",120],["tomatefrito",120],["cebolla",60],["zanahoria",50],["aceite",8]],
      steps:["Cuece la pasta al dente.","Sofríe cebolla y zanahoria picadas 4 min.","Añade la ternera picada y dórala.","Vierte el tomate y cuece 8 min (orégano y una pizca de azúcar).","Mezcla con la pasta y queso rallado al gusto."]
    },
    {
      id:"pasta-pesto-pollo", name:"Pasta al pesto con pollo", emoji:"🌿", grad:"linear-gradient(135deg,#8FD694,#3FA76A)",
      slot:"comida", time:16, servings:1, tags:["easy","fast"], prep:false, goals:["masa","recomp","mantener"],
      ingredients:[["pasta",90],["pollo",150],["pesto",25],["tomate",60],["aceite",5]],
      steps:["Cuece la pasta.","Saltea el pollo en dados hasta dorar.","Fuera del fuego, mezcla la pasta con el pesto y el pollo.","Añade el tomate en trozos. Un poco de queso por encima."]
    },
    {
      id:"chili-carne", name:"Chili con carne exprés", emoji:"🌶️", grad:"linear-gradient(135deg,#E0553B,#A6320F)",
      slot:"comida", time:18, servings:1, tags:["easy"], prep:true, goals:["masa","mantener","recomp","definir"],
      ingredients:[["ternera",140],["alubias",150],["tomatefrito",120],["pimiento",70],["cebolla",60],["aceite",7]],
      steps:["Sofríe cebolla y pimiento picados 4 min.","Añade la carne picada y dórala con comino y pimentón.","Incorpora el tomate y las alubias escurridas.","Cuece 10 min a fuego lento. Cilantro por encima."]
    },
    {
      id:"fajitas-pollo", name:"Fajitas de pollo", emoji:"🌯", grad:"linear-gradient(135deg,#FFB05C,#F26419)",
      slot:"comida", time:18, servings:1, tags:["easy","fast"], prep:false, goals:["masa","mantener","recomp"],
      ingredients:[["tortillatrigo",120],["pollo",150],["pimiento",80],["cebolla",60],["quesocurado",30],["aceite",6]],
      steps:["Saltea el pollo en tiras con el pimiento y la cebolla, con especias fajita.","Calienta las tortillas 20 seg en el micro.","Rellena con el salteado y un poco de queso.","Enrolla y a comer 🌯."]
    },
    {
      id:"gambas-ajillo", name:"Gambas al ajillo con arroz", emoji:"🦐", grad:"linear-gradient(135deg,#FF9E7A,#F2607A)",
      slot:"comida", time:15, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener"],
      ingredients:[["gambas",160],["ajo",12],["aceite",12],["arroz",70],["pimiento",60]],
      steps:["Cuece el arroz.","Dora el ajo laminado en el aceite a fuego medio.","Añade las gambas y el pimiento y saltea 2-3 min (guindilla opcional).","Sirve sobre el arroz con el aceite del ajillo."]
    },
    {
      id:"strogonoff", name:"Strogonoff ligero de pollo", emoji:"🍄", grad:"linear-gradient(135deg,#C9B6A8,#8A7060)",
      slot:"comida", time:18, servings:1, tags:["easy","fast"], prep:false, goals:["masa","mantener","recomp"],
      ingredients:[["pollo",160],["champinon",120],["nata",60],["mostaza",10],["cebolla",50],["arroz",70],["aceite",6]],
      steps:["Cuece el arroz.","Saltea el pollo en tiras y reserva.","Pocha la cebolla y los champiñones.","Añade la nata y la mostaza, devuelve el pollo y cuece 5 min hasta que espese. Sirve con arroz."]
    },
    {
      id:"salmon-teriyaki", name:"Salmón a la plancha teriyaki", emoji:"🐟", grad:"linear-gradient(135deg,#FF9E7A,#E0553B)",
      slot:"comida", time:18, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener","masa"],
      ingredients:[["salmon",160],["salsasoja",18],["miel",10],["patata",180],["brocoli",100],["aceite",6]],
      steps:["Cuece la patata en dados en el micro tapada 6-7 min.","Haz el salmón a la sartén 3-4 min por lado.","Glasea con la salsa de soja y la miel 1 min.","Cuece el brócoli al micro 3 min. Sirve todo junto."]
    },
    {
      id:"wok-pollo-verde", name:"Wok de pollo y calabacín", emoji:"🥦", grad:"linear-gradient(135deg,#5BBF7B,#1B998B)",
      slot:"cena", time:16, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener","masa"],
      ingredients:[["pollo",160],["pimiento",70],["calabacin",100],["zanahoria",60],["salsasoja",15],["aceite",6]],
      steps:["Corta todo en tiras.","Saltea el pollo a fuego fuerte 3 min.","Añade las verduras y saltea 5 min.","Salsa de soja al final y sésamo por encima."]
    },
    {
      id:"revuelto-gambas", name:"Revuelto cremoso de gambas", emoji:"🍳", grad:"linear-gradient(135deg,#FFD27A,#FF9E4A)",
      slot:"cena", time:12, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener","masa"],
      ingredients:[["huevo",180],["gambas",100],["champinon",80],["cebolla",40],["aceite",6]],
      steps:["Pocha la cebolla y los champiñones.","Añade las gambas y saltea 2 min.","Vierte los huevos batidos y remueve a fuego bajo hasta que queden cremosos (sin secar)."]
    },
    {
      id:"tacos-pavo", name:"Tacos de pavo con salsa de yogur", emoji:"🌮", grad:"linear-gradient(135deg,#B6E3A0,#4FBF7B)",
      slot:"cena", time:15, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener","masa"],
      ingredients:[["tortillatrigo",100],["pavo",130],["lechuga",40],["tomate",60],["yogur",40],["aceite",5]],
      steps:["Saltea el pavo picado con especias (comino, pimentón).","Mezcla el yogur con limón y sal para la salsa.","Calienta las tortillas.","Monta con lechuga, tomate, el pavo y la salsa de yogur."]
    },
    {
      id:"berenjena-carne", name:"Salteado de berenjena y carne", emoji:"🍆", grad:"linear-gradient(135deg,#9A82FF,#6B4EF2)",
      slot:"cena", time:18, servings:1, tags:["easy"], prep:false, goals:["definir","recomp","mantener","masa"],
      ingredients:[["berenjena",200],["ternera",120],["tomatefrito",100],["cebolla",50],["aceite",8]],
      steps:["Saltea la berenjena en dados 6 min hasta que ablande.","Añade la carne picada y la cebolla, dora.","Incorpora el tomate y cuece 6 min. Albahaca al final."]
    },
    {
      id:"merluza-salsa-verde", name:"Merluza en salsa verde", emoji:"🐠", grad:"linear-gradient(135deg,#9AD0F5,#4A97F2)",
      slot:"cena", time:18, servings:1, tags:["easy","fast"], prep:false, goals:["definir","mantener","recomp","masa"],
      ingredients:[["merluza",180],["ajo",8],["guisantes",60],["patata",120],["aceite",10]],
      steps:["Cuece la patata en rodajas en el micro 5 min.","Dora el ajo picado en el aceite.","Añade la merluza 3-4 min y un poco de agua; mueve la sartén para ligar la salsa.","Incorpora los guisantes y perejil picado."]
    },
    {
      id:"omelette-proteico", name:"Omelette de tomate y queso", emoji:"🍳", grad:"linear-gradient(135deg,#8FD694,#3FA76A)",
      slot:"cena", time:12, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener","masa"],
      ingredients:[["huevo",180],["tomate",60],["espinaca",60],["quesocurado",30],["cebolla",40],["aceite",6]],
      steps:["Sofríe la cebolla, el tomate y la espinaca hasta que ablanden.","Bate los huevos, viértelos sobre las verduras y añade el queso.","Cuaja a fuego lento y dobla por la mitad."]
    },
    {
      id:"tortitas-avena", name:"Tortitas de avena y plátano", emoji:"🥞", grad:"linear-gradient(135deg,#FFD27A,#FF9E4A)",
      slot:"desayuno", time:12, servings:1, tags:["easy","fast"], prep:false, goals:["masa","recomp","mantener"],
      ingredients:[["avena",60],["huevo",120],["platano",100],["proteina",15],["miel",8]],
      steps:["Tritura la avena, el plátano, los huevos y la proteína hasta una masa.","Haz tortitas en sartén antiadherente 1-2 min por lado.","Sirve con un hilo de miel y fruta."]
    },
    {
      id:"mugcake", name:"Mug cake proteico de chocolate", emoji:"🍫", grad:"linear-gradient(135deg,#8A6BFF,#5B3FE0)",
      slot:"snack", time:5, servings:1, tags:["easy","fast"], prep:false, goals:["masa","recomp"],
      ingredients:[["avena",40],["proteina",30],["huevo",60],["leche",60],["chocolatenegro",15],["platano",60]],
      steps:["Mezcla todo en una taza grande hasta que no queden grumos.","Micro 1,5-2 min (vigila que no se desborde).","Deja reposar 1 min. Bizcocho proteico al momento 🍫."]
    },
    {
      id:"wrap-atun", name:"Wrap de atún y aguacate", emoji:"🌯", grad:"linear-gradient(135deg,#B6E3A0,#5BBF7B)",
      slot:"comida", time:8, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener"],
      ingredients:[["tortillatrigo",80],["atun",80],["aguacate",60],["tomate",50],["lechuga",30]],
      steps:["Machaca el aguacate y mézclalo con el atún escurrido.","Calienta la tortilla unos segundos.","Rellena con la mezcla, tomate y lechuga. Enrolla."]
    },

    // ===== Recetas veganas (para la dieta vegana/vegetariana) =====
    {
      id:"avena-vegana", name:"Porridge de avena y soja", emoji:"🌱", grad:"linear-gradient(135deg,#B6E3A0,#4FBF7B)",
      slot:"desayuno", time:8, servings:1, tags:["easy","fast"], prep:false, goals:["masa","recomp","mantener","definir"],
      ingredients:[["avena",60],["bebidasoja",220],["platano",100],["mantequillacacahuete",15],["arandano",40]],
      steps:["Calienta la bebida de soja con la avena 2-3 min (cazo o micro).","Añade el plátano en rodajas y la crema de cacahuete.","Remata con arándanos. Cremoso y saciante 🌱."]
    },
    {
      id:"tofu-wok", name:"Wok de tofu y verduras", emoji:"🌱", grad:"linear-gradient(135deg,#8FD694,#1B998B)",
      slot:"comida", time:18, servings:1, tags:["easy","fast"], prep:false, goals:["masa","recomp","mantener","definir"],
      ingredients:[["tofu",180],["pimiento",70],["brocoli",100],["zanahoria",60],["salsasoja",18],["arroz",70],["aceite",7]],
      steps:["Cuece el arroz.","Dora el tofu en dados hasta que quede crujiente por fuera.","Añade las verduras y saltea 5 min.","Salsa de soja al final. Sirve con el arroz."]
    },
    {
      id:"garbanzos-curry", name:"Garbanzos al curry con coco", emoji:"🍛", grad:"linear-gradient(135deg,#FFC24B,#E0A83A)",
      slot:"comida", time:18, servings:1, tags:["easy"], prep:true, goals:["masa","mantener","recomp","definir"],
      ingredients:[["garbanzo",180],["lechecoco",120],["curry",8],["cebolla",70],["espinaca",60],["arroz",70]],
      steps:["Cuece el arroz.","Sofríe la cebolla y añade el curry 1 min.","Incorpora la leche de coco y los garbanzos, cuece 8 min.","Añade la espinaca al final. Sirve con el arroz."]
    },
    {
      id:"tempeh-salteado", name:"Salteado de tempeh y verduras", emoji:"🌱", grad:"linear-gradient(135deg,#B4A06A,#7A6A3A)",
      slot:"cena", time:16, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener","masa"],
      ingredients:[["tempeh",160],["calabacin",120],["pimiento",70],["salsasoja",15],["aceite",7]],
      steps:["Corta el tempeh en tiras y dóralo 3 min.","Añade el calabacín y el pimiento, saltea 5 min.","Salsa de soja y sésamo al final."]
    },
    {
      id:"tofu-revuelto", name:"Tofu revuelto con tomate", emoji:"🍳", grad:"linear-gradient(135deg,#FFD27A,#5BBF7B)",
      slot:"cena", time:12, servings:1, tags:["easy","fast"], prep:false, goals:["definir","recomp","mantener"],
      ingredients:[["tofu",200],["tomate",70],["espinaca",60],["cebolla",40],["aceite",6]],
      steps:["Sofríe la cebolla y el tomate.","Desmenuza el tofu con las manos y añádelo (una pizca de cúrcuma le da color).","Saltea 4 min y añade la espinaca. Cremoso y proteico 🌱."]
    },
    {
      id:"batido-vegano", name:"Batido vegano de plátano y cacahuete", emoji:"🥤", grad:"linear-gradient(135deg,#B6E3A0,#3FA76A)",
      slot:"snack", time:3, servings:1, tags:["easy","fast"], prep:false, goals:["masa","recomp"],
      ingredients:[["bebidasoja",250],["platano",120],["avena",30],["mantequillacacahuete",15],["chia",8]],
      steps:["Echa todo en la batidora.","Tritura 30 seg. Energético, cremoso y vegano 🌱."]
    },
  ];

  // ---- Preparados (batch cooking) -----------------------------------------
  const PREPARADOS = [
    { id:"salsa-base", emoji:"🍅", name:"Salsa base de sofrito", freeze:"Hasta 3 meses", yield:"6 raciones",
      desc:"El sofrito que ahorra media faena de la semana. Sirve para pasta, lentejas, arroces y guisos.",
      steps:["Pocha 2 cebollas + 2 pimientos + 3 zanahorias picadas con aceite 15 min.","Añade 400 g de tomate triturado y cuece 10 min.","Reparte en botes o cubiteras y congela en porciones."] },
    { id:"pollo-batch", emoji:"🍗", name:"Pollo cocinado en tandas", freeze:"3-4 días nevera / 2 meses congelado", yield:"5 raciones",
      desc:"Cocina 1 kg de pollo de golpe y tienes proteína lista toda la semana.",
      steps:["Sazona 1 kg de pechuga y hazla a la plancha en tandas.","Deja enfriar y corta en tiras.","Guarda en táperes de ración. Se descongela en minutos."] },
    { id:"arroz-batch", emoji:"🍚", name:"Base de arroz/quinoa", freeze:"4 días nevera", yield:"5 raciones",
      desc:"El carbohidrato listo para montar comidas en 2 minutos.",
      steps:["Cuece 400 g de arroz.","Enfría rápido y guarda en porciones.","Recalienta con unas gotas de agua."] },
    { id:"verdura-salteada", emoji:"🥦", name:"Verdura salteada en lotes", freeze:"4 días nevera", yield:"4 raciones",
      desc:"Saltea mucha verdura de una vez: brócoli, pimiento, calabacín y cebolla.",
      steps:["Trocea las verduras en tamaños parecidos.","Saltéalas en una sartén grande con aceite y sal 10-12 min a fuego fuerte.","Reparte en táperes. Van con todo."] },
  ];

  // ---- Gimnasio ------------------------------------------------------------
  // Plantillas por objetivo. days = nº de días entrenados/semana sugerido.
  const WORKOUTS = {
    masa: {
      title:"Hipertrofia · Fuerza-volumen", focus:"Ganar músculo", days:4, badge:"bg-carrot",
      note:"Enfocado en sobrecarga progresiva. Sube peso cuando completes el rango alto de reps.",
      split:[
        { day:"Lunes", name:"Empuje (Pecho/Hombro/Tríceps)", color:"bg-carrot", ex:[
          ["🏋️","Press banca","4 series","8-10 reps"],
          ["💪","Press militar mancuernas","4 series","10 reps"],
          ["🦅","Aperturas en polea","3 series","12 reps"],
          ["💪","Fondos / press cerrado","3 series","10 reps"],
        ]},
        { day:"Martes", name:"Tirón (Espalda/Bíceps)", color:"bg-leaf", ex:[
          ["🧗","Dominadas / jalón","4 series","8-10 reps"],
          ["🚣","Remo con barra","4 series","10 reps"],
          ["🪝","Remo en polea","3 series","12 reps"],
          ["💪","Curl bíceps","3 series","12 reps"],
        ]},
        { day:"Jueves", name:"Pierna completa", color:"bg-grape", ex:[
          ["🦵","Sentadilla","4 series","8-10 reps"],
          ["🍑","Peso muerto rumano","4 series","10 reps"],
          ["🦵","Prensa","3 series","12 reps"],
          ["🐄","Gemelos de pie","4 series","15 reps"],
        ]},
        { day:"Viernes", name:"Full-body / puntos débiles", color:"bg-sun", ex:[
          ["🏋️","Press inclinado","3 series","10 reps"],
          ["🚣","Remo mancuerna","3 series","12 reps"],
          ["🦵","Zancadas","3 series","12/pierna"],
          ["🔥","Plancha abdominal","3 series","45 seg"],
        ]},
      ]
    },
    definir: {
      title:"Definición · Fuerza + cardio", focus:"Perder grasa manteniendo músculo", days:4, badge:"bg-leaf",
      note:"Mantén los pesos altos para conservar músculo. Añade cardio suave en ayunas o post-entreno.",
      split:[
        { day:"Lunes", name:"Torso (Fuerza)", color:"bg-carrot", ex:[
          ["🏋️","Press banca","4 series","6-8 reps"],
          ["🧗","Dominadas / jalón","4 series","8 reps"],
          ["💪","Press militar","3 series","10 reps"],
          ["🚶","Cardio LISS cinta","1","20 min"],
        ]},
        { day:"Martes", name:"Pierna + core", color:"bg-grape", ex:[
          ["🦵","Sentadilla","4 series","8 reps"],
          ["🍑","Hip thrust","4 series","10 reps"],
          ["🦵","Extensión de cuádriceps","3 series","15 reps"],
          ["🔥","Circuito abdominal","3 vueltas","—"],
        ]},
        { day:"Jueves", name:"Torso (Volumen)", color:"bg-sun", ex:[
          ["🏋️","Press inclinado mancuernas","4 series","12 reps"],
          ["🚣","Remo en polea","4 series","12 reps"],
          ["🤸","Elevaciones laterales","4 series","15 reps"],
          ["🚴","Bici / elíptica","1","20 min"],
        ]},
        { day:"Sábado", name:"HIIT + full-body", color:"bg-berry", ex:[
          ["⚡","HIIT (30s on/30s off)","8 rondas","—"],
          ["🦵","Zancadas con mancuernas","3 series","12/pierna"],
          ["🚣","Remo invertido","3 series","12 reps"],
          ["🔥","Plancha + mountain climbers","3 series","40 seg"],
        ]},
      ]
    },
    mantener: {
      title:"Mantenimiento · Salud y forma", focus:"Estar en forma y sano", days:3, badge:"bg-sun",
      note:"Rutina equilibrada y sostenible. Prioriza técnica y constancia sobre intensidad.",
      split:[
        { day:"Lunes", name:"Full-body A", color:"bg-carrot", ex:[
          ["🦵","Sentadilla goblet","3 series","12 reps"],
          ["🏋️","Press banca mancuernas","3 series","12 reps"],
          ["🚣","Remo en polea","3 series","12 reps"],
          ["🔥","Plancha","3 series","40 seg"],
        ]},
        { day:"Miércoles", name:"Cardio + core", color:"bg-leaf", ex:[
          ["🏃","Carrera suave / bici","1","30 min"],
          ["🔥","Circuito core (4 ejercicios)","3 vueltas","—"],
          ["🧘","Movilidad y estiramientos","1","10 min"],
        ]},
        { day:"Viernes", name:"Full-body B", color:"bg-grape", ex:[
          ["🍑","Peso muerto rumano","3 series","12 reps"],
          ["💪","Press militar","3 series","12 reps"],
          ["🧗","Jalón al pecho","3 series","12 reps"],
          ["🦵","Zancadas","3 series","12/pierna"],
        ]},
      ]
    },
    recomp: {
      title:"Recomposición · Fuerza total", focus:"Ganar músculo y perder grasa a la vez", days:4, badge:"bg-grape",
      note:"Come en tu mantenimiento con alta proteína. Entrena fuerte y sé muy constante.",
      split:[
        { day:"Lunes", name:"Empuje", color:"bg-carrot", ex:[
          ["🏋️","Press banca","4 series","8-10 reps"],
          ["💪","Press militar","3 series","10 reps"],
          ["🤸","Elevaciones laterales","3 series","15 reps"],
          ["💪","Extensión tríceps","3 series","12 reps"],
        ]},
        { day:"Martes", name:"Tirón", color:"bg-leaf", ex:[
          ["🧗","Dominadas / jalón","4 series","8-10 reps"],
          ["🚣","Remo con barra","4 series","10 reps"],
          ["💪","Curl bíceps","3 series","12 reps"],
          ["🚶","Cardio suave","1","15 min"],
        ]},
        { day:"Jueves", name:"Pierna", color:"bg-grape", ex:[
          ["🦵","Sentadilla","4 series","8-10 reps"],
          ["🍑","Hip thrust","4 series","10 reps"],
          ["🦵","Prensa","3 series","12 reps"],
          ["🐄","Gemelos","4 series","15 reps"],
        ]},
        { day:"Sábado", name:"Full-body", color:"bg-sun", ex:[
          ["🏋️","Press inclinado","3 series","10 reps"],
          ["🚣","Remo mancuerna","3 series","12 reps"],
          ["🦵","Zancadas","3 series","12/pierna"],
          ["🔥","Core circuito","3 vueltas","—"],
        ]},
      ]
    },
  };

  // Etiquetas legibles de objetivos
  const GOAL_LABELS = {
    masa:     { label:"Ganar masa muscular", emoji:"💪", plan:"Dieta hipercalórica",     color:"ic-carrot", bg:"bg-carrot" },
    definir:  { label:"Perder grasa",         emoji:"🔥", plan:"Dieta de definición",      color:"ic-berry",  bg:"bg-berry" },
    mantener: { label:"Mantenerme / salud",   emoji:"⚖️", plan:"Dieta de mantenimiento",  color:"ic-sun",    bg:"bg-sun" },
    recomp:   { label:"Recomposición",        emoji:"🔄", plan:"Dieta de recomposición",  color:"ic-grape",  bg:"bg-grape" },
  };

  // ---- Modelo de compra realista -----------------------------------------
  // type 'count' (unidades contables): avg g/pieza, name singular, packOf opcional (redondea a múltiplos)
  // type 'pack'  (envase): g por paquete, name del envase
  // sin entrada -> se compra por peso (g / kg)
  const BUY = {
    huevo:{type:"count", avg:60, name:"huevo", packOf:6},
    platano:{type:"count", avg:120, name:"plátano"},
    manzana:{type:"count", avg:180, name:"manzana"},
    tomate:{type:"count", avg:110, name:"tomate"},
    pimiento:{type:"count", avg:150, name:"pimiento"},
    cebolla:{type:"count", avg:120, name:"cebolla"},
    zanahoria:{type:"count", avg:80, name:"zanahoria"},
    aguacate:{type:"count", avg:170, name:"aguacate"},
    patata:{type:"count", avg:150, name:"patata"},
    boniato:{type:"count", avg:200, name:"boniato"},
    brocoli:{type:"count", avg:300, name:"brócoli"},
    pasta:{type:"pack", g:500, name:"paquete"},
    arroz:{type:"pack", g:1000, name:"paquete"},
    arrozint:{type:"pack", g:1000, name:"paquete"},
    avena:{type:"pack", g:500, name:"paquete"},
    pan:{type:"pack", g:500, name:"barra"},
    lenteja:{type:"pack", g:400, name:"bote"},
    garbanzo:{type:"pack", g:400, name:"bote"},
    atun:{type:"pack", g:80, name:"lata"},
    tomatefrito:{type:"pack", g:400, name:"bote"},
    espinaca:{type:"pack", g:200, name:"bolsa"},
    fresa:{type:"pack", g:250, name:"tarrina"},
    arandano:{type:"pack", g:125, name:"tarrina"},
    yogur:{type:"pack", g:500, name:"envase"},
    leche:{type:"pack", g:1000, name:"brik"},
    quesofresco:{type:"pack", g:250, name:"tarrina"},
    proteina:{type:"pack", g:1000, name:"bote"},
    aceite:{type:"pack", g:1000, name:"botella"},
    almendra:{type:"pack", g:200, name:"bolsa"},
    mantequillacacahuete:{type:"pack", g:300, name:"bote"},
    miel:{type:"pack", g:500, name:"bote"},
    // carne/pescado: por peso (bandeja/mostrador)
    // ---- nuevos ----
    sardinas:{type:"pack", g:90, name:"lata"},
    tofu:{type:"pack", g:250, name:"paquete"},
    tempeh:{type:"pack", g:200, name:"paquete"},
    edamame:{type:"pack", g:300, name:"bolsa"},
    sojatext:{type:"pack", g:250, name:"paquete"},
    alubias:{type:"pack", g:400, name:"bote"},
    guisantes:{type:"pack", g:400, name:"bolsa"},
    bebidasoja:{type:"pack", g:1000, name:"brik"},
    bebidaavena:{type:"pack", g:1000, name:"brik"},
    requeson:{type:"pack", g:250, name:"tarrina"},
    quinoa:{type:"pack", g:500, name:"paquete"},
    tortitasarroz:{type:"pack", g:130, name:"paquete"},
    nueces:{type:"pack", g:200, name:"bolsa"},
    aceitunas:{type:"pack", g:350, name:"bote"},
    chia:{type:"pack", g:250, name:"bolsa"},
    chocolatenegro:{type:"pack", g:100, name:"tableta"},
    champinon:{type:"pack", g:250, name:"bandeja"},
    frambuesa:{type:"pack", g:125, name:"tarrina"},
    calabacin:{type:"count", avg:250, name:"calabacín"},
    berenjena:{type:"count", avg:250, name:"berenjena"},
    lechuga:{type:"count", avg:300, name:"lechuga"},
    pepino:{type:"count", avg:300, name:"pepino"},
    coliflor:{type:"count", avg:600, name:"coliflor"},
    ajo:{type:"count", avg:60, name:"cabeza de ajo"},
    naranja:{type:"count", avg:180, name:"naranja"},
    kiwi:{type:"count", avg:90, name:"kiwi"},
    pera:{type:"count", avg:170, name:"pera"},
    pina:{type:"count", avg:1200, name:"piña"},
    salsasoja:{type:"pack", g:250, name:"botella"},
    mostaza:{type:"pack", g:250, name:"bote"},
    nata:{type:"pack", g:200, name:"brik"},
    pesto:{type:"pack", g:190, name:"bote"},
    lechecoco:{type:"pack", g:400, name:"lata"},
    tortillatrigo:{type:"pack", g:240, name:"paquete"},
    curry:{type:"pack", g:50, name:"bote"},
    // uvas, judiaverde, lomo, bacalao, quesocurado -> por peso
  };

  // ---- Precios realistas (€/kg aprox, súper España 2025-26) ---------------
  // Se aplican sobre FOODS.price para que el coste sea realista.
  const PRICE = {
    pollo:6.5, pavo:8.5, ternera:11, lomo:7, huevo:4.6, salmon:15, atun:12, merluza:10, gambas:13, bacalao:11, sardinas:13,
    arroz:1.55, arrozint:2.0, pasta:1.8, avena:2.2, pan:2.5, patata:1.2, boniato:2.2, lenteja:2.2, garbanzo:2.2, alubias:2.2,
    brocoli:2.8, espinaca:4.0, tomate:2.0, pimiento:2.5, cebolla:1.3, zanahoria:1.1, aguacate:5.5, platano:1.7, manzana:1.9,
    fresa:4.0, arandano:15, yogur:4.5, leche:0.9, quesofresco:3.5, proteina:20, aceite:6.5, almendra:12, nueces:13,
    mantequillacacahuete:9, chia:8, miel:7, tomatefrito:2.0, chocolatenegro:14, calabacin:1.8, berenjena:2.0, champinon:5,
    lechuga:2.5, pepino:1.5, judiaverde:3.5, coliflor:2.0, ajo:6, naranja:1.5, kiwi:3.5, pera:1.9, uvas:2.8, pina:1.8, frambuesa:18,
    tofu:7, tempeh:11, edamame:6, sojatext:8, guisantes:3, bebidasoja:1.3, bebidaavena:1.6, requeson:3.5, quesocurado:13,
    quinoa:5, tortitasarroz:6, salsasoja:5, mostaza:3, nata:4.5, pesto:12, lechecoco:3.5, tortillatrigo:5, curry:20,
  };
  Object.keys(PRICE).forEach(k=>{ if(FOODS[k]) FOODS[k].price = PRICE[k]; });

  // ---- Factor de peso crudo -> cocido (para mostrar la cantidad real en el plato)
  // Fuentes: arroz blanco 1:3, integral ~2.7, pasta ~2.3, quinoa ~2.9, avena ~2.5
  const COOK_FACTOR = { arroz:3.0, arrozint:2.7, pasta:2.3, quinoa:2.9, avena:2.5 };

  const AISLES = {
    verduras:{name:"Frutas y verduras", emoji:"🥦"}, fruta:{name:"Fruta", emoji:"🍎"},
    carne:{name:"Carnicería", emoji:"🥩"}, pescado:{name:"Pescadería", emoji:"🐟"},
    nevera:{name:"Refrigerados", emoji:"🧊"}, despensa:{name:"Despensa", emoji:"🫙"},
    conservas:{name:"Conservas", emoji:"🥫"}, panaderia:{name:"Panadería", emoji:"🍞"},
    suplementos:{name:"Suplementos", emoji:"💊"},
  };

  return { FOODS, RECIPES, PREPARADOS, WORKOUTS, GOAL_LABELS, AISLES, BUY, COOK_FACTOR };
})();
