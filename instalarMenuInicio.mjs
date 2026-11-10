import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Ejecutar desde el proyecto: node instalarMenuInicio.mjs
const raiz = path.dirname(fileURLToPath(import.meta.url));
const archivo = process.argv[2] ? path.resolve(process.argv[2]) : path.join(raiz,'index.html');
function rutaWeb(destino) {return './'+path.relative(path.dirname(archivo),destino).split(path.sep).join('/');}
function bloqueConId(html,id) {
  const inicio = new RegExp('<([a-zA-Z][\\w:-]*)\\b[^>]*\\bid\\s*=\\s*["\\\']'+id+'["\\\'][^>]*>','i').exec(html);
  if (!inicio) return null;
  const tag=inicio[1], tokens=new RegExp('<\\/?'+tag+'\\b[^>]*>','gi');tokens.lastIndex=inicio.index;
  let profundidad=0,token;
  while ((token=tokens.exec(html))) {
    if (/^<\//.test(token[0])) profundidad--;
    else if (!/\/\s*>$/.test(token[0])) profundidad++;
    if (profundidad===0) return {inicio:inicio.index,fin:tokens.lastIndex};
  }
  throw new Error('No se encontró el cierre del elemento #'+id+'.');
}
try {
  const original = await readFile(archivo,'utf8');
  if (original.includes('data-mi-menu="romantico"')) {
    console.log('El menú ya está instalado. No se duplicó el HTML.');
    process.exit(0);
  }
  if (!/id\s*=\s*["']contenedor["']/i.test(original)) throw new Error('Este no parece ser el HTML del castillo: falta #contenedor. Usa el index del castillo, no el del jardín de referencia.');
  const principal = /<script\b[^>]*\bsrc\s*=\s*(["'])([^"']*\bmain\.js(?:\?[^"']*)?)\1[^>]*>\s*<\/script>/i.exec(original);
  if (!principal) throw new Error('No se encontró la carga de main.js. No se modificó el HTML.');
  const bloque = bloqueConId(original,'menu');
  if (!bloque) throw new Error('No se encontró #menu. No se modificó el HTML.');
  const fragmento = await readFile(path.join(raiz,'menuInicio.fragment.html'),'utf8');
  let nuevo = original.slice(0,bloque.inicio)+fragmento+original.slice(bloque.fin);
  const css = rutaWeb(path.join(raiz,'css/menuInicio.css'));
  const js = rutaWeb(path.join(raiz,'js/menuInicio.js'));
  if (!/<\/head\s*>/i.test(nuevo)) throw new Error('El HTML no tiene cierre de head.');
  nuevo = nuevo.replace(/<\/head\s*>/i,`  <link rel="stylesheet" href="${css}">\n</head>`);
  const cargaPrincipal = /<script\b[^>]*\bsrc\s*=\s*(["'])([^"']*\bmain\.js(?:\?[^"']*)?)\1[^>]*>\s*<\/script>/i;
  nuevo = nuevo.replace(cargaPrincipal,`<script type="module" src="${js}"></script>\n  $&`);
  const backup=archivo+'.antes-menu.bak';
  try {await writeFile(backup,original,{encoding:'utf8',flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}
  const temporal=archivo+'.'+process.pid+'.tmp';
  try {await writeFile(temporal,nuevo,'utf8');await rename(temporal,archivo);}catch(e){await unlink(temporal).catch(()=>{});throw e;}
  console.log('Menú instalado: '+archivo+'\nRespaldo: '+backup);
  console.log('Se conservaron el importmap de Three.js, main.js y los demás elementos del HTML.');
  console.log('Recarga el navegador con Ctrl+F5.');
}catch(error){console.error('No se pudo instalar: '+error.message);process.exitCode=1;}
