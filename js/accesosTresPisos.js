import * as THREE from 'three';

// Aplicar despues de elevar el castillo, antes de gestores, agrupacion y colisiones.
export function crearAccesosTresPisos(castillo) {
  const lista=castillo.userData.colisiones;
  const suelos=[],quitar=new Set();
  const viejo=castillo.getObjectByName('Torre central superior');
  const piedra=(Array.isArray(viejo?.material)?viejo.material[0]:viejo?.material)?.clone()||new THREE.MeshStandardMaterial({color:0x8c8d7b});
  const moldura=piedra.clone();moldura.color.setHex(0xd7c7a2);
  const hierro=new THREE.MeshStandardMaterial({color:0x342f26,roughness:0.7,metalness:0.5});
  const oro=new THREE.MeshStandardMaterial({color:0xba8e45,metalness:0.55,roughness:0.5});
  const llama=new THREE.MeshStandardMaterial({color:0xffda81,emissive:0xff8b2b,emissiveIntensity:2.2});
  const madera=new THREE.MeshStandardMaterial({color:0x69462d,roughness:0.9});
  const geoCaja=new THREE.BoxGeometry(1,1,1);
  const raiz=new THREE.Group();raiz.name='Accesos tres pisos';castillo.add(raiz);
  const eliminarNombre=/^(Escalera interior|Baranda|Baranda lateral|Baranda galeria|Baranda frontal|Baranda descanso|Cornisa principal|Galeria frontal|Galeria posterior)$/;
  castillo.traverse(o=>{if(o.isMesh&&(eliminarNombre.test(o.name)||o===viejo))quitar.add(o);});
  // Son volumenes retirados, no solo mallas ocultas con colisiones activas.
  for(let i=lista.length-1;i>=0;i--)if(quitar.has(lista[i].mesh))lista.splice(i,1);
  for(const o of quitar)o.removeFromParent();
  function caja(nombre,x,y,z,w,h,d,mat=piedra,solido=false) {
    const o=new THREE.Mesh(geoCaja,mat);o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);
    o.castShadow=o.receiveShadow=true;raiz.add(o);
    if(solido)lista.push({mesh:o,w,h,d,esCaja:true});return o;
  }
  function piso(nombre,x,z,w,d,y) {
    caja(nombre,x,y-0.12,z,w,0.24,d,moldura);
    suelos.push({x1:x-w/2,x2:x+w/2,z1:z-d/2,z2:z+d/2,y});
  }
  function baranda(x,z,w,d,y) {
    const o=caja('Baranda nueva',x,y+0.52,z,w,1.04,d,hierro,true);
    // El volumen de colision es continuo; la malla usa listones, no un muro opaco.
    o.visible=false;
    const largo=Math.max(w,d),n=Math.ceil(largo/0.8);
    for(let i=0;i<=n;i++)caja('Balaustre',x+(w>d?-largo/2+i*largo/n:0),y+0.48,z+(d>w?-largo/2+i*largo/n:0),0.07,0.96,0.07,hierro);
    caja('Pasamanos',x,y+1,z,w,0.09,d,hierro);
  }
  // Planta segunda: corredor continuo hasta las cuatro puertas, sin barreras frente a ellas.
  piso('Galeria central oeste',-5.65,-0.0,2.7,36,10);
  piso('Galeria central este',5.65,0,2.7,36,10);
  piso('Galeria central frontal',0,7.65,8.6,20.7,10);
  piso('Galeria central posterior',0,-14.65,8.6,6.7,10);
  piso('Descanso segundo piso',3.65,-7,1.3,1.8,10);
  // El bloque superior se vacia y se reconstruye como envolvente.
  caja('Muro salon superior oeste',-6.9,25.5,-7,0.3,16,12,piedra,true);
  caja('Muro salon superior este',6.9,25.5,-7,0.3,16,12,piedra,true);
  caja('Muro salon superior frente',0,25.5,-1.1,13.6,16,0.3,piedra,true);
  caja('Muro salon superior fondo',0,25.5,-12.9,13.6,16,0.3,piedra,true);
  piso('Salon superior oeste',-5.5,-7,2.4,11.6,17.5);
  piso('Salon superior este',5.5,-7,2.4,11.6,17.5);
  piso('Salon superior frente',0,-1.95,8.6,1.5,17.5);
  piso('Salon superior fondo',0,-12.05,8.6,1.5,17.5);
  piso('Descanso tercer piso',3.65,-7,1.3,1.8,17.5);
  // Tercera planta: sala accesible por la escalera, no un bloque macizo.
  caja('Mesa del salon superior',0,18.1,-12.15,2.8,1.2,0.8,madera,true).userData.habitacion='Salon superior';
  for(const y of [10,17.5]) {
    baranda(-4.3,-7,0.12,8.6,y);
    baranda(0,-11.3,8.6,0.12,y);baranda(0,-2.7,8.6,0.12,y);
    baranda(4.3,-9.6,0.12,3.4,y);baranda(4.3,-4.4,0.12,3.4,y);
  }
  // Una vuelta completa por planta: 28 y 30 peldaños de 0.25 unidades.
  const tramos=[{base:3,n:28},{base:10,n:30}],dosPi=Math.PI*2;
  const geometriaPeldaños=new THREE.BufferGeometry(),pos=[],uv=[];
  function tri(a,b,c){for(const p of [a,b,c]){pos.push(...p);uv.push(p[0]/2,p[2]/2);}}
  function quad(a,b,c,d){tri(a,b,c);tri(a,c,d);}
  function punto(r,a,y){return [Math.cos(a)*r,y,-7+Math.sin(a)*r];}
  for(const t of tramos)for(let i=0;i<t.n;i++) {
    const a=i*dosPi/t.n,b=(i+1)*dosPi/t.n,y=t.base+(i+1)*0.25;
    for(let j=0;j<3;j++) {
      const a1=a+(b-a)*j/3,a2=a+(b-a)*(j+1)/3;
      const p=punto(1.6,a1,y),q=punto(4,a1,y),r=punto(4,a2,y),s=punto(1.6,a2,y);
      quad(p,s,r,q);quad(punto(1.6,a1,y-0.2),punto(4,a1,y-0.2),punto(4,a2,y-0.2),punto(1.6,a2,y-0.2));
      quad(q,r,punto(4,a2,y-0.2),punto(4,a1,y-0.2));
    }
    quad(punto(1.6,a,y),punto(4,a,y),punto(4,a,y-0.2),punto(1.6,a,y-0.2));
    quad(punto(4,b,y),punto(1.6,b,y),punto(1.6,b,y-0.2),punto(4,b,y-0.2));
    if(i>1&&i<t.n-2&&i%2===0) {
      const ang=(a+b)/2;
      caja('Poste caracol',Math.cos(ang)*3.96,y+0.5,-7+Math.sin(ang)*3.96,0.06,1,0.06,hierro);
      const rail=caja('Barra caracol',Math.cos(ang)*3.96,y+1,-7+Math.sin(ang)*3.96,0.07,0.07,(b-a)*3.96*2,hierro);
      rail.rotation.y=-ang;
    }
  }
  geometriaPeldaños.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geometriaPeldaños.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometriaPeldaños.computeVertexNormals();
  const matPeldaños=moldura.clone();matPeldaños.side=THREE.DoubleSide;
  const escalera=new THREE.Mesh(geometriaPeldaños,matPeldaños);escalera.name='Caracol transitable';escalera.castShadow=escalera.receiveShadow=true;raiz.add(escalera);
  caja('Nucleo escalera',0,10.3,-7,1.8,14.6,1.8,moldura,true);

  // Portal monumental sin estrechar el vano existente.
  for(const x of [-1.85,1.85]){
    caja('Columna entrada',x,5,18.65,0.5,4,0.65,moldura,true);
    caja('Capitel entrada',x,7.05,18.65,0.8,0.25,0.85,moldura);
  }
  const arcoPos=[];
  for(let i=0;i<20;i++) {
    const a=i*Math.PI/20,b=(i+1)*Math.PI/20;
    const p=(r,t)=>[Math.cos(t)*r,7.1+Math.sin(t)*r,18.75];
    for(const v of [p(1.65,a),p(2,a),p(2,b),p(1.65,a),p(2,b),p(1.65,b)])arcoPos.push(...v);
  }
  const ag=new THREE.BufferGeometry();ag.setAttribute('position',new THREE.Float32BufferAttribute(arcoPos,3));ag.computeVertexNormals();
  const am=moldura.clone();am.side=THREE.DoubleSide;const arco=new THREE.Mesh(ag,am);arco.name='Arco de entrada';raiz.add(arco);

  // Retira fuentes invisibles originales: las nuevas pertenecen a luminarias visibles.
  const lucesAntiguas=[];castillo.traverse(o=>{if(o.isPointLight)lucesAntiguas.push(o);});for(const l of lucesAntiguas)l.removeFromParent();
  function fuente(x,y,z,potencia=110) {
    const l=new THREE.PointLight(0xffc475,potencia,20,2);l.position.set(x,y,z);l.name='Fuente luminaria';raiz.add(l);
  }
  function antorcha(x,y,z,rot=0) {
    const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot;raiz.add(g);
    const palo=new THREE.Mesh(geoCaja,madera);palo.scale.set(0.12,0.85,0.12);g.add(palo);
    const soporte=new THREE.Mesh(geoCaja,hierro);soporte.scale.set(0.35,0.12,0.45);soporte.position.y=-0.25;g.add(soporte);
    const fuego=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.48,6),llama);fuego.position.y=0.57;g.add(fuego);
    fuente(x,y+0.55,z);
  }
  function candelabro(x,y,z) {
    caja('Cadena candelabro',x,y+0.7,z,0.05,1.4,0.05,hierro);
    caja('Brazo candelabro',x,y,z,2.5,0.12,0.12,oro);
    caja('Brazo candelabro',x,y,z,0.12,0.12,2.5,oro);
    for(const [dx,dz] of [[-1.1,0],[1.1,0],[0,-1.1],[0,1.1]]){
      caja('Vela',x+dx,y+0.2,z+dz,0.12,0.4,0.12,moldura);
      const f=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.27,6),llama);f.position.set(x+dx,y+0.51,z+dz);raiz.add(f);
    }
    fuente(x,y+0.4,z,150);
  }
  for(const base of [3,10]) {
    for(const x of [-6.4,6.4])antorcha(x,base+2.7,3,Math.PI/2);
    for(const x of [-13.5,13.5])for(const z of [7,-10])candelabro(x,base+3.8,z);
  }
  antorcha(-2.6,5.2,18.7);antorcha(2.6,5.2,18.7);
  candelabro(0,7.4,10);candelabro(0,22,-7);
  antorcha(-6.4,20,-5,Math.PI/2);antorcha(6.4,20,-5,Math.PI/2);

  const sueloAnterior=castillo.userData.alturaSuelo,bloqueoAnterior=castillo.userData.bloqueado;
  castillo.userData.alturaSuelo=(x,z,pies)=>{
    const lx=x-castillo.position.x,lz=z-castillo.position.z,py=pies-castillo.position.y;
    // Sustituye tambien el soporte invisible de la escalera vieja.
    if(Math.abs(lx)>19.6||lz<-17.6||lz>17.6)return sueloAnterior(x,z,pies);
    let mejor=3;
    const enHueco=Math.abs(lx)<4.3&&lz>-11.3&&lz<-2.7;
    if(py+0.32>=10&&!enHueco)mejor=10;
    for(const s of suelos)if(lx>=s.x1&&lx<=s.x2&&lz>=s.z1&&lz<=s.z2&&s.y<=py+0.32)mejor=Math.max(mejor,s.y);
    const r=Math.hypot(lx,lz+7);
    if(r>=1.6&&r<=4.0) {
      const a=((Math.atan2(lz+7,lx)%dosPi)+dosPi)%dosPi;
      for(const t of tramos) {
        const i=Math.min(t.n-1,Math.floor(a/dosPi*t.n));
        const h=t.base+(i+1)*0.25;
        if(h<=py+0.32)mejor=Math.max(mejor,h);
      }
    }
    return mejor+castillo.position.y;
  };
  castillo.userData.bloqueado=(x,z,pies,h=1.7,r=0.32)=>{
    const lx=x-castillo.position.x,lz=z-castillo.position.z+7,py=pies-castillo.position.y;
    const radio=Math.hypot(lx,lz),angulo=Math.abs(Math.atan2(lz,lx));
    // Borde exterior de la espiral, con apertura en los descansos del lado este.
    if(py>3.25&&py<17.4&&radio>3.72&&radio<4.4&&angulo>0.35)return true;
    return bloqueoAnterior(x,z,pies,h,r);
  };
  castillo.userData.accesosTresPisos={pisos:[3,10,17.5],peldaños:58,centro:{x:0,z:-7},entradaEscalera:{x:3.1,z:-7}};
  return castillo.userData.accesosTresPisos;
}
