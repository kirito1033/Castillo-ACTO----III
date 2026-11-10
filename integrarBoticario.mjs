import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
const archivo=path.resolve(process.argv[2]||'js/main.js');
const MARCA='// BOTICARIO_ARMERIA_INTEGRADO';
try{
  const original=await readFile(archivo,'utf8');
  if(original.includes(MARCA)){console.log('El boticario ya está integrado.');process.exit(0);}
  let codigo=original;
  function despues(patron,texto,nombre){const coincidencias=[...codigo.matchAll(patron)];if(coincidencias.length!==1)throw new Error('No se reconoció '+nombre+'. No se modificó main.js. Usa las instrucciones manuales.');const c=coincidencias[0];codigo=codigo.slice(0,c.index+c[0].length)+'\n'+texto+codigo.slice(c.index+c[0].length);}
  codigo="import { crearBoticarioArmeria } from './boticarioArmeria.js';\n"+MARCA+'\n'+codigo;
  despues(/window\.comedorRompecabezas\s*=\s*comedor\s*;/g,"const boticario = crearBoticarioArmeria(escena, camara, castillo, renderizador.domElement);\nwindow.boticarioArmeria = boticario;",'la creación del comedor');
  despues(/comedor\.vincularControles\(controles\)\s*;/g,'boticario.vincularControles(controles);','los controles');
  despues(/comedor\.vincularOclusion\(oclusion\)\s*;/g,'boticario.vincularOclusion(oclusion);','la oclusión');
  despues(/comedor\.actualizar\(dt\)\s*;/g,'  boticario.actualizar(dt);','el bucle de actualización');
  const backup=archivo+'.antes-boticario.bak';try{await writeFile(backup,original,{encoding:'utf8',flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}
  const tmp=archivo+'.'+process.pid+'.tmp';try{await writeFile(tmp,codigo,'utf8');await rename(tmp,archivo);}catch(e){await unlink(tmp).catch(()=>{});throw e;}
  console.log('Boticario integrado: '+archivo+'\nRespaldo: '+backup+'\nRecarga con Ctrl+F5.');
}catch(error){console.error(error.message);process.exitCode=1;}
