/* =========================================================
   ZANA · i18n — traducción automática de la interfaz
   Reescribe los textos visibles a ca / en tras cada render.
   ========================================================= */
window.ZI18N = (() => {
  // Diccionario: texto en español -> { ca, en }
  const DICT = {
    // Navbar
    "Inicio":{ca:"Inici",en:"Home"},
    "Recetas":{ca:"Receptes",en:"Recipes"},
    "Calendario":{ca:"Calendari",en:"Calendar"},
    "Súper":{ca:"Súper",en:"Shop"},
    "Ejercicio":{ca:"Exercici",en:"Exercise"},
    "Ajustes":{ca:"Ajustos",en:"Settings"},
    // Saludos / home
    "¡Hola!":{ca:"Hola!",en:"Hi!"},
    "Buenos días":{ca:"Bon dia",en:"Good morning"},
    "Buenas tardes":{ca:"Bona tarda",en:"Good afternoon"},
    "Buenas noches":{ca:"Bona nit",en:"Good evening"},
    "Tus planes":{ca:"Els teus plans",en:"Your plans"},
    "Hoy":{ca:"Avui",en:"Today"},
    "Crear nuevo plan":{ca:"Crear un nou pla",en:"Create new plan"},
    "➕ Crear nuevo plan":{ca:"➕ Crear un nou pla",en:"➕ Create new plan"},
    "¡Todo hecho por hoy! 🎉":{ca:"Tot fet per avui! 🎉",en:"All done for today! 🎉"},
    "Comidas":{ca:"Àpats",en:"Meals"},
    "Ejercicios":{ca:"Exercicis",en:"Workouts"},
    "Preparar / congelar":{ca:"Preparar / congelar",en:"Prep / freeze"},
    "Ahora toca":{ca:"Ara toca",en:"Up next"},
    "¡Toca ya!":{ca:"Toca ja!",en:"Time to eat!"},
    // Onboarding
    "Continuar":{ca:"Continuar",en:"Continue"},
    "Atrás":{ca:"Enrere",en:"Back"},
    "Empezar 🚀":{ca:"Començar 🚀",en:"Start 🚀"},
    "¿Cómo te llamas?":{ca:"Com et dius?",en:"What's your name?"},
    "Tu nombre":{ca:"El teu nom",en:"Your name"},
    "Sobre ti":{ca:"Sobre tu",en:"About you"},
    "Tus datos básicos":{ca:"Les teves dades bàsiques",en:"Your basic details"},
    "Edad":{ca:"Edat",en:"Age"},
    "Tipo de cuerpo":{ca:"Tipus de cos",en:"Body type"},
    "🏃 Delgado (ectomorfo)":{ca:"🏃 Prim (ectomorf)",en:"🏃 Slim (ectomorph)"},
    "💪 Atlético (mesomorfo)":{ca:"💪 Atlètic (mesomorf)",en:"💪 Athletic (mesomorph)"},
    "🧸 Tiende a engordar (endomorfo)":{ca:"🧸 Tendeix a engreixar (endomorf)",en:"🧸 Gains fat easily (endomorph)"},
    "Altura":{ca:"Alçada",en:"Height"},
    "Peso actual":{ca:"Pes actual",en:"Current weight"},
    "años":{ca:"anys",en:"years"},
    "Tu actividad":{ca:"La teva activitat",en:"Your activity"},
    "¿Cuánto te mueves?":{ca:"Quant et mous?",en:"How active are you?"},
    "Tu objetivo":{ca:"El teu objectiu",en:"Your goal"},
    "¿Qué quieres conseguir?":{ca:"Què vols aconseguir?",en:"What do you want?"},
    "Ganar masa muscular":{ca:"Guanyar massa muscular",en:"Build muscle"},
    "Perder grasa":{ca:"Perdre greix",en:"Lose fat"},
    "Mantenerme / salud":{ca:"Mantenir-me / salut",en:"Maintain / health"},
    "Recomposición":{ca:"Recomposició",en:"Recomposition"},
    "Tus gustos":{ca:"Els teus gustos",en:"Your preferences"},
    "Para ajustar las recetas":{ca:"Per ajustar les receptes",en:"To tailor the recipes"},
    "Tipo de dieta":{ca:"Tipus de dieta",en:"Diet type"},
    "¿Algo que no quieras comer?":{ca:"Alguna cosa que no vulguis menjar?",en:"Anything you won't eat?"},
    "¿Cómo es tu apetito?":{ca:"Com és la teva gana?",en:"How's your appetite?"},
    "¿Cuántas comidas al día?":{ca:"Quants àpats al dia?",en:"How many meals a day?"},
    "comidas":{ca:"àpats",en:"meals"},
    "Tu día a día":{ca:"El teu dia a dia",en:"Your daily routine"},
    "Para encajar las comidas":{ca:"Per encaixar els àpats",en:"To fit your meals"},
    "¿Cuánto tiempo tienes para cocinar?":{ca:"Quant temps tens per cuinar?",en:"How much time to cook?"},
    "Cuéntame tus horarios":{ca:"Explica'm els teus horaris",en:"Tell me your schedule"},
    "Calcular mi plan 🧮":{ca:"Calcular el meu pla 🧮",en:"Calculate my plan 🧮"},
    "Tu plan está listo":{ca:"El teu pla és a punt",en:"Your plan is ready"},
    "Revisa y ponle nombre":{ca:"Revisa'l i posa-li nom",en:"Review and name it"},
    "Objetivo":{ca:"Objectiu",en:"Goal"},
    "Calorías":{ca:"Calories",en:"Calories"},
    "Proteína":{ca:"Proteïna",en:"Protein"},
    "Carbos":{ca:"Carbos",en:"Carbs"},
    "Grasas":{ca:"Greixos",en:"Fats"},
    "Nombre de tu plan":{ca:"Nom del teu pla",en:"Your plan name"},
    "Crear mi plan 🥕":{ca:"Crear el meu pla 🥕",en:"Create my plan 🥕"},
    // Dietas especiales
    "Dietas especiales":{ca:"Dietes especials",en:"Special diets"},
    "Alergias y patrones concretos":{ca:"Al·lèrgies i patrons concrets",en:"Allergies & specific patterns"},
    // Plan hub
    "Objetivo diario":{ca:"Objectiu diari",en:"Daily target"},
    "Horas y platos de cada día":{ca:"Hores i plats de cada dia",en:"Times & dishes each day"},
    "¿Qué toca ahora?":{ca:"Què toca ara?",en:"What's next?"},
    "Tu lista de la compra":{ca:"La teva llista de la compra",en:"Your shopping list"},
    "Gastos":{ca:"Despeses",en:"Expenses"},
    "Cuentas y previsión":{ca:"Comptes i previsió",en:"Accounts & forecast"},
    "Rutina de hoy en casa":{ca:"Rutina d'avui a casa",en:"Today's home workout"},
    "Pregunta a Zana":{ca:"Pregunta a Zana",en:"Ask Zana"},
    "Tu coach IA":{ca:"El teu coach IA",en:"Your AI coach"},
    // Calendario
    "Semanal":{ca:"Setmanal",en:"Weekly"},
    "Mensual":{ca:"Mensual",en:"Monthly"},
    // Recetas
    "El resto del día":{ca:"La resta del dia",en:"Rest of the day"},
    "🧊 Preparados · adelanta faena":{ca:"🧊 Preparats · avança feina",en:"🧊 Meal prep · get ahead"},
    "Ver receta paso a paso 👩‍🍳":{ca:"Veure recepta pas a pas 👩‍🍳",en:"See step-by-step recipe 👩‍🍳"},
    "⏰ Saca del congelador":{ca:"⏰ Treu del congelador",en:"⏰ Take out of freezer"},
    "🛒 Ingredientes":{ca:"🛒 Ingredients",en:"🛒 Ingredients"},
    "👩‍🍳 Preparación":{ca:"👩‍🍳 Preparació",en:"👩‍🍳 Preparation"},
    "Comida realizada":{ca:"Àpat fet",en:"Meal done"},
    "✅ Comida realizada":{ca:"✅ Àpat fet",en:"✅ Meal done"},
    "Cerrar":{ca:"Tancar",en:"Close"},
    "Cómo se hace":{ca:"Com es fa",en:"How to make it"},
    // Súper
    "Coste estimado":{ca:"Cost estimat",en:"Estimated cost"},
    "en el carro":{ca:"al carro",en:"in cart"},
    "✅ Compra terminada":{ca:"✅ Compra acabada",en:"✅ Shopping done"},
    "Ya tienes en tu despensa":{ca:"Ja tens al teu rebost",en:"Already in your pantry"},
    // Gastos
    "Comida y previsión":{ca:"Menjar i previsió",en:"Food & forecast"},
    "Previsión semanal":{ca:"Previsió setmanal",en:"Weekly forecast"},
    "Previsión mensual":{ca:"Previsió mensual",en:"Monthly forecast"},
    "Últimos 7 días":{ca:"Últims 7 dies",en:"Last 7 days"},
    "Añadir gasto":{ca:"Afegir despesa",en:"Add expense"},
    "Movimientos recientes":{ca:"Moviments recents",en:"Recent activity"},
    "Concepto":{ca:"Concepte",en:"Concept"},
    // Ejercicio
    "Ejercicio de hoy":{ca:"Exercici d'avui",en:"Today's workout"},
    "hechos":{ca:"fets",en:"done"},
    // Ajustes
    "Configura tu Zana":{ca:"Configura la teva Zana",en:"Set up your Zana"},
    "🔔 Notificaciones":{ca:"🔔 Notificacions",en:"🔔 Notifications"},
    "Avisos de comidas":{ca:"Avisos d'àpats",en:"Meal reminders"},
    "Activar":{ca:"Activar",en:"Enable"},
    "Activadas":{ca:"Activades",en:"Enabled"},
    "Probar notificación 🔔":{ca:"Provar notificació 🔔",en:"Test notification 🔔"},
    "🥕 IA de Zana":{ca:"🥕 IA de Zana",en:"🥕 Zana AI"},
    "Motor de la IA":{ca:"Motor de la IA",en:"AI engine"},
    "Tu clave API":{ca:"La teva clau API",en:"Your API key"},
    "Guardar IA":{ca:"Desar IA",en:"Save AI"},
    "🎨 Estilo":{ca:"🎨 Estil",en:"🎨 Style"},
    "Tema oscuro":{ca:"Tema fosc",en:"Dark theme"},
    "🌐 Idioma":{ca:"🌐 Idioma",en:"🌐 Language"},
    "🍃 Dieta especial / alergias":{ca:"🍃 Dieta especial / al·lèrgies",en:"🍃 Special diet / allergies"},
    "Cambiar":{ca:"Canviar",en:"Change"},
    "💨 Intolerancias / incidencias":{ca:"💨 Intoleràncies / incidències",en:"💨 Intolerances / issues"},
    "Anotar incidencia":{ca:"Anotar incidència",en:"Log issue"},
    "📋 Tu plan":{ca:"📋 El teu pla",en:"📋 Your plan"},
    "Regenerar menú":{ca:"Regenerar menú",en:"Regenerate menu"},
    "Editar mis datos":{ca:"Editar les meves dades",en:"Edit my details"},
    "Datos":{ca:"Dades",en:"Data"},
    "🗑️ Borrar todo y empezar de cero":{ca:"🗑️ Esborrar-ho tot i començar de nou",en:"🗑️ Erase all and start over"},
    "Guardar":{ca:"Desar",en:"Save"},
    // Chat
    "Escríbele a Zana...":{ca:"Escriu a la Zana...",en:"Message Zana..."},
    "tu coach nutricional 🥕":{ca:"el teu coach nutricional 🥕",en:"your nutrition coach 🥕"},
    "¿Cuántas calorías como?":{ca:"Quantes calories menjo?",en:"How many calories?"},
    "¿Qué toca comer hoy?":{ca:"Què toca menjar avui?",en:"What to eat today?"},
    "¿Cuánta proteína?":{ca:"Quanta proteïna?",en:"How much protein?"},
    "Consejo para hoy":{ca:"Consell per avui",en:"Tip for today"},
  };

  // Ampliación: contenido y más UI
  Object.assign(DICT, {
    // Slots de comida
    "desayuno":{ca:"esmorzar",en:"breakfast"}, "comida":{ca:"dinar",en:"lunch"},
    "cena":{ca:"sopar",en:"dinner"}, "snack":{ca:"snack",en:"snack"},
    // Días (largos)
    "Lunes":{ca:"Dilluns",en:"Monday"},"Martes":{ca:"Dimarts",en:"Tuesday"},"Miércoles":{ca:"Dimecres",en:"Wednesday"},
    "Jueves":{ca:"Dijous",en:"Thursday"},"Viernes":{ca:"Divendres",en:"Friday"},"Sábado":{ca:"Dissabte",en:"Saturday"},"Domingo":{ca:"Diumenge",en:"Sunday"},
    // Meses
    "ene":{ca:"gen",en:"Jan"},"feb":{ca:"febr",en:"Feb"},"mar":{ca:"març",en:"Mar"},"abr":{ca:"abr",en:"Apr"},"may":{ca:"maig",en:"May"},"jun":{ca:"juny",en:"Jun"},"jul":{ca:"jul",en:"Jul"},"ago":{ca:"ag",en:"Aug"},"sep":{ca:"set",en:"Sep"},"oct":{ca:"oct",en:"Oct"},"nov":{ca:"nov",en:"Nov"},"dic":{ca:"des",en:"Dec"},
    // Objetivos (planes)
    "Dieta hipercalórica":{ca:"Dieta hipercalòrica",en:"High-calorie diet"},
    "Dieta de definición":{ca:"Dieta de definició",en:"Cutting diet"},
    "Dieta de mantenimiento":{ca:"Dieta de manteniment",en:"Maintenance diet"},
    "Dieta de recomposición":{ca:"Dieta de recomposició",en:"Recomposition diet"},
    "Mantenerme / salud":{ca:"Mantenir-me / salut",en:"Maintain / health"},
    // Actividad
    "Sedentario (poco o nada de ejercicio)":{ca:"Sedentari (poc o gens d'exercici)",en:"Sedentary (little/no exercise)"},
    "Ligero (1-2 días/semana)":{ca:"Lleuger (1-2 dies/setmana)",en:"Light (1-2 days/week)"},
    "Moderado (3-4 días/semana)":{ca:"Moderat (3-4 dies/setmana)",en:"Moderate (3-4 days/week)"},
    "Alto (5-6 días/semana)":{ca:"Alt (5-6 dies/setmana)",en:"High (5-6 days/week)"},
    "Muy alto (2x día / trabajo físico)":{ca:"Molt alt (2x dia / feina física)",en:"Very high (2x/day / physical job)"},
    // Botones / labels varios
    "Guardar":{ca:"Desar",en:"Save"}, "Entendido":{ca:"Entesos",en:"Got it"},
    "Cancelar":{ca:"Cancel·lar",en:"Cancel"}, "Sí, borrar todo":{ca:"Sí, esborra-ho tot",en:"Yes, erase all"},
    "¿Borrar todo?":{ca:"Esborrar-ho tot?",en:"Erase everything?"},
    "Añadir gasto 💶":{ca:"Afegir despesa 💶",en:"Add expense 💶"},
    "Importe (€)":{ca:"Import (€)",en:"Amount (€)"},
    "Regenerar":{ca:"Regenerar",en:"Regenerate"},
    "Añadir mi clave IA":{ca:"Afegir la meva clau IA",en:"Add my AI key"},
    "🔑 Añadir mi clave IA":{ca:"🔑 Afegir la meva clau IA",en:"🔑 Add my AI key"},
    "Tu clave de IA gratis":{ca:"La teva clau d'IA gratis",en:"Your free AI key"},
    "Personaliza la tuya":{ca:"Personalitza la teva",en:"Customize yours"},
    "Descríbele a Zana cómo quieres tu dieta":{ca:"Explica a la Zana com vols la teva dieta",en:"Tell Zana how you want your diet"},
    "Aspecto de la app":{ca:"Aspecte de l'app",en:"App appearance"},
    "💡 ¿Cómo lo hago?":{ca:"💡 Com ho faig?",en:"💡 How do I do it?"},
    "Cómo hacerlo bien":{ca:"Com fer-ho bé",en:"How to do it right"},
    "series":{ca:"sèries",en:"sets"}, "repeticiones":{ca:"repeticions",en:"reps"}, "tiempo":{ca:"temps",en:"time"}, "peso":{ca:"pes",en:"weight"},
    "🔥 Cocción precisa (tu ración)":{ca:"🔥 Cocció precisa (la teva ració)",en:"🔥 Precise cooking (your portion)"},
    "🥕 Con todo lo que me has contado calcularé":{ca:"🥕 Amb tot el que m'has explicat calcularé",en:"🥕 With all you told me I'll calculate"},
    "¿A qué horas sueles poder cocinar?":{ca:"A quines hores pots cuinar?",en:"When can you usually cook?"},
    "Anotar incidencia":{ca:"Anotar incidència",en:"Log issue"},
    // Súper
    "🛒 Compra de hoy":{ca:"🛒 Compra d'avui",en:"🛒 Today's shopping"},
    "Escanear tiquet":{ca:"Escanejar tiquet",en:"Scan receipt"},
    "Sin marca concreta":{ca:"Sense marca concreta",en:"No specific brand"},
    // Preparados
    "Salsa base de sofrito":{ca:"Salsa base de sofregit",en:"Base sofrito sauce"},
    "Pollo cocinado en tandas":{ca:"Pollastre cuinat en tandes",en:"Batch-cooked chicken"},
    "Base de arroz/quinoa":{ca:"Base d'arròs/quinoa",en:"Rice/quinoa base"},
    "Bandeja de verdura asada":{ca:"Safata de verdura rostida",en:"Roasted veg tray"},
    // Ejercicios (nombres)
    "Flexiones":{ca:"Flexions",en:"Push-ups"},"Sentadilla":{ca:"Esquat",en:"Squat"},"Zancadas":{ca:"Ganxos (lunges)",en:"Lunges"},
    "Plancha":{ca:"Planxa",en:"Plank"},"Puente de glúteo":{ca:"Pont de gluti",en:"Glute bridge"},"Abdominales":{ca:"Abdominals",en:"Crunches"},
    "Burpees":{ca:"Burpees",en:"Burpees"},"Jumping jacks":{ca:"Jumping jacks",en:"Jumping jacks"},"Carrera continua":{ca:"Cursa contínua",en:"Steady run"},
    "Sprints":{ca:"Sprints",en:"Sprints"},"Sentadilla salto":{ca:"Esquat amb salt",en:"Jump squat"},"Sentadilla búlgara":{ca:"Esquat búlgar",en:"Bulgarian squat"},
    // Dietas especiales (nombres)
    "Sin restricción":{ca:"Sense restricció",en:"No restriction"},"Vegetariana":{ca:"Vegetariana",en:"Vegetarian"},"Vegana":{ca:"Vegana",en:"Vegan"},
    "Pescetariana":{ca:"Pescetariana",en:"Pescatarian"},"Sin gluten (celiaquía)":{ca:"Sense gluten (celiaquia)",en:"Gluten-free (celiac)"},
    "Sin lactosa":{ca:"Sense lactosa",en:"Lactose-free"},"Baja en FODMAP":{ca:"Baixa en FODMAP",en:"Low FODMAP"},
    "Cetogénica (keto)":{ca:"Cetogènica (keto)",en:"Ketogenic (keto)"},"Mediterránea":{ca:"Mediterrània",en:"Mediterranean"},
    "DASH (tensión alta)":{ca:"DASH (tensió alta)",en:"DASH (high blood pressure)"},"Control glucémico":{ca:"Control glucèmic",en:"Glucose control"},
    "Alergia a frutos secos":{ca:"Al·lèrgia a fruits secs",en:"Nut allergy"},
    // Alimentos (nombres)
    "Pechuga de pollo":{ca:"Pit de pollastre",en:"Chicken breast"},"Pechuga de pavo":{ca:"Pit de gall dindi",en:"Turkey breast"},
    "Ternera magra":{ca:"Vedella magra",en:"Lean beef"},"Salmón":{ca:"Salmó",en:"Salmon"},"Atún al natural":{ca:"Tonyina al natural",en:"Tuna in water"},
    "Merluza":{ca:"Lluç",en:"Hake"},"Gambas":{ca:"Gambes",en:"Prawns"},"Arroz":{ca:"Arròs",en:"Rice"},"Arroz integral":{ca:"Arròs integral",en:"Brown rice"},
    "Pasta":{ca:"Pasta",en:"Pasta"},"Copos de avena":{ca:"Flocs de civada",en:"Oats"},"Pan integral":{ca:"Pa integral",en:"Wholemeal bread"},
    "Patata":{ca:"Patata",en:"Potato"},"Boniato":{ca:"Moniato",en:"Sweet potato"},"Lentejas":{ca:"Llenties",en:"Lentils"},"Garbanzos":{ca:"Cigrons",en:"Chickpeas"},
    "Brócoli":{ca:"Bròquil",en:"Broccoli"},"Espinacas":{ca:"Espinacs",en:"Spinach"},"Tomate":{ca:"Tomàquet",en:"Tomato"},"Pimiento":{ca:"Pebrot",en:"Pepper"},
    "Cebolla":{ca:"Ceba",en:"Onion"},"Zanahoria":{ca:"Pastanaga",en:"Carrot"},"Aguacate":{ca:"Alvocat",en:"Avocado"},"Plátano":{ca:"Plàtan",en:"Banana"},
    "Manzana":{ca:"Poma",en:"Apple"},"Fresas":{ca:"Maduixes",en:"Strawberries"},"Arándanos":{ca:"Nabius",en:"Blueberries"},"Yogur griego":{ca:"Iogurt grec",en:"Greek yogurt"},
    "Leche semi":{ca:"Llet semi",en:"Semi milk"},"Queso fresco batido":{ca:"Formatge fresc batut",en:"Quark cheese"},"Proteína whey":{ca:"Proteïna whey",en:"Whey protein"},
    "Aceite de oliva":{ca:"Oli d'oliva",en:"Olive oil"},"Almendras":{ca:"Ametlles",en:"Almonds"},"Crema de cacahuete":{ca:"Crema de cacauet",en:"Peanut butter"},
    "Miel":{ca:"Mel",en:"Honey"},"Tomate triturado":{ca:"Tomàquet triturat",en:"Crushed tomato"},"Huevos":{ca:"Ous",en:"Eggs"},
    // Recetas (nombres)
    "Avena proteica con plátano":{ca:"Civada proteica amb plàtan",en:"Protein oats with banana"},
    "Tostada de aguacate y huevo":{ca:"Torrada d'alvocat i ou",en:"Avocado & egg toast"},
    "Bowl de yogur griego y frutos rojos":{ca:"Bol de iogurt grec i fruits vermells",en:"Greek yogurt & berry bowl"},
    "Pollo con arroz y brócoli":{ca:"Pollastre amb arròs i bròquil",en:"Chicken, rice & broccoli"},
    "Salmón al horno con boniato":{ca:"Salmó al forn amb moniato",en:"Baked salmon with sweet potato"},
    "Lentejas con verduras":{ca:"Llenties amb verdures",en:"Lentils with veggies"},
    "Pasta con atún y tomate":{ca:"Pasta amb tonyina i tomàquet",en:"Tuna & tomato pasta"},
    "Wok de pollo y verduras":{ca:"Wok de pollastre i verdures",en:"Chicken & veg wok"},
    "Tortilla de espinacas y queso":{ca:"Truita d'espinacs i formatge",en:"Spinach & cheese omelette"},
    "Merluza a la plancha con verduras":{ca:"Lluç a la planxa amb verdures",en:"Grilled hake with veggies"},
    "Batido post-entreno":{ca:"Batut post-entrenament",en:"Post-workout shake"},
    "Yogur con almendras y manzana":{ca:"Iogurt amb ametlles i poma",en:"Yogurt with almonds & apple"},
    "Hummus casero con crudités":{ca:"Hummus casolà amb crudités",en:"Homemade hummus with crudités"},
    "Tostada de pavo y queso":{ca:"Torrada de gall dindi i formatge",en:"Turkey & cheese toast"},
    // Recetas nuevas
    "Pollo teriyaki con arroz":{ca:"Pollastre teriyaki amb arròs",en:"Teriyaki chicken with rice"},
    "Wok de ternera con soja":{ca:"Wok de vedella amb soja",en:"Beef & soy wok"},
    "Pollo al curry con arroz":{ca:"Pollastre al curri amb arròs",en:"Chicken curry with rice"},
    "Pasta boloñesa":{ca:"Pasta bolonyesa",en:"Bolognese pasta"},
    "Pasta al pesto con pollo":{ca:"Pasta al pesto amb pollastre",en:"Pesto pasta with chicken"},
    "Chili con carne exprés":{ca:"Chili con carn exprés",en:"Quick chili con carne"},
    "Fajitas de pollo":{ca:"Fajites de pollastre",en:"Chicken fajitas"},
    "Gambas al ajillo con arroz":{ca:"Gambes a l'allet amb arròs",en:"Garlic prawns with rice"},
    "Strogonoff ligero de pollo":{ca:"Strogonoff lleuger de pollastre",en:"Light chicken stroganoff"},
    "Salmón a la plancha teriyaki":{ca:"Salmó a la planxa teriyaki",en:"Teriyaki grilled salmon"},
    "Wok de pollo y calabacín":{ca:"Wok de pollastre i carbassó",en:"Chicken & zucchini wok"},
    "Revuelto cremoso de gambas":{ca:"Remenat cremós de gambes",en:"Creamy prawn scramble"},
    "Tacos de pavo con salsa de yogur":{ca:"Tacos de gall dindi amb salsa de iogurt",en:"Turkey tacos with yogurt sauce"},
    "Salteado de berenjena y carne":{ca:"Saltat d'albergínia i carn",en:"Eggplant & beef sauté"},
    "Merluza en salsa verde":{ca:"Lluç en salsa verda",en:"Hake in green sauce"},
    "Omelette de tomate y queso":{ca:"Truita de tomàquet i formatge",en:"Tomato & cheese omelette"},
    "Tortitas de avena y plátano":{ca:"Tortetes de civada i plàtan",en:"Oat & banana pancakes"},
    "Mug cake proteico de chocolate":{ca:"Mug cake proteic de xocolata",en:"Chocolate protein mug cake"},
    "Wrap de atún y aguacate":{ca:"Wrap de tonyina i alvocat",en:"Tuna & avocado wrap"},
    "Salmón a la sartén con boniato":{ca:"Salmó a la paella amb moniato",en:"Pan salmon with sweet potato"},
    // Ingredientes nuevos
    "Salsa de soja":{ca:"Salsa de soja",en:"Soy sauce"},"Mostaza":{ca:"Mostassa",en:"Mustard"},
    "Nata para cocinar":{ca:"Nata per cuinar",en:"Cooking cream"},"Pesto":{ca:"Pesto",en:"Pesto"},
    "Leche de coco":{ca:"Llet de coco",en:"Coconut milk"},"Tortillas de trigo":{ca:"Truites de blat",en:"Wheat tortillas"},
    "Curry en polvo":{ca:"Curri en pols",en:"Curry powder"},
    // Preparado renombrado
    "Verdura salteada en lotes":{ca:"Verdura saltada en lots",en:"Batch sautéed veggies"},
    // Recetas veganas
    "Porridge de avena y soja":{ca:"Porridge de civada i soja",en:"Oat & soy porridge"},
    "Wok de tofu y verduras":{ca:"Wok de tofu i verdures",en:"Tofu & veggie wok"},
    "Garbanzos al curry con coco":{ca:"Cigrons al curri amb coco",en:"Coconut curry chickpeas"},
    "Salteado de tempeh y verduras":{ca:"Saltat de tempeh i verdures",en:"Tempeh & veggie sauté"},
    "Tofu revuelto con tomate":{ca:"Tofu remenat amb tomàquet",en:"Tofu scramble with tomato"},
    "Batido vegano de plátano y cacahuete":{ca:"Batut vegà de plàtan i cacauet",en:"Vegan banana peanut shake"},
  });

  // Diccionario de palabras/frases para textos DINÁMICOS (con números, etc.)
  // Se reemplazan como palabra completa dentro de cualquier cadena.
  const DYN = {
    "kcal/día":{ca:"kcal/dia",en:"kcal/day"}, "al día":{ca:"al dia",en:"per day"},
    "días de ejercicio esta semana":{ca:"dies d'exercici aquesta setmana",en:"days of exercise this week"},
    "ejercicios pendientes":{ca:"exercicis pendents",en:"pending exercises"},
    "ejercicios":{ca:"exercicis",en:"exercises"}, "pendientes":{ca:"pendents",en:"pending"},
    "series":{ca:"sèries",en:"sets"}, "comidas":{ca:"àpats",en:"meals"},
    "en el carro":{ca:"al carro",en:"in cart"}, "quedan":{ca:"queden",en:"left"},
    "comprado":{ca:"comprat",en:"bought"}, "hechos":{ca:"fets",en:"done"},
    "Marca:":{ca:"Marca:",en:"Brand:"}, "También:":{ca:"També:",en:"Also:"},
    "Agua":{ca:"Aigua",en:"Water"}, "prot":{ca:"prot",en:"prot"},
    "Descongelar":{ca:"Descongelar",en:"Defrost"}, "para mañana":{ca:"per demà",en:"for tomorrow"},
    "Te avisaré":{ca:"T'avisaré",en:"I'll remind you"}, "comida":{ca:"àpat",en:"meal"},
    "Regenerar menú":{ca:"Regenerar menú",en:"Regenerate menu"},
    "objetivos pendientes":{ca:"objectius pendents",en:"pending goals"},
    "¡Toca":{ca:"Toca",en:"Time for"},
    "Fácil":{ca:"Fàcil",en:"Easy"}, "Rápida":{ca:"Ràpida",en:"Fast"},
    "Descongelar":{ca:"Descongelar",en:"Defrost"},
    "desayuno":{ca:"esmorzar",en:"breakfast"}, "cena":{ca:"sopar",en:"dinner"}, "snack":{ca:"snack",en:"snack"},
    "Coste estimado":{ca:"Cost estimat",en:"Estimated cost"},
    "hechos":{ca:"fets",en:"done"}, "hecho":{ca:"fet",en:"done"},
  };

  // Saludos del chat, toasts, notificaciones y ventanas
  Object.assign(DICT, {
    "¡Hola! 🥕 Soy Zana. Pregúntame lo que quieras sobre tu dieta, recetas, la compra o el ejercicio.":
      {ca:"Hola! 🥕 Soc la Zana. Pregunta'm el que vulguis sobre la teva dieta, receptes, la compra o l'exercici.",
       en:"Hi! 🥕 I'm Zana. Ask me anything about your diet, recipes, shopping or exercise."},
    "¡Hola! 🥕 Soy Zana. Ya te puedo ayudar aquí mismo. Para que converse con más soltura, añade tu **clave de IA gratuita**: pulsa el botón 🔑 de abajo (te explico cómo) o pégala aquí directamente.":
      {ca:"Hola! 🥕 Soc la Zana. Ja et puc ajudar aquí mateix. Perquè parli amb més fluïdesa, afegeix la teva **clau d'IA gratuïta**: prem el botó 🔑 de sota (t'explico com) o enganxa-la aquí directament.",
       en:"Hi! 🥕 I'm Zana. I can help you right here. For smoother chat, add your **free AI key**: tap the 🔑 button below (I'll show you how) or paste it here directly."},
    "Cuéntame cómo tiene que ser tu dieta 📝. Descríbela tanto como quieras (alimentos, estilo, restricciones, lo que comes, lo que evitas...) y te diré los pros y contras según tu perfil, y la aplicaré a tus menús.":
      {ca:"Explica'm com ha de ser la teva dieta 📝. Descriu-la tant com vulguis (aliments, estil, restriccions, què menges, què evites...) i et diré els pros i contres segons el teu perfil, i l'aplicaré als teus menús.",
       en:"Tell me how your diet should be 📝. Describe it as much as you like (foods, style, restrictions, what you eat, what you avoid...) and I'll give you the pros and cons for your profile, and apply it to your menus."},
    // Toasts
    "¡Plan creado! Bienvenido 🥕":{ca:"Pla creat! Benvingut/da 🥕",en:"Plan created! Welcome 🥕"},
    "Menú regenerado ✨":{ca:"Menú regenerat ✨",en:"Menu regenerated ✨"},
    "¡Comida hecha! 🍽️ Despensa actualizada":{ca:"Àpat fet! 🍽️ Rebost actualitzat",en:"Meal done! 🍽️ Pantry updated"},
    "¡Comida realizada! 🍽️ Despensa actualizada":{ca:"Àpat fet! 🍽️ Rebost actualitzat",en:"Meal done! 🍽️ Pantry updated"},
    "Comida desmarcada":{ca:"Àpat desmarcat",en:"Meal unchecked"},
    "¡+250 ml de agua! 💧":{ca:"+250 ml d'aigua! 💧",en:"+250 ml water! 💧"},
    "¡Compra guardada en tu despensa! 🥕":{ca:"Compra desada al teu rebost! 🥕",en:"Shopping saved to your pantry! 🥕"},
    "Lista regenerada 🛒":{ca:"Llista regenerada 🛒",en:"List regenerated 🛒"},
    "¡Ejercicio hecho! 💪":{ca:"Exercici fet! 💪",en:"Exercise done! 💪"},
    "Desmarcado":{ca:"Desmarcat",en:"Unchecked"},
    "Gasto añadido 💶":{ca:"Despesa afegida 💶",en:"Expense added 💶"},
    "Pon un importe válido 💶":{ca:"Posa un import vàlid 💶",en:"Enter a valid amount 💶"},
    "IA guardada 🥕":{ca:"IA desada 🥕",en:"AI saved 🥕"},
    "Alimento suprimido de tu dieta ✅":{ca:"Aliment suprimit de la teva dieta ✅",en:"Food removed from your diet ✅"},
    "Incidencia anotada 💨":{ca:"Incidència anotada 💨",en:"Issue logged 💨"},
    "Escribe qué te ha sentado mal":{ca:"Escriu què t'ha sentat malament",en:"Write what didn't sit well"},
    "Marcado como congelado 🧊":{ca:"Marcat com a congelat 🧊",en:"Marked as frozen 🧊"},
    "Descongelado":{ca:"Descongelat",en:"Defrosted"},
    "Elige un objetivo 🎯":{ca:"Tria un objectiu 🎯",en:"Pick a goal 🎯"},
    "Añade tu clave de IA para leer tiquets 🔑":{ca:"Afegeix la teva clau d'IA per llegir tiquets 🔑",en:"Add your AI key to read receipts 🔑"},
    "Leyendo tu tiquet... 📷":{ca:"Llegint el teu tiquet... 📷",en:"Reading your receipt... 📷"},
    "No pude leer el tiquet, prueba otra foto":{ca:"No he pogut llegir el tiquet, prova una altra foto",en:"Couldn't read the receipt, try another photo"},
    // Notificaciones
    "🥕 ¡Hola! Soy Zana":{ca:"🥕 Hola! Soc la Zana",en:"🥕 Hi! I'm Zana"},
    "Así te avisaré cuando toque cocinar 🍽️":{ca:"Així t'avisaré quan toqui cuinar 🍽️",en:"This is how I'll remind you when it's time to cook 🍽️"},
    "Notificaciones activadas 🔔":{ca:"Notificacions activades 🔔",en:"Notifications enabled 🔔"},
    // Ventanas / descripciones
    "tu coach nutricional 🥕":{ca:"el teu coach nutricional 🥕",en:"your nutrition coach 🥕"},
    "Cómo se hace":{ca:"Com es fa",en:"How to make it"},
    "🔒 Tu clave se guarda solo en tu móvil, nunca se comparte.":{ca:"🔒 La teva clau es desa només al teu mòbil, mai es comparteix.",en:"🔒 Your key is stored only on your phone, never shared."},
    "Para que la zanahoria converse contigo":{ca:"Perquè la pastanaga parli amb tu",en:"So the carrot can chat with you"},
    "Escríbele a Zana...":{ca:"Escriu a la Zana...",en:"Message Zana..."},
    "Ver receta paso a paso 👩‍🍳":{ca:"Veure recepta pas a pas 👩‍🍳",en:"See step-by-step recipe 👩‍🍳"},
    "Pídele a Zana que te lo explique 🥕":{ca:"Demana a la Zana que t'ho expliqui 🥕",en:"Ask Zana to explain it 🥕"},
    "Preguntar a Zana sobre esta receta 🥕":{ca:"Preguntar a la Zana sobre aquesta recepta 🥕",en:"Ask Zana about this recipe 🥕"},
    "Añadir gasto":{ca:"Afegir despesa",en:"Add expense"},
    "Cerrar":{ca:"Tancar",en:"Close"},
    // Cabeceras del resumen "Hoy"
    "🍽️ Comidas":{ca:"🍽️ Àpats",en:"🍽️ Meals"},
    "🤸 Ejercicios":{ca:"🤸 Exercicis",en:"🤸 Workouts"},
    "🧊 Preparar / congelar":{ca:"🧊 Preparar / congelar",en:"🧊 Prep / freeze"},
    "Descongelar":{ca:"Descongelar",en:"Defrost"},
    "Hoy":{ca:"Avui",en:"Today"},
    "El resto del día":{ca:"La resta del dia",en:"Rest of the day"},
  });
  // Palabras dinámicas extra (slots dentro de notificaciones, etc.)
  Object.assign(DICT, {});

  // Unidades de compra (packs y contables) para las cantidades del súper
  Object.assign(DYN, {
    "paquetes":{ca:"paquets",en:"packs"}, "paquete":{ca:"paquet",en:"pack"},
    "botes":{ca:"pots",en:"jars"}, "bote":{ca:"pot",en:"jar"},
    "latas":{ca:"llaunes",en:"cans"}, "lata":{ca:"llauna",en:"can"},
    "tarrinas":{ca:"terrines",en:"tubs"}, "tarrina":{ca:"terrina",en:"tub"},
    "bolsas":{ca:"bosses",en:"bags"}, "bolsa":{ca:"bossa",en:"bag"},
    "briks":{ca:"brics",en:"cartons"}, "brik":{ca:"bric",en:"carton"},
    "botellas":{ca:"ampolles",en:"bottles"}, "botella":{ca:"ampolla",en:"bottle"},
    "barras":{ca:"barres",en:"loaves"}, "barra":{ca:"barra",en:"loaf"},
    "envases":{ca:"envasos",en:"tubs"}, "envase":{ca:"envàs",en:"tub"},
    "huevos":{ca:"ous",en:"eggs"}, "huevo":{ca:"ou",en:"egg"},
    "plátanos":{ca:"plàtans",en:"bananas"}, "plátano":{ca:"plàtan",en:"banana"},
    "manzanas":{ca:"pomes",en:"apples"}, "manzana":{ca:"poma",en:"apple"},
    "tomates":{ca:"tomàquets",en:"tomatoes"}, "tomate":{ca:"tomàquet",en:"tomato"},
    "pimientos":{ca:"pebrots",en:"peppers"}, "pimiento":{ca:"pebrot",en:"pepper"},
    "cebollas":{ca:"cebes",en:"onions"}, "cebolla":{ca:"ceba",en:"onion"},
    "zanahorias":{ca:"pastanagues",en:"carrots"}, "zanahoria":{ca:"pastanaga",en:"carrot"},
    "aguacates":{ca:"alvocats",en:"avocados"}, "aguacate":{ca:"alvocat",en:"avocado"},
    "patatas":{ca:"patates",en:"potatoes"}, "patata":{ca:"patata",en:"potato"},
    "boniatos":{ca:"moniatos",en:"sweet potatoes"}, "boniato":{ca:"moniato",en:"sweet potato"},
    "brócolis":{ca:"bròquils",en:"broccoli"}, "brócoli":{ca:"bròquil",en:"broccoli"},
  });
  // Página de consumo económico
  Object.assign(DICT, {
    "Consumo económico":{ca:"Consum econòmic",en:"Spending"},
    "Basado en tus compras":{ca:"Basat en les teves compres",en:"Based on your shopping"},
    "Este mes":{ca:"Aquest mes",en:"This month"}, "Este año":{ca:"Aquest any",en:"This year"},
    "Gasto mensual":{ca:"Despesa mensual",en:"Monthly spending"},
    "últimos 12 meses · €":{ca:"últims 12 mesos · €",en:"last 12 months · €"},
    "Media mensual (este año)":{ca:"Mitjana mensual (aquest any)",en:"Monthly average (this year)"},
    "Promedio de lo que llevas gastado":{ca:"Mitjana del que portes gastat",en:"Average of what you've spent"},
    "Compras recientes":{ca:"Compres recents",en:"Recent purchases"},
    "🛒 En el carro":{ca:"🛒 Al carret",en:"🛒 In the cart"},
    "En el carro":{ca:"Al carret",en:"In the cart"},
    "Consumo económico":{ca:"Consum econòmic",en:"Spending"},
    // Preparados
    "🍳 Preparar antes de congelar":{ca:"🍳 Preparar abans de congelar",en:"🍳 Cook before freezing"},
    "🧊 Solo congelar":{ca:"🧊 Només congelar",en:"🧊 Just freeze"},
    "En el congelador":{ca:"Al congelador",en:"In the freezer"},
    "✅ Preparado y congelado":{ca:"✅ Preparat i congelat",en:"✅ Prepped & frozen"},
    "Cocínalos por lotes y, al acabar, márcalos como preparados y congelados.":{ca:"Cuina'ls per lots i, en acabar, marca'ls com a preparats i congelats.",en:"Batch-cook them and, when done, mark them as prepped and frozen."},
    "Estos van directos al congelador, sin cocinar.":{ca:"Aquests van directes al congelador, sense cuinar.",en:"These go straight to the freezer, no cooking."},
    "¡Preparado y al congelador! 🧊":{ca:"Preparat i al congelador! 🧊",en:"Prepped and in the freezer! 🧊"},
    "Toca para marcar como congelado":{ca:"Toca per marcar com a congelat",en:"Tap to mark as frozen"},
  });

  // Nuevos alimentos: nombres (wholesale) y unidades contables (DYN)
  Object.assign(DICT, {
    "Lomo de cerdo":{ca:"Llom de porc",en:"Pork loin"},"Bacalao":{ca:"Bacallà",en:"Cod"},
    "Sardinas en lata":{ca:"Sardines en llauna",en:"Canned sardines"},"Tofu":{ca:"Tofu",en:"Tofu"},
    "Tempeh":{ca:"Tempeh",en:"Tempeh"},"Edamame":{ca:"Edamame",en:"Edamame"},
    "Soja texturizada":{ca:"Soja texturitzada",en:"Textured soy"},"Alubias blancas":{ca:"Mongetes blanques",en:"White beans"},
    "Guisantes":{ca:"Pèsols",en:"Peas"},"Bebida de soja":{ca:"Beguda de soja",en:"Soy drink"},
    "Bebida de avena":{ca:"Beguda de civada",en:"Oat drink"},"Requesón":{ca:"Mató",en:"Cottage cheese"},
    "Queso curado":{ca:"Formatge curat",en:"Cured cheese"},"Quinoa":{ca:"Quinoa",en:"Quinoa"},
    "Tortitas de arroz":{ca:"Coquetes d'arròs",en:"Rice cakes"},"Nueces":{ca:"Nous",en:"Walnuts"},
    "Aceitunas":{ca:"Olives",en:"Olives"},"Semillas de chía":{ca:"Llavors de chía",en:"Chia seeds"},
    "Chocolate negro 85%":{ca:"Xocolata negra 85%",en:"85% dark chocolate"},"Calabacín":{ca:"Carbassó",en:"Zucchini"},
    "Berenjena":{ca:"Albergínia",en:"Eggplant"},"Champiñones":{ca:"Xampinyons",en:"Mushrooms"},
    "Lechuga":{ca:"Enciam",en:"Lettuce"},"Pepino":{ca:"Cogombre",en:"Cucumber"},
    "Judías verdes":{ca:"Mongeta tendra",en:"Green beans"},"Coliflor":{ca:"Coliflor",en:"Cauliflower"},
    "Ajo":{ca:"All",en:"Garlic"},"Naranja":{ca:"Taronja",en:"Orange"},"Kiwi":{ca:"Kiwi",en:"Kiwi"},
    "Pera":{ca:"Pera",en:"Pear"},"Uvas":{ca:"Raïm",en:"Grapes"},"Piña":{ca:"Pinya",en:"Pineapple"},
    "Frambuesas":{ca:"Gerds",en:"Raspberries"},
  });
  Object.assign(DYN, {
    "tabletas":{ca:"tauletes",en:"bars"}, "tableta":{ca:"tauleta",en:"bar"},
    "bandejas":{ca:"safates",en:"trays"}, "bandeja":{ca:"safata",en:"tray"},
    "calabacines":{ca:"carbassons",en:"zucchinis"}, "calabacín":{ca:"carbassó",en:"zucchini"},
    "berenjenas":{ca:"albergínies",en:"eggplants"}, "berenjena":{ca:"albergínia",en:"eggplant"},
    "lechugas":{ca:"enciams",en:"lettuces"}, "lechuga":{ca:"enciam",en:"lettuce"},
    "pepinos":{ca:"cogombres",en:"cucumbers"}, "pepino":{ca:"cogombre",en:"cucumber"},
    "coliflores":{ca:"coliflors",en:"cauliflowers"}, "coliflor":{ca:"coliflor",en:"cauliflower"},
    "cabeza de ajo":{ca:"cap d'all",en:"garlic bulb"}, "cabezas de ajo":{ca:"caps d'all",en:"garlic bulbs"},
    "naranjas":{ca:"taronges",en:"oranges"}, "naranja":{ca:"taronja",en:"orange"},
    "kiwis":{ca:"kiwis",en:"kiwis"}, "kiwi":{ca:"kiwi",en:"kiwi"},
    "peras":{ca:"peres",en:"pears"}, "pera":{ca:"pera",en:"pear"},
    "piñas":{ca:"pinyes",en:"pineapples"}, "piña":{ca:"pinya",en:"pineapple"},
  });

  function esRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }
  const DYN_SORTED = Object.entries(DYN).sort((a,b)=> b[0].length - a[0].length)
    .map(([k,v])=>({ k, v, re: new RegExp("(?<![\\p{L}\\p{N}])"+esRe(k)+"(?![\\p{L}\\p{N}])","gu") }));

  function tr(str, lang){
    const key = str.trim();
    const e = DICT[key];
    if(!e || !e[lang]) return null;
    return str.replace(key, e[lang]);
  }
  function tDyn(str, lang){
    let out = str;
    for(const {v,re} of DYN_SORTED){ const t=v[lang]; if(t) out = out.replace(re, t); }
    return out;
  }
  // Traduce una cadena suelta (toasts, chat, notificaciones)
  function translate(str){
    const lang = (window.ZSTORE?.get().settings.lang) || "es";
    if(lang==="es" || !str) return str;
    const w = tr(str, lang);
    if(w!==null && w!==str) return tDyn(w, lang);
    return tDyn(str, lang);
  }

  // Traduce todos los nodos de texto y placeholders dentro de root
  function apply(root){
    const lang = (window.ZSTORE?.get().settings.lang) || "es";
    root = root || document.body;
    if(lang==="es") return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    for(const n of nodes){
      const v = n.nodeValue;
      if(!v || !v.trim()) continue;
      const whole = tr(v, lang);
      if(whole!==null && whole!==v){ n.nodeValue = tDyn(whole, lang); continue; }
      const dyn = tDyn(v, lang);
      if(dyn!==v) n.nodeValue = dyn;
    }
    root.querySelectorAll("[placeholder]").forEach(el=>{
      const p = el.getAttribute("placeholder");
      const t = tr(p, lang);
      el.setAttribute("placeholder", (t!==null? tDyn(t,lang) : tDyn(p,lang)));
    });
  }

  // Helper para textos "clonados" en 3 idiomas (asistente, avisos largos)
  function L(es, ca, en){
    const lang = (window.ZSTORE?.get().settings.lang) || "es";
    return lang==="ca" ? (ca??es) : lang==="en" ? (en??es) : es;
  }
  window.ZL = L;

  return { apply, translate, L, DICT, DYN };
})();
