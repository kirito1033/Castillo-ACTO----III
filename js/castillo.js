import * as THREE from 'three';

// Reemplazo para la version jugable: conserva su API de movimiento y puertas.
export function crearCastillo(escena) {
  const raiz=new THREE.Group();raiz.name='castillo-jugable';raiz.position.set(0,0,-22);escena.add(raiz);
  const obstaculos=[],superficies=[],puertas=[];
  const geoCaja=new THREE.BoxGeometry(1,1,1);
  const geometrias=new Set([geoCaja]),materiales=new Set(),texturas=new Set();
  const cache=new Map();
  let semilla=24;
  const azar=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla/4294967296;};

  // Texturas generadas localmente; no requieren imagenes ni descargas.
  function textura(tipo,relieve=false) {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
    const ctx=canvas.getContext('2d');
    if(tipo==='piedra'||tipo==='suelo'||tipo==='techo') {
      ctx.fillStyle=relieve?'#303030':(tipo==='techo'?'#49321e':'#49483f');ctx.fillRect(0,0,512,512);
      const filas=tipo==='techo'?12:8,alto=512/filas,ancho=tipo==='suelo'?128:128;
      for(let f=0;f<filas;f++) for(let col=-1;col<5;col++) {
        const x=col*ancho+(f%2)*ancho/2,y=f*alto;
        const v=Math.floor(azar()*28);
        ctx.fillStyle=relieve?`rgb(${170+v},${170+v},${170+v})`:
          tipo==='techo'?`rgb(${143+v},${82+v},${38+v})`:`rgb(${128+v},${126+v},${112+v})`;
        ctx.fillRect(x+3,y+3,ancho-6,alto-6);
        ctx.strokeStyle=relieve?'#dedede':'rgba(255,245,210,0.2)';
        ctx.beginPath();ctx.moveTo(x+5,y+alto-6);ctx.lineTo(x+5,y+5);ctx.lineTo(x+ancho-6,y+5);ctx.stroke();
      }
    } else if(tipo==='madera') {
      ctx.fillStyle=relieve?'#999':'#70462a';ctx.fillRect(0,0,512,512);
      for(let i=0;i<8;i++) {
        ctx.fillStyle=relieve?'#333':'#382719';ctx.fillRect(i*64,0,4,512);
        for(let j=0;j<28;j++) {
          ctx.strokeStyle=relieve?'#858585':`rgba(30,15,5,${0.1+azar()*0.22})`;
          const x=i*64+5+azar()*52;
          ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x+12,170,x-12,340,x,512);ctx.stroke();
        }
      }
    }
    if(!relieve) {
      const data=ctx.getImageData(0,0,512,512);
      for(let i=0;i<data.data.length;i+=4) {
        const n=(azar()-0.5)*14;
        for(let c=0;c<3;c++)data.data[i+c]=Math.max(0,Math.min(255,data.data[i+c]+n));
      }
      ctx.putImageData(data,0,0);
    }
    const t=new THREE.CanvasTexture(canvas);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;
    if(!relieve)t.colorSpace=THREE.SRGBColorSpace;
    texturas.add(t);return t;
  }
  const patrones={};
  for(const tipo of ['piedra','suelo','techo','madera'])patrones[tipo]={color:textura(tipo),bump:textura(tipo,true)};
  const tonos={piedra:0xc0c3b4,moldura:0xe3d6b4,suelo:0xddd0b4,techo:0xffffff,
    madera:0xffffff,oscuro:0x16211e,turquesa:0x16cdb6,alfombra:0x60372f,oro:0xc7a653,
    libro:0x3c625d,cama:0x6b546d,hierro:0x323a39};
  function mat(tipo,u=1,v=1) {
    u=Math.max(0.1,Math.round(u*10)/10);v=Math.max(0.1,Math.round(v*10)/10);
    const key=`${tipo}:${u}:${v}`;if(cache.has(key))return cache.get(key);
    const m=new THREE.MeshStandardMaterial({color:tonos[tipo]??0xffffff,roughness:tipo==='oro'?0.4:0.91,metalness:tipo==='oro'?0.55:tipo==='hierro'?0.5:0});
    const patron=patrones[tipo==='moldura'?'piedra':tipo];
    if(patron) {
      m.map=patron.color.clone();m.bumpMap=patron.bump.clone();
      for(const t of [m.map,m.bumpMap]){t.repeat.set(u,v);t.needsUpdate=true;texturas.add(t);}
      m.bumpScale=tipo==='madera'?0.035:0.055;
    }
    if(tipo==='turquesa'){m.emissive.setHex(0x16cdb6);m.emissiveIntensity=0.7;}
    materiales.add(m);cache.set(key,m);return m;
  }
  function caja(nombre,x,y,z,w,h,d,tipo='piedra',solido=false) {
    // Un material por orientacion: mantiene el tamaño de la textura al escalar.
    const materialesCaja=[mat(tipo,d/4,h/4),mat(tipo,d/4,h/4),mat(tipo,w/4,d/4),mat(tipo,w/4,d/4),mat(tipo,w/4,h/4),mat(tipo,w/4,h/4)];
    const o=new THREE.Mesh(geoCaja,materialesCaja);o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);
    o.castShadow=o.receiveShadow=true;raiz.add(o);
    if(solido)obstaculos.push({mesh:o,w,h,d,esCaja:true});return o;
  }
  function forma(nombre,geo,tipo,x,y,z) {
    geometrias.add(geo);const o=new THREE.Mesh(geo,mat(tipo,2,3));
    o.name=nombre;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;raiz.add(o);return o;
  }
  function piso(nombre,x,z,w,d,y,tipo='suelo') {
    caja(nombre,x,y-0.15,z,w,0.3,d,tipo);
    superficies.push({x1:x-w/2,x2:x+w/2,z1:z-d/2,z2:z+d/2,y});
  }
  const muro=(nombre,x,y,z,w,h,d)=>caja(nombre,x,y,z,w,h,d,'piedra',true);
  function puerta(nombre,x,z,base,rot=0,ancho=2.6,alto=3.6) {
    const marco=new THREE.Group();marco.position.set(x,base,z);marco.rotation.y=rot;raiz.add(marco);
    const pivote=new THREE.Group();pivote.position.x=-ancho/2;marco.add(pivote);
    const hoja=caja(nombre,ancho/2,alto/2,0,ancho,alto,0.22,'madera');
    pivote.add(hoja);
    obstaculos.push({mesh:hoja,w:ancho,h:alto,d:0.22,esCaja:true});
    for(const y of [0.55,alto-0.55]) {
      const banda=new THREE.Mesh(geoCaja,mat('hierro'));banda.scale.set(ancho-0.15,0.16,0.29);
      banda.position.set(ancho/2,y,0);pivote.add(banda);
    }
    const manija=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,8),mat('oro'));geometrias.add(manija.geometry);
    manija.position.set(ancho-0.23,alto*0.47,0.22);pivote.add(manija);
    for(const dx of [-ancho/2-0.12,ancho/2+0.12]) {
      const p=new THREE.Mesh(geoCaja,mat('moldura',0.2,1));p.scale.set(0.22,alto+0.2,0.5);p.position.set(dx,alto/2,0);marco.add(p);
    }
    const dintel=new THREE.Mesh(geoCaja,mat('moldura'));dintel.scale.set(ancho+0.5,0.25,0.5);dintel.position.y=alto+0.12;marco.add(dintel);
    puertas.push({nombre,marco,pivote,hoja,ancho,alto,abierta:false,angulo:0});
  }
  function paredConPuerta(nombre,x,z,largo,base,alto,eje='x') {
    const vano=2.6,h=3.6,trozo=(largo-vano)/2;
    for(const s of [-1,1])muro(nombre,x+(eje==='x'?s*(vano/2+trozo/2):0),base+alto/2,z+(eje==='z'?s*(vano/2+trozo/2):0),eje==='x'?trozo:0.65,alto,eje==='x'?0.65:trozo);
    muro('Dintel',x,base+h+(alto-h)/2,z,eje==='x'?vano:0.65,alto-h,eje==='x'?0.65:vano);
    puerta(nombre,x,z,base,eje==='x'?0:Math.PI/2);
  }
  function ventana(x,y,z,rot=0) {
    const grupo=new THREE.Group();grupo.position.set(x,y,z);grupo.rotation.y=rot;raiz.add(grupo);
    for(const [w,h,d,tipo] of [[1.1,2.3,0.12,'moldura'],[0.8,2,0.15,'turquesa']]) {
      const o=new THREE.Mesh(geoCaja,mat(tipo));o.scale.set(w,h,d);grupo.add(o);
    }
    const cruz=new THREE.Mesh(geoCaja,mat('hierro'));cruz.scale.set(0.05,2,0.18);grupo.add(cruz);
  }
  function almenas(x,z,largo,eje,y) {
    const n=Math.ceil(largo/1.3);
    for(let i=0;i<=n;i++){const t=-largo/2+i*largo/n;caja('Almena',x+(eje==='x'?t:0),y+0.4,z+(eje==='z'?t:0),0.65,0.85,0.65);}
  }
  function torre(x,z,r,base,alto,conica=true) {
    forma('Torre',new THREE.CylinderGeometry(r,r,alto,24),'piedra',x,base+alto/2,z);
    forma('Cornisa',new THREE.CylinderGeometry(r*1.12,r*1.12,0.4,24),'moldura',x,base+alto,z);
    if(conica)forma('Tejado ocre',new THREE.ConeGeometry(r*1.3,r*3,24),'techo',x,base+alto+r*1.5,z);
    else for(let i=0;i<12;i++){const a=i*Math.PI/6;caja('Almena',x+Math.cos(a)*r,base+alto+0.5,z+Math.sin(a)*r,0.6,1,0.6);}
    const bloque=new THREE.Object3D();bloque.position.set(x,base+alto/2,z);raiz.add(bloque);
    obstaculos.push({mesh:bloque,w:r*2,h:alto,d:r*2,esCaja:false});
    for(let y=base+2;y<base+alto-1;y+=4)ventana(x,y,z+r+0.04);
  }
  function escalera(nombre,x,inicio,ancho,n,huella,base,alto) {
    for(let i=0;i<n;i++){
      const y=base+(i+1)*alto,z=inicio-(i+0.5)*huella;
      caja(nombre,x,(base+y)/2,z,ancho,y-base,huella,'moldura');
      superficies.push({x1:x-ancho/2,x2:x+ancho/2,z1:z-huella/2,z2:z+huella/2,y});
    }
  }

  piso('Patio',0,30,48,28,0.03);
  muro('Muralla oeste',-24,2.2,30,0.8,4.4,28);muro('Muralla este',24,2.2,30,0.8,4.4,28);
  // Vano real en la gran muralla: no hay un muro oculto detras de la puerta.
  paredConPuerta('Salida de la gran muralla',0,44,48,0.03,4.4,'x');
  piso('Umbral de salida',0,44,4,3,0.03,'moldura');
  piso('Sendero exterior',0,58,4,25,0.025,'suelo');
  muro('Cierre frontal izquierdo',-16,2.2,16,16,4.4,0.8);
  muro('Cierre frontal derecho',16,2.2,16,16,4.4,0.8);
  almenas(-24,30,28,'z',4.4);almenas(24,30,28,'z',4.4);almenas(0,44,48,'x',4.43);
  for(const x of [-24,24])torre(x,44,1.6,0,6,false);
  // Refuerzos del porton, fuera del vano.
  for(const x of [-2.1,2.1])caja('Pilar del porton',x,2.4,44,0.8,4.8,1.1,'moldura',true);
  piso('Camino entrada',0,23,7,14,0.05,'moldura');
  escalera('Escalera exterior',0,28,6,12,0.8,0,0.25);
  piso('Descanso entrada',0,17.8,7,1.6,3,'moldura');
  for(const x of [-3.6,3.6])muro('Pretil de acceso',x,2.3,23,0.45,1.2,10);

  // Zocalo macizo: elimina la franja de cielo y cesped bajo las fachadas.
  muro('Cimentacion continua',0,1.5,0,40,3,36);
  for(const x of [-11.75,11.75]) {
    muro('Relleno lateral de acceso',x,1.5,18.4,16.5,3,1.6);
    caja('Remate del zocalo',x,2.9,18.45,16.6,0.2,1.7,'moldura');
  }
  piso('Planta baja',0,0,40,36,3);
  paredConPuerta('Entrada principal',0,18,40,3,14,'x');
  muro('Muro posterior',0,10,-18,40,14,0.8);
  muro('Muro oeste',-20,10,0,0.8,14,36);muro('Muro este',20,10,0,0.8,14,36);
  caja('Cornisa principal',0,17.1,0,41,0.4,37,'moldura');
  almenas(0,18,40,'x',17.3);almenas(0,-18,40,'x',17.3);
  almenas(-20,0,36,'z',17.3);almenas(20,0,36,'z',17.3);
  for(const base of [3,10])for(const lado of [-1,1]) {
    paredConPuerta(base===3?(lado<0?'Biblioteca':'Comedor'):(lado<0?'Dormitorio oeste':'Dormitorio este'),lado*7,8,20,base,7,'z');
    paredConPuerta(base===3?(lado<0?'Armeria':'Sala del consejo'):(lado<0?'Estudio':'Sala de mapas'),lado*7,-10,16,base,7,'z');
    muro('Division de habitaciones',lado*13.5,base+3.5,-2,13,7,0.6);
  }
  piso('Planta alta oeste',-13.5,0,13,36,10);piso('Planta alta este',13.5,0,13,36,10);
  piso('Galeria frontal',0,13,14,10,10);piso('Galeria posterior',0,-16,14,4,10);
  escalera('Escalera interior',0,0,5,28,0.5,3,0.25);
  for(const lado of [-1,1]){
    muro('Baranda lateral',lado*6.8,10.65,-3,0.24,1.3,22);
    muro('Baranda frontal',lado*4.7,10.65,8,4.4,1.3,0.24);
  }
  for(const x of [-4.8,4.8])muro('Baranda descanso',x,10.65,-14,4.4,1.3,0.24);
  caja('Alfombra vestibulo',0,3.015,9,5,0.025,12,'alfombra');
  for(const base of [3,10]) {
    for(const x of [-19.5,19.5])for(const z of [-12,0,12])ventana(x,base+3,z,Math.PI/2);
    for(const x of [-15,-10,10,15])ventana(x,base+3,18.46);
    for(const x of [-17,17]){
      caja('Mesa',x,base+0.9,-9,3.6,1.8,2,'madera',true);
      caja('Armario',x,base+1.7,-16,3,3.4,0.9,'madera',true);
    }
  }
  for(let i=0;i<4;i++) {
    caja('Estanteria',-18.9,4.7,2+i*3.8,1,3.4,2.8,'madera',true);
    for(let j=0;j<5;j++)caja('Libros',-18.3,4+j*0.45,2+i*3.8,0.15,0.28,2.4,'libro');
  }
  caja('Mesa comedor',14,4,8,4,2,7,'madera',true);
  for(const x of [-14,14]){
    caja('Cama',x,10.65,9,3,1.3,5,'cama',true);
    caja('Cabecera',x,11.2,6.5,3,2.4,0.35,'madera',true);
  }
  for(const [x,z,r,b,h] of [[-20,17,2.1,0,23],[20,17,2.1,0,21],[-20,-16,1.9,0,28],[20,-16,1.9,0,25],[-7,-7,1.3,17.4,18],[7,-6,1.2,17.4,14],[-4,-11,1,27,18]])torre(x,z,r,b,h);
  caja('Torre central superior',0,24,-7,9,13,9,'piedra',true);
  caja('Cornisa torre',0,30.6,-7,9.5,0.4,9.5,'moldura');
  forma('Tejado central',new THREE.ConeGeometry(7.1,7,4),'techo',0,34.3,-7).rotation.y=Math.PI/4;
  for(const x of [-2,2])ventana(x,26,-2.42);
  for(const [x,z] of [[0,8],[-13,8],[13,8],[-13,-10],[13,-10]])for(const y of [7,14]) {
    const luz=new THREE.PointLight(0xffdca8,45,20,2);luz.position.set(x,y,z);raiz.add(luz);
  }
  const local=new THREE.Vector3(),centro=new THREE.Vector3();
  const rejilla=new Map(),moviles=[];
  let listaColisiones=null;
  function actualizarFicha(f) {
    f.o.mesh.updateWorldMatrix(true,false);
    f.inversa.copy(f.o.mesh.matrixWorld).invert();
    const o=f.o;
    f.caja.set(new THREE.Vector3(o.esCaja?-0.5:-o.w/2,o.esCaja?-0.5:-o.h/2,o.esCaja?-0.5:-o.d/2),
      new THREE.Vector3(o.esCaja?0.5:o.w/2,o.esCaja?0.5:o.h/2,o.esCaja?0.5:o.d/2)).applyMatrix4(o.mesh.matrixWorld);
  }
  function prepararColisiones() {
    raiz.updateMatrixWorld(true);rejilla.clear();moviles.length=0;
    const hojas=new Set(puertas.map(p=>p.hoja));
    listaColisiones=obstaculos.map(o=>({o,inversa:new THREE.Matrix4(),caja:new THREE.Box3()}));
    for(const f of listaColisiones) {
      actualizarFicha(f);
      if(hojas.has(f.o.mesh)){moviles.push(f);continue;}
      const b=f.caja;
      for(let x=Math.floor((b.min.x-0.7)/8);x<=Math.floor((b.max.x+0.7)/8);x++)
        for(let z=Math.floor((b.min.z-0.7)/8);z<=Math.floor((b.max.z+0.7)/8);z++){
          const k=x+','+z;if(!rejilla.has(k))rejilla.set(k,[]);rejilla.get(k).push(f);
        }
    }
    for(const p of puertas)p.fichaColision=moviles.find(f=>f.o.mesh===p.hoja);
  }
  function toca(f,x,z,pies,altura,radio) {
    const b=f.caja;
    if(x<b.min.x-radio||x>b.max.x+radio||z<b.min.z-radio||z>b.max.z+radio||pies>=b.max.y-0.06||pies+altura<=b.min.y+0.06)return false;
    centro.set(x,pies+altura/2,z);local.copy(centro).applyMatrix4(f.inversa);
    const o=f.o,lx=local.x*(o.esCaja?o.w:1),ly=local.y*(o.esCaja?o.h:1),lz=local.z*(o.esCaja?o.d:1);
    return Math.abs(ly)<o.h/2+altura/2-0.06&&Math.abs(lx)<o.w/2+radio&&Math.abs(lz)<o.d/2+radio;
  }
  function bloqueado(x,z,pies,altura=1.7,radio=0.32) {
    if(!listaColisiones)prepararColisiones();
    for(const f of rejilla.get(Math.floor(x/8)+','+Math.floor(z/8))||[])if(toca(f,x,z,pies,altura,radio))return true;
    for(const f of moviles)if(toca(f,x,z,pies,altura,radio))return true;
    return false;
  }
  function alturaSuelo(x,z,pies) {
    x-=raiz.position.x;z-=raiz.position.z;let y=0;
    for(const s of superficies)if(x>=s.x1-0.001&&x<=s.x2+0.001&&z>=s.z1-0.001&&z<=s.z2+0.001&&s.y<=pies+0.32)y=Math.max(y,s.y);
    return y;
  }
  function puertaCercana(camara) {
    const direccion=new THREE.Vector3();camara.getWorldDirection(direccion);
    let elegida=null,distancia=3.3;
    for(const p of puertas) {
      const vector=p.marco.localToWorld(new THREE.Vector3(0,1.6,0)).sub(camara.position),d=vector.length();
      if(d<distancia&&vector.normalize().dot(direccion)>0.35){elegida=p;distancia=d;}
    }
    return elegida;
  }
  function actualizar(dt,camara,pies) {
    if(!listaColisiones)prepararColisiones();
    for(const p of puertas) {
      const objetivo=p.abierta?-Math.PI*0.52:0;
      if(Math.abs(p.angulo-objetivo)<0.0001)continue;
      const previo=p.angulo;
      p.angulo=THREE.MathUtils.damp(previo,objetivo,9,dt);
      if(Math.abs(p.angulo-objetivo)<0.0001)p.angulo=objetivo;
      p.pivote.rotation.y=p.angulo;p.pivote.updateWorldMatrix(true,true);
      actualizarFicha(p.fichaColision);
      if(toca(p.fichaColision,camara.position.x,camara.position.z,pies,1.7,0.32)) {
        p.angulo=previo;p.pivote.rotation.y=previo;p.pivote.updateWorldMatrix(true,true);actualizarFicha(p.fichaColision);
      }
    }
  }
  Object.assign(raiz.userData,{bloqueado,alturaSuelo,actualizar,puertaCercana,prepararColisiones,
    interactuar(camara){const p=puertaCercana(camara);if(p)p.abierta=!p.abierta;},
    puertas,grupos:{exterior:raiz},colisiones:obstaculos,
    liberar(){raiz.removeFromParent();for(const g of geometrias)g.dispose();for(const m of materiales)m.dispose();for(const t of texturas)t.dispose();}
  });
  return raiz;
}
