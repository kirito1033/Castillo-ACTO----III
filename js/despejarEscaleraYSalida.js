import * as THREE from 'three';

// Antes de cachear colisiones y fusionar estructura.
export function despejarEscaleraYSalida(castillo) {
  if(castillo.getObjectByName('Estructura agrupada por sectores'))throw new Error('Ejecuta despejarEscaleraYSalida antes de agruparEstructura.');
  const nombres=new Set(['Cerramiento caja escalera','Paño entre descansos','Cubierta caja escalera']);
  const quitar=new Set(),protegidos=new Set();
  for(const p of castillo.userData.puertas||[])p.marco.traverse(o=>protegidos.add(o));
  castillo.updateMatrixWorld(true);
  const inversa=new THREE.Matrix4().copy(castillo.matrixWorld).invert();
  const box=new THREE.Box3();
  // Solo el paso inmediato frente a la puerta del salon, antes del pabellon.
  const paso=new THREE.Box3(new THREE.Vector3(-1.15,17.7,-0.85),new THREE.Vector3(1.15,20.9,4.7));
  const informe={cerramientoRetirado:[],bloqueosSalidaRetirados:[]};
  castillo.traverse(o=>{
    if(!o.isMesh)return;
    if(nombres.has(o.name)){quitar.add(o);informe.cerramientoRetirado.push(o.name);return;}
    if(protegidos.has(o)||o.isInstancedMesh)return;
    if(/Tejado|Cornisa|Cubierta|Losa|pelda|Caracol|Nucleo|Marco|Columna|Candelabro|Pasamanos|Balaustre/i.test(o.name))return;
    box.setFromObject(o).applyMatrix4(inversa);
    const ancho=box.max.x-box.min.x,alto=box.max.y-box.min.y,fondo=box.max.z-box.min.z;
    // No elimina muros laterales ni toda la casa: solo una pared transversal
    // delgada o barrera que efectivamente invada el paso central.
    if(box.intersectsBox(paso)&&ancho>=2&&alto>=0.6&&fondo<=0.8&&
      /Muro|Pared|Paño|Cierre|Baranda|Colision/i.test(o.name)){
      quitar.add(o);informe.bloqueosSalidaRetirados.push(o.name);
    }
  });
  // Si una barrera retirada tenia pasamanos/listones en el mismo plano,
  // elimina solo los que tambien cruzan el ancho libre del paso.
  const extras=[];
  castillo.traverse(o=>{
    if(!o.isMesh||protegidos.has(o)||!/Pasamanos|Balaustre/.test(o.name))return;
    box.setFromObject(o).applyMatrix4(inversa);
    if(box.intersectsBox(paso)&&box.max.z-box.min.z<=0.8)extras.push(o);
  });
  for(const o of extras)quitar.add(o);
  const obstaculos=castillo.userData.colisiones;
  for(let i=obstaculos.length-1;i>=0;i--)if(quitar.has(obstaculos[i].mesh))obstaculos.splice(i,1);
  for(const o of quitar)o.removeFromParent();
  informe.totalRetirados=quitar.size;
  informe.nota='Conserva escalones, nucleo y puertas. El despeje exterior solo cubre el paso entre salon y pabellon.';
  return informe;
}
