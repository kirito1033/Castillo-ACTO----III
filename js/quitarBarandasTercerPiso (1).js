import * as THREE from 'three';

export function quitarBarandasTercerPiso(castillo) {
  if(castillo.getObjectByName('Estructura agrupada por sectores'))throw new Error('Quita las barandas antes de agruparEstructura.');
  castillo.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(castillo.matrixWorld).invert(),p=new THREE.Vector3();
  const eliminar=[];
  castillo.traverse(o=>{
    if(!o.isMesh||!/Baranda|Balaustre|Pasamanos/i.test(o.name))return;
    // Conserva las piezas de la espiral y las de la segunda planta.
    if(/caracol|escalera/i.test(o.name))return;
    o.getWorldPosition(p).applyMatrix4(inv);
    if(p.y>=17.45&&p.y<=19.2)eliminar.push(o);
  });
  const conjunto=new Set(eliminar),obstaculos=castillo.userData.colisiones;
  let colisiones=0;
  for(let i=obstaculos.length-1;i>=0;i--)if(conjunto.has(obstaculos[i].mesh)){obstaculos.splice(i,1);colisiones++;}
  for(const o of eliminar)o.removeFromParent();
  return {piezasRetiradas:eliminar.length,colisionesRetiradas:colisiones,
    nota:'Tercer piso sin barandas: es posible caer por bordes y huecos.'};
}
