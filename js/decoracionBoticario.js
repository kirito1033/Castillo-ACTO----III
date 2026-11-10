import * as THREE from 'three';

// Decoracion calculada una vez antes de cachear colisiones/fusionar estructura.
export function decorarBoticario(castillo, grupo, recursos) {
  if(grupo.userData.decorado)return;
  grupo.userData.decorado=true;
  let semilla=629;
  const azar=()=>{semilla=(Math.imul(1664525,semilla)+1013904223)>>>0;return semilla/4294967296;};
  function textura(tipo){
    const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
    if(tipo==='madera'){
      g.fillStyle='#6d5740';g.fillRect(0,0,256,256);
      for(let tabla=0;tabla<4;tabla++){
        const v=Math.floor(azar()*18);g.fillStyle=`rgb(${90+v},${68+v},${44+v})`;g.fillRect(tabla*64+1,0,62,256);
        for(let j=0;j<28;j++){const x=tabla*64+3+azar()*58;g.strokeStyle=`rgba(32,21,10,${.1+azar()*.18})`;g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+7,85,x-7,170,x,256);g.stroke();}
      }
    }else{
      g.fillStyle=tipo==='verde'?'#6f8170':'#c4bea3';g.fillRect(0,0,256,256);const image=g.getImageData(0,0,256,256);
      for(let i=0;i<image.data.length;i+=4){const ruido=(azar()-.5)*12;for(let j=0;j<3;j++)image.data[i+j]+=ruido;}g.putImageData(image,0,0);
    }
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;recursos.t.add(t);return t;
  }
  function mat(color,map=null){const m=new THREE.MeshBasicMaterial({color,map,toneMapped:false});recursos.m.add(m);return m;}
  const madera=mat(0xffffff,textura('madera')),verde=mat(0xffffff,textura('verde')),crema=mat(0xffffff,textura('crema'));
  const dorado=mat(0xbba371),hojas=mat(0x68856b),botella=mat(0xffffff),corcho=mat(0x8d7653);
  const originales=grupo.children.filter(o=>o.isMesh&&!o.isInstancedMesh);
  for(const o of originales){
    let material=null;
    if(/Suelo|Mueble herbario|Estante|Balda|Separador/.test(o.name))material=madera;
    else if(/Mural boticario fondo|Entrada boticario/.test(o.name))material=verde;
    else if(/Mural boticario sur|Mural boticario norte|Dintel boticario/.test(o.name))material=crema;
    if(!material||o.geometry.type!=='BoxGeometry')continue;
    if(o.name==='Estante botanico'){
      // Convertir el bloque macizo en un fondo delgado para que se vean los estantes.
      o.position.x=-19.28;o.scale.x=.08;
      for(const c of castillo.userData.colisiones)if(c.mesh===o)c.w=.08;
    }
    const g=o.geometry.clone(),uv=g.attributes.uv,w=o.scale.x,h=o.scale.y,d=o.scale.z;
    const caras=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
    for(let i=0;i<uv.count;i++){const[u,v]=caras[Math.floor(i/4)];uv.setXY(i,uv.getX(i)*u/3,uv.getY(i)*v/3);}
    g.clearGroups();recursos.g.add(g);o.geometry=g;o.material=material;
  }
  const cube=new THREE.BoxGeometry(1,1,1),unidad=cube.toNonIndexed();recursos.g.add(cube);
  function lote(nombre,items,material){
    const pos=[],p=new THREE.Vector3(),m=new THREE.Matrix4();
    for(const[x,y,z,w,h,d]of items){m.makeScale(w,h,d);m.setPosition(x,y,z);for(let i=0;i<unidad.attributes.position.count;i++){p.fromBufferAttribute(unidad.attributes.position,i).applyMatrix4(m);pos.push(p.x,p.y,p.z);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeBoundingSphere();recursos.g.add(g);
    const o=new THREE.Mesh(g,material);o.name=nombre;o.userData.habitacion='Armeria';grupo.add(o);
  }
  const molduras=[];
  for(const y of[3.2,4.3,9.48])molduras.push([-19.45,y,-10,.035,.06,15.0],[-13.45,y,-17.5,12,.06,.035],[-13.45,y,-2.5,12,.06,.035]);
  for(const z of[-15.1,-10,-4.9])molduras.push([-18.29,4.9,z,.045,2.8,.045]);
  lote('Molduras boticario mejorado',molduras,dorado);
  lote('Remates estantes boticario',[4.6,5.8,6.35].map(y=>[-18.31,y,-10,.025,.035,10.5]),hojas);unidad.dispose();

  // Frascos ornamentales sin recetas ni identificacion medicinal.
  const posiciones=[];for(const y of[4.86,6.06])for(const z of[-14.4,-12.7,-10.8,-8.7,-6.2])posiciones.push([-18.55,y,z]);
  const cuerpoGeo=new THREE.CylinderGeometry(.13,.15,.34,8),tapaGeo=new THREE.CylinderGeometry(.09,.09,.08,8);recursos.g.add(cuerpoGeo);recursos.g.add(tapaGeo);
  const frascos=new THREE.InstancedMesh(cuerpoGeo,botella,posiciones.length),tapas=new THREE.InstancedMesh(tapaGeo,corcho,posiciones.length),aux=new THREE.Object3D();
  const colores=[0x617c6a,0xa78b58,0x8b9c7c,0x798b8d];
  posiciones.forEach(([x,y,z],i)=>{aux.position.set(x,y,z);aux.updateMatrix();frascos.setMatrixAt(i,aux.matrix);frascos.setColorAt(i,new THREE.Color(colores[i%colores.length]));aux.position.y=y+.21;aux.updateMatrix();tapas.setMatrixAt(i,aux.matrix);});
  for(const o of[frascos,tapas]){o.instanceMatrix.needsUpdate=true;if(o.instanceColor)o.instanceColor.needsUpdate=true;o.computeBoundingBox();o.computeBoundingSphere();o.userData.habitacion='Armeria';grupo.add(o);}
  const liberarAnterior=grupo.userData.liberarDecoracion;
  grupo.userData.liberarDecoracion=()=>{frascos.dispose();tapas.dispose();liberarAnterior?.();};

  // Laminas botanicas genericas, no fotos inventadas de especies de la API.
  for(const [i,x]of[-15.5,-11.6].entries()){
    const c=document.createElement('canvas');c.width=384;c.height=512;const g=c.getContext('2d');g.fillStyle='#d8cfb4';g.fillRect(0,0,384,512);g.strokeStyle='#8c8664';g.lineWidth=3;g.strokeRect(15,15,354,482);
    g.strokeStyle='#47694f';g.lineWidth=6;g.beginPath();g.moveTo(192,430);g.quadraticCurveTo(i?150:230,270,192,95);g.stroke();
    for(let j=0;j<6;j++){const y=140+j*45;g.fillStyle=j%2?'#688063':'#7e916c';g.beginPath();g.ellipse(192+(j%2?37:-37),y,47,17,j%2?-.55:.55,0,Math.PI*2);g.fill();}
    g.fillStyle='#4c5b43';g.textAlign='center';g.font='23px Georgia';g.fillText(i?'APRENDER':'OBSERVAR',192,475);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;recursos.t.add(t);const geo=new THREE.PlaneGeometry(1.9,2.5);recursos.g.add(geo);
    const o=new THREE.Mesh(geo,mat(0xffffff,t));o.name='Lamina botanica decorativa';o.position.set(x,7.3,-2.47);o.rotation.y=Math.PI;o.userData.habitacion='Armeria';grupo.add(o);
  }
}
