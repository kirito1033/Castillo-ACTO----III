import * as THREE from 'three';
import { CONFIG } from './config.js';

// Reemplazo del modulo anterior: conserva inicio lejano y zonas de escaleras.
export function configurarInicioLejano(camara,castillo) {
  const mundo=castillo.userData,altura=CONFIG.jugador.altura;
  const margen=Math.max(2,CONFIG.terreno.margenBorde??2);
  const extremo=CONFIG.terreno.largo/2-margen;
  const x=THREE.MathUtils.clamp(castillo.position.x,-CONFIG.terreno.ancho/2+margen,CONFIG.terreno.ancho/2-margen);
  mundo.prepararColisiones?.();
  let encontrado=null;
  for(let z=extremo;z>castillo.position.z+45;z-=1) {
    const y=mundo.alturaSuelo(x,z,0);
    if(Number.isFinite(y)&&!mundo.bloqueado(x,z,y,altura)){encontrado={x,y,z};break;}
  }
  if(!encontrado)throw new Error('No hay un inicio despejado sobre el eje frontal.');
  // El camino ya fue creado por crearEntornoMontana, antes de este modulo.
  const camino=castillo.parent.getObjectByName('Sendero en pendiente');
  if(!camino)throw new Error('No se encontro Sendero en pendiente. Conserva entornoMontana.js y su orden de inicializacion.');
  camino.geometry.computeBoundingBox();
  const caja=camino.geometry.boundingBox;
  const inicio=caja.min.z,ancho=caja.max.x-caja.min.x;
  const centroX=(caja.min.x+caja.max.x)/2;
  const final=Math.max(caja.max.z,Math.min(CONFIG.terreno.largo/2-0.5,encontrado.z+1));
  const longitud=final-inicio,segmentos=Math.ceil(longitud*2);
  const geo=new THREE.PlaneGeometry(ancho,longitud,1,segmentos);
  geo.rotateX(-Math.PI/2);geo.translate(centroX,0,(inicio+final)/2);
  const pos=geo.attributes.position,sueloAnterior=mundo.alturaSuelo;
  // Las coordenadas del sendero existente estan horneadas en espacio de mundo;
  // su mesh permanece con transformacion identidad, como en entornoMontana.js.
  for(let i=0;i<pos.count;i++){
    const px=pos.getX(i),pz=pos.getZ(i);
    pos.setY(i,sueloAnterior(px,pz,0)+0.035);
  }
  geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();
  const anterior=camino.geometry;camino.geometry=geo;anterior.dispose();
  camino.receiveShadow=true;camino.userData.longitudSendero=longitud;
  // ambienteAvanzado asigna la textura despues de crear el spawn.
  // Ajustarla antes de dibujar conserva la escala de adoquines del sendero de 36m.
  const antes=camino.onBeforeRender;
  camino.onBeforeRender=function(...args){
    const mapa=this.material?.map;
    if(mapa){mapa.repeat.set(2,longitud/2);mapa.updateMatrix();}
    antes?.apply(this,args);
  };
  const perfil=[];
  for(let i=0;i<pos.count;i+=2)perfil.push({z:pos.getZ(i),y:(pos.getY(i)+pos.getY(i+1))/2});
  perfil.sort((a,b)=>a.z-b.z);
  function alturaPavimento(z){
    const t=THREE.MathUtils.clamp((z-inicio)/longitud,0,1)*(perfil.length-1);
    const i=Math.min(perfil.length-2,Math.floor(t));
    return THREE.MathUtils.lerp(perfil[i].y,perfil[i+1].y,t-i);
  }
  mundo.alturaSuelo=(px,pz,pies)=>{
    let y=sueloAnterior(px,pz,pies);
    if(Math.abs(px-centroX)<=ancho/2&&pz>=inicio&&pz<=final){
      const pavimento=alturaPavimento(pz);
      if(pavimento<=pies+0.32)y=Math.max(y,pavimento);
    }
    return y;
  };
  encontrado.y=mundo.alturaSuelo(encontrado.x,encontrado.z,encontrado.y);
  camara.position.set(encontrado.x,encontrado.y+altura,encontrado.z);
  camara.lookAt(castillo.position.x,castillo.position.y+4.8,castillo.position.z+18);
  camara.updateMatrixWorld(true);
  mundo.esZonaEscalera=(px,pz,pies)=>{
    const lx=px-castillo.position.x,lz=pz-castillo.position.z,py=pies-castillo.position.y;
    const r=Math.hypot(lx,lz+7);
    return (r>=1.5&&r<=4.2&&py>=2.9&&py<17.45)||
      (Math.abs(lx)<=3.25&&lz>=18.2&&lz<=28.2&&py<3.2);
  };
  return {x:encontrado.x,z:encontrado.z,alturaSuelo:encontrado.y,
    camino:{desdeZ:inicio,hastaZ:final,longitud,ancho},
    nota:'Inicio exterior sobre el sendero; acercarse al porton y abrir con E.'};
}
