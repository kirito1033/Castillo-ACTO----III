import * as THREE from 'three';

// Tras crearAccesosTresPisos y antes de los gestores y la agrupacion.
export function corregirTechoYTerraza(castillo) {
  const obstaculos=castillo.userData.colisiones,puertas=castillo.userData.puertas;
  const pared=castillo.getObjectByName('Muro salon superior frente');
  if(!pared)throw new Error('Instala primero la actualizacion de escalera caracol y tres pisos.');
  const piedra=(Array.isArray(pared.material)?pared.material[0]:pared.material).clone();
  const moldura=piedra.clone();moldura.color.setHex(0xd5c5a1);
  const hierro=new THREE.MeshStandardMaterial({color:0x34352f,metalness:0.6,roughness:0.6});
  const madera=new THREE.MeshStandardMaterial({color:0x67412a,roughness:0.9});
  const dorado=new THREE.MeshStandardMaterial({color:0xcda758,metalness:0.55,roughness:0.5});
  const geo=new THREE.BoxGeometry(1,1,1),raiz=new THREE.Group();raiz.name='Techo reparado y terraza';castillo.add(raiz);
  function caja(nombre,x,y,z,w,h,d,material=piedra,colision=false) {
    const o=new THREE.Mesh(geo,material);o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;raiz.add(o);
    if(colision)obstaculos.push({mesh:o,w,h,d,esCaja:true});return o;
  }
  function quitar(o){for(let i=obstaculos.length-1;i>=0;i--)if(obstaculos[i].mesh===o)obstaculos.splice(i,1);o.removeFromParent();}
  // Sustituye la pared por dos paños y dintel: el vano queda realmente libre.
  quitar(pared);
  const anchoPuerta=2.6,altoPuerta=3.6,base=17.5,zPuerta=-1.1;
  for(const s of [-1,1])caja('Lateral puerta terraza',s*4.05,25.5,zPuerta,5.5,16,0.3,piedra,true);
  caja('Dintel puerta terraza',0,27.3,zPuerta,2.6,12.4,0.3,piedra,true);
  const marco=new THREE.Group();marco.position.set(0,base,zPuerta);raiz.add(marco);
  const pivote=new THREE.Group();pivote.position.x=-anchoPuerta/2;marco.add(pivote);
  const hoja=new THREE.Mesh(geo,madera);hoja.name='Puerta terraza';hoja.scale.set(anchoPuerta,altoPuerta,0.22);hoja.position.set(anchoPuerta/2,altoPuerta/2,0);pivote.add(hoja);
  obstaculos.push({mesh:hoja,w:anchoPuerta,h:altoPuerta,d:0.22,esCaja:true});
  for(const y of [0.55,3.05]){
    const b=new THREE.Mesh(geo,hierro);b.scale.set(2.45,0.14,0.28);b.position.set(1.3,y,0);pivote.add(b);
  }
  const manija=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,8),dorado);manija.position.set(2.35,1.65,0.2);pivote.add(manija);
  for(const x of [-1.43,1.43])caja('Marco acceso terraza',x,19.35,zPuerta,0.23,3.9,0.55,moldura);
  caja('Marco acceso terraza',0,21.25,zPuerta,3.1,0.25,0.55,moldura);
  puertas.push({nombre:'Acceso a la terraza',marco,pivote,hoja,ancho:2.6,alto:3.6,abierta:false,angulo:0});
  // Umbral solo en el espacio entre pisos, no otra losa encima de la cubierta.
  caja('Umbral terraza',0,17.38,-1.1,2.6,0.24,0.2,moldura);

  // Completa las esquinas del hueco cuadrado, conservando el paso circular.
  const vertices=[],uv=[];
  function tri(a,b,c){for(const v of [a,b,c]){vertices.push(...v);uv.push(v[0]/3,v[2]/3);}}
  function quad(a,b,c,d){tri(a,b,c);tri(a,c,d);}
  function punto(r,a,y){return [Math.cos(a)*r,y,-7+Math.sin(a)*r];}
  for(let i=0;i<96;i++) {
    const a=i*Math.PI*2/96,b=(i+1)*Math.PI*2/96;
    const r1=4.3/Math.max(Math.abs(Math.cos(a)),Math.abs(Math.sin(a)));
    const r2=4.3/Math.max(Math.abs(Math.cos(b)),Math.abs(Math.sin(b)));
    quad(punto(4.08,a,17.5),punto(4.08,b,17.5),punto(r2,b,17.5),punto(r1,a,17.5));
    quad(punto(r1,a,17.26),punto(r2,b,17.26),punto(4.08,b,17.26),punto(4.08,a,17.26));
    quad(punto(4.08,a,17.26),punto(4.08,b,17.26),punto(4.08,b,17.5),punto(4.08,a,17.5));
  }
  const tapaGeo=new THREE.BufferGeometry();tapaGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));tapaGeo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));tapaGeo.computeVertexNormals();
  const tapaMat=moldura.clone();tapaMat.side=THREE.DoubleSide;
  const tapa=new THREE.Mesh(tapaGeo,tapaMat);tapa.name='Remate techo segundo piso';tapa.castShadow=tapa.receiveShadow=true;raiz.add(tapa);
  // Caja de escalera circular; abertura este para ambos descansos.
  for(let i=0;i<64;i++) {
    const a=(i+0.5)*Math.PI*2/64;
    if(Math.abs(Math.atan2(Math.sin(a),Math.cos(a)))<0.34)continue;
    const o=caja('Cerramiento caja escalera',Math.cos(a)*4.22,15.65,-7+Math.sin(a)*4.22,0.43,11.3,0.12,piedra,true);
    o.rotation.y=Math.PI/2-a;
  }
  // Cierra el paño este entre las dos salidas, sin bloquear los descansos.
  caja('Paño entre descansos',4.22,15.55,-7,0.14,3.9,2.8,piedra,true);
  const cubiertaGeo=new THREE.CylinderGeometry(4.3,4.3,0.25,64);
  const cubierta=new THREE.Mesh(cubiertaGeo,moldura);cubierta.position.set(0,21.425,-7);cubierta.name='Cubierta caja escalera';cubierta.castShadow=cubierta.receiveShadow=true;raiz.add(cubierta);
  // Barandas de una terraza frontal de 9 por 5 unidades, antes del cuerpo decorativo.
  function baranda(x,z,w,d) {
    const barrera=caja('Colision baranda terraza',x,18.05,z,w,1.1,d,hierro,true);barrera.visible=false;
    caja('Pasamanos terraza',x,18.6,z,w,0.1,d,hierro);
    const largo=Math.max(w,d),n=Math.ceil(largo/0.75);
    for(let i=0;i<=n;i++)caja('Balaustre terraza',x+(w>d?-largo/2+i*largo/n:0),18.02,z+(d>w?-largo/2+i*largo/n:0),0.07,1.04,0.07,hierro);
  }
  baranda(0,4,9,0.16);baranda(-4.5,1.5,0.16,5);baranda(4.5,1.5,0.16,5);
  // Mantiene el piso existente a 17.5: no se agrega una superficie coplanar encima.
  const sueloAnterior=castillo.userData.alturaSuelo;
  castillo.userData.alturaSuelo=(x,z,pies)=>{
    const lx=x-castillo.position.x,lz=z-castillo.position.z,py=pies-castillo.position.y;
    let h=sueloAnterior(x,z,pies);
    const remate=Math.abs(lx)<=4.3&&Math.abs(lz+7)<=4.3&&Math.hypot(lx,lz+7)>=4.08;
    const umbral=Math.abs(lx)<=1.3&&lz>=-1.2&&lz<=-1;
    const terraza=Math.abs(lx)<=4.5&&lz>=-1&&lz<=4;
    if(py+0.32>=17.5&&(remate||umbral||terraza))h=Math.max(h,17.5+castillo.position.y);
    return h;
  };
  castillo.userData.terraza={puerta:'Acceso a la terraza',piso:17.5,ancho:9,fondo:5};
  return castillo.userData.terraza;
}
