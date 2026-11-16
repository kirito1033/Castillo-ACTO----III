#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const MARCA='// ESTUDIO_MARAVILLAS_INTEGRADO';
const NOMBRE='estudioMaravillas.js';
const aqui=path.dirname(fileURLToPath(import.meta.url));
const args=process.argv.slice(2);
function error(t){throw new Error(t);}
function sintaxis(s,n){const r=spawnSync(process.execPath,['--input-type=module','--check'],{input:s,encoding:'utf8'});if(r.error||r.status!==0)error(`Error de sintaxis en ${n}:\n${r.stderr||r.error}`);}
function una(s,re,cambio,n){const veces=[...s.matchAll(new RegExp(re.source,'g'))].length;if(veces!==1)error(`No se encontró un único punto de integración para ${n} (${veces}). No se modificaron archivos.`);return s.replace(re,cambio);}
function integrar(original){
  if(original.includes(MARCA))return null;
  if(/\bcrearEstudioMaravillas\b|\bestudioMaravillas\b/.test(original))error('Hay una integración parcial del estudio. No se modificaron archivos.');
  let s=`import { crearEstudioMaravillas } from './estudioMaravillas.js';\n${MARCA}\n`+original;
  s=una(s,/const\s+controles\s*=\s*crearControles\s*\(/,
`const estudio = crearEstudioMaravillas(
  escena,
  camara,
  castillo,
  renderizador.domElement
);
window.estudioMaravillas = estudio;

const controles = crearControles(`,'creación de controles');
  s=una(s,/boticario\s*\.\s*vincularControles\s*\(\s*controles\s*\)\s*;/,'$&\nestudio.vincularControles(controles);','vinculación de controles');
  s=una(s,/boticario\s*\.\s*vincularOclusion\s*\(\s*oclusion\s*\)\s*;/,'$&\nestudio.vincularOclusion(oclusion);','vinculación de oclusión');
  s=una(s,/boticario\s*\.\s*actualizar\s*\(\s*dt\s*\)\s*;/,'$&\n  estudio.actualizar(dt);','bucle de animación');
  const inicio=s.indexOf('const estudio ='),gestor=s.search(/(?:const|let)\s+oclusion\s*=\s*crearOclusionHabitaciones/),colisiones=s.search(/castillo\s*\.\s*userData\s*\.\s*prepararColisiones\s*\(/);
  if(gestor<0||colisiones<0||inicio>gestor||inicio>colisiones)error('El estudio debe crearse antes de la oclusión y de prepararColisiones. No se modificaron archivos.');
  sintaxis(s,'main.js');return s;
}
function atomico(destino,contenido){const temporal=destino+`.estudio-${process.pid}.tmp`;try{fs.writeFileSync(temporal,contenido);fs.renameSync(temporal,destino);}finally{if(fs.existsSync(temporal))fs.unlinkSync(temporal);}}
try{
  if(args.includes('--help')){console.log('Uso desde la raíz: node instalarEstudioMaravillas.mjs [js | assets/js | otra/carpeta] [--solo-validar]');process.exit(0);}
  const argumento=args.find(a=>!a.startsWith('--'));
  const candidatas=['js','assets/js','.'].map(p=>path.resolve(p)).filter(p=>fs.existsSync(path.join(p,'main.js')));
  const carpeta=argumento?path.resolve(argumento):(candidatas.length===1?candidatas[0]:null);
  if(!carpeta)error('Indica la carpeta de scripts: node instalarEstudioMaravillas.mjs js');
  const main=path.join(carpeta,'main.js'),destino=path.join(carpeta,NOMBRE);
  if(!fs.existsSync(main))error('No existe '+main);
  const origen=[path.join(aqui,NOMBRE),destino].find(p=>fs.existsSync(p));
  if(!origen)error('Coloca estudioMaravillas.js junto al instalador o en la carpeta de main.js.');
  const modulo=fs.readFileSync(origen,'utf8');sintaxis(modulo,NOMBRE);
  if(!modulo.includes('export function crearEstudioMaravillas('))error('El módulo no contiene la función esperada.');
  const original=fs.readFileSync(main,'utf8'),nuevo=integrar(original);
  if(nuevo===null){if(!fs.existsSync(destino))error('main.js está integrado, pero falta estudioMaravillas.js. Copia el módulo a la carpeta de main.js.');console.log('El estudio ya está integrado. No se modificaron archivos.');process.exit(0);}
  if(args.includes('--solo-validar')){console.log('Validación correcta. main.js es compatible y no se modificaron archivos.');process.exit(0);}
  const anteriorModulo=fs.existsSync(destino)?fs.readFileSync(destino):null,sello=new Date().toISOString().replace(/[:.]/g,'-');
  const respaldo=main+'.antes-estudio-maravillas-'+sello+'.bak';fs.copyFileSync(main,respaldo);
  if(anteriorModulo&&path.resolve(origen)!==path.resolve(destino))fs.copyFileSync(destino,destino+'.antes-estudio-maravillas-'+sello+'.bak');
  try{if(path.resolve(origen)!==path.resolve(destino))atomico(destino,modulo);atomico(main,nuevo);}
  catch(e){fs.writeFileSync(main,original);if(anteriorModulo)fs.writeFileSync(destino,anteriorModulo);else if(fs.existsSync(destino))fs.unlinkSync(destino);throw e;}
  console.log(`Estudio de las pequeñas maravillas instalado.\nMódulo: ${destino}\nRespaldo: ${respaldo}\nLas otras habitaciones y sus datos se conservaron.\nSube main.js y estudioMaravillas.js a GitHub; espera el despliegue y recarga sin caché.\nPlanta alta, habitación Estudio. R cerca del escritorio para explorar.\nLa melodía solo se activa al pulsar su botón; no se descarga música.\nLa sala no lee ni guarda los deseos escritos en la otra habitación.`);
}catch(e){console.error('Instalación cancelada:',e.message);process.exitCode=1;}
