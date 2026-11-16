import * as THREE from 'three';

// Biblioteca de poesía: recursos dibujados localmente, sin APIs ni imágenes externas.
export const POEMAS_CONSEJO = Object.freeze([
  {
    "titulo": "Donde empieza el reino",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "No hace falta una corona",
      "para un reino levantar;",
      "basta una luz en la ventana",
      "y alguien a quien regresar."
    ]
  },
  {
    "titulo": "La torre de la luna",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Sobre la torre dormida",
      "la luna dejó su voz:",
      "hay noches que son eternas",
      "si las compartimos dos."
    ]
  },
  {
    "titulo": "El puente del alba",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "Un puente cruza la niebla,",
      "otro cruza el corazón;",
      "yo elegí seguir tus pasos",
      "sin pedirle al mapa razón."
    ]
  },
  {
    "titulo": "Jardín de piedra",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "Entre las viejas murallas",
      "una flor quiso nacer;",
      "hasta la piedra más fría",
      "tiene algo que agradecer."
    ]
  },
  {
    "titulo": "El faro del invierno",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "Cuando el invierno oscurece",
      "los caminos hacia el mar,",
      "tu recuerdo enciende un faro",
      "que me enseña a regresar."
    ]
  },
  {
    "titulo": "Nuestro pequeño castillo",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "Que el mundo guarde sus tronos,",
      "su oro y su inmensidad;",
      "yo prefiero una ventana",
      "donde verte despertar."
    ]
  },
  {
    "titulo": "La llave de cobre",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "No abre cofres ni tesoros,",
      "ni la puerta de un salón;",
      "esta llave tan pequeña",
      "abre nuestra conversación."
    ]
  },
  {
    "titulo": "Ventanas encendidas",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Cada ventana es un barco",
      "sobre un océano de cal;",
      "si dejas tu luz despierta,",
      "yo sabré dónde llegar."
    ]
  },
  {
    "titulo": "El bosque del silencio",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "El bosque guardó mi nombre",
      "bajo un abrigo de abril;",
      "lo pronunciaste muy bajo",
      "y volvió a vivir en mí."
    ]
  },
  {
    "titulo": "La rosa del patio",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "Una rosa entre las losas",
      "no conoce de esplendor;",
      "le basta un poco de lluvia",
      "para regalar color."
    ]
  },
  {
    "titulo": "Campanas al regreso",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "Cuando suenan las campanas",
      "sobre la tarde de miel,",
      "cada nota me recuerda",
      "que aún puedo volver."
    ]
  },
  {
    "titulo": "La escalera del viento",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "Subí buscando las nubes,",
      "bajé escuchando el jardín;",
      "a veces la mejor cima",
      "es quien espera por ti."
    ]
  },
  {
    "titulo": "El lago y la torre",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "En el agua de la tarde",
      "la torre aprende a bailar;",
      "lo que parece tan firme",
      "también se deja llevar."
    ]
  },
  {
    "titulo": "La carta sin sello",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Dejé una carta en tu libro,",
      "sin dirección ni papel:",
      "eran mis ganas de verte",
      "entre las líneas de ayer."
    ]
  },
  {
    "titulo": "La biblioteca dormida",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "Duermen cien mundos abiertos",
      "bajo un techo de nogal;",
      "si una página despierta,",
      "nada vuelve a ser igual."
    ]
  },
  {
    "titulo": "Abrigo de estrellas",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "La noche olvidó su abrigo",
      "en la almena del balcón;",
      "lo tendimos sobre el miedo",
      "y el miedo se adormeció."
    ]
  },
  {
    "titulo": "La puerta entreabierta",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "No prometo días perfectos",
      "ni un cielo siempre de abril;",
      "sí una puerta entreabierta",
      "cuando quieras venir."
    ]
  },
  {
    "titulo": "El reloj del jardín",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "El reloj perdió sus horas",
      "entre lavanda y jazmín;",
      "desde entonces mide el tiempo",
      "por lo que nos hace reír."
    ]
  },
  {
    "titulo": "La fuente escondida",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "En un rincón del castillo",
      "canta una fuente sin rey;",
      "el agua no pide aplausos",
      "para enseñarnos a ser."
    ]
  },
  {
    "titulo": "Manos de primavera",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Traías frío en los dedos,",
      "yo una tarde de papel;",
      "juntamos nuestras dos manos",
      "y empezó a florecer."
    ]
  },
  {
    "titulo": "El dragón de papel",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "Dibujamos un gran dragón",
      "en una hoja de color;",
      "no custodiaba riquezas,",
      "sino nuestro buen humor."
    ]
  },
  {
    "titulo": "El balcón del domingo",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "Se quedó quieta la prisa",
      "al ver la plaza pasar;",
      "un domingo a nuestro lado",
      "aprendió a descansar."
    ]
  },
  {
    "titulo": "La nieve sobre el puente",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "La nieve cubrió los pasos",
      "que dejamos al volver;",
      "no pudo borrar la risa",
      "que trajimos de aquel mes."
    ]
  },
  {
    "titulo": "Lumbre en la cocina",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "Lejos del salón del trono,",
      "junto al pan y al resplandor,",
      "descubrí que las historias",
      "también huelen a calor."
    ]
  },
  {
    "titulo": "La brújula pequeña",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "Mi brújula no señala",
      "las fronteras de un lugar;",
      "cuando pronuncias mi nombre,",
      "siempre empieza a girar."
    ]
  },
  {
    "titulo": "El hilo de la tarde",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Con un hilo de luz tibia",
      "la tarde cosió el balcón;",
      "nos quedamos en silencio",
      "para oír su corazón."
    ]
  },
  {
    "titulo": "Un reino sin murallas",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "Si construimos un reino,",
      "que no encierre a nadie allí;",
      "que sus puertas sean caminos",
      "y haya sitio para ti."
    ]
  },
  {
    "titulo": "Los nombres del río",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "El río cambia de orilla",
      "sin dejar de ser canción;",
      "yo cambio un poco contigo",
      "sin perder mi dirección."
    ]
  },
  {
    "titulo": "El secreto de la hiedra",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "La hiedra sube despacio,",
      "no tiene nada que probar;",
      "hay abrazos que se quedan",
      "sin necesidad de hablar."
    ]
  },
  {
    "titulo": "El guardián del alba",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "Un gorrión sobre la almena",
      "anunció que amaneció;",
      "sin espada ni armadura,",
      "a la sombra derrotó."
    ]
  },
  {
    "titulo": "Donde duermen las nubes",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "Las nubes bajan al valle",
      "cuando se cansa el azul;",
      "yo también busco un refugio",
      "en la calma que das tú."
    ]
  },
  {
    "titulo": "La mesa de los mapas",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Sobre la mesa extendimos",
      "un mapa sin terminar;",
      "dibujamos una casa",
      "y aprendimos a viajar."
    ]
  },
  {
    "titulo": "El eco de tus pasos",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "Por el corredor de piedra",
      "ya no camina el temor;",
      "va siguiendo nuestros pasos",
      "un eco de buen humor."
    ]
  },
  {
    "titulo": "La lámpara del lector",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "Una lámpara pequeña",
      "hace al invierno esperar;",
      "mientras exista una historia,",
      "queda un mundo por hallar."
    ]
  },
  {
    "titulo": "El pozo de los deseos",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "No arrojé ninguna moneda",
      "al pozo del viejo patio;",
      "pedí saber reconocer",
      "lo bueno que tengo al lado."
    ]
  },
  {
    "titulo": "La capa del viajero",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "Mi capa guarda caminos,",
      "polvo, lluvia y un adiós;",
      "pero en su bolsillo llevo",
      "el calor de nuestra voz."
    ]
  },
  {
    "titulo": "Azul de medianoche",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "El cielo derrama tinta",
      "sobre el lomo del torreón;",
      "escribamos algo bueno",
      "antes de que salga el sol."
    ]
  },
  {
    "titulo": "La silla junto al fuego",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Hay una silla esperando",
      "junto al fuego del salón;",
      "no pregunta de qué huyes,",
      "solo ofrece su rincón."
    ]
  },
  {
    "titulo": "Un barco en la ventana",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "Doblé un barco de papel",
      "y lo puse en el alféizar;",
      "no necesitaba un puerto,",
      "solo una ilusión sincera."
    ]
  },
  {
    "titulo": "El baile de las hojas",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "El otoño por el patio",
      "hizo una fiesta de cobre;",
      "cada hoja que caía",
      "parecía decir tu nombre."
    ]
  },
  {
    "titulo": "La canción del herrero",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "Bajo el golpe del martillo",
      "nace un ritmo de metal;",
      "también los días difíciles",
      "pueden algo bueno forjar."
    ]
  },
  {
    "titulo": "El espejo del estanque",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "El estanque no me exige",
      "ser distinto para entrar;",
      "me devuelve lo que encuentro",
      "cuando aprendo a mirar."
    ]
  },
  {
    "titulo": "La primera luciérnaga",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "Una chispa entre los juncos",
      "se atrevió a la oscuridad;",
      "no encendió todo el camino,",
      "pero nos hizo avanzar."
    ]
  },
  {
    "titulo": "El tapiz inacabado",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Nuestro tapiz tiene huecos,",
      "nudos y algún hilo gris;",
      "por eso cuenta una vida,",
      "no un dibujo sin matiz."
    ]
  },
  {
    "titulo": "Pan para el camino",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "Lleva pan para el camino,",
      "una historia y buen humor;",
      "hay distancias que se acortan",
      "si se viaja con amor."
    ]
  },
  {
    "titulo": "El jardín de invierno",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "Parecía que las ramas",
      "habían dejado de soñar;",
      "bajo el silencio del frío",
      "ya preparaban su brotar."
    ]
  },
  {
    "titulo": "La plaza sin corona",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "En la plaza nadie manda",
      "cuando empieza la canción;",
      "hasta el rey baja sus pasos",
      "al compás del acordeón."
    ]
  },
  {
    "titulo": "La escalera de caracol",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "Cada vuelta de la escala",
      "me devuelve un mismo azul;",
      "no es volver al mismo sitio",
      "si en el viaje creces tú."
    ]
  },
  {
    "titulo": "La lluvia en los cristales",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "Escribió la lluvia un verso",
      "en el vidrio del salón;",
      "no supimos descifrarlo,",
      "pero el ruido nos unió."
    ]
  },
  {
    "titulo": "Un lugar en la mesa",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "No hace falta una gran fiesta",
      "ni vajilla de marfil;",
      "basta un sitio entre nosotros",
      "que guardamos para ti."
    ]
  },
  {
    "titulo": "El sendero de lavanda",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "La lavanda junto al muro",
      "perfuma incluso al pasar;",
      "hay personas que hacen eso:",
      "sin querer, nos hacen bien."
    ]
  },
  {
    "titulo": "La torre sin bandera",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "Una torre sin bandera",
      "no ha perdido su valor;",
      "puede abrirse a todo el valle",
      "sin pedir un vencedor."
    ]
  },
  {
    "titulo": "El astrolabio quieto",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "Preguntamos a las estrellas",
      "por el rumbo de los dos;",
      "nos respondieron brillando,",
      "lo demás fue decisión."
    ]
  },
  {
    "titulo": "El cuaderno del regreso",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "En las páginas vacías",
      "no anoté lo que perdí;",
      "fui escribiendo los pequeños",
      "buenos días que viví."
    ]
  },
  {
    "titulo": "La sombra del cerezo",
    "subtitulo": "Biblioteca de los versos",
    "color": "#315f69",
    "cielo": "#183647",
    "acento": "#f2d49b",
    "motivo": "castillo",
    "versos": [
      "Bajo la sombra del árbol",
      "dejamos la discusión;",
      "las palabras, más despacio,",
      "encontraron otra voz."
    ]
  },
  {
    "titulo": "El secreto del umbral",
    "subtitulo": "Biblioteca de los versos",
    "color": "#594578",
    "cielo": "#19182f",
    "acento": "#e8d6ff",
    "motivo": "luna",
    "versos": [
      "Una casa se hace hogar",
      "cuando al cruzar su umbral",
      "ya no tienes que fingir",
      "que nunca te sale mal."
    ]
  },
  {
    "titulo": "El ala de la tarde",
    "subtitulo": "Biblioteca de los versos",
    "color": "#9a533e",
    "cielo": "#3e3d60",
    "acento": "#ffdaa8",
    "motivo": "puente",
    "versos": [
      "Una golondrina escribe",
      "su camino sobre el sol;",
      "yo no sé leer el cielo,",
      "pero entiendo su canción."
    ]
  },
  {
    "titulo": "Una taza y dos historias",
    "subtitulo": "Biblioteca de los versos",
    "color": "#41634a",
    "cielo": "#203b3b",
    "acento": "#e6dcab",
    "motivo": "jardin",
    "versos": [
      "Dos historias diferentes",
      "en la mesa coincidieron;",
      "entre una taza y la otra,",
      "nuevos capítulos nacieron."
    ]
  },
  {
    "titulo": "La última vela",
    "subtitulo": "Biblioteca de los versos",
    "color": "#335b87",
    "cielo": "#162b48",
    "acento": "#e3eeff",
    "motivo": "faro",
    "versos": [
      "Si se apaga la última vela,",
      "no termina la reunión;",
      "quedan brasas en la charla",
      "y calor en cada voz."
    ]
  },
  {
    "titulo": "Hasta la próxima página",
    "subtitulo": "Biblioteca de los versos",
    "color": "#85445d",
    "cielo": "#38223d",
    "acento": "#ffd5bd",
    "motivo": "castillo",
    "versos": [
      "Cierra el libro con cuidado,",
      "deja un hilo en el lugar;",
      "las historias compartidas",
      "siempre invitan a regresar."
    ]
  }
]);

export function crearSalaConsejoPoetica(escena, camara, castillo, elemento, opciones = {}) {
  if (castillo.userData.consejoPoetico) return castillo.userData.consejoPoetico;
  const ROOM = 'Sala del consejo';
  const raiz = new THREE.Group();
  raiz.name = 'Consejo · Biblioteca de los versos';
  Object.assign(raiz.userData, { habitacion: ROOM, noAgrupar: true, dinamico: true });
  castillo.add(raiz);
  const geometrias = new Set(), materiales = new Set(), texturas = new Set();
  const obstaculosPropios = [], originalesOcultos = [], colisionesQuitadas = [];
  const colisiones = castillo.userData.colisiones;
  const geoCaja = new THREE.BoxGeometry(1, 1, 1); geometrias.add(geoCaja);
  const originalBox = new THREE.Box3(), inv = new THREE.Matrix4();
  castillo.updateMatrixWorld(true); inv.copy(castillo.matrixWorld).invert();
  const zona = new THREE.Box3(new THREE.Vector3(7.4, 3, -17.8), new THREE.Vector3(19.7, 9.8, -2.4));
  castillo.traverse(o => {
    if (!o.isMesh || !/^(Mesa|Armario)(\s|$)/i.test(o.name)) return;
    originalBox.setFromObject(o).applyMatrix4(inv);
    if (zona.containsBox(originalBox)) originalesOcultos.push({ objeto: o, visible: o.visible });
  });
  originalesOcultos.forEach(r => { r.objeto.visible = false; });
  if (Array.isArray(colisiones)) {
    const retirados = new Set(originalesOcultos.map(r => r.objeto));
    for (let i = colisiones.length - 1; i >= 0; i--) {
      if (retirados.has(colisiones[i].mesh)) colisionesQuitadas.push({ indice: i, valor: colisiones.splice(i, 1)[0] });
    }
  }
  function material(color, extra = {}) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra }); materiales.add(m); return m;
  }
  const madera = material('#38251f'), borde = material('#644532'), oro = material('#cba75d', { metalness: 0.55, roughness: 0.42 });
  const tela = material('#663b4e'), marfil = material('#edddb7'), cuero = material(POEMAS_CONSEJO[0].color);
  const oscuro = material('#211c24');
  function marcar(o) { Object.assign(o.userData, { habitacion: ROOM, noAgrupar: true, dinamico: true }); return o; }
  function caja(nombre, x, y, z, w, h, d, mat, padre = raiz, solido = false) {
    const o = marcar(new THREE.Mesh(geoCaja, mat)); o.name = nombre; o.position.set(x,y,z); o.scale.set(w,h,d);
    o.castShadow = o.receiveShadow = true; padre.add(o);
    if (solido && Array.isArray(colisiones)) {
      const r = { mesh: o, w, h, d, esCaja: true }; colisiones.push(r); obstaculosPropios.push(r);
    }
    return o;
  }
  function cilindro(x,y,z,r,h,mat,padre=raiz) {
    const geo = new THREE.CylinderGeometry(r,r,h,16); geometrias.add(geo);
    const o = marcar(new THREE.Mesh(geo,mat)); o.position.set(x,y,z); o.castShadow = o.receiveShadow = true; padre.add(o); return o;
  }
  function canvas(ancho, alto) { const c = document.createElement('canvas'); c.width=ancho; c.height=alto; return c; }
  function textura(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; texturas.add(t); return t; }
  function plano(c, w, h, x, y, z, ry=0, padre=raiz) {
    const geo = new THREE.PlaneGeometry(w,h); geometrias.add(geo);
    const mat = new THREE.MeshBasicMaterial({ map: textura(c), side: THREE.DoubleSide, toneMapped: false }); materiales.add(mat);
    const o = marcar(new THREE.Mesh(geo,mat)); o.position.set(x,y,z); o.rotation.y=ry; padre.add(o); return o;
  }
  function textoCentrado(ctx, texto, y, tam, ancho=420) {
    ctx.font = `${tam}px Georgia, serif`; const palabras=texto.split(' '); let linea='', lineas=[];
    for(const p of palabras) { const prueba=linea ? linea+' '+p : p; if(ctx.measureText(prueba).width>ancho && linea){lineas.push(linea);linea=p;}else linea=prueba; }
    if(linea)lineas.push(linea); ctx.textAlign='center';
    lineas.forEach((l,i)=>ctx.fillText(l,256,y+i*tam*1.2)); return y+lineas.length*tam*1.2;
  }
  function paisaje(ctx, p) {
    const grad=ctx.createLinearGradient(0,100,0,600); grad.addColorStop(0,p.cielo); grad.addColorStop(1,p.color);
    ctx.fillStyle=grad; ctx.fillRect(48,210,416,365);
    ctx.fillStyle=p.acento;
    for(let i=0;i<26;i++){ const x=62+(i*83%382), y=226+(i*47%170); ctx.globalAlpha=0.35+(i%3)*0.2; ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill(); }
    ctx.globalAlpha=1; ctx.beginPath();ctx.arc(p.motivo==='luna'?282:355,280,p.motivo==='luna'?42:25,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#15242c';ctx.beginPath();ctx.moveTo(48,500);ctx.lineTo(125,405);ctx.lineTo(215,470);ctx.lineTo(300,390);ctx.lineTo(464,500);ctx.lineTo(464,575);ctx.lineTo(48,575);ctx.fill();
    ctx.fillStyle='#0c1821';ctx.beginPath();ctx.moveTo(48,550);ctx.quadraticCurveTo(250,450,464,535);ctx.lineTo(464,575);ctx.lineTo(48,575);ctx.fill();
    const torre=(x,y,w,h)=>{ctx.fillStyle='#dbc79e';ctx.fillRect(x,y,w,h);for(let n=0;n<3;n++)ctx.fillRect(x+n*w/3,y-9,w/5,12);ctx.fillStyle='#f8d487';ctx.fillRect(x+w*.4,y+25,w*.2,19);};
    if(p.motivo==='puente') {
      ctx.strokeStyle='#d6b887';ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(90,494);ctx.quadraticCurveTo(256,352,422,494);ctx.stroke();
      ctx.fillStyle='#d6b887';ctx.fillRect(118,465,17,80);ctx.fillRect(377,465,17,80);
      ctx.strokeStyle='#8ab8bd';ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(165,530+i*6);ctx.lineTo(345,530+i*6);ctx.stroke();}
    } else if(p.motivo==='faro') {
      ctx.fillStyle='#e7d7b0';ctx.beginPath();ctx.moveTo(228,514);ctx.lineTo(244,345);ctx.lineTo(274,345);ctx.lineTo(289,514);ctx.fill();
      ctx.fillStyle=p.acento;ctx.fillRect(239,329,40,25);ctx.globalAlpha=.2;ctx.beginPath();ctx.moveTo(256,340);ctx.lineTo(452,277);ctx.lineTo(452,390);ctx.fill();ctx.globalAlpha=1;
    } else {
      torre(156,408,48,112);torre(307,408,48,112);torre(232,360,48,160);
      ctx.fillStyle='#d2b78d';ctx.fillRect(200,449,112,71);ctx.fillStyle='#24313a';ctx.beginPath();ctx.arc(256,492,15,Math.PI,0);ctx.lineTo(271,520);ctx.lineTo(241,520);ctx.fill();
      if(p.motivo==='jardin'){for(let i=0;i<11;i++){ctx.fillStyle=['#dbb0b5','#e6cf9d','#abbf92'][i%3];ctx.beginPath();ctx.arc(95+i*32,548-(i%3)*10,5,0,Math.PI*2);ctx.fill();}}
    }
  }
  function portada(p) {
    const c=canvas(512,768),ctx=c.getContext('2d');
    ctx.fillStyle=p.color;ctx.fillRect(0,0,512,768);ctx.strokeStyle=p.acento;ctx.lineWidth=3;ctx.strokeRect(22,22,468,724);ctx.lineWidth=1;ctx.strokeRect(32,32,448,704);
    ctx.fillStyle=p.acento;ctx.font='15px Georgia';ctx.textAlign='center';ctx.fillText('BIBLIOTECA DEL CONSEJO',256,72);
    textoCentrado(ctx,p.titulo,120,31,400);paisaje(ctx,p);
    ctx.strokeStyle=p.acento;ctx.strokeRect(48,210,416,365);ctx.fillStyle=p.acento;textoCentrado(ctx,p.subtitulo,627,21,395);
    ctx.font='14px Georgia';ctx.fillText('POEMAS PARA HABITAR UN CASTILLO',256,708);return c;
  }
  // Caché limitada: 60 portadas disponibles, como máximo cuatro texturas activas.
  const cachePortadas=new Map();
  function obtenerPortada(n) {
    if(cachePortadas.has(n)){
      const existente=cachePortadas.get(n);cachePortadas.delete(n);cachePortadas.set(n,existente);return existente;
    }
    const c=portada(POEMAS_CONSEJO[n]),t=textura(c),entrada={canvas:c,textura:t};cachePortadas.set(n,entrada);
    while(cachePortadas.size>4){const k=cachePortadas.keys().next().value;const viejo=cachePortadas.get(k);viejo.textura.dispose();texturas.delete(viejo.textura);cachePortadas.delete(k);}
    return entrada;
  }

  // Estanterías de madera con libros geométricos; sin descargas.
  let semilla=721; const azar=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla/4294967296;};
  const lomos=['#6b334c','#3d6566','#8a6a3f','#4e4976','#8e493c','#486247'].map(c=>material(c));
  function estanteria(x,z,ancho,rot=0) {
    const g=new THREE.Group();g.position.set(x,3,z);g.rotation.y=rot;raiz.add(g);
    caja('Consejo · Fondo de estantería',0,2.15,0,ancho,4.3,.65,madera,g,true);
    for(const dx of [-ancho/2,ancho/2])caja('Consejo · Columna',dx,2.15,.39,.14,4.5,.24,borde,g);
    for(let f=0;f<5;f++) {
      const y=.28+f*.82;caja('Consejo · Repisa',0,y,.43,ancho+.18,.12,.95,borde,g);
      let xLibro=-ancho/2+.15;
      while(xLibro<ancho/2-.22) {
        const w=.13+azar()*.15,h=.42+azar()*.25;
        caja('Consejo · Libro de estante',xLibro+w/2,y+.06+h/2,.43,w,h,.45,lomos[Math.floor(azar()*lomos.length)],g);
        caja('Consejo · Dorado del lomo',xLibro+w/2,y+.06+h*.75,.661,w*.74,.018,.012,oro,g);xLibro+=w+.035;
      }
    }
    caja('Consejo · Cornisa tallada',0,4.5,.08,ancho+.28,.22,1.02,oro,g);
  }
  estanteria(10.35,-17.15,4.25);estanteria(16.8,-17.15,4.25);
  estanteria(19.05,-5.65,4.5,-Math.PI/2);estanteria(19.05,-14.8,3.2,-Math.PI/2);

  // Alfombra y zócalos; se mantiene libre la puerta del oeste.
  const alf=canvas(512,512),ac=alf.getContext('2d');ac.fillStyle='#503044';ac.fillRect(0,0,512,512);
  for(const inset of [12,21,40]){ac.strokeStyle=inset===21?'#b48e56':'#806345';ac.lineWidth=3;ac.strokeRect(inset,inset,512-2*inset,512-2*inset);}
  ac.strokeStyle='#b48e56';ac.lineWidth=2;ac.beginPath();ac.moveTo(256,140);ac.lineTo(340,256);ac.lineTo(256,372);ac.lineTo(172,256);ac.closePath();ac.stroke();
  const alfombra=plano(alf,8.2,10.8,13.4,3.025,-9.7);alfombra.rotation.x=-Math.PI/2;
  caja('Consejo · Zócalo posterior',13.5,3.27,-17.52,12.3,.45,.15,borde);
  caja('Consejo · Zócalo oriental',19.51,3.27,-10,.15,.45,15,borde);

  // Atril central y libro tridimensional.
  caja('Consejo · Base del atril',13.6,3.18,-10.1,1.9,.32,1.45,madera,raiz,true);
  caja('Consejo · Pedestal',13.6,3.84,-10.1,1.12,1.05,.92,borde,raiz,true);
  caja('Consejo · Moldura de atril',13.6,4.41,-10.1,1.95,.15,1.45,oro);
  const libro=new THREE.Group();libro.position.set(13.6,5.49,-10.1);libro.rotation.y=-Math.PI/2;raiz.add(libro);marcar(libro);
  caja('Consejo · Páginas',0,0,0,1.62,2.02,.27,marfil,libro);
  caja('Consejo · Contraportada',0,0,-.17,1.77,2.16,.07,cuero,libro);
  caja('Consejo · Lomo',-.865,0,0,.1,2.16,.4,cuero,libro);
  for(const y of [-.84,-.67,.67,.84])caja('Consejo · Nervio dorado',-.923,y,0,.02,.035,.41,oro,libro);
  const hoja=canvas(512,768), hc=hoja.getContext('2d');
  const pagina=plano(hoja,1.56,1.96,0,0,.141,0,libro);
  const pivote=new THREE.Group();pivote.position.set(-.885,0,.2);libro.add(pivote);marcar(pivote);
  caja('Consejo · Tapa móvil',.885,0,0,1.77,2.16,.075,cuero,pivote);
  const geoPortada=new THREE.PlaneGeometry(1.7,2.09);geometrias.add(geoPortada);
  const matPortada=new THREE.MeshBasicMaterial({map:obtenerPortada(0).textura,toneMapped:false});materiales.add(matPortada);
  const caratula=marcar(new THREE.Mesh(geoPortada,matPortada));caratula.position.set(.885,0,.04);pivote.add(caratula);
  function pintarPagina(p) {
    hc.fillStyle='#f4e7c9';hc.fillRect(0,0,512,768);
    hc.strokeStyle='#a78c53';hc.lineWidth=2;hc.strokeRect(25,25,462,718);
    hc.fillStyle='#40313c';textoCentrado(hc,p.titulo,115,30,416);
    hc.font='25px Georgia';hc.textAlign='center';
    let y=280;
    for(const verso of p.versos){
      let linea='';
      for(const palabra of verso.split(' ')){
        const prueba=linea?linea+' '+palabra:palabra;
        if(linea && hc.measureText(prueba).width>425){hc.fillText(linea,256,y);y+=35;linea=palabra;}else linea=prueba;
      }
      if(linea){hc.fillText(linea,256,y);y+=45;}
    }
    hc.font='15px Georgia';hc.fillStyle='#8c754c';hc.fillText('BIBLIOTECA DE LOS VERSOS',256,688);
    pagina.material.map.needsUpdate=true;
  }
  pintarPagina(POEMAS_CONSEJO[0]);

  // CONSEJO_LIBRO_ABIERTO_60_V2: acabados locales, sin teñir materiales compartidos.
  const paredConsejo=material('#244a4d',{roughness:.94});
  const matSueloConsejo=material('#aa916b',{roughness:.88});
  caja('Consejo · Pared verde petróleo posterior',13.5,6.5,-17.585,12.3,6.96,.018,paredConsejo);
  caja('Consejo · Pared verde petróleo este',19.585,6.5,-9.96,.018,6.96,15.25,paredConsejo);
  caja('Consejo · Pared verde petróleo frontal',13.5,6.5,-2.315,12.3,6.96,.018,paredConsejo);
  // La puerta oeste conserva su hueco de 2,6 m y su dintel.
  caja('Consejo · Pared oeste norte',7.335,6.5,-14.5,.018,6.96,6.34,paredConsejo);
  caja('Consejo · Pared oeste sur',7.335,6.5,-5.5,.018,6.96,6.34,paredConsejo);
  caja('Consejo · Dintel verde',7.335,8.3,-10,.018,3.36,2.66,paredConsejo);
  const pisoConsejo=caja('Consejo · Piso roble miel',13.46,3.007,-9.98,12.20,.01,15.22,matSueloConsejo);
  const vetas=canvas(512,512),vc=vetas.getContext('2d');vc.fillStyle='#b79c75';vc.fillRect(0,0,512,512);
  for(let fila=0;fila<8;fila++){
    const yy=fila*64;vc.fillStyle=fila%2?'#b99d77':'#ac906b';vc.fillRect(0,yy,512,64);
    vc.strokeStyle='#7c654c';vc.lineWidth=2;vc.strokeRect(0,yy,512,64);
    vc.beginPath();vc.moveTo((fila%3)*170+36,yy);vc.lineTo((fila%3)*170+36,yy+64);vc.stroke();
    vc.strokeStyle='#7f664530';vc.lineWidth=1;
    for(let j=0;j<8;j++){vc.beginPath();vc.moveTo(0,yy+9+j*6);vc.bezierCurveTo(170,yy+3+j*6,340,yy+15+j*6,512,yy+8+j*6);vc.stroke();}
  }
  const mapaPiso=textura(vetas);mapaPiso.wrapS=mapaPiso.wrapT=THREE.RepeatWrapping;mapaPiso.repeat.set(3,4);matSueloConsejo.map=mapaPiso;matSueloConsejo.color.set('#ffffff');matSueloConsejo.needsUpdate=true;
  // La tapa interior izquierda lleva la ilustración; el poema aparece a la derecha.
  const geoInterior=new THREE.PlaneGeometry(1.64,2.02);geometrias.add(geoInterior);
  const matInterior=new THREE.MeshBasicMaterial({map:obtenerPortada(0).textura,toneMapped:false});materiales.add(matInterior);
  const interior=marcar(new THREE.Mesh(geoInterior,matInterior));interior.position.set(.885,0,-.044);interior.rotation.y=Math.PI;pivote.add(interior);
  pagina.material.transparent=true;pagina.material.opacity=0;pagina.material.depthWrite=false;
  const pivoteHoja=new THREE.Group();pivoteHoja.position.set(-.81,0,.16);libro.add(pivoteHoja);
  const geoHoja=new THREE.PlaneGeometry(1.62,2.02);geometrias.add(geoHoja);
  const matHoja=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});materiales.add(matHoja);
  const hojaMovil=marcar(new THREE.Mesh(geoHoja,matHoja));hojaMovil.position.x=.81;pivoteHoja.add(hojaMovil);


  function sillon(x,z,rot) {
    const g=new THREE.Group();g.position.set(x,3,z);g.rotation.y=rot;raiz.add(g);
    caja('Consejo · Butaca',0,.48,0,1.3,.65,1.25,tela,g,true);
    caja('Consejo · Respaldo',0,1.08,-.53,1.3,1.1,.23,tela,g);
    for(const dx of [-.68,.68])caja('Consejo · Brazo tallado',dx,.85,0,.16,.55,1.2,borde,g);
    for(const dx of [-.49,.49])for(const dz of [-.43,.43])caja('Consejo · Pata',dx,.14,dz,.12,.28,.12,oro,g);
  }
  sillon(10.2,-5.1,Math.PI/2);sillon(16.5,-5.1,-Math.PI/2);
  caja('Consejo · Mesa de lectura',13.35,3.68,-5.1,1.55,1.32,1.2,madera,raiz,true);
  caja('Consejo · Tapa de mesa',13.35,4.39,-5.1,1.8,.12,1.4,borde);
  for(let i=0;i<3;i++)caja('Consejo · Volumen apilado',13.4,4.52+i*.12,-5.1,.7,.1,.49,lomos[i]);

  // Cartela, cuadro y lámpara ornamental.
  const cartel=canvas(512,256),cc=cartel.getContext('2d');cc.fillStyle='#302831';cc.fillRect(0,0,512,256);cc.strokeStyle='#cba75d';cc.lineWidth=5;cc.strokeRect(12,12,488,232);cc.fillStyle='#eddbb6';
  textoCentrado(cc,'LA BIBLIOTECA',93,35);textoCentrado(cc,'DE LOS VERSOS',145,30);cc.font='17px Georgia';cc.fillText('SALA DEL CONSEJO',256,210);
  plano(cartel,3.4,1.7,13.5,8.3,-17.53);
  const arte=portada(POEMAS_CONSEJO[1]);caja('Consejo · Marco del cuadro',19.48,6.3,-9.1,.12,3.0,2.08,oro);
  plano(arte,1.9,2.82,19.40,6.3,-9.1,-Math.PI/2);
  const llama=material('#ffe2a0',{emissive:'#ffb85b',emissiveIntensity:1.4});
  const geoLlama=new THREE.SphereGeometry(.065,8,6);geometrias.add(geoLlama);
  function vela(x,y,z) {
    cilindro(x,y+.17,z,.065,.34,marfil);cilindro(x,y-.025,z,.14,.06,oro);
    const f=marcar(new THREE.Mesh(geoLlama,llama));f.position.set(x,y+.39,z);f.scale.y=1.9;raiz.add(f);
  }
  cilindro(13.6,8.4,-10.1,1.12,.09,oro);
  cilindro(13.6,9.0,-10.1,.028,1.15,oro);
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7;vela(13.6+Math.cos(a)*1.03,8.48,-10.1+Math.sin(a)*1.03);}
  vela(12.8,4.5,-5.1);vela(14.3,4.5,-5.1);
  const luz=new THREE.PointLight(0xffd39c,23,12,2);luz.position.set(13.6,7.4,-10.1);luz.castShadow=false;raiz.add(luz);marcar(luz);

  // Libros estáticos agrupados por material para reducir llamadas de dibujo.
  raiz.updateWorldMatrix(true,true);
  const inversaRaiz=new THREE.Matrix4().copy(raiz.matrixWorld).invert();
  const lotes=new Map(),aRetirar=[];
  raiz.traverse(o=>{
    if(!o.isMesh || !/^Consejo · (Libro de estante|Dorado del lomo)$/.test(o.name))return;
    if(!lotes.has(o.material))lotes.set(o.material,[]);
    lotes.get(o.material).push(new THREE.Matrix4().multiplyMatrices(inversaRaiz,o.matrixWorld));
    aRetirar.push(o);
  });
  aRetirar.forEach(o=>o.removeFromParent());
  for(const [mat,matrices] of lotes){
    const lote=marcar(new THREE.InstancedMesh(geoCaja,mat,matrices.length));
    lote.name='Consejo · Libros agrupados';lote.castShadow=lote.receiveShadow=true;
    matrices.forEach((m,i)=>lote.setMatrixAt(i,m));lote.instanceMatrix.needsUpdate=true;
    lote.computeBoundingSphere();raiz.add(lote);
  }

  // Lector sobre el escenario: el libro real permanece a la vista.
  const id='consejo-poetico';
  const estilo=document.createElement('style');estilo.textContent=`
  #${id}[hidden],#${id}-abrir[hidden],#${id} [hidden]{display:none!important}
  #${id}{position:fixed;inset:0;z-index:30000;background:transparent;display:flex;align-items:flex-end;justify-content:center;padding:14px;box-sizing:border-box;color:#f6e8cc;font-family:Georgia,serif}
  #${id} *{box-sizing:border-box}
  #${id} .cp-hud{width:min(850px,100%);padding:15px 18px;border:1px solid #b49b65;border-radius:16px;background:#17272aee;box-shadow:0 10px 45px #0008;max-height:60dvh;overflow:auto;overscroll-behavior:contain}
  #${id} .cp-barra{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
  #${id} h2{font-size:18px;margin:0 0 5px;color:#ffe5ac}
  #${id} .cp-estado{font:12px/1.4 system-ui,sans-serif;color:#ccc2ac;margin:0}
  #${id} button,#${id}-abrir{font:14px system-ui,sans-serif;min-height:44px;background:#263e40;color:#f6e8cc;border:1px solid #b19a63;padding:10px 14px;border-radius:9px;cursor:pointer;touch-action:manipulation}
  #${id} button:disabled{opacity:.45;cursor:wait}
  #${id} button:hover,#${id}-abrir:hover{background:#3c5654}
  #${id} button:focus-visible,#${id}-abrir:focus-visible{outline:3px solid #f6ce74;outline-offset:3px}
  #${id} .cp-acciones{display:flex;gap:8px;flex-wrap:wrap}
  #${id} .cp-versos{white-space:pre-line;text-align:center;font-size:clamp(18px,3vw,24px);line-height:1.8;margin:16px 0 6px}
  #${id}-abrir{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:25;max-width:90vw;background:#183537ee}
  @media(max-width:600px){#${id}{padding:7px}#${id} .cp-hud{padding:12px}#${id} h2{font-size:16px}#${id} button{padding:9px 10px;font-size:12px}.cp-acciones{width:100%;justify-content:center}}
  `;document.head.appendChild(estilo);
  const panel=document.createElement('section');panel.id=id;panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Libro de poemas de la Sala del Consejo');
  panel.innerHTML=`<div class="cp-hud"><div class="cp-barra"><div><h2>Biblioteca de los versos</h2><p class="cp-estado" role="status" aria-live="polite"></p></div><div class="cp-acciones"><button type="button" class="cp-anterior">← Anterior</button><button type="button" class="cp-siguiente">Siguiente →</button><button type="button" class="cp-texto" aria-expanded="false">Ampliar texto</button><button type="button" class="cp-cerrar">Cerrar libro</button></div></div><p class="cp-versos" hidden></p></div>`;
  document.body.appendChild(panel);
  const abrirBtn=document.createElement('button');abrirBtn.id=id+'-abrir';abrirBtn.type='button';abrirBtn.hidden=true;abrirBtn.textContent='R · Abrir el libro del consejo';document.body.appendChild(abrirBtn);
  const titulo=panel.querySelector('h2'),aviso=panel.querySelector('.cp-estado'),versos=panel.querySelector('.cp-versos');
  const anterior=panel.querySelector('.cp-anterior'),siguiente=panel.querySelector('.cp-siguiente'),textoBtn=panel.querySelector('.cp-texto'),cerrarBtn=panel.querySelector('.cp-cerrar');
  const menu=document.getElementById('menu');
  let controles=null,oclusion=null,indice=0,abierto=false,liberado=false,cerca=false;
  let fase='cerrado',tiempo=0,transicion=null,recuerdo=null,camino=null,anguloSalida=0;
  const reducido=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const localCam=new THREE.Vector3(),centroLibro=new THREE.Vector3(13.6,5.49,-10.1);
  const anguloAbierto=-2.90;
  const suavizar=p=>p*p*(3-2*p);
  function interfaz(){
    const listo=fase==='abierto'&&!transicion;
    titulo.textContent=listo?POEMAS_CONSEJO[indice].titulo:'Biblioteca de los versos';
    aviso.textContent=fase==='abriendo'?'Abriendo el libro…':fase==='cerrando'?'Cerrando el libro…':transicion?'Pasando la página…':`${indice+1} / ${POEMAS_CONSEJO.length} · Poema · Flechas para cambiar`;
    anterior.disabled=siguiente.disabled=textoBtn.disabled=!listo;
    versos.textContent=listo?POEMAS_CONSEJO[indice].versos.join('\n'):'';
    if(!listo){versos.hidden=true;textoBtn.setAttribute('aria-expanded','false');}
  }
  function aplicarIndice(n){
    indice=n;const p=POEMAS_CONSEJO[n],entrada=obtenerPortada(n);
    cuero.color.set(p.color);matPortada.map=entrada.textura;matInterior.map=entrada.textura;matPortada.needsUpdate=matInterior.needsUpdate=true;
    pintarPagina(p);
  }
  function enfocar(){
    libro.updateWorldMatrix(true,true);
    const aspecto=Math.max(.25,camara.aspect),fov=THREE.MathUtils.degToRad(camara.fov);
    const distancia=THREE.MathUtils.clamp(1.95/(Math.tan(fov/2)*aspecto)+.5,3.4,5.65);
    const objetivo=libro.localToWorld(new THREE.Vector3(-.78,-.04,0));
    const posicion=libro.localToWorld(new THREE.Vector3(-.78,.10,distancia));
    const matriz=new THREE.Matrix4().lookAt(posicion,objetivo,camara.up);
    const q=new THREE.Quaternion().setFromRotationMatrix(matriz);
    if(camara.parent){camara.parent.updateWorldMatrix(true,false);camara.parent.worldToLocal(posicion);q.premultiply(camara.parent.getWorldQuaternion(new THREE.Quaternion()).invert());}
    return {posicion,quaternion:q};
  }
  function moverCamara(p,desde,hasta){
    const s=suavizar(p);camara.position.lerpVectors(desde.posicion,hasta.posicion,s);camara.quaternion.slerpQuaternions(desde.quaternion,hasta.quaternion,s);
  }
  function abrir(){
    if(liberado||!cerca||abierto)return;
    recuerdo={posicion:camara.position.clone(),quaternion:camara.quaternion.clone()};
    camino=enfocar();abierto=true;fase='abriendo';tiempo=0;
    controles?.pausar?.();
    if(document.pointerLockElement){try{const p=document.exitPointerLock();p?.catch?.(()=>{});}catch{}}
    pagina.material.opacity=0;pivote.rotation.y=0;panel.hidden=false;abrirBtn.hidden=true;if(menu)menu.hidden=true;
    interfaz();cerrarBtn.focus();
  }
  function terminarCierre(){
    if(recuerdo){camara.position.copy(recuerdo.posicion);camara.quaternion.copy(recuerdo.quaternion);}
    pivote.rotation.y=0;pagina.material.opacity=0;matHoja.opacity=0;
    if(transicion?.textura){transicion.textura.dispose();texturas.delete(transicion.textura);}transicion=null;
    matHoja.map=null;fase='cerrado';abierto=false;panel.hidden=true;recuerdo=null;camino=null;
    if(menu){menu.hidden=false;document.getElementById('boton-iniciar')?.focus();}
  }
  function cerrar(){
    if(!abierto||fase==='cerrando')return;
    if(transicion?.textura){transicion.textura.dispose();texturas.delete(transicion.textura);}transicion=null;matHoja.map=null;matHoja.opacity=0;
    pagina.material.opacity=0;anguloSalida=pivote.rotation.y;
    camino={posicion:camara.position.clone(),quaternion:camara.quaternion.clone()};
    fase='cerrando';tiempo=0;interfaz();
  }
  function cambiar(direccion){
    if(liberado||fase!=='abierto'||transicion)return;
    const n=(indice+direccion+POEMAS_CONSEJO.length)%POEMAS_CONSEJO.length;
    if(reducido){aplicarIndice(n);interfaz();return;}
    const copia=canvas(512,768);copia.getContext('2d').drawImage(hoja,0,0);
    const t=textura(copia);matHoja.map=t;matHoja.needsUpdate=true;matHoja.opacity=1;matHoja.depthWrite=true;pivoteHoja.rotation.y=0;
    transicion={t:0,n,cambiado:false,textura:t,direccion};interfaz();
  }
  function teclado(e){
    if(abierto){
      if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();cerrar();return;}
      if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)cambiar(e.code==='ArrowLeft'?-1:1);return;}
      if(e.code==='Tab'){
        const botones=[...panel.querySelectorAll('button:not(:disabled)')],primero=botones[0],ultimo=botones[botones.length-1];
        if(e.shiftKey&&document.activeElement===primero){e.preventDefault();ultimo.focus();}
        else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primero.focus();}
      }
      if(['KeyW','KeyA','KeyS','KeyD','KeyE','KeyF','KeyR','Space','ShiftLeft','ControlLeft'].includes(e.code))e.stopImmediatePropagation();
    }else if(e.code==='KeyR'&&cerca&&!e.repeat&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&!document.activeElement?.isContentEditable&&(!menu||menu.hidden||document.pointerLockElement===elemento)){
      e.preventDefault();e.stopImmediatePropagation();abrir();
    }
  }
  abrirBtn.addEventListener('click',abrir);cerrarBtn.addEventListener('click',cerrar);anterior.addEventListener('click',()=>cambiar(-1));siguiente.addEventListener('click',()=>cambiar(1));
  textoBtn.addEventListener('click',()=>{if(fase!=='abierto'||transicion)return;versos.hidden=!versos.hidden;textoBtn.setAttribute('aria-expanded',String(!versos.hidden));textoBtn.textContent=versos.hidden?'Ampliar texto':'Ocultar texto';});
  document.addEventListener('keydown',teclado,true);
  function alDesbloquear(){if(abierto&&menu)menu.hidden=true;}
  document.addEventListener('pointerlockchange',alDesbloquear);
  function actualizar(dt=0){
    if(liberado)return;
    const paso=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.1));
    castillo.updateWorldMatrix(true,false);camara.getWorldPosition(localCam);castillo.worldToLocal(localCam);
    const dentro=localCam.x>7.3&&localCam.x<19.7&&localCam.z> -17.7&&localCam.z< -2.3&&localCam.y>3&&localCam.y<9.8;
    cerca=dentro&&localCam.distanceTo(centroLibro)<(opciones.distanciaLectura??4.6);
    const visible=abierto||(oclusion?.habitaciones?.find(h=>h.id===ROOM)?.visible??true);raiz.visible=visible;luz.visible=visible;
    abrirBtn.hidden=!cerca||abierto||Boolean(menu&&!menu.hidden);
    if(fase==='abriendo'){
      tiempo+=paso;const p=Math.min(1,tiempo/(reducido ? .001 : 1.15));
      pivote.rotation.y=anguloAbierto*suavizar(p);moverCamara(p,recuerdo,camino);
      if(p===1){fase='abierto';aplicarIndice(indice);pagina.material.opacity=1;interfaz();}
    }else if(fase==='cerrando'){
      tiempo+=paso;const p=Math.min(1,tiempo/(reducido ? .001 : .85));pivote.rotation.y=anguloSalida*(1-suavizar(p));moverCamara(p,camino,recuerdo);
      if(p===1)terminarCierre();
    }
    if(transicion){
      transicion.t+=paso;const p=Math.min(1,transicion.t/.85);
      // La hoja física cruza el lomo; el nuevo poema aparece debajo.
      pivoteHoja.rotation.y=-Math.PI*suavizar(p);
      if(p>=.5&&!transicion.cambiado){transicion.cambiado=true;aplicarIndice(transicion.n);}
      if(p===1){matHoja.opacity=0;matHoja.depthWrite=false;matHoja.map=null;transicion.textura.dispose();texturas.delete(transicion.textura);transicion=null;pivoteHoja.rotation.y=0;interfaz();}
    }
    if(abierto&&menu&&!menu.hidden)menu.hidden=true;
  }
  const api={raiz,libro,poemas:POEMAS_CONSEJO,actualizar,abrir,cerrar,
    siguiente:()=>cambiar(1),anterior:()=>cambiar(-1),
    vincularControles(c){controles=c;},vincularOclusion(o){oclusion=o;},
    get indice(){return indice;},get abierto(){return abierto;},get fase(){return fase;},
    liberar(){
      if(liberado)return;if(abierto)terminarCierre();liberado=true;
      document.removeEventListener('keydown',teclado,true);document.removeEventListener('pointerlockchange',alDesbloquear);
      panel.remove();abrirBtn.remove();estilo.remove();raiz.removeFromParent();
      if(Array.isArray(colisiones)){
        for(const r of obstaculosPropios){const i=colisiones.indexOf(r);if(i>=0)colisiones.splice(i,1);}
        colisionesQuitadas.sort((a,b)=>a.indice-b.indice).forEach(r=>colisiones.splice(Math.min(r.indice,colisiones.length),0,r.valor));
      }
      originalesOcultos.forEach(r=>r.objeto.visible=r.visible);
      for(const g of geometrias)g.dispose();for(const m of materiales)m.dispose();for(const t of texturas)t.dispose();cachePortadas.clear();
      delete castillo.userData.consejoPoetico;
    }
  };
  castillo.userData.consejoPoetico=api;return api;
}
