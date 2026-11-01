import * as THREE from 'three';

// Portal culling CPU para la distribucion de 8 habitaciones del castillo jugable.
// Oculta contenidos, no la estructura compartida ni los datos de colision.
export function crearOclusionHabitaciones(escena,camara,castillo) {
  const habitaciones=[],celdas=new Map(),portales=[];
  const registros=[],frustum=new THREE.Frustum(),matriz=new THREE.Matrix4();
  const inversa=new THREE.Matrix4(),ojoLocal=new THREE.Vector3(),ojo=new THREE.Vector3();
  const nombres=['Biblioteca','Comedor','Armeria','Sala del consejo',
    'Dormitorio oeste','Dormitorio este','Estudio','Sala de mapas'];
  function celda(id,caja=null) {
    const c={id,caja,portales:[],habitacion:null};celdas.set(id,c);return c;
  }
  const exterior=celda('exterior');
  const volumen=(x1,y1,z1,x2,y2,z2)=>new THREE.Box3(new THREE.Vector3(x1,y1,z1),new THREE.Vector3(x2,y2,z2));
  celda('corredor-bajo',volumen(-7,3,-18,7,10,18));
  celda('corredor-alto',volumen(-7,10,-18,7,17.5,18));
  let indice=0;
  for(const base of [3,10])for(const atras of [false,true])for(const lado of [-1,1]) {
    const id=nombres[indice++];
    const box=volumen(lado<0?-20:7,base,atras?-18:-2,lado<0?-7:20,base+7,atras?-2:18);
    const c=celda(id,box);c.habitacion={id,caja:box,objetos:[],visible:true};habitaciones.push(c.habitacion);
    const x=lado*7,z=atras?-10:8;
    const puerta=castillo.userData.puertas?.find(p=>p.nombre===id);
    // Si falta una puerta en un proyecto modificado, se considera un paso abierto.
    conectar(id,base===3?'corredor-bajo':'corredor-alto',[
      [x,base,z-1.3],[x,base+3.6,z-1.3],[x,base+3.6,z+1.3],[x,base,z+1.3]
    ],puerta);
  }
  const salon=celda('Salon superior',volumen(-6.7,17.5,-12.7,6.7,34,-1.3));
  salon.habitacion={id:'Salon superior',caja:salon.caja,objetos:[],visible:true};
  habitaciones.push(salon.habitacion);
  celda('Terraza frontal',volumen(-4.5,17.5,-1.3,4.5,24,5));
  celda('Pabellon frontal',volumen(-10.7,17.5,5,10.7,24.5,11));
  celda('Balcon exterior',volumen(-10.5,17.5,11,10.5,25,17.4));
  conectar('corredor-alto','Salon superior',[
    [-4.3,17.5,-11.3],[4.3,17.5,-11.3],[4.3,17.5,-2.7],[-4.3,17.5,-2.7]
  ]);
  const vano=(z)=>[[-1.3,17.5,z],[1.3,17.5,z],[1.3,21.1,z],[-1.3,21.1,z]];
  const puertaNombre=n=>castillo.userData.puertas.find(p=>p.nombre===n);
  conectar('Salon superior','Terraza frontal',vano(-1.1),puertaNombre('Acceso a la terraza'));
  conectar('Terraza frontal','Pabellon frontal',vano(5),puertaNombre('Entrada pabellon frontal'));
  conectar('Pabellon frontal','Balcon exterior',vano(11),puertaNombre('Salida pabellon frontal'));
  conectar('exterior','Balcon exterior',[
    [-10.5,17.5,17.4],[10.5,17.5,17.4],[10.5,25,17.4],[-10.5,25,17.4]
  ]);
  conectar('exterior','Balcon exterior',[
    [-10.5,25,11],[10.5,25,11],[10.5,25,17.4],[-10.5,25,17.4]
  ]);
  conectar('exterior','Terraza frontal',[
    [-4.5,24,-1],[4.5,24,-1],[4.5,24,5],[-4.5,24,5]
  ]);
  function conectar(a,b,puntos,puerta=null) {
    const p={a,b,local:puntos.map(v=>new THREE.Vector3(...v)),puerta};
    portales.push(p);celdas.get(a).portales.push(p);celdas.get(b).portales.push(p);
  }
  conectar('exterior','corredor-bajo',[
    [-1.3,3,18],[1.3,3,18],[1.3,6.6,18],[-1.3,6.6,18]
  ],castillo.userData.puertas?.find(p=>p.nombre==='Entrada principal'));
  // Hueco real entre las galerias; comunica las plantas por la escalera.
  conectar('corredor-bajo','corredor-alto',[
    [-4.3,10,-11.3],[4.3,10,-11.3],[4.3,10,-2.7],[-4.3,10,-2.7]
  ]);
  const cajaMundo=new THREE.Box3(),cajaLocal=new THREE.Box3();
  castillo.updateWorldMatrix(true,false);inversa.copy(castillo.matrixWorld).invert();
  const esContenido=/^(Mesa|Armario|Estanteria|Libros|Cama|Cabecera)(\s|$)/i;
  castillo.traverse(o=>{
    if(!o.isMesh)return;
    let h=habitaciones.find(h=>h.id===o.userData.habitacion);
    if(!h&&!esContenido.test(o.name))return;
    if(!h) {
      cajaMundo.setFromObject(o);cajaLocal.copy(cajaMundo).applyMatrix4(inversa);
      h=habitaciones.find(h=>h.caja.clone().expandByScalar(0.06).containsBox(cajaLocal));
    }
    if(h){const r={objeto:o,visibleInicial:o.visible};h.objetos.push(r);registros.push(r);}
  });
  function recortar(poligono,planos) {
    let salida=poligono;
    for(const plano of planos) {
      if(!salida.length)return salida;
      const entrada=salida;salida=[];
      for(let i=0;i<entrada.length;i++) {
        const a=entrada[i],b=entrada[(i+1)%entrada.length];
        const da=plano.distanceToPoint(a),db=plano.distanceToPoint(b);
        const dentroA=da>=-0.0001,dentroB=db>=-0.0001;
        if(dentroA)salida.push(a);
        if(dentroA!==dentroB)salida.push(a.clone().lerp(b,da/(da-db)));
      }
    }
    return salida;
  }
  function planosPortal(poligono,anteriores) {
    const centro=new THREE.Vector3();for(const p of poligono)centro.add(p);centro.multiplyScalar(1/poligono.length);
    const resultado=anteriores.slice();
    for(let i=0;i<poligono.length;i++) {
      const a=poligono[i],b=poligono[(i+1)%poligono.length];
      const normal=new THREE.Vector3().crossVectors(a.clone().sub(ojo),b.clone().sub(ojo));
      if(normal.lengthSq()<1e-12)continue;
      const plano=new THREE.Plane().setFromNormalAndCoplanarPoint(normal.normalize(),ojo);
      if(plano.distanceToPoint(centro)<0)plano.negate();
      resultado.push(plano);
    }
    return resultado;
  }
  const ultimas=new Map();let tiempo=0;
  const estadisticas={zona:'exterior',habitacionesVisibles:[],habitacionesOcultas:[],objetosGestionados:registros.length,objetosOcultos:0,habilitado:true};
  function actualizar(dt=0) {
    tiempo+=dt;
    castillo.updateWorldMatrix(true,false);camara.updateMatrixWorld(true);
    camara.getWorldPosition(ojo);inversa.copy(castillo.matrixWorld).invert();ojoLocal.copy(ojo).applyMatrix4(inversa);
    matriz.multiplyMatrices(camara.projectionMatrix,camara.matrixWorldInverse);frustum.setFromProjectionMatrix(matriz);
    let origen=exterior;
    // En el umbral se evalua tambien la celda vecina para evitar desapariciones.
    for(const c of celdas.values())if(c.caja?.containsPoint(ojoLocal)){origen=c;break;}
    estadisticas.zona=origen.id;
    const visibles=new Set();
    function visitar(id,planos,camino,profundidad) {
      if(profundidad>12)return;
      visibles.add(id);
      const siguienteCamino=new Set(camino);siguienteCamino.add(id);
      for(const p of celdas.get(id).portales) {
        const destino=p.a===id?p.b:p.a;
        if(siguienteCamino.has(destino))continue;
        const mundo=p.local.map(v=>v.clone().applyMatrix4(castillo.matrixWorld));
        const plano=new THREE.Plane().setFromCoplanarPoints(mundo[0],mundo[1],mundo[2]);
        const box=new THREE.Box3().setFromPoints(mundo).expandByScalar(0.4);
        const enUmbral=box.containsPoint(ojo);
        // angulo real, no solo la orden de apertura: respeta el cierre animado.
        if(p.puerta&&Math.abs(p.puerta.angulo??p.puerta.pivote.rotation.y)<0.01&&!enUmbral)continue;
        if(enUmbral||Math.abs(plano.distanceToPoint(ojo))<0.04) {
          visitar(destino,planos,siguienteCamino,profundidad+1);continue;
        }
        const recortado=recortar(mundo,planos);
        if(recortado.length>=3)visitar(destino,planosPortal(recortado,planos),siguienteCamino,profundidad+1);
      }
    }
    if(estadisticas.habilitado)visitar(origen.id,frustum.planes, new Set(),0);
    estadisticas.habitacionesVisibles=[];estadisticas.habitacionesOcultas=[];estadisticas.objetosOcultos=0;
    for(const h of habitaciones) {
      const visible=!estadisticas.habilitado||visibles.has(h.id);
      if(visible)ultimas.set(h.id,tiempo);
      // Retardo de 150 ms al ocultar, nunca al mostrar.
      h.visible=visible||tiempo-(ultimas.get(h.id)??-100)<0.15;
      (h.visible?estadisticas.habitacionesVisibles:estadisticas.habitacionesOcultas).push(h.id);
      for(const r of h.objetos){r.objeto.visible=r.visibleInicial&&h.visible;if(!r.objeto.visible&&r.visibleInicial)estadisticas.objetosOcultos++;}
    }
  }
  return {actualizar,estadisticas,habitaciones,
    activar(valor){estadisticas.habilitado=Boolean(valor);actualizar();},
    liberar(){for(const r of registros)r.objeto.visible=r.visibleInicial;}
  };
}
