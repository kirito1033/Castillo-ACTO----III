#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const MARCA='// CONSEJO_POETICO_INTEGRADO';
const aqui=path.dirname(fileURLToPath(import.meta.url));
const args=process.argv.slice(2);
if(args.includes('--help')){
  console.log('Uso: node instalarSalaConsejo.mjs [js | assets/js | otra/carpeta] [--solo-validar]');
  process.exit(0);
}
function fallo(mensaje){throw new Error(mensaje);}
function sintaxis(texto,nombre){
  const r=spawnSync(process.execPath,['--input-type=module','--check'],{input:texto,encoding:'utf8'});
  if(r.error || r.status!==0)fallo(`Sintaxis inválida en ${nombre}:\n${r.stderr||r.error}`);
}
function una(texto,regex,reemplazo,nombre){
  const veces=[...texto.matchAll(new RegExp(regex.source,'g'))].length;
  if(veces!==1)fallo(`No se encontró un único punto de integración para ${nombre} (${veces}). No se modificó ningún archivo. Usa tu main.js completo y actual.`);
  return texto.replace(regex,reemplazo);
}
function integrar(original){
  if(original.includes(MARCA))return null;
  if(/\bcrearSalaConsejoPoetica\b|\bconsejoPoetico\b/.test(original))fallo('main.js ya contiene una integración parcial del consejo. Revísala antes de continuar.');
  let texto=`import { crearSalaConsejoPoetica } from './salaConsejoPoetica.js';\n${MARCA}\n`+original;
  texto=una(texto,/const\s+controles\s*=\s*crearControles\s*\(/,
`const consejoPoetico = crearSalaConsejoPoetica(
  escena,
  camara,
  castillo,
  renderizador.domElement
);
window.bibliotecaConsejo = consejoPoetico;

const controles = crearControles(`,'creación de controles');
  texto=una(texto,/boticario\s*\.\s*vincularControles\s*\(\s*controles\s*\)\s*;/,
    '$&\nconsejoPoetico.vincularControles(controles);','vinculación de controles');
  texto=una(texto,/boticario\s*\.\s*vincularOclusion\s*\(\s*oclusion\s*\)\s*;/,
    '$&\nconsejoPoetico.vincularOclusion(oclusion);','vinculación de oclusión');
  texto=una(texto,/boticario\s*\.\s*actualizar\s*\(\s*dt\s*\)\s*;/,
    '$&\n  consejoPoetico.actualizar(dt);','bucle de animación');
  const inicio=texto.indexOf('const consejoPoetico =');
  const gestor=texto.search(/(?:const|let)\s+oclusion\s*=\s*crearOclusionHabitaciones/);
  const preparar=texto.search(/castillo\s*\.\s*userData\s*\.\s*prepararColisiones\s*\(/);
  if(gestor<0||preparar<0||inicio>gestor||inicio>preparar)fallo('El consejo debe crearse antes de la oclusión y de prepararColisiones. No se modificó ningún archivo.');
  sintaxis(texto,'main.js');return texto;
}
function escribirAtomico(destino,contenido){
  const temporal=destino+`.consejo-${process.pid}.tmp`;
  try{fs.writeFileSync(temporal,contenido,'utf8');fs.renameSync(temporal,destino);}
  finally{if(fs.existsSync(temporal))fs.unlinkSync(temporal);}
}
try{
  const carpetaArg=args.find(a=>!a.startsWith('--'));
  const candidatas=['js','assets/js','.'].map(p=>path.resolve(p)).filter(p=>fs.existsSync(path.join(p,'main.js')));
  const carpeta=carpetaArg?path.resolve(carpetaArg):(candidatas.length===1?candidatas[0]:null);
  if(!carpeta)fallo(`Se encontraron ${candidatas.length} carpetas candidatas. Indica una: node instalarSalaConsejo.mjs js`);
  const archivoMain=path.join(carpeta,'main.js');
  if(!fs.existsSync(archivoMain))fallo(`No existe ${archivoMain}`);
  const archivoModulo=path.join(carpeta,'salaConsejoPoetica.js');
  const fuente=path.join(aqui,'salaConsejoPoetica.js');
  if(!fs.existsSync(fuente))fallo('Coloca salaConsejoPoetica.js junto a este instalador.');
  const contenidoModulo=fs.readFileSync(fuente,'utf8');sintaxis(contenidoModulo,'salaConsejoPoetica.js');
  const original=fs.readFileSync(archivoMain,'utf8');const actualizado=integrar(original);
  if(actualizado===null){console.log('El consejo ya está integrado. No se modificaron archivos.');process.exit(0);}
  if(args.includes('--solo-validar')){console.log('Validación correcta. Integración compatible; no se modificaron archivos.');process.exit(0);}
  const previoModulo=fs.existsSync(archivoModulo)?fs.readFileSync(archivoModulo):null;
  const sello=new Date().toISOString().replace(/[:.]/g,'-');
  const respaldoMain=archivoMain+`.antes-consejo-${sello}.bak`;
  fs.copyFileSync(archivoMain,respaldoMain);
  if(previoModulo && path.resolve(fuente)!==path.resolve(archivoModulo))fs.copyFileSync(archivoModulo,archivoModulo+`.antes-consejo-${sello}.bak`);
  try{
    if(path.resolve(fuente)!==path.resolve(archivoModulo))escribirAtomico(archivoModulo,contenidoModulo);
    escribirAtomico(archivoMain,actualizado);
  }catch(e){
    fs.writeFileSync(archivoMain,original);
    if(previoModulo)fs.writeFileSync(archivoModulo,previoModulo);else if(fs.existsSync(archivoModulo))fs.unlinkSync(archivoModulo);
    throw e;
  }
  console.log(`Consejo instalado en: ${carpeta}\nRespaldo de main.js: ${respaldoMain}\nSube main.js y salaConsejoPoetica.js a GitHub; espera el despliegue y recarga sin caché.\nEntra en la Sala del consejo, acércate al libro y pulsa R o el botón de lectura.`);
}catch(e){console.error('No se pudo instalar el consejo:',e.message);process.exitCode=1;}
