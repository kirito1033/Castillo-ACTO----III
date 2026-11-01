import * as THREE from 'three';

export function crearEntornoMontana(escena,camara,castillo) {
  const elevacion=6.04;
  // Meseta suficientemente amplia para edificio, escalera y patio existentes.
  function altura(x,z) {
    const distancia=Math.max(Math.abs(x)-27,Math.abs(z+9)-34,0);
    return 0.04+6*(1-THREE.MathUtils.smoothstep(distancia,0,28));
  }
  const terrenoGeo=new THREE.PlaneGeometry(116,132,116,132);
  terrenoGeo.rotateX(-Math.PI/2);terrenoGeo.translate(0,0,-9);
  const p=terrenoGeo.attributes.position,colores=[];
  const verde=new THREE.Color(),bajo=new THREE.Color(0x628148),alto=new THREE.Color(0x64734b);
  for(let i=0;i<p.count;i++) {
    const x=p.getX(i),z=p.getZ(i),y=altura(x,z);p.setY(i,y);
    verde.copy(bajo).lerp(alto,y/elevacion);
    verde.multiplyScalar(0.94+0.06*Math.sin(x*0.8)*Math.cos(z*0.7));
    colores.push(verde.r,verde.g,verde.b);
  }
  terrenoGeo.setAttribute('color',new THREE.Float32BufferAttribute(colores,3));terrenoGeo.computeVertexNormals();
  const terrenoMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1});
  const terreno=new THREE.Mesh(terrenoGeo,terrenoMat);terreno.name='Colina transitable';terreno.receiveShadow=true;escena.add(terreno);
  castillo.position.y+=elevacion;castillo.updateMatrixWorld(true);
  camara.position.y+=elevacion;
  // El antiguo sendero era plano. Se sustituye por uno ajustado a la pendiente.
  castillo.traverse(o=>{if(o.name==='Sendero exterior')o.visible=false;});
  const caminoGeo=new THREE.PlaneGeometry(4,36,1,72);caminoGeo.rotateX(-Math.PI/2);caminoGeo.translate(0,0,43);
  const cp=caminoGeo.attributes.position;
  for(let i=0;i<cp.count;i++)cp.setY(i,altura(cp.getX(i),cp.getZ(i))+0.035);
  caminoGeo.computeVertexNormals();
  const caminoMat=new THREE.MeshStandardMaterial({color:0xb1a181,roughness:1});
  const camino=new THREE.Mesh(caminoGeo,caminoMat);camino.name='Sendero en pendiente';camino.receiveShadow=true;escena.add(camino);
  const sueloAnterior=castillo.userData.alturaSuelo;
  const bloqueoAnterior=castillo.userData.bloqueado;

  let semilla=81;
  const azar=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla/4294967296;};
  const celdas=new Map(),colisionesArbol=new Map();
  const celda=18;
  const clave=(x,z)=>`${Math.floor(x/celda)},${Math.floor(z/celda)}`;
  const geos={tronco:new THREE.CylinderGeometry(0.18,0.27,1,7),
    copa:new THREE.ConeGeometry(1,1,8),arbusto:new THREE.IcosahedronGeometry(1,0),
    roca:new THREE.IcosahedronGeometry(1,0)};
  const mats={tronco:new THREE.MeshStandardMaterial({color:0x65472e,roughness:1}),
    copa:new THREE.MeshStandardMaterial({color:0x315f37,roughness:1}),
    arbusto:new THREE.MeshStandardMaterial({color:0x58733e,roughness:1}),
    roca:new THREE.MeshStandardMaterial({color:0x7c7c6c,roughness:1})};
  function colocar(tipo,x,z,escala,rotacion=0) {
    const k=clave(x,z);
    if(!celdas.has(k))celdas.set(k,{tronco:[],copa:[],arbusto:[],roca:[]});
    celdas.get(k)[tipo].push({x,y:altura(x,z),z,escala,rotacion});
  }
  let arboles=0;
  for(let intento=0;intento<2200&&arboles<240;intento++) {
    const x=(azar()-0.5)*152,z=(azar()-0.5)*152;
    // Sin vegetacion en el castillo/patio ni en la ruta de salida.
    if((Math.abs(x)<29&&z>-45&&z<27)||(Math.abs(x)<5&&z>18))continue;
    const s=0.8+azar()*0.7,r=azar()*Math.PI*2;
    colocar('tronco',x,z,s,r);colocar('copa',x,z,s,r);
    const k=clave(x,z);if(!colisionesArbol.has(k))colisionesArbol.set(k,[]);
    colisionesArbol.get(k).push({x,z,r:0.27*s});arboles++;
  }
  for(let i=0;i<220;i++) {
    const x=(azar()-0.5)*154,z=(azar()-0.5)*154;
    if((Math.abs(x)<29&&z>-45&&z<27)||(Math.abs(x)<5&&z>18))continue;
    colocar(i%3===0?'roca':'arbusto',x,z,0.35+azar()*0.7,azar()*Math.PI*2);
  }
  const sectores=[],dummy=new THREE.Object3D();
  for(const [k,contenido] of celdas)for(const tipo of Object.keys(geos)) {
    const items=contenido[tipo];if(!items.length)continue;
    const m=new THREE.InstancedMesh(geos[tipo],mats[tipo],items.length);
    m.name=`Vegetacion ${k} ${tipo}`;
    items.forEach((item,i)=>{
      const s=item.escala;let alto,ancho,profundidad,centro;
      if(tipo==='tronco'){alto=3*s;ancho=profundidad=s;centro=alto/2;}
      else if(tipo==='copa'){alto=5*s;ancho=profundidad=2*s;centro=3*s+alto/2-0.7*s;}
      else{alto=(tipo==='roca'?0.6:0.85)*s;ancho=1.1*s;profundidad=s;centro=alto*0.65;}
      dummy.position.set(item.x,item.y+centro,item.z);
      dummy.rotation.set(0,item.rotacion,0);dummy.scale.set(ancho,alto,profundidad);dummy.updateMatrix();
      m.setMatrixAt(i,dummy.matrix);
    });
    m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();m.computeBoundingBox();
    m.frustumCulled=true;
    // Sin sombras de vegetacion: coste menor y sin sombras que desaparezcan al descartarla.
    m.castShadow=false;m.receiveShadow=true;escena.add(m);sectores.push(m);
  }
  castillo.userData.alturaSuelo=(x,z,pies)=>{
    const terrenoY=altura(x,z);
    const lx=x-castillo.position.x,lz=z-castillo.position.z;
    const enMeseta=Math.abs(lx)<=27&&lz>=-21&&lz<=47;
    if(!enMeseta)return terrenoY;
    const local=sueloAnterior(x,z,pies-elevacion);
    return Math.max(terrenoY,local>0?local+elevacion:terrenoY);
  };
  castillo.userData.bloqueado=(x,z,pies,alto=1.7,radio=0.32)=>{
    if(bloqueoAnterior(x,z,pies,alto,radio))return true;
    const cx=Math.floor(x/celda),cz=Math.floor(z/celda);
    for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
      for(const t of colisionesArbol.get(`${cx+dx},${cz+dz}`)||[])
        if(Math.hypot(x-t.x,z-t.z)<t.r+radio)return true;
    return false;
  };
  const ajustes={distanciaVegetacion:105};
  const stats={arboles,sectores:sectores.length,sectoresEnDistancia:0};
  function actualizar() {
    stats.sectoresEnDistancia=0;
    for(const s of sectores) {
      const b=s.boundingSphere;
      s.visible=b.center.distanceTo(camara.position)-b.radius<ajustes.distanciaVegetacion;
      // El descarte por vista lo hace Three.js por sector en el pase de render.
      if(s.visible)stats.sectoresEnDistancia++;
    }
  }
  return {actualizar,altura,ajustes,estadisticas:stats};
}
