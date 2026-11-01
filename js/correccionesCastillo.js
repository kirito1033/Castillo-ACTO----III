import * as THREE from 'three';

// Ejecutar ANTES de crearRenderizadoDinamico y crearOclusionHabitaciones.
export function corregirPisosEIluminacion(escena,camara,castillo) {
  const cambios=[];
  const mover=(nombre,fn)=>{castillo.traverse(o=>{if(o.isMesh&&o.name===nombre){fn(o);cambios.push(nombre);}});};
  // El piso sigue a y=3. Solo baja el bloque de soporte que tenia su tapa a y=3.
  mover('Cimentacion continua',o=>{o.position.y=1.35;});
  // Evita que el remate del relleno compita con el piso interior a y=3.
  mover('Remate del zocalo',o=>{o.position.y=2.84;});
  mover('Relleno lateral de acceso',o=>{o.position.y=1.4;});
  // Antes ocupaba z=17..18.6: invadia el piso interior que termina en z=18.
  mover('Descanso entrada',o=>{o.position.z=18.3;o.scale.z=0.6;});
  mover('Descanso de entrada',o=>{o.position.z=18.3;o.scale.z=0.6;});
  // El patio termina en z=44. El umbral nuevo empieza alli y termina en 45.5.
  mover('Umbral de salida',o=>{o.position.z=44.75;o.scale.z=1.5;});
  // El sendero exterior ya empieza en z=45.5, por lo que no hay solape de areas.
  // No modificar materiales compartidos ni desactivar el test/escritura de profundidad.
  castillo.updateMatrixWorld(true);

  // El gestor dinamico copia estos valores al construir su pool de luces.
  let lucesReforzadas=0;
  castillo.traverse(o=>{
    if(!o.isPointLight)return;
    o.intensity=Math.max(o.intensity,110);
    o.distance=Math.max(o.distance,24);
    lucesReforzadas++;
  });
  const relleno=new THREE.AmbientLight(0xffedd6,0);
  relleno.name='Relleno interior controlado';escena.add(relleno);
  const local=new THREE.Vector3(),inversa=new THREE.Matrix4();
  const ajustes={rellenoInterior:0.6,transicion:6};
  function actualizar(dt=0) {
    castillo.updateWorldMatrix(true,false);
    inversa.copy(castillo.matrixWorld).invert();
    camara.getWorldPosition(local).applyMatrix4(inversa);
    const dentro=Math.abs(local.x)<20.4&&local.z>-18.4&&local.z<18.4&&local.y>2.7&&local.y<17.5;
    // Interpolacion, no encendido/apagado brusco al mirar o cruzar una puerta.
    relleno.intensity=THREE.MathUtils.damp(relleno.intensity,dentro?ajustes.rellenoInterior:0,ajustes.transicion,dt);
  }
  return {actualizar,ajustes,informe:{geometriasCorregidas:cambios,lucesReforzadas},
    liberar(){escena.remove(relleno);relleno.dispose?.();}};
}
