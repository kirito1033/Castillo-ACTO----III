import * as THREE from 'three';

// Ampliacion visual para el castillo con texturas, antes de crear los gestores.
export function ampliarParteSuperior(castillo) {
  if(castillo.userData.ampliacionSuperior)return;
  const torre=castillo.getObjectByName('Torre central superior');
  if(!torre)throw new Error('La ampliacion requiere el castillo.js con texturas de esta conversacion.');
  const recursos={geometrias:[],materiales:[],texturas:[]};
  const geo=new THREE.BoxGeometry(1,1,1);recursos.geometrias.push(geo);
  const basePiedra=Array.isArray(torre.material)?torre.material:[torre.material];
  const cornisaOriginal=castillo.getObjectByName('Cornisa torre');
  const tejadoOriginal=castillo.getObjectByName('Tejado central');
  const baseMoldura=cornisaOriginal?(Array.isArray(cornisaOriginal.material)?cornisaOriginal.material:[cornisaOriginal.material]):basePiedra;
  const baseTecho=tejadoOriginal?.material??basePiedra[0];
  function materialConRepeticion(original,u,v) {
    const m=original.clone();recursos.materiales.push(m);
    for(const propiedad of ['map','bumpMap'])if(m[propiedad]) {
      m[propiedad]=m[propiedad].clone();m[propiedad].repeat.set(Math.max(0.15,u),Math.max(0.15,v));
      m[propiedad].needsUpdate=true;recursos.texturas.push(m[propiedad]);
    }
    return m;
  }
  function materialesCaja(base,w,h,d) {
    return [[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]].map(([u,v],i)=>materialConRepeticion(base[i%base.length],u/4,v/4));
  }
  const raiz=new THREE.Group();raiz.name='Ampliacion superior';castillo.add(raiz);
  function caja(nombre,x,y,z,w,h,d,base=basePiedra) {
    const o=new THREE.Mesh(geo,materialesCaja(base,w,h,d));o.name=nombre;
    o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;raiz.add(o);return o;
  }
  function techoDosAguas(x,z,y,w,d,alto) {
    // Cumbrera longitudinal en Z; triangulos con orientacion exterior explicita.
    const a=[x-w/2,y,z-d/2],b=[x+w/2,y,z-d/2],c=[x+w/2,y,z+d/2],e=[x-w/2,y,z+d/2];
    const p=[x,y+alto,z-d/2],q=[x,y+alto,z+d/2],vertices=[];
    const tri=(a,b,c)=>vertices.push(...a,...b,...c);
    tri(a,e,q);tri(a,q,p);tri(b,p,q);tri(b,q,c);tri(a,p,b);tri(e,c,q);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    const uv=[];for(let i=0;i<vertices.length;i+=3)uv.push(vertices[i]/4,vertices[i+2]/4+vertices[i+1]/4);
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();recursos.geometrias.push(g);
    const m=materialConRepeticion(baseTecho,1,1);m.side=THREE.DoubleSide;
    const o=new THREE.Mesh(g,m);o.name='Tejado de ala superior';o.castShadow=o.receiveShadow=true;raiz.add(o);
  }
  const ventanasMat=new THREE.MeshStandardMaterial({color:0x8adccc,emissive:0x16cdb6,emissiveIntensity:0.7,roughness:0.4});
  recursos.materiales.push(ventanasMat);
  function ventana(x,y,z,rot=0) {
    const grupo=new THREE.Group();grupo.position.set(x,y,z);grupo.rotation.y=rot;raiz.add(grupo);
    const marco=new THREE.Mesh(geo,materialesCaja(baseMoldura,0.9,1.9,0.16));marco.scale.set(0.9,1.9,0.16);grupo.add(marco);
    const cristal=new THREE.Mesh(geo,ventanasMat);cristal.scale.set(0.61,1.57,0.2);grupo.add(cristal);
    // Se modelan en el plano frontal; la barra no coincide en profundidad con el cristal.
    const barra=new THREE.Mesh(geo,materialesCaja(baseMoldura,0.07,1.6,0.23));barra.scale.set(0.07,1.6,0.23);grupo.add(barra);
  }
  function ala(nombre,x,z,w,d,h) {
    const base=17.5,cima=base+h;
    caja(nombre,x,base+h/2,z,w,h,d);
    caja('Cornisa '+nombre,x,cima+0.05,z,w+0.35,0.3,d+0.35,baseMoldura);
    techoDosAguas(x,z,cima+0.23,w+0.7,d+0.7,Math.min(4.5,w*0.5));
    for(const y of [base+2.3,base+5.7]) {
      if(y>cima-1)continue;
      for(let dx=-w/2+1.4;dx<w/2-0.7;dx+=2.3)ventana(x+dx,y,z+d/2+0.1);
    }
    for(const lado of [-1,1])for(let dz=-d/2+2;dz<d/2-1;dz+=3)
      ventana(x+lado*(w/2+0.1),base+3.5,z+dz,Math.PI/2);
  }
  // Torre principal mas ancha y alta, conservando su base sobre la cubierta.
  torre.scale.set(14,16,12);torre.position.set(0,25.5,-7);
  if(Array.isArray(torre.material))torre.material=materialesCaja(basePiedra,14,16,12);
  if(cornisaOriginal){cornisaOriginal.scale.set(14.7,0.4,12.7);cornisaOriginal.position.set(0,33.7,-7);}
  if(tejadoOriginal){tejadoOriginal.scale.set(1.52,1.4,1.4);tejadoOriginal.position.set(0,38.8,-7);}
  // Alas conectadas al bloque central y al cuerpo delantero.
  ala('Ala superior oeste',-10.5,-2,8,16,9);
  ala('Ala superior este',10.5,-2,8,16,9);
  ala('Cuerpo frontal superior',0,8,22,6,7);
  ala('Cuerpo posterior superior',0,-14,25,5,8);
  for(const y of [21.5,26.5,30.7])for(const x of [-4.5,0,4.5])ventana(x,y,-0.88);
  // Detalles de fachada y chimeneas, sin duplicar pisos sobre la cubierta.
  for(const x of [-8,8])caja('Chimenea superior',x,31,-5,0.8,3,0.9);
  for(const x of [-9,-4.5,0,4.5,9])caja('Pilastra frontal superior',x,21,11.15,0.28,6.7,0.25,baseMoldura);
  const informe={alas:4,torreCentral:{ancho:14,fondo:12,altura:16},transitable:false};
  castillo.userData.ampliacionSuperior=informe;
  // Se libera junto con los recursos originales si se llama userData.liberar().
  const liberarAnterior=castillo.userData.liberar;
  castillo.userData.liberar=()=>{
    for(const g of recursos.geometrias)g.dispose();for(const m of recursos.materiales)m.dispose();for(const t of recursos.texturas)t.dispose();
    liberarAnterior?.();
  };
  return informe;
}
