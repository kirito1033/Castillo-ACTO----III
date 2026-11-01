import * as THREE from 'three';

// Tras reconstruirLosaCompleta, antes de luces dinamicas, portales y agrupacion.
export function abrirPasoExteriorTercerPiso(castillo) {
  const cuerpo=castillo.getObjectByName('Cuerpo frontal superior');
  if(!cuerpo)throw new Error('No se encuentra el cuerpo frontal de la ampliacion superior.');
  const colisiones=castillo.userData.colisiones,puertas=castillo.userData.puertas;
  const basePiedra=Array.isArray(cuerpo.material)?cuerpo.material:[cuerpo.material];
  const raiz=new THREE.Group();raiz.name='Pabellon frontal transitable';castillo.add(raiz);
  const geo=new THREE.BoxGeometry(1,1,1);
  const hierro=new THREE.MeshStandardMaterial({color:0x34382f,roughness:0.7,metalness:0.55});
  const madera=new THREE.MeshStandardMaterial({color:0x6e472a,roughness:0.9});
  const dorado=new THREE.MeshStandardMaterial({color:0xc7a05a,metalness:0.6,roughness:0.45});
  const llama=new THREE.MeshStandardMaterial({color:0xffdb82,emissive:0xff9f39,emissiveIntensity:2});
  function quitar(o){for(let i=colisiones.length-1;i>=0;i--)if(colisiones[i].mesh===o)colisiones.splice(i,1);o.removeFromParent();}
  quitar(cuerpo);
  function materiales(w,h,d) {
    return [[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]].map(([u,v],i)=>{
      const m=basePiedra[i%basePiedra.length].clone();
      for(const key of ['map','bumpMap'])if(m[key]){m[key]=m[key].clone();m[key].repeat.set(Math.max(0.15,u/4),Math.max(0.15,v/4));m[key].needsUpdate=true;}
      return m;
    });
  }
  function caja(nombre,x,y,z,w,h,d,mat=null,colision=false) {
    const o=new THREE.Mesh(geo,mat||materiales(w,h,d));o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;raiz.add(o);
    if(colision)colisiones.push({mesh:o,w,h,d,esCaja:true});return o;
  }
  // Retira la baranda que cortaba el camino delante de la casa.
  castillo.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(castillo.matrixWorld).invert(),p=new THREE.Vector3(),retirar=[];
  castillo.traverse(o=>{
    if(o===raiz)return;
    o.getWorldPosition(p).applyMatrix4(inv);
    if(o.isMesh&&['Colision baranda terraza','Pasamanos terraza','Balaustre terraza'].includes(o.name)&&Math.abs(p.z-4)<0.04)retirar.push(o);
    if(o.isMesh&&o.name==='Pilastra frontal superior'&&Math.abs(p.x)<1.4)retirar.push(o);
    // Una ventana decorativa del bloque anterior coincidia con el nuevo vano.
    if(o.isGroup&&o.children.length===3&&Math.abs(p.x)<1.6&&p.z>11&&p.z<11.4&&p.y>17.5&&p.y<21.3)retirar.push(o);
  });
  for(const o of new Set(retirar))quitar(o);
  const nivel=17.5;
  // Misma cubierta y cornisas exteriores: ahora el cuerpo es una envolvente hueca.
  caja('Pared pabellon oeste',-10.85,21,8,0.3,7,6,null,true);
  caja('Pared pabellon este',10.85,21,8,0.3,7,6,null,true);
  function paredConPuerta(z,nombre) {
    for(const s of [-1,1])caja('Pared '+nombre,s*6.15,21,z,9.7,7,0.3,null,true);
    caja('Dintel '+nombre,0,22.8,z,2.6,3.4,0.3,null,true);
    const marco=new THREE.Group();marco.position.set(0,nivel,z);raiz.add(marco);
    const pivote=new THREE.Group();pivote.position.x=-1.3;marco.add(pivote);
    const hoja=new THREE.Mesh(geo,madera);hoja.scale.set(2.6,3.6,0.22);hoja.position.set(1.3,1.8,0);hoja.name=nombre;pivote.add(hoja);
    colisiones.push({mesh:hoja,w:2.6,h:3.6,d:0.22,esCaja:true});
    for(const y of [0.5,3.1]){const b=new THREE.Mesh(geo,hierro);b.scale.set(2.45,0.14,0.28);b.position.set(1.3,y,0);pivote.add(b);}
    const pomo=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,8),dorado);pomo.position.set(2.34,1.65,0.23);pivote.add(pomo);
    for(const x of [-1.43,1.43])caja('Marco '+nombre,x,19.35,z,0.23,3.9,0.5,null,false);
    caja('Marco superior '+nombre,0,21.25,z,3.1,0.25,0.5);
    puertas.push({nombre,marco,pivote,hoja,ancho:2.6,alto:3.6,abierta:false,angulo:0});
  }
  paredConPuerta(5,'Entrada pabellon frontal');
  paredConPuerta(11,'Salida pabellon frontal');
  function baranda(x,z,w,d) {
    const b=caja('Colision baranda pabellon',x,18.05,z,w,1.1,d,hierro,true);b.visible=false;
    caja('Pasamanos pabellon',x,18.6,z,w,0.1,d,hierro);
    const l=Math.max(w,d),n=Math.ceil(l/0.8);
    for(let i=0;i<=n;i++)caja('Balaustre pabellon',x+(w>d?-l/2+i*l/n:0),18.02,z+(d>w?-l/2+i*l/n:0),0.07,1.04,0.07,hierro);
  }
  // Paso central abierto en la antigua baranda; conserva proteccion a ambos lados.
  baranda(-3,4,3,0.16);baranda(3,4,3,0.16);
  baranda(-1.6,4.5,0.12,1);baranda(1.6,4.5,0.12,1);
  // Balcon exterior despues de atravesar el pabellon, sobre la losa existente.
  baranda(0,17.3,21,0.16);baranda(-10.5,14.15,0.16,6.3);baranda(10.5,14.15,0.16,6.3);
  // No agrega otro plano coplanar: reutiliza la losa continua del piso 3.
  const sueloAnterior=castillo.userData.alturaSuelo;
  castillo.userData.alturaSuelo=(x,z,pies)=>{
    let h=sueloAnterior(x,z,pies);
    const lx=x-castillo.position.x,lz=z-castillo.position.z;
    if(Math.abs(lx)<=10.7&&lz>=4&&lz<=17.4&&pies-castillo.position.y+0.32>=nivel)h=Math.max(h,nivel+castillo.position.y);
    return h;
  };
  // Luminarias visibles, capturadas por el pool existente de luces interiores.
  for(const z of [6,10]) {
    for(const x of [-2,2]){
      caja('Soporte antorcha pabellon',x,20,z,0.12,0.8,0.12,madera);
      const f=new THREE.Mesh(new THREE.ConeGeometry(0.14,0.4,6),llama);f.position.set(x,20.55,z);raiz.add(f);
    }
    const l=new THREE.PointLight(0xffc878,110,15,2);l.position.set(0,20.8,z);raiz.add(l);
  }
  return {entradaZ:5,salidaZ:11,piso:nivel,balconHastaZ:17.3};
}
