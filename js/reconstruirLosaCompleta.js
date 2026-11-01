import * as THREE from 'three';

// Ejecutar despues de corregirTechoYTerraza, ANTES de agrupar y cachear colisiones.
export function reconstruirLosaCompleta(castillo) {
  const cota=17.5,espesor=0.28,radio=4.08;
  const nombres=new Set([
    'Cornisa principal','Cubierta exterior oeste','Cubierta exterior este',
    'Cubierta exterior frontal','Cubierta exterior posterior','Salon superior oeste',
    'Salon superior este','Salon superior frente','Salon superior fondo',
    'Descanso tercer piso','Remate techo segundo piso','Umbral terraza'
  ]);
  const retirados=[];let materialOrigen=null;
  castillo.traverse(o=>{
    if(o.isMesh&&nombres.has(o.name)){
      retirados.push(o);
      if(!materialOrigen)materialOrigen=Array.isArray(o.material)?o.material[0]:o.material;
    }
  });
  if(!retirados.length)throw new Error('No se encuentran las piezas de tres pisos. Ejecuta este modulo despues de accesosTresPisos y techoYTerraza, antes de agruparEstructura.');
  const material=materialOrigen?.clone()||new THREE.MeshStandardMaterial({color:0xc9b992,roughness:0.9});
  material.side=THREE.DoubleSide;material.name='Losa continua pisos 2 y 3';
  for(const propiedad of ['map','bumpMap'])if(material[propiedad]) {
    material[propiedad]=material[propiedad].clone();material[propiedad].repeat.set(0.25,0.25);
    material[propiedad].offset.set(0,0);material[propiedad].needsUpdate=true;
  }
  for(const o of retirados){
    const lista=castillo.userData.colisiones;
    for(let i=lista.length-1;i>=0;i--)if(lista[i].mesh===o)lista.splice(i,1);
    o.removeFromParent();
  }
  const raiz=new THREE.Group();raiz.name='Losa continua segundo tercero';castillo.add(raiz);
  const circulo=[];
  for(let i=0;i<128;i++){const a=i*Math.PI*2/128;circulo.push(new THREE.Vector2(Math.cos(a)*radio,Math.sin(a)*radio));}
  function trazar(contorno) {
    const s=new THREE.Shape();s.moveTo(contorno[0].x,contorno[0].y);
    for(let i=1;i<contorno.length;i++)s.lineTo(contorno[i].x,contorno[i].y);
    s.closePath();return s;
  }
  // Coordenadas XY de la forma: Y se convierte en Z local al rotarla.
  // Centro del hueco en Z=-7; la cubierta abarca Z=-18..18 y X=-20..20.
  const forma=trazar([new THREE.Vector2(-20,-11),new THREE.Vector2(20,-11),new THREE.Vector2(20,25),new THREE.Vector2(-20,25)]);
  const hueco=new THREE.Path();
  const sentido=circulo.slice().reverse();hueco.moveTo(sentido[0].x,sentido[0].y);
  for(let i=1;i<sentido.length;i++)hueco.lineTo(sentido[i].x,sentido[i].y);
  hueco.closePath();forma.holes.push(hueco);
  function crearPieza(nombre,shape) {
    const g=new THREE.ExtrudeGeometry(shape,{depth:espesor,bevelEnabled:false,steps:1,curveSegments:1});
    g.rotateX(Math.PI/2);g.translate(0,cota,-7);g.computeBoundingSphere();g.computeBoundingBox();
    const o=new THREE.Mesh(g,material);o.name=nombre;o.castShadow=o.receiveShadow=true;raiz.add(o);return o;
  }
  crearPieza('Losa completa techo segundo piso',forma);
  // Un descanso recortado dentro del mismo hueco: no se superpone sobre la losa.
  function recortar(poligono,distancia) {
    const salida=[];
    for(let i=0;i<poligono.length;i++) {
      const a=poligono[i],b=poligono[(i+1)%poligono.length],da=distancia(a),db=distancia(b);
      if(da>=0)salida.push(a.clone());
      if((da>=0)!==(db>=0))salida.push(a.clone().lerp(b,da/(da-db)));
    }
    return salida;
  }
  let descanso=circulo.slice();
  for(const d of [p=>p.x-3,p=>0.9-p.y,p=>p.y+0.9])descanso=recortar(descanso,d);
  crearPieza('Descanso integrado tercer piso',trazar(descanso));
  const anterior=castillo.userData.alturaSuelo;
  castillo.userData.alturaSuelo=(x,z,pies)=>{
    const lx=x-castillo.position.x,lz=z-castillo.position.z;
    let y=anterior(x,z,pies);
    if(Math.abs(lx)>20||lz<-18||lz>18||pies-castillo.position.y+0.32<cota)return y;
    const enHueco=Math.hypot(lx,lz+7)<radio;
    const enDescanso=lx>=3&&Math.abs(lz+7)<=0.9;
    if(!enHueco||enDescanso)y=Math.max(y,cota+castillo.position.y);
    return y;
  };
  castillo.userData.losaCompleta={piezasRetiradas:retirados.map(o=>o.name),ancho:40,fondo:36,
    cotaLocal:cota,cotaMundo:cota+castillo.position.y,espesor,radioHueco:radio};
  return castillo.userData.losaCompleta;
}
