import { readdir, readFile, writeFile, rename, unlink, stat } from 'node:fs/promises';
import path from 'node:path';

// Uso desde la raiz del proyecto:
// node generarCatalogoRompecabezas.mjs
// node generarCatalogoRompecabezas.mjs --actualizar-juego
// node generarCatalogoRompecabezas.mjs --carpeta assets/imagen/rompecabezas --actualizar-juego --juego js/comedorRompecabezas.js

const args = process.argv.slice(2);
let rutaCarpeta = 'assets/imagen/rompecabezas';
let rutaJuego = 'js/comedorRompecabezas.js';
let actualizarJuego = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--actualizar-juego') actualizarJuego = true;
  else if (args[i] === '--carpeta') {
    if (!args[i+1] || args[i+1].startsWith('--')) throw new Error('Falta la ruta después de --carpeta.');
    rutaCarpeta = args[++i];
  } else if (args[i] === '--juego') {
    if (!args[i+1] || args[i+1].startsWith('--')) throw new Error('Falta la ruta después de --juego.');
    rutaJuego = args[++i];
  } else if (!args[i].startsWith('--')) rutaCarpeta = args[i];
  else throw new Error('Opción desconocida: ' + args[i]);
}
const carpeta = path.resolve(rutaCarpeta);
const salida = path.join(carpeta, 'imagenes.json');
const juego = path.resolve(rutaJuego);
const extensiones = new Set(['.jpg','.jpeg','.png','.webp','.avif','.gif','.bmp']);
const orden = new Intl.Collator('es', {numeric:true, sensitivity:'base'});
const MARCA = '// RP_MEJORAS_PERSONALIZADAS_V2';

async function escribirAtomico(destino, contenido) {
  const temporal = destino + '.' + process.pid + '.tmp';
  try { await writeFile(temporal, contenido, 'utf8'); await rename(temporal, destino); }
  catch (error) { await unlink(temporal).catch(() => {}); throw error; }
}
async function buscarImagenes(directorio) {
  const encontrados = [];
  for (const e of await readdir(directorio, {withFileTypes:true})) {
    if (e.isSymbolicLink() || e.name.startsWith('.')) continue;
    const absoluta = path.join(directorio,e.name);
    if (e.isDirectory()) encontrados.push(...await buscarImagenes(absoluta));
    else if (e.isFile() && extensiones.has(path.extname(e.name).toLowerCase())) encontrados.push(absoluta);
  }
  return encontrados;
}
async function leerAnteriores() {
  try {
    const json = JSON.parse(await readFile(salida,'utf8'));
    const lista = Array.isArray(json) ? json : json.imagenes;
    if (!Array.isArray(lista)) return new Map();
    return new Map(lista.filter(x => x && typeof x === 'object' && typeof x.archivo === 'string').map(x => [x.archivo,x]));
  } catch (error) {
    if (error.code !== 'ENOENT') throw new Error('El catálogo existente no es válido. No se sobrescribió: ' + error.message);
    return new Map();
  }
}
async function generarCatalogo() {
  if (!(await stat(carpeta)).isDirectory()) throw new Error('La ruta de imágenes no es una carpeta.');
  const anteriores = await leerAnteriores();
  const rutas = (await buscarImagenes(carpeta)).map(p => path.relative(carpeta,p).split(path.sep).join('/'));
  rutas.sort((a,b) => orden.compare(a,b) || a.localeCompare(b));
  const imagenes = rutas.map(archivo => {
    const anterior = anteriores.get(archivo);
    const titulo = typeof anterior?.titulo === 'string' && anterior.titulo.trim()
      ? anterior.titulo
      : path.parse(archivo.split('/').pop()).name.replace(/[-_]+/g,' ');
    // No inventa el contenido de la foto: mensaje genérico editable por imagen.
    const descripcion = typeof anterior?.descripcion === 'string'
      ? anterior.descripcion
      : typeof anterior?.mensajeFinal === 'string'
        ? anterior.mensajeFinal
        : `¡Excelente! Has completado el rompecabezas «${titulo}».`;
    return {id:anterior?.id ?? archivo, titulo, archivo, descripcion};
  });
  await escribirAtomico(salida,JSON.stringify({version:1,imagenes},null,2)+'\n');
  console.log(`Catálogo actualizado: ${imagenes.length} imágenes.\n${salida}`);
  console.log('Edita descripcion en cada entrada para personalizar el mensaje al completar.');
  return imagenes.length;
}

// Estas mejoras se insertan dentro del módulo existente. No crean otro bucle.
const AYUDANTES = `
  // RP_MEJORAS_PERSONALIZADAS_V2
  let ultimoPunteroRompecabezas = null;
  function ocultarMensajeFinal() {
    const aviso = $('rp-final');
    if (aviso) { aviso.hidden = true; aviso.textContent = ''; }
  }
  function mostrarMensajeFinal() {
    let aviso = $('rp-final');
    if (!aviso) {
      aviso = document.createElement('div'); aviso.id = 'rp-final';
      aviso.setAttribute('role','status'); aviso.setAttribute('aria-live','polite');
      $('rp-estado').insertAdjacentElement('afterend',aviso);
    }
    const item = catalogo[retoActual];
    aviso.textContent = item?.descripcion?.trim() || '¡Completaste el rompecabezas!';
    aviso.hidden = false;
    mensaje('¡Rompecabezas completado!');
    aviso.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function inicializarMejorasRompecabezas() {
    estilo.textContent += '\\n' +
      '#rp-final{padding:16px;margin:12px 0;border:1px solid #d9bf70;border-radius:10px;background:#31483d;color:#fff1ba;white-space:pre-wrap;line-height:1.6;font:16px system-ui}' +
      '#rp-final[hidden]{display:none!important}' +
      '#rp-navegacion{position:sticky;top:0;z-index:3;display:flex;gap:8px;justify-content:center;padding:8px;background:#19333af5;border-radius:8px;margin-bottom:8px}' +
      '#rp-canvas{scroll-margin-top:80px}';
    const barra = document.createElement('div'); barra.id = 'rp-navegacion';
    const tablero = document.createElement('button'); tablero.type = 'button'; tablero.textContent = 'Ver tablero';
    const piezas = document.createElement('button'); piezas.type = 'button'; piezas.textContent = 'Ver piezas';
    barra.append(tablero,piezas); canvas.insertAdjacentElement('beforebegin',barra);
    tablero.addEventListener('click', () => {
      $('rp-panel').scrollTo({top:Math.max(0,canvas.offsetTop-90),behavior:'smooth'});
    });
    piezas.addEventListener('click', () => {
      $('rp-panel').scrollTo({top:Math.max(0,canvas.offsetTop+canvas.clientHeight*(535/CH)-75),behavior:'smooth'});
    });
  }
  function actualizarDesplazamientoArrastre(dt) {
    if (!abierto || !arrastre?.movido || !ultimoPunteroRompecabezas) return;
    const panel = $('rp-panel'), r = panel.getBoundingClientRect();
    const y = ultimoPunteroRompecabezas.clientY, borde = 75;
    let velocidad = 0;
    if (y < r.top+borde) velocidad = -Math.min(1,(r.top+borde-y)/borde)*650;
    else if (y > r.bottom-borde) velocidad = Math.min(1,(y-(r.bottom-borde))/borde)*650;
    const antes = panel.scrollTop;
    panel.scrollTop += velocidad*Math.min(0.05,Math.max(0,dt));
    if (panel.scrollTop !== antes) {
      const p = puntoCanvas(ultimoPunteroRompecabezas);
      arrastre.pieza.x = THREE.MathUtils.clamp(p.x-arrastre.dx,0,CW-PW);
      arrastre.pieza.y = THREE.MathUtils.clamp(p.y-arrastre.dy,0,CH-PH);
      dibujar();
    }
  }

`;

async function parchearJuego() {
  const original = await readFile(juego,'utf8');
  if (original.includes(MARCA)) {
    console.log('El juego ya tiene el tablero ampliado y los mensajes finales. No se modificó otra vez.');
    return;
  }
  let codigo = original;
  function cambiar(antes,despues,nombre) {
    const cantidad = codigo.split(antes).length-1;
    if (cantidad !== 1) throw new Error(`No se reconoció ${nombre}. El JS del juego no se modificó. Usa el módulo de imágenes personales de la última entrega.`);
    codigo = codigo.replace(antes,despues);
  }
  cambiar(
    'resultado.push({id:String(objeto.id??src),titulo:String(titulo),src});',
    "resultado.push({id:String(objeto.id??src),titulo:String(titulo),src,descripcion:String(objeto.descripcion??objeto.mensajeFinal??'')});",
    'la lectura de descripciones del catálogo'
  );
  cambiar(
    '#rp-panel{width:min(920px,100%);',
    '#rp-panel{position:relative;width:min(1280px,100%);',
    'el ancho del panel'
  );
  cambiar(
    '#rp-canvas{display:block;width:min(100%,calc((100dvh - 245px)*0.833333));height:auto;',
    '#rp-canvas{display:block;width:100%;max-width:1150px;height:auto;',
    'el tamaño visible del tablero'
  );
  cambiar(
    'async function reiniciar(){',
    'async function reiniciar(){\n    ocultarMensajeFinal();',
    'el reinicio del mensaje final'
  );
  cambiar(
    "mensaje('¡Completaste tu imagen! Puedes elegir otro nivel o rompecabezas.');",
    'mostrarMensajeFinal();',
    'la finalización de la partida'
  );
  cambiar(
    "canvas.addEventListener('pointerdown',e=>{",
    "canvas.addEventListener('pointerdown',e=>{\n    ultimoPunteroRompecabezas={clientX:e.clientX,clientY:e.clientY};",
    'el inicio del arrastre'
  );
  cambiar(
    "canvas.addEventListener('pointermove',e=>{",
    "canvas.addEventListener('pointermove',e=>{\n    if(arrastre&&e.pointerId===arrastre.id)ultimoPunteroRompecabezas={clientX:e.clientX,clientY:e.clientY};",
    'el movimiento del arrastre'
  );
  cambiar(
    'if(destruido)return;const estaDentro=',
    'if(destruido)return;actualizarDesplazamientoArrastre(dt);const estaDentro=',
    'la actualización del desplazamiento'
  );
  cambiar(
    'actualizarCarteles();actualizarSelectores();actualizarMarcador();dibujar();promesaCatalogo=cargarCatalogo();',
    AYUDANTES + '\n  inicializarMejorasRompecabezas();\n  actualizarCarteles();actualizarSelectores();actualizarMarcador();dibujar();promesaCatalogo=cargarCatalogo();',
    'el punto de inicialización'
  );
  // Guardar la versión previa una vez. Nunca borrar ni sobrescribir el respaldo.
  const backup = juego + '.antes-mejoras.bak';
  try { await writeFile(backup,original,{encoding:'utf8',flag:'wx'}); }
  catch(error) { if(error.code !== 'EEXIST') throw error; }
  await escribirAtomico(juego,codigo);
  console.log(`Juego actualizado: ${juego}\nRespaldo: ${backup}`);
  console.log('Tablero grande, navegación tablero/piezas y descripción al terminar activados.');
}

try {
  await generarCatalogo();
  if (actualizarJuego) await parchearJuego();
  else console.log('Para ampliar el tablero y activar el mensaje final, ejecuta con --actualizar-juego.');
  console.log('Después recarga el juego sin caché.');
} catch(error) {
  console.error('No se pudo completar: '+error.message);
  process.exitCode = 1;
}
