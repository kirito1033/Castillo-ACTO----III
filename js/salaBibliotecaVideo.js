import * as THREE from 'three';

// =============================================================
// BIBLIOTECA: SALA DE VIDEO, FOCOS Y PARPADEO POR CANCION
// Compatible con el main.js existente. No requiere otros modulos.
// =============================================================
export function crearSalaBibliotecaVideo(escena, camara, castillo, opciones = {}) {

  // -----------------------------------------------------------
  // 01. REFERENCIAS, CONFIGURACION Y ESTADO
  // -----------------------------------------------------------
  const puerta = castillo.userData.puertas.find(p => p.nombre === 'Biblioteca');
  if (!puerta) throw new Error('No se encontró la puerta Biblioteca.');

  const recursos = { texturas: [], materiales: [], geometrias: [] };
  const inv = new THREE.Matrix4(), posicion = new THREE.Vector3();
  castillo.updateMatrixWorld(true); inv.copy(castillo.matrixWorld).invert();
  const protegidos = new Set(); puerta.marco.traverse(o => protegidos.add(o));
  const playlist = (opciones.videos || []).map((v, i) => typeof v === 'string'
    ? { src: v, titulo: 'Vídeo ' + (i + 1), tiempo: 0 } : { ...v, tiempo: 0 });

  let indice = 0, video = null, texturaVideo = null, habilitado = false;
  let controles = null, oclusion = null, panelAbierto = false;
  let estabaDentro = false, relojUI = 0, destruido = false;
  const colorRespaldo = opciones.colorFocos ?? 0xffd39a;
  const separacionFocos = Math.max(0.45, Number.isFinite(opciones.separacionFocos)
    ? opciones.separacionFocos : 0.7);
  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const parpadeo = {
    activo: false, tiempo: 0, brillo: 1, pulsos: 2, ultimoInicio: -Infinity,
    duracion: THREE.MathUtils.clamp(Number.isFinite(opciones.duracionParpadeo)
      ? opciones.duracionParpadeo : 1.4, 1.2, 4),
    brilloMinimo: 0.35
  };
  const colorBaseFocos = new THREE.Color(colorRespaldo);

  function esNegroBasico(m) {
    return m?.isMeshBasicMaterial && m.color?.getHex() === 0 && !m.map;
  }
  if (!Array.isArray(puerta.hoja.material) && esNegroBasico(puerta.hoja.material)) {
    const otra = castillo.userData.puertas.find(p => p !== puerta &&
      !(Array.isArray(p.hoja.material) ? p.hoja.material.some(esNegroBasico)
        : esNegroBasico(p.hoja.material)));
    if (otra) puerta.hoja.material = otra.hoja.material;
  }
  const materialPuerta = puerta.hoja.material;
  const enBiblioteca = v => v.x > -19.85 && v.x < -7.15 &&
    v.z > -1.85 && v.z < 17.85 && v.y > 3.05 && v.y < 9.85;

  // -----------------------------------------------------------
  // 02. RETIRAR LA BARANDA INVASORA, MUEBLES Y LUCES ANTIGUAS
  // -----------------------------------------------------------
  const cierre = castillo.getObjectByName('Cierre frontal izquierdo');
  if (cierre) {
    const minX = cierre.position.x - cierre.scale.x / 2;
    const maxX = cierre.position.x + cierre.scale.x / 2;
    if (maxX > -20) {
      const ancho = Math.max(0, -20 - minX);
      if (ancho > 0.01) {
        cierre.scale.x = ancho; cierre.position.x = minX + ancho / 2;
        for (const c of castillo.userData.colisiones) if (c.mesh === cierre) c.w = ancho;
        cierre.updateMatrix(); cierre.updateWorldMatrix(true, false);
      } else {
        const lista = castillo.userData.colisiones;
        for (let i = lista.length - 1; i >= 0; i--) if (lista[i].mesh === cierre) lista.splice(i, 1);
        cierre.removeFromParent();
      }
    }
  }
  const muebles = /^(Mesa|Armario|Estanteria|Libros|Cama|Cabecera|Cadena candelabro|Brazo candelabro|Vela|Soporte antorcha)/i;
  const eliminar = new Set();
  castillo.traverse(o => {
    if (protegidos.has(o)) return;
    o.getWorldPosition(posicion).applyMatrix4(inv);
    if (!enBiblioteca(posicion)) return;
    if (o.isPointLight || (o.isMesh && muebles.test(o.name))) { eliminar.add(o); return; }
    if (o.isMesh && o.material) {
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      if (ms.some(m => m?.emissive && (m.emissive.r > 0.05 || m.emissive.g > 0.05 || m.emissive.b > 0.05))) eliminar.add(o);
    }
    if (o.isGroup && o.children.some(c => c.isMesh && c.material?.emissive?.g > 0.1)) eliminar.add(o);
  });
  const todos = new Set(); for (const o of eliminar) o.traverse(c => todos.add(c));
  let colisionesRetiradas = 0;
  const colisiones = castillo.userData.colisiones;
  for (let i = colisiones.length - 1; i >= 0; i--) if (todos.has(colisiones[i].mesh)) {
    colisiones.splice(i, 1); colisionesRetiradas++;
  }
  for (const o of eliminar) o.removeFromParent();

  // -----------------------------------------------------------
  // 03. TEXTURAS PROCEDURALES Y MATERIALES
  // -----------------------------------------------------------
  let semilla = 412;
  const azar = () => { semilla = (Math.imul(1664525, semilla) + 1013904223) >>> 0; return semilla / 4294967296; };
  function crearTextura(tipo) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const ctx = c.getContext('2d');
    if (tipo === 'madera') {
      ctx.fillStyle = '#21160e'; ctx.fillRect(0, 0, 256, 256);
      for (let tabla = 0; tabla < 4; tabla++) {
        const v = Math.floor(azar() * 10);
        ctx.fillStyle = `rgb(${35 + v},${24 + v},${16 + v})`;
        ctx.fillRect(tabla * 64 + 1, 0, 62, 256);
        for (let j = 0; j < 28; j++) {
          const x = tabla * 64 + 3 + azar() * 58;
          ctx.strokeStyle = `rgba(15,10,6,${0.15 + azar() * 0.25})`;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x + 6, 85, x - 6, 170, x, 256); ctx.stroke();
        }
        ctx.fillStyle = '#140c08'; ctx.fillRect(tabla * 64, 0, 1, 256);
      }
    } else {
      ctx.fillStyle = tipo === 'pared' ? '#323438' : '#181b1f'; ctx.fillRect(0, 0, 256, 256);
      const imagen = ctx.getImageData(0, 0, 256, 256);
      for (let i = 0; i < imagen.data.length; i += 4) {
        const ruido = (azar() - 0.5) * (tipo === 'pared' ? 16 : 8);
        for (let j = 0; j < 3; j++) imagen.data[i + j] += ruido;
      }
      ctx.putImageData(imagen, 0, 0);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; recursos.texturas.push(t); return t;
  }
  function material(color, map = null) {
    const m = new THREE.MeshBasicMaterial({ color, map, toneMapped: false });
    recursos.materiales.push(m); return m;
  }
  const matPared = material(0xffffff, crearTextura('pared'));
  const matSuelo = material(0xffffff, crearTextura('madera'));
  const matTecho = material(0xffffff, crearTextura('techo'));
  const matMoldura = material(0x4a4338), matMarco = material(0x1a1c1e), matFriso = material(0x281d15);
  const matLed = material(colorRespaldo), matPortafoco = material(0x756348), matBombillo = material(colorRespaldo);

  // -----------------------------------------------------------
  // 04. PAREDES, SUELO Y TECHO
  // -----------------------------------------------------------
  const cajaGeo = new THREE.BoxGeometry(1, 1, 1); recursos.geometrias.push(cajaGeo);
  const revestimiento = new THREE.Group(); revestimiento.name = 'Biblioteca castillo oscuro'; castillo.add(revestimiento);
  function panel(nombre, x, y, z, w, h, d, mat = matPared) {
    const g = cajaGeo.clone(), uv = g.attributes.uv;
    const caras = [[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]], tile = mat === matSuelo ? [2.4,3] : [3,3];
    for (let i = 0; i < uv.count; i++) {
      const [u,v] = caras[Math.floor(i / 4)]; uv.setXY(i, uv.getX(i) * u / tile[0], uv.getY(i) * v / tile[1]);
    }
    g.clearGroups(); recursos.geometrias.push(g);
    const o = new THREE.Mesh(g, mat); o.name = nombre; o.position.set(x,y,z); o.scale.set(w,h,d);
    o.userData.habitacion = 'Biblioteca'; revestimiento.add(o); return o;
  }
  panel('Suelo nogal oscuro biblioteca',-13.45,3.025,8,12.2,0.02,19.2,matSuelo);
  panel('Techo oscuro biblioteca',-13.45,9.675,8,12.2,0.02,19.2,matTecho);
  panel('Fondo piedra biblioteca',-19.55,6.35,8,0.025,6.6,19.2);
  panel('Lateral piedra biblioteca',-13.45,6.35,-1.6,12.2,6.6,0.025);
  panel('Lateral piedra biblioteca',-13.45,6.35,17.6,12.2,6.6,0.025);
  panel('Entrada biblioteca izquierda',-7.35,6.35,2.55,0.025,6.6,8.3);
  panel('Entrada biblioteca derecha',-7.35,6.35,13.45,0.025,6.6,8.3);
  panel('Dintel biblioteca',-7.35,8.15,8,0.025,3,2.6);

  // -----------------------------------------------------------
  // 05. REVESTIMIENTO PARCIAL DE COLUMNAS, SIN CORTAR TORRES
  // -----------------------------------------------------------
  function revestirColumnas() {
    const caja = new THREE.Box3(new THREE.Vector3(-19.53,3.06,-1.58),new THREE.Vector3(-7.38,9.64,17.58));
    castillo.updateMatrixWorld(true);
    const inversa = new THREE.Matrix4().copy(castillo.matrixWorld).invert();
    const candidatos = [], box = new THREE.Box3();
    castillo.traverse(o => {
      if (!o.isMesh || o.isInstancedMesh || o.geometry?.type !== 'CylinderGeometry') return;
      box.setFromObject(o).applyMatrix4(inversa); if (box.intersectsBox(caja)) candidatos.push(o);
    });
    const limites = [v=>v.x-caja.min.x,v=>caja.max.x-v.x,v=>v.y-caja.min.y,v=>caja.max.y-v.y,v=>v.z-caja.min.z,v=>caja.max.z-v.z];
    function recortar(poly, distancia) {
      const salida = [];
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i+1)%poly.length], da = distancia(a), db = distancia(b);
        const ia = da >= -0.000001, ib = db >= -0.000001;
        if (ia) salida.push(a);
        if (ia !== ib) salida.push(a.clone().lerp(b,THREE.MathUtils.clamp(da/(da-db),0,1)));
      }
      return salida;
    }
    const vertices = [], uvs = []; let cantidadColumnas = 0;
    const agregar = v => { vertices.push(v.x,v.y,v.z); uvs.push(v.x/3,v.y/3); };
    for (const o of candidatos) {
      const pos = o.geometry.attributes.position, idx = o.geometry.index;
      const matriz = new THREE.Matrix4().multiplyMatrices(inversa,o.matrixWorld);
      const cantidad = idx ? idx.count : pos.count, antes = vertices.length;
      for (let i = 0; i < cantidad; i += 3) {
        let poly = [];
        for (let j = 0; j < 3; j++) poly.push(new THREE.Vector3().fromBufferAttribute(pos,idx?idx.getX(i+j):i+j).applyMatrix4(matriz));
        for (const limite of limites) { poly = recortar(poly,limite); if (poly.length<3) break; }
        for (let j = 1; j < poly.length-1; j++) { agregar(poly[0]); agregar(poly[j]); agregar(poly[j+1]); }
      }
      if (vertices.length > antes) cantidadColumnas++;
    }
    if (vertices.length) {
      const g = new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.computeVertexNormals();g.computeBoundingSphere();
      const m = matPared.clone();m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-1;
      const o = new THREE.Mesh(g,m);o.name='Revestimiento interior columnas biblioteca';o.userData.habitacion='Biblioteca';o.renderOrder=1;revestimiento.add(o);
      recursos.geometrias.push(g);recursos.materiales.push(m);
    }
    return cantidadColumnas;
  }
  const columnasRevestidas = revestirColumnas();

  // -----------------------------------------------------------
  // 06. DECORACION Y MARCOS AGRUPADOS
  // -----------------------------------------------------------
  const unidad = cajaGeo.toNonIndexed();
  function cajasAgrupadas(padre,nombre,items,mat) {
    const vertices=[],v=new THREE.Vector3(),matriz=new THREE.Matrix4(),q=new THREE.Quaternion(),eje=new THREE.Vector3(0,1,0);
    for (const [x,y,z,w,h,d,rot=0] of items) {
      q.setFromAxisAngle(eje,rot);matriz.compose(new THREE.Vector3(x,y,z),q,new THREE.Vector3(w,h,d));
      for(let i=0;i<unidad.attributes.position.count;i++){v.fromBufferAttribute(unidad.attributes.position,i).applyMatrix4(matriz);vertices.push(v.x,v.y,v.z);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();g.computeBoundingSphere();recursos.geometrias.push(g);
    const o=new THREE.Mesh(g,mat);o.name=nombre;o.userData.habitacion='Biblioteca';padre.add(o);return o;
  }
  cajasAgrupadas(revestimiento,'Frisos nogal oscuro biblioteca',[
    [-19.51,3.62,8,0.02,1.12,19.16],[-13.45,3.62,17.56,12.14,1.12,0.02],[-13.45,3.62,-1.56,12.14,1.12,0.02],
    [-7.39,3.62,2.55,0.02,1.12,8.25],[-7.39,3.62,13.45,0.02,1.12,8.25]
  ],matFriso);
  const molduras=[];
  for(const y of [3.13,4.2,9.52])molduras.push([-19.48,y,8,0.035,0.045,19.1],[-13.45,y,17.53,12.1,0.045,0.035],[-13.45,y,-1.53,12.1,0.045,0.035]);
  cajasAgrupadas(revestimiento,'Molduras hierro biblioteca',molduras,matMoldura);
  cajasAgrupadas(revestimiento,'Vigas biblioteca',[1.5,8,14.5].map(z=>[-13.45,9.56,z,12.12,0.1,0.13]),matMarco);

  // -----------------------------------------------------------
  // 07. TRES PANTALLAS SINCRONIZADAS Y LED
  // -----------------------------------------------------------
  const pantallas=new THREE.Group();pantallas.name='Pantallas biblioteca';pantallas.visible=false;castillo.add(pantallas);
  const screenGeo=new THREE.PlaneGeometry(1,1);recursos.geometrias.push(screenGeo);
  const screenMat=material(0),monitores=[],piezasMarcos=[],piezasLeds=[],posicionesFocos=[];
  function pantalla(nombre,x,z,rot,w,h) {
    const o=new THREE.Mesh(screenGeo,screenMat);o.name=nombre;o.position.set(x,6.6,z);o.rotation.y=rot;o.scale.set(w,h,1);o.userData.habitacion='Biblioteca';pantallas.add(o);monitores.push({o,w,h});
    const punto=(dx,dy,dz)=>new THREE.Vector3(x+Math.cos(rot)*dx+Math.sin(rot)*dz,6.6+dy,z-Math.sin(rot)*dx+Math.cos(rot)*dz);
    function pieza(lista,dx,dy,dz,ancho,alto,fondo){const p=punto(dx,dy,dz);lista.push([p.x,p.y,p.z,ancho,alto,fondo,rot]);}
    pieza(piezasMarcos,0,0,-0.07,w+0.54,h+0.54,0.04);
    pieza(piezasMarcos,-w/2-0.14,0,-0.02,0.25,h+0.54,0.12);pieza(piezasMarcos,w/2+0.14,0,-0.02,0.25,h+0.54,0.12);
    pieza(piezasMarcos,0,h/2+0.14,-0.02,w+0.54,0.25,0.12);pieza(piezasMarcos,0,-h/2-0.14,-0.02,w+0.54,0.25,0.12);
    pieza(piezasLeds,-w/2-0.006,0,0.055,0.018,h-0.1,0.012);pieza(piezasLeds,w/2+0.006,0,0.055,0.018,h-0.1,0.012);
    pieza(piezasLeds,0,h/2+0.006,0.055,w-0.1,0.018,0.012);pieza(piezasLeds,0,-h/2-0.006,0.055,w-0.1,0.018,0.012);
    const foco=(dx,dy)=>posicionesFocos.push({base:punto(dx,dy,0.075),bombillo:punto(dx,dy,0.17),rot});
    const nh=Math.max(2,Math.ceil(w/separacionFocos)),nv=Math.max(2,Math.ceil(h/separacionFocos));
    for(let i=0;i<=nh;i++){const dx=THREE.MathUtils.lerp(-w/2,w/2,i/nh);foco(dx,h/2+0.14);foco(dx,-h/2-0.14);}
    for(let i=0;i<=nv;i++){const dy=THREE.MathUtils.lerp(-h/2,h/2,i/nv);foco(-w/2-0.14,dy);foco(w/2+0.14,dy);}
  }
  pantalla('Pantalla frontal biblioteca',-19.38,8,Math.PI/2,10,5.6);
  pantalla('Pantalla izquierda biblioteca',-13.4,17.43,Math.PI,9,5.1);
  pantalla('Pantalla derecha biblioteca',-13.4,-1.43,0,9,5.1);
  const marcos=cajasAgrupadas(pantallas,'Marcos pantallas biblioteca',piezasMarcos,matMarco);
  const leds=cajasAgrupadas(pantallas,'LED pantallas biblioteca',piezasLeds,matLed);unidad.dispose();

  // -----------------------------------------------------------
  // 08. FOCOS INSTANCIADOS Y HALOS: SIN POINTLIGHT POR BOMBILLO
  // -----------------------------------------------------------
  const geoPortafoco=new THREE.CylinderGeometry(0.115,0.13,0.055,8);geoPortafoco.rotateX(Math.PI/2);
  const geoBombillo=new THREE.SphereGeometry(0.085,8,6);recursos.geometrias.push(geoPortafoco,geoBombillo);
  const portafocos=new THREE.InstancedMesh(geoPortafoco,matPortafoco,posicionesFocos.length);
  const focos=new THREE.InstancedMesh(geoBombillo,matBombillo,posicionesFocos.length);
  portafocos.name='Portafocos biblioteca';focos.name='Bombillos biblioteca';
  portafocos.userData.habitacion=focos.userData.habitacion='Biblioteca';
  const auxiliar=new THREE.Object3D(),posicionesHalo=[];
  posicionesFocos.forEach((item,i)=>{
    auxiliar.position.copy(item.base);auxiliar.rotation.set(0,item.rot,0);auxiliar.updateMatrix();portafocos.setMatrixAt(i,auxiliar.matrix);
    auxiliar.position.copy(item.bombillo);auxiliar.rotation.set(0,0,0);auxiliar.updateMatrix();focos.setMatrixAt(i,auxiliar.matrix);
    posicionesHalo.push(item.bombillo.x,item.bombillo.y,item.bombillo.z);
  });
  for(const o of [portafocos,focos]){o.instanceMatrix.needsUpdate=true;o.computeBoundingBox();o.computeBoundingSphere();o.castShadow=false;}
  pantallas.add(portafocos,focos);
  let halosFocos=null;
  if(opciones.halosFocos!==false){
    const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');
    const grad=ctx.createRadialGradient(32,32,0,32,32,30);
    grad.addColorStop(0,'rgba(255,255,240,0.9)');grad.addColorStop(0.2,'rgba(255,225,170,0.5)');grad.addColorStop(1,'rgba(255,190,100,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,64,64);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.generateMipmaps=false;t.minFilter=t.magFilter=THREE.LinearFilter;recursos.texturas.push(t);
    const m=new THREE.PointsMaterial({map:t,color:colorRespaldo,size:0.34,sizeAttenuation:true,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending,depthTest:true,depthWrite:false,toneMapped:false});recursos.materiales.push(m);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(posicionesHalo,3));g.computeBoundingSphere();recursos.geometrias.push(g);
    halosFocos=new THREE.Points(g,m);halosFocos.name='Halos focos biblioteca';pantallas.add(halosFocos);
  }

  // -----------------------------------------------------------
  // 09. COLOR POR CANCION Y DOS PULSOS SUAVES AL CAMBIAR
  // -----------------------------------------------------------
  function aplicarBrilloFocos(brillo){
    parpadeo.brillo=brillo;
    matBombillo.color.copy(colorBaseFocos).multiplyScalar(brillo);
    matLed.color.copy(colorBaseFocos).multiplyScalar(brillo);
    if(halosFocos){halosFocos.material.color.copy(colorBaseFocos);halosFocos.material.opacity=0.4*brillo;}
  }
  function actualizarColorCancion(parpadear=true){
    colorBaseFocos.set(playlist[indice]?.colorFocos??colorRespaldo);
    if(opciones.parpadeoFocos===false||movimientoReducido.matches){
      parpadeo.activo=false;parpadeo.tiempo=0;aplicarBrilloFocos(1);return;
    }
    const ahora=performance.now(),espera=Math.max(1500,parpadeo.duracion*1000+100);
    // Cambios rapidos conservan el pulso actual sin reiniciar destellos.
    if(parpadear&&!parpadeo.activo&&ahora-parpadeo.ultimoInicio>=espera){
      parpadeo.activo=true;parpadeo.tiempo=0;parpadeo.ultimoInicio=ahora;parpadeo.brillo=1;
    }
    aplicarBrilloFocos(parpadeo.activo?parpadeo.brillo:1);
  }
  function actualizarParpadeo(dt){
    if(!parpadeo.activo)return;
    if(opciones.parpadeoFocos===false||movimientoReducido.matches){parpadeo.activo=false;aplicarBrilloFocos(1);return;}
    parpadeo.tiempo+=Math.max(0,Number.isFinite(dt)?dt:0);
    const progreso=Math.min(parpadeo.tiempo/parpadeo.duracion,1);
    if(progreso>=1){parpadeo.activo=false;aplicarBrilloFocos(1);return;}
    const onda=0.5+0.5*Math.cos(progreso*Math.PI*2*parpadeo.pulsos);
    aplicarBrilloFocos(parpadeo.brilloMinimo+(1-parpadeo.brilloMinimo)*onda);
  }

  // -----------------------------------------------------------
  // 10. INTERFAZ COMPACTA: ANTERIOR, PLAY/PAUSA, SIGUIENTE
  // -----------------------------------------------------------
  const style=document.createElement('style');style.textContent=`
    #bc-abrir[hidden],#bc-panel[hidden]{display:none!important}
    #bc-abrir{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9;border:1px solid #4a453b;border-radius:22px;background:#181716ea;color:#d8d2c4;padding:9px 15px;font:600 12px system-ui;min-height:40px;cursor:pointer;touch-action:manipulation}
    #bc-panel{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:60;width:min(370px,calc(100vw - 24px));box-sizing:border-box;padding:11px 12px 10px;border:1px solid #4a453b;border-radius:14px;background:#181716f2;box-shadow:0 6px 24px #000a;color:#d8d2c4;font:13px system-ui;touch-action:pan-y}
    #bc-panel *{box-sizing:border-box}#bc-cabecera{display:flex;align-items:center;gap:8px;margin-bottom:8px}#bc-cabecera-textos{flex:1;min-width:0}
    #bc-etiqueta{display:block;color:#938d80;font-size:10px;letter-spacing:.06em;text-transform:uppercase}#bc-titulo{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;font-size:13px}
    #bc-cerrar{width:40px;min-height:40px;padding:0;border:0;background:transparent;color:#a8a294;font:24px system-ui;cursor:pointer;border-radius:8px;touch-action:manipulation}
    #bc-acciones{display:grid;grid-template-columns:1fr 1.25fr 1fr;gap:7px}#bc-acciones button{font:600 12px system-ui;min-height:44px;border:1px solid #3a3730;border-radius:9px;background:#262421;color:#e2ded0;cursor:pointer;touch-action:manipulation;padding:8px 5px}
    #bc-acciones #bc-play{background:#4a3f31;border-color:#6e5e49}#bc-acciones button:disabled{opacity:.35;cursor:default}#bc-estado{margin:7px 0 0;font-size:11px;color:#a8a294;line-height:1.3;max-height:2.6em;overflow:hidden}
    #bc-estado:empty{display:none}#bc-panel button:focus-visible,#bc-abrir:focus-visible{outline:2px solid #8c795b;outline-offset:2px}
    @media(max-height:440px){#bc-panel{bottom:8px;padding:8px 10px}#bc-cabecera{margin-bottom:4px}#bc-estado{margin-top:4px}}
  `;document.head.appendChild(style);
  const abrir=document.createElement('button');abrir.id='bc-abrir';abrir.type='button';abrir.textContent='Reproductor · R';abrir.hidden=true;document.body.appendChild(abrir);
  const panelUI=document.createElement('section');panelUI.id='bc-panel';panelUI.hidden=true;panelUI.setAttribute('role','dialog');panelUI.setAttribute('aria-modal','false');panelUI.setAttribute('aria-label','Controles de las pantallas');
  panelUI.innerHTML=`<div id="bc-cabecera"><div id="bc-cabecera-textos"><span id="bc-etiqueta">Biblioteca · Tres pantallas</span><span id="bc-titulo"></span></div><button type="button" id="bc-cerrar" aria-label="Ocultar controles y volver al juego" title="Ocultar sin pausar">×</button></div><div id="bc-acciones"><button type="button" id="bc-anterior">Anterior</button><button type="button" id="bc-play">Reproducir</button><button type="button" id="bc-siguiente">Siguiente</button></div><p id="bc-estado" role="status" aria-live="polite"></p>`;document.body.appendChild(panelUI);
  const $=id=>panelUI.querySelector('#'+id);
  const ponerMensaje=t=>{$('bc-estado').textContent=t;};
  function refrescarUI(){
    $('bc-titulo').textContent=playlist[indice]?.titulo||'Sin vídeos configurados';$('bc-play').textContent=video&&!video.paused?'Pausar':'Reproducir';
    $('bc-play').disabled=!habilitado||!playlist.length;$('bc-anterior').disabled=$('bc-siguiente').disabled=!habilitado||playlist.length<2;
  }

  // -----------------------------------------------------------
  // 11. DETECCION DE HABITACION Y PUERTA
  // -----------------------------------------------------------
  function posicionJugador(){castillo.updateWorldMatrix(true,false);inv.copy(castillo.matrixWorld).invert();return camara.getWorldPosition(posicion).applyMatrix4(inv);}
  function jugadorDentro(){
    const v=posicionJugador(),margen=estabaDentro?0.08:0;
    const dentro=v.x>-19.95-margen&&v.x<-7.05+margen&&v.z>-1.95-margen&&v.z<17.95+margen&&v.y>3&&v.y<9.95;estabaDentro=dentro;return dentro;
  }
  function cerca(){const v=posicionJugador();return enBiblioteca(v)||(Math.hypot(v.x+7,v.z-8)<3&&v.y>3&&v.y<10);}
  function puertaAbierta(){return Boolean(puerta.abierta&&Math.abs(puerta.angulo??puerta.pivote.rotation.y)>0.015);}
  function puedeUsarse(){return jugadorDentro()||puertaAbierta();}

  // -----------------------------------------------------------
  // 12. CARGA, REPRODUCCION Y CAMBIO DE CANCION
  // -----------------------------------------------------------
  function liberarVideo(){
    const anterior=video;video=null;
    if(anterior){if(playlist[indice])playlist[indice].tiempo=Number.isFinite(anterior.currentTime)?anterior.currentTime:0;anterior.pause();anterior.removeAttribute('src');anterior.load();anterior.remove();}
    if(texturaVideo){texturaVideo.dispose();texturaVideo=null;}screenMat.map=null;screenMat.color.setHex(0);screenMat.needsUpdate=true;
  }
  async function iniciar(v){
    if(!v||!puedeUsarse()||destruido)return;
    try{await v.play();if(video!==v||!puedeUsarse()||destruido){v.pause();return;}ponerMensaje('');refrescarUI();}
    catch(error){if(video===v&&!destruido){ponerMensaje(error.name==='NotAllowedError'?'Pulsa Reproducir para autorizar el vídeo.':'No se pudo reproducir el vídeo. Revisa la ruta y el formato.');refrescarUI();}}
  }
  function seleccionar(nuevoIndice,reproducir=false,desdeInicio=false){
    if(!puedeUsarse()||!playlist.length||destruido)return;
    habilitado=true;liberarVideo();indice=((nuevoIndice%playlist.length)+playlist.length)%playlist.length;
    const item=playlist[indice];if(desdeInicio)item.tiempo=0;
    // Color y parpadeo se actualizan en todos los caminos de seleccion.
    actualizarColorCancion(true);
    const v=document.createElement('video');video=v;v.crossOrigin='anonymous';v.playsInline=true;v.setAttribute('playsinline','');v.preload='metadata';
    v.volume=THREE.MathUtils.clamp(Number.isFinite(opciones.volumen)?opciones.volumen:0.7,0,1);
    v.style.cssText='position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-10px;top:-10px';document.body.appendChild(v);
    v.addEventListener('loadedmetadata',()=>{
      if(video!==v||destruido)return;
      if(item.tiempo&&Number.isFinite(v.duration))v.currentTime=Math.min(item.tiempo,Math.max(0,v.duration-0.1));
      const aspecto=v.videoWidth/v.videoHeight||16/9;for(const s of monitores){const h=Math.min(s.h,s.w/aspecto);s.o.scale.set(h*aspecto,h,1);}
      if(v.paused)ponerMensaje('Listo para reproducir.');refrescarUI();
    });
    v.addEventListener('loadeddata',()=>{
      if(video!==v||destruido||!puedeUsarse())return;texturaVideo=new THREE.VideoTexture(v);texturaVideo.colorSpace=THREE.SRGBColorSpace;texturaVideo.generateMipmaps=false;texturaVideo.minFilter=texturaVideo.magFilter=THREE.LinearFilter;
      screenMat.map=texturaVideo;screenMat.color.setHex(0xffffff);screenMat.needsUpdate=true;
    },{once:true});
    v.addEventListener('play',refrescarUI);v.addEventListener('pause',refrescarUI);
    v.addEventListener('error',()=>{if(video===v&&!destruido)ponerMensaje('No se pudo cargar el vídeo. Revisa ruta, formato o CORS.');});
    v.addEventListener('ended',()=>{if(video!==v||!puedeUsarse())return;item.tiempo=0;if(playlist.length>1)seleccionar(indice+1,true,true);else{ponerMensaje('Vídeo finalizado.');refrescarUI();}});
    try{v.src=new URL(item.src,document.baseURI).href;v.load();ponerMensaje('Cargando…');refrescarUI();if(reproducir)iniciar(v);}catch{ponerMensaje('Ruta de vídeo inválida.');}
  }
  function reproducirPausar(){
    if(!puedeUsarse())return;if(!playlist.length){ponerMensaje('Configura vídeos en opciones.videos de main.js.');return;}
    if(!video){seleccionar(indice,true);return;}if(!video.paused){video.pause();ponerMensaje('En pausa.');refrescarUI();}else iniciar(video);
  }
  function cambiar(delta){if(playlist.length<2||!puedeUsarse())return;seleccionar(indice+delta,Boolean(video&&!video.paused),true);}

  // -----------------------------------------------------------
  // 13. PANEL, TECLADO Y REGRESO AL JUEGO SIN PAUSAR VIDEO
  // -----------------------------------------------------------
  function ocultarMenuDetras(){if(panelAbierto){const menu=document.getElementById('menu');if(menu)menu.hidden=true;}}
  function abrirPanel(){
    if(!puedeUsarse()||!cerca()||destruido)return;
    habilitado=true;panelAbierto=true;panelUI.hidden=false;abrir.hidden=true;controles?.pausar?.();
    if(document.pointerLockElement)document.exitPointerLock();ocultarMenuDetras();
    if(playlist.length&&!video)seleccionar(indice,false);refrescarUI();$('bc-play').focus();
  }
  function cerrarPanel(reanudar=true){panelAbierto=false;panelUI.hidden=true;if(reanudar)document.getElementById('boton-iniciar')?.click();}
  function tecla(e){
    if(e.repeat)return;
    if(panelAbierto&&(e.code==='Escape'||e.code==='KeyR')){e.preventDefault();cerrarPanel(true);return;}
    if(e.code==='KeyR'&&puedeUsarse()&&cerca()&&document.getElementById('menu')?.hidden){e.preventDefault();abrirPanel();}
  }
  function cambioPointerLock(){if(panelAbierto)queueMicrotask(ocultarMenuDetras);}
  function falloPointerLock(){if(!panelAbierto){const menu=document.getElementById('menu');if(menu)menu.hidden=false;}}
  function pausarOculto(){if(document.hidden)video?.pause();}
  abrir.addEventListener('click',abrirPanel);$('bc-cerrar').addEventListener('click',()=>cerrarPanel(true));$('bc-play').addEventListener('click',reproducirPausar);$('bc-anterior').addEventListener('click',()=>cambiar(-1));$('bc-siguiente').addEventListener('click',()=>cambiar(1));
  document.addEventListener('keydown',tecla);document.addEventListener('pointerlockchange',cambioPointerLock);document.addEventListener('pointerlockerror',falloPointerLock);document.addEventListener('visibilitychange',pausarOculto);

  // -----------------------------------------------------------
  // 14. ACTUALIZACION UNICA: USAR sala.actualizar(dt) EXISTENTE
  // -----------------------------------------------------------
  function actualizar(dt){
    if(destruido)return;
    actualizarParpadeo(dt);
    const dentro=jugadorDentro(),abierta=puertaAbierta(),activo=dentro||abierta;
    if(activo!==habilitado){
      habilitado=activo;
      if(!activo){liberarVideo();parpadeo.activo=false;aplicarBrilloFocos(1);if(panelAbierto)cerrarPanel(false);ponerMensaje('Fuera de la sala y puerta cerrada: sistema desactivado.');}
    }
    const visible=oclusion?.estadisticas?.habitacionesVisibles?.includes('Biblioteca')??true;
    pantallas.visible=habilitado&&(dentro||visible);
    if(dentro){for(const s of monitores)s.o.visible=true;for(const o of [marcos,leds,portafocos,focos])o.visible=true;if(halosFocos)halosFocos.visible=true;for(const o of revestimiento.children)o.visible=true;}
    if(video&&!dentro&&!visible&&!panelAbierto)video.pause();if(panelAbierto)ocultarMenuDetras();
    abrir.hidden=!habilitado||!cerca()||panelAbierto||!document.getElementById('menu')?.hidden;
    relojUI+=Math.max(0,Number.isFinite(dt)?dt:0);if(relojUI>=0.25){relojUI=0;refrescarUI();}
  }

  // -----------------------------------------------------------
  // 15. INICIALIZACION, API Y LIBERACION DE RECURSOS
  // -----------------------------------------------------------
  actualizarColorCancion(false); // No destellar al cargar la pagina.
  refrescarUI();
  return {
    actualizar,vincularControles(c){controles=c;},vincularOclusion(o){oclusion=o;},
    get activo(){return habilitado;},abrirPanel,cerrarPanel,
    get estadoFocos(){return {cancion:playlist[indice]?.titulo,color:colorBaseFocos.getHexString(),parpadeando:parpadeo.activo,brillo:parpadeo.brillo};},
    informe:{mueblesYLuminariasRetirados:eliminar.size,colisionesRetiradas,columnasRevestidas,pantallas:3,videoCompartido:true,puertaConMaterialOriginal:true,focosDecorativos:posicionesFocos.length,lucesDinamicasAdicionales:0,estilo:'Castillo oscuro, focos por cancion y dos pulsos suaves'},
    liberar(){
      if(destruido)return;destruido=true;liberarVideo();
      document.removeEventListener('keydown',tecla);document.removeEventListener('pointerlockchange',cambioPointerLock);document.removeEventListener('pointerlockerror',falloPointerLock);document.removeEventListener('visibilitychange',pausarOculto);
      abrir.remove();panelUI.remove();style.remove();pantallas.removeFromParent();revestimiento.removeFromParent();puerta.hoja.material=materialPuerta;
      portafocos.dispose();focos.dispose();
      for(const g of recursos.geometrias)g.dispose();for(const m of recursos.materiales)m.dispose();for(const t of recursos.texturas)t.dispose();
    }
  };
}