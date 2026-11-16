#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const MARCA='// SALA_MAPAS_GALERIA_INTEGRADA';
const NOMBRE='salaMapasGaleria.js';
const CONFIG={"cuadros": [{"id": "cuadro-1", "titulo": "El reino entre montañas", "archivo": ""}, {"id": "cuadro-2", "titulo": "Un puente hacia casa", "archivo": ""}, {"id": "cuadro-3", "titulo": "Memorias del jardín", "archivo": ""}, {"id": "cuadro-4", "titulo": "Nuestro pequeño refugio", "archivo": ""}, {"id": "cuadro-5", "titulo": "Donde viven las estrellas", "archivo": ""}, {"id": "cuadro-6", "titulo": "Caminos compartidos", "archivo": ""}, {"id": "cuadro-7", "titulo": "El horizonte nos espera", "archivo": ""}, {"id": "cuadro-8", "titulo": "Una ventana al recuerdo", "archivo": ""}]};
const LEEME="GALERÍA DE LA SALA DE MAPAS\n\nPara ver tus imágenes en todos los navegadores y en GitHub Pages:\n1. Coloca tus JPG, PNG o WebP en esta carpeta.\n2. Abre galeria.json y completa archivo con el nombre exacto, por ejemplo foto-1.jpg.\n3. Puedes cambiar también titulo. Conserva los identificadores cuadro-1 a cuadro-8.\n4. Sube las imágenes y galeria.json junto con los scripts actualizados a GitHub.\n5. Espera al despliegue y recarga sin caché.\n\nEjemplo de una entrada (dentro de la lista cuadros):\n{\"id\":\"cuadro-1\",\"titulo\":\"Un viaje juntos\",\"archivo\":\"foto-1.jpg\"}\n\nNo pongas una ruta de Windows ni una dirección /tree/main/ en archivo.\nUsa nombres sencillos, como foto-1.jpg. Las imágenes conservan su proporción.\nUn archivo vacío muestra una ilustración generada desde el código.\n\nEl botón del lector guarda imágenes en IndexedDB SOLO para ese navegador y origen.\nNo sube archivos a GitHub. Una carga local tiene prioridad sobre galeria.json.\nUsa Quitar cambio local para volver a ver la imagen publicada.\nBorrar los datos del sitio elimina las cargas locales.\nLa opción de volver a la imagen publicada solicita confirmación.\n\nInteracción:\nR o botón: abrir la edición de los cuadros.\nClic sobre un cuadro, con el mouse capturado: editar ese cuadro.\nG o botón, cerca del perrito: acariciarlo.\nEsc: cerrar edición. Después pulsa Continuar para volver al recorrido.\n\nEl perro es un modelo geométrico 3D estilizado inspirado en la referencia,\nno un GLB fotorealista ni una reproducción exacta de la fotografía.\n";
const aqui=path.dirname(fileURLToPath(import.meta.url));
const args=process.argv.slice(2);
function error(t){throw new Error(t);}
function sintaxis(s,n){const r=spawnSync(process.execPath,['--input-type=module','--check'],{input:s,encoding:'utf8'});if(r.error||r.status!==0)error(`Error de sintaxis en ${n}:\n${r.stderr||r.error}`);}
function una(s,re,cambio,n){const coincidencias=[...s.matchAll(new RegExp(re.source,'g'))];if(coincidencias.length!==1)error(`Se esperó un único punto para ${n}, se encontraron ${coincidencias.length}. No se modificaron archivos.`);return s.replace(re,cambio);}
function integrar(original){
  if(original.includes(MARCA))return null;
  if(/\bcrearSalaMapasGaleria\b|\bgaleriaMapas\b/.test(original))error('Hay una integración parcial de la galería. No se modificaron archivos.');
  let s=`import { crearSalaMapasGaleria } from './salaMapasGaleria.js';\n${MARCA}\n`+original;
  s=una(s,/const\s+controles\s*=\s*crearControles\s*\(/,
`const galeriaMapas = crearSalaMapasGaleria(
  escena,
  camara,
  castillo,
  renderizador.domElement
);
window.galeriaMapas = galeriaMapas;

const controles = crearControles(`,'creación de controles');
  s=una(s,/boticario\s*\.\s*vincularControles\s*\(\s*controles\s*\)\s*;/,'$&\ngaleriaMapas.vincularControles(controles);','vinculación de controles');
  s=una(s,/boticario\s*\.\s*vincularOclusion\s*\(\s*oclusion\s*\)\s*;/,'$&\ngaleriaMapas.vincularOclusion(oclusion);','vinculación de oclusión');
  s=una(s,/boticario\s*\.\s*actualizar\s*\(\s*dt\s*\)\s*;/,'$&\n  galeriaMapas.actualizar(dt);','actualización');
  const inicio=s.indexOf('const galeriaMapas =');
  const gestor=s.search(/(?:const|let)\s+oclusion\s*=\s*crearOclusionHabitaciones/);
  const colisiones=s.search(/castillo\s*\.\s*userData\s*\.\s*prepararColisiones\s*\(/);
  if(gestor<0||colisiones<0||inicio>gestor||inicio>colisiones)error('La galería debe construirse antes de preparar la oclusión y las colisiones. No se modificaron archivos.');
  sintaxis(s,'main.js');return s;
}
function atomico(destino,texto){const tmp=destino+`.galeria-${process.pid}.tmp`;try{fs.writeFileSync(tmp,texto);fs.renameSync(tmp,destino);}finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}}
try{
  if(args.includes('--help')){console.log('Uso desde la raíz: node instalarSalaMapas.mjs [js | assets/js | otra/carpeta] [--solo-validar]');process.exit(0);}
  const argumento=args.find(a=>!a.startsWith('--'));
  const candidatas=['js','assets/js','.'].map(p=>path.resolve(p)).filter(p=>fs.existsSync(path.join(p,'main.js')));
  const carpeta=argumento?path.resolve(argumento):(candidatas.length===1?candidatas[0]:null);
  if(!carpeta)error('Indica la carpeta: node instalarSalaMapas.mjs js');
  const main=path.join(carpeta,'main.js'),destinoModulo=path.join(carpeta,NOMBRE);
  if(!fs.existsSync(main))error(`No existe ${main}`);
  const origen=[path.join(aqui,NOMBRE),destinoModulo].find(p=>fs.existsSync(p));
  if(!origen)error('Coloca salaMapasGaleria.js junto al instalador o en la carpeta de main.js.');
  const modulo=fs.readFileSync(origen,'utf8');sintaxis(modulo,NOMBRE);
  if(!modulo.includes('export function crearSalaMapasGaleria('))error('El archivo del módulo no es el esperado.');
  const original=fs.readFileSync(main,'utf8'),nuevo=integrar(original);
  if(nuevo===null){if(!fs.existsSync(destinoModulo))error('main.js está marcado como integrado pero falta el módulo. Restaura el respaldo de main.js y vuelve a ejecutar.');console.log('La galería ya está integrada. No se modificaron archivos.');process.exit(0);}
  let raiz=carpeta;
  for(let i=0;i<6&&!fs.existsSync(path.join(raiz,'index.html'));i++){const padre=path.dirname(raiz);if(padre===raiz)break;raiz=padre;}
  if(!fs.existsSync(path.join(raiz,'index.html')))error('No se encontró index.html en las carpetas superiores. Ejecuta desde tu proyecto real.');
  const recursos=path.join(raiz,'assets','galeriaMapas');
  const archivoJSON=path.join(recursos,'galeria.json'),archivoLEEME=path.join(recursos,'LEEME.txt');
  if(args.includes('--solo-validar')){console.log('Validación correcta. Integración compatible. No se modificaron archivos.');process.exit(0);}
  const sello=new Date().toISOString().replace(/[:.]/g,'-');
  const respaldo=main+`.antes-galeria-mapas-${sello}.bak`;
  const previoModulo=fs.existsSync(destinoModulo)?fs.readFileSync(destinoModulo):null;
  fs.copyFileSync(main,respaldo);
  if(previoModulo&&path.resolve(origen)!==path.resolve(destinoModulo))fs.copyFileSync(destinoModulo,destinoModulo+`.antes-galeria-mapas-${sello}.bak`);
  const nuevos=[];
  try{
    fs.mkdirSync(recursos,{recursive:true});
    if(!fs.existsSync(archivoJSON)){atomico(archivoJSON,JSON.stringify(CONFIG,null,2)+'\n');nuevos.push(archivoJSON);}
    if(!fs.existsSync(archivoLEEME)){atomico(archivoLEEME,LEEME);nuevos.push(archivoLEEME);}
    if(path.resolve(origen)!==path.resolve(destinoModulo))atomico(destinoModulo,modulo);
    atomico(main,nuevo);
  }catch(e){
    fs.writeFileSync(main,original);
    if(previoModulo)fs.writeFileSync(destinoModulo,previoModulo);else if(fs.existsSync(destinoModulo))fs.unlinkSync(destinoModulo);
    for(const f of nuevos)if(fs.existsSync(f))fs.unlinkSync(f);throw e;
  }
  console.log(`Sala de Mapas instalada.\nMódulo: ${destinoModulo}\nConfiguración de imágenes: ${archivoJSON}\nRespaldo de main.js: ${respaldo}\nSe conservaron las demás habitaciones y los datos locales.\nSube main.js, salaMapasGaleria.js y assets/galeriaMapas/ a GitHub.\nEntra a la Sala de mapas, en la planta alta: R para los cuadros; G cerca del perrito.`);
}catch(e){console.error('Instalación cancelada:',e.message);process.exitCode=1;}
