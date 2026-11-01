import * as THREE from 'three';

// Para el castillo jugable de la conversacion. No modifica sus colisiones.
export function crearRenderizadoDinamico(escena,camara,renderizador,castillo) {
  const frustum=new THREE.Frustum(),matriz=new THREE.Matrix4();
  const caja=new THREE.Box3(),esfera=new THREE.Sphere();
  const decoraciones=[],fuentes=[],originales=[];
  const anisotropia=Math.min(8,renderizador.capabilities.getMaxAnisotropy());
  const texturas=new Set();
  escena.updateMatrixWorld(true);
  escena.traverse(o=>{
    if(!o.isMesh)return;
    // El motor decide el descarte en cada pase, incluida la camara de sombras.
    o.frustumCulled=true;
    const lista=Array.isArray(o.material)?o.material:[o.material];
    for(const m of lista) {
      if(!m)continue;
      m.dithering=true;
      for(const t of [m.map,m.bumpMap,m.normalMap,m.roughnessMap]) {
        if(!t||texturas.has(t))continue;
        texturas.add(t);t.anisotropy=anisotropia;t.needsUpdate=true;
      }
      if(/alfombra/i.test(o.name)) {
        m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1;
      }
      m.needsUpdate=true;
    }
    // Nunca ocultar paredes, pisos, puertas o emisores de sombras.
    // Opt-in para adornos que el autor haya marcado expresamente.
    if(o.userData.detalleDinamico===true&&!o.castShadow) {
      caja.setFromObject(o);caja.getBoundingSphere(esfera);
      decoraciones.push({objeto:o,visible:o.visible,radioLocal:esfera.radius});
    }
  });
  castillo.traverse(o=>{
    if(!o.isPointLight)return;
    const posicion=new THREE.Vector3();o.getWorldPosition(posicion);
    fuentes.push({posicion,color:o.color.clone(),intensidad:o.intensity,distancia:o.distance,decay:o.decay});
    originales.push({luz:o,visible:o.visible});o.visible=false;
  });
  // Pool fijo: evita variar el numero de luces del shader al girar la camara.
  const cantidad=Math.min(4,fuentes.length),slots=[];
  for(let i=0;i<cantidad;i++) {
    const luz=new THREE.PointLight(0xffffff,0,20,2);
    luz.name='Luz interior dinamica '+i;luz.castShadow=false;escena.add(luz);
    slots.push({luz,fuente:null});
  }
  let indicesDeseados=[];
  let reloj=1;
  const posicion=new THREE.Vector3();
  const metricas={dibujadas:0,triangulos:0,lucesInteriores:cantidad};
  function seleccionar() {
    const activos=new Set(slots.map(s=>s.fuente));
    indicesDeseados=fuentes.map((f,i)=>({i,d:f.posicion.distanceTo(camara.position)*(activos.has(i)?0.85:1)}))
      .filter(x=>x.d<32).sort((a,b)=>a.d-b.d).slice(0,cantidad).map(x=>x.i);
  }
  function actualizar(dt) {
    camara.updateMatrixWorld();
    matriz.multiplyMatrices(camara.projectionMatrix,camara.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matriz);
    for(const d of decoraciones) {
      caja.setFromObject(d.objeto);caja.getBoundingSphere(esfera);
      esfera.radius+=0.7;
      d.objeto.getWorldPosition(posicion);
      d.objeto.visible=d.visible&&(posicion.distanceTo(camara.position)<18||
        (posicion.distanceTo(camara.position)<75&&frustum.intersectsSphere(esfera)));
    }
    reloj+=dt;
    if(reloj>0.25){reloj=0;seleccionar();}
    const reservados=new Set(slots.filter(s=>indicesDeseados.includes(s.fuente)).map(s=>s.fuente));
    for(const s of slots) {
      const mantener=indicesDeseados.includes(s.fuente);
      const fuente=mantener?fuentes[s.fuente]:null;
      let objetivo=0;
      if(fuente) {
        const d=fuente.posicion.distanceTo(camara.position);
        objetivo=fuente.intensidad*(1-THREE.MathUtils.smoothstep(d,22,32));
      }
      s.luz.intensity=THREE.MathUtils.damp(s.luz.intensity,objetivo,8,dt);
      if(!mantener&&s.luz.intensity<0.03) {
        s.luz.intensity=0;
        const nuevo=indicesDeseados.find(i=>!reservados.has(i));
        s.fuente=nuevo??null;
        if(nuevo!==undefined) {
          reservados.add(nuevo);const f=fuentes[nuevo];
          s.luz.position.copy(f.posicion);s.luz.color.copy(f.color);
          s.luz.distance=f.distancia;s.luz.decay=f.decay;
        }
      }
    }
  }
  function registrarMetricas() {
    metricas.dibujadas=renderizador.info.render.calls;
    metricas.triangulos=renderizador.info.render.triangles;
  }
  function liberar() {
    for(const s of slots){escena.remove(s.luz);s.luz.dispose?.();}
    for(const o of originales)o.luz.visible=o.visible;
    for(const d of decoraciones)d.objeto.visible=d.visible;
  }
  return {actualizar,registrarMetricas,metricas,liberar};
}
