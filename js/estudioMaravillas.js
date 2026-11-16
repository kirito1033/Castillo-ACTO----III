import * as THREE from 'three';

export const MELODIA_ESTUDIO = Object.freeze([60,64,67,72,71,67,64,62,65,69,72,76,74,72,69,67]);
export const MENSAJE_ESTUDIO = 'Gracias por entrar en este pequeño mundo.\nQue la curiosidad te siga abriendo puertas y que siempre encuentres belleza en las cosas sencillas.';

export function crearEstudioMaravillas(escena,camara,castillo,elemento,opciones={}){
  if(castillo.userData.estudioMaravillas)return castillo.userData.estudioMaravillas;
  const ROOM='Estudio',raiz=new THREE.Group();raiz.name='Estudio de las pequeñas maravillas';castillo.add(raiz);
  const geometrias=new Set(),materiales=new Set(),texturas=new Set(),propios=[],ocultos=[],retirados=[];
  const colisiones=castillo.userData.colisiones,geoCaja=new THREE.BoxGeometry(1,1,1),geoEsfera=new THREE.SphereGeometry(1,18,12);geometrias.add(geoCaja);geometrias.add(geoEsfera);
  const marcar=o=>{Object.assign(o.userData,{habitacion:ROOM,noAgrupar:true,dinamico:true});return o;};marcar(raiz);
  function material(color,extra={}){const m=new THREE.MeshStandardMaterial({color,roughness:.84,...extra});materiales.add(m);return m;}
  const nogal=material('#392b25'),moldura=material('#6d4d36'),oro=material('#c9a665',{metalness:.58,roughness:.38}),verde=material('#284c4c'),crema=material('#e2d4b5'),terciopelo=material('#704451');
  function caja(nombre,x,y,z,w,h,d,mat,padre=raiz,solido=false){const o=marcar(new THREE.Mesh(geoCaja,mat));o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;padre.add(o);if(solido&&Array.isArray(colisiones)){const r={mesh:o,w,h,d,esCaja:true};colisiones.push(r);propios.push(r);}return o;}
  function esfera(nombre,x,y,z,sx,sy,sz,mat,padre=raiz){const o=marcar(new THREE.Mesh(geoEsfera,mat));o.name=nombre;o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=o.receiveShadow=true;padre.add(o);return o;}
  function cilindro(x,y,z,r,h,mat,padre=raiz,rt=r){const g=new THREE.CylinderGeometry(rt,r,h,20);geometrias.add(g);const o=marcar(new THREE.Mesh(g,mat));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;padre.add(o);return o;}
  function varilla(a,b,r,mat,padre=raiz){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),dir=vb.clone().sub(va);const g=new THREE.CylinderGeometry(r,r,dir.length(),10);geometrias.add(g);const o=marcar(new THREE.Mesh(g,mat));o.position.copy(va.add(vb).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());o.castShadow=o.receiveShadow=true;padre.add(o);return o;}
  function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function tex(c){const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;texturas.add(t);return t;}
  function plano(c,w,h,x,y,z,ry=0,padre=raiz){const g=new THREE.PlaneGeometry(w,h);geometrias.add(g);const m=new THREE.MeshBasicMaterial({map:tex(c),toneMapped:false});materiales.add(m);const o=marcar(new THREE.Mesh(g,m));o.position.set(x,y,z);o.rotation.y=ry;padre.add(o);return o;}
  let semilla=713492;const azar=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla/4294967296;};
  castillo.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(castillo.matrixWorld).invert(),bb=new THREE.Box3(),zona=new THREE.Box3(new THREE.Vector3(-19.7,9.99,-17.8),new THREE.Vector3(-7.35,16.95,-2.32));
  castillo.traverse(o=>{if(!o.isMesh||!/^(Mesa|Armario)(\s|$)/i.test(o.name))return;bb.setFromObject(o).applyMatrix4(inv);if(zona.containsBox(bb))ocultos.push({objeto:o,visible:o.visible});});ocultos.forEach(r=>r.objeto.visible=false);
  if(Array.isArray(colisiones)){const quitar=new Set(ocultos.map(r=>r.objeto));for(let i=colisiones.length-1;i>=0;i--)if(quitar.has(colisiones[i].mesh))retirados.push({indice:i,valor:colisiones.splice(i,1)[0]});}
  // Revestimientos locales y vano del este libre.
  caja('Estudio · Pared oeste',-19.585,13.5,-10,.018,6.96,15.2,verde);
  for(const z of [-17.585,-2.315])caja('Estudio · Pared transversal',-13.5,13.5,z,12.25,6.96,.018,verde);
  for(const z of [-14.5,-5.5])caja('Estudio · Pared de acceso',-7.335,13.5,z,.018,6.96,6.34,verde);
  caja('Estudio · Dintel',-7.335,15.3,-10,.018,3.36,2.66,verde);
  const matPiso=material('#84654a');caja('Estudio · Piso de nogal',-13.5,10.05,-9.98,12.22,.012,15.22,matPiso);
  const pisoC=canvas(512,512),pc=pisoC.getContext('2d');pc.fillStyle='#856649';pc.fillRect(0,0,512,512);
  for(let i=0;i<8;i++){pc.fillStyle=i%2?'#896b50':'#795b43';pc.fillRect(0,i*64,512,64);pc.strokeStyle='#392b2666';pc.strokeRect(0,i*64,512,64);for(let j=0;j<5;j++){pc.beginPath();pc.moveTo(0,i*64+10+j*9);pc.bezierCurveTo(170,i*64+4+j*9,340,i*64+16+j*9,512,i*64+8+j*9);pc.stroke();}}
  const mapaPiso=tex(pisoC);mapaPiso.wrapS=mapaPiso.wrapT=THREE.RepeatWrapping;mapaPiso.repeat.set(3,4);matPiso.map=mapaPiso;matPiso.color.set('#ffffff');
  for(const z of [-17.48,-2.43]){caja('Estudio · Zócalo',-13.5,10.66,z,12.1,1.12,.12,nogal);caja('Estudio · Pasamanos dorado',-13.5,11.25,z,12.1,.045,.16,oro);caja('Estudio · Cornisa',-13.5,16.30,z,12.1,.18,.17,moldura);}
  caja('Estudio · Zócalo oeste',-19.48,10.66,-10,.12,1.12,15.0,nogal);caja('Estudio · Borde oeste',-19.45,11.25,-10,.15,.045,15,oro);
  const techo=canvas(768,1024),tc=techo.getContext('2d');tc.fillStyle='#233b3d';tc.fillRect(0,0,768,1024);
  for(let a=0;a<3;a++)for(let b=0;b<4;b++){const x=a*256,y=b*256;tc.fillStyle='#2a4444';tc.fillRect(x+18,y+18,220,220);tc.strokeStyle='#997d4f';tc.lineWidth=3;tc.strokeRect(x+28,y+28,200,200);tc.strokeStyle='#b79861';tc.lineWidth=1;tc.strokeRect(x+36,y+36,184,184);tc.fillStyle='#ba9a64';tc.beginPath();tc.arc(x+128,y+128,7,0,Math.PI*2);tc.fill();}
  const artesonado=plano(techo,12.1,15.1,-13.5,16.55,-10);artesonado.rotation.x=Math.PI/2;
  const alf=canvas(512,512),ac=alf.getContext('2d');ac.fillStyle='#603e4b';ac.fillRect(0,0,512,512);for(const d of [12,23,40]){ac.strokeStyle=d===23?'#b99a64':'#977960';ac.lineWidth=3;ac.strokeRect(d,d,512-2*d,512-2*d);}ac.strokeStyle='#c7aa76';ac.lineWidth=2;ac.beginPath();ac.moveTo(256,130);ac.lineTo(350,256);ac.lineTo(256,382);ac.lineTo(162,256);ac.closePath();ac.stroke();
  const alfombra=plano(alf,8.4,10.3,-13.5,10.071,-9.2);alfombra.rotation.x=-Math.PI/2;
  // Libreros con volúmenes agrupados por material.
  const coloresLibro=['#6b4354','#42646b','#8b744e','#6d6384','#8b574a'].map(c=>material(c));const libros=[];
  function librero(x){
    caja('Estudio · Fondo del librero',x,12.24,-17.15,3.55,4.25,.62,nogal,raiz,true);
    for(const dx of [-1.79,1.79])caja('Estudio · Columna tallada',x+dx,12.27,-16.77,.15,4.42,.22,moldura);
    for(let f=0;f<5;f++){
      const y=10.35+f*.79;caja('Estudio · Repisa',x,y,-16.76,3.72,.11,.91,moldura);
      for(let dx=-1.58;dx<1.60;){const w=.12+azar()*.15,h=.43+azar()*.20;libros.push({x:x+dx+w/2,y:y+.055+h/2,z:-16.78,w,h,d:.42,mat:coloresLibro[Math.floor(azar()*coloresLibro.length)]});dx+=w+.028;}
    }
    caja('Estudio · Cornisa de librero',x,14.55,-17,3.92,.20,.98,oro);
  }
  librero(-17.3);librero(-9.7);
  const lotes=new Map();for(const l of libros){if(!lotes.has(l.mat))lotes.set(l.mat,[]);lotes.get(l.mat).push(l);}
  for(const [mat,lista] of lotes){const lote=marcar(new THREE.InstancedMesh(geoCaja,mat,lista.length));lote.name='Estudio · Libros agrupados';const d=new THREE.Object3D();lista.forEach((l,i)=>{d.position.set(l.x,l.y,l.z);d.scale.set(l.w,l.h,l.d);d.updateMatrix();lote.setMatrixAt(i,d.matrix);});lote.instanceMatrix.needsUpdate=true;lote.computeBoundingSphere();lote.castShadow=lote.receiveShadow=true;raiz.add(lote);}
  // Reloj alto: caja hueca, esfera, agujas y péndulo.
  const relojAlto=new THREE.Group();relojAlto.position.set(-13.5,10.09,-17.13);raiz.add(relojAlto);
  caja('Estudio · Fondo del reloj',0,2.2,-.23,1.30,4.4,.12,nogal,relojAlto);
  for(const x of [-.62,.62])caja('Estudio · Columna del reloj',x,2.2,.02,.14,4.4,.65,moldura,relojAlto);
  caja('Estudio · Base del reloj',0,.15,.02,1.48,.30,.85,moldura,relojAlto);caja('Estudio · Corona del reloj',0,4.47,.02,1.48,.24,.85,oro,relojAlto);
  const dial=canvas(512,512),dc=dial.getContext('2d');dc.fillStyle='#e6d8b8';dc.fillRect(0,0,512,512);dc.strokeStyle='#8e744a';dc.lineWidth=7;dc.beginPath();dc.arc(256,256,235,0,Math.PI*2);dc.stroke();dc.fillStyle='#4d4438';dc.textAlign='center';dc.textBaseline='middle';dc.font='32px Georgia';const romanos=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2;dc.fillText(romanos[i],256+Math.cos(a)*184,256+Math.sin(a)*184);}
  const gDial=new THREE.CircleGeometry(.53,48);geometrias.add(gDial);const mDial=new THREE.MeshBasicMaterial({map:tex(dial),toneMapped:false});materiales.add(mDial);const caraReloj=marcar(new THREE.Mesh(gDial,mDial));caraReloj.position.set(0,3.83,.38);relojAlto.add(caraReloj);
  const agujas=[];for(const [h,w] of [[.28,.032],[.39,.023],[.43,.010]]){const p=new THREE.Group();p.position.set(0,3.83,.40+agujas.length*.012);caja('Estudio · Aguja',0,h/2,0,w,h,.015,agujas.length===2?moldura:oro,p);relojAlto.add(p);agujas.push(p);}esfera('Estudio · Centro del reloj',0,3.83,.45,.045,.045,.02,oro,relojAlto);
  const pendulo=new THREE.Group();pendulo.position.set(0,3.10,.22);relojAlto.add(pendulo);varilla([0,0,0],[0,-1.65,0],.020,oro,pendulo);esfera('Estudio · Disco de péndulo',0,-1.65,0,.22,.22,.055,oro,pendulo);
  const cristal=material('#b1c1ba',{transparent:true,opacity:.16,depthWrite:false,roughness:.18});caja('Estudio · Cristal de reloj',0,1.95,.37,.98,2.0,.025,cristal,relojAlto);
  const invisible=material('#ffffff');invisible.visible=false;const proxyReloj=caja('Estudio · Colisión del reloj',-13.5,12.35,-17.1,1.5,4.55,.9,invisible,raiz,true);proxyReloj.castShadow=proxyReloj.receiveShadow=false;
  // Escritorio, sillón y detalles de lectura.
  caja('Estudio · Escritorio',-13.5,10.68,-9.2,4.7,1.2,2.1,nogal,raiz,true);caja('Estudio · Tapa del escritorio',-13.5,11.33,-9.2,4.95,.13,2.28,moldura);
  for(const x of [-15.25,-11.75])for(let y=10.35;y<11.1;y+=.25){caja('Estudio · Cajón',x,y,-8.12,1.15,.21,.05,moldura);esfera('Estudio · Tirador',x,y,-8.07,.045,.025,.025,oro);}
  const silla=new THREE.Group();silla.position.set(-13.5,10.08,-6.85);silla.rotation.y=Math.PI;raiz.add(silla);caja('Estudio · Asiento',0,.53,0,1.45,.36,1.3,terciopelo,silla,true);caja('Estudio · Respaldo',0,1.16,-.50,1.45,1.18,.26,terciopelo,silla);for(const x of [-.72,.72])caja('Estudio · Brazo de sillón',x,.89,0,.15,.40,1.2,moldura,silla);
  for(const x of [-.55,.55])for(const z of [-.43,.43])caja('Estudio · Pata de sillón',x,.20,z,.13,.4,.13,oro,silla);
  const papel=canvas(512,360),pp=papel.getContext('2d');pp.fillStyle='#eee1bf';pp.fillRect(0,0,512,360);pp.strokeStyle='#b29866';pp.strokeRect(14,14,484,332);pp.fillStyle='#665840';pp.textAlign='center';pp.font='28px Georgia';pp.fillText('Las pequeñas maravillas',256,90);pp.font='21px Georgia';pp.fillText('También merecen una pausa.',256,140);pp.strokeStyle='#baa575';for(let i=0;i<5;i++){pp.beginPath();pp.moveTo(80,195+i*23);pp.lineTo(432-(i%2)*40,195+i*23);pp.stroke();}
  const hoja=plano(papel,1.0,.72,-12.2,11.411,-9.1);hoja.rotation.x=-Math.PI/2;
  cilindro(-11.55,11.54,-9.5,.10,.26,material('#263f42'));varilla([-11.55,11.62,-9.5],[-11.35,12.1,-9.57],.012,oro);
  const pluma=esfera('Estudio · Pluma',-11.31,12.15,-9.58,.047,.22,.013,crema);pluma.rotation.z=-.35;
  cilindro(-15.35,11.55,-9.8,.20,.28,oro);varilla([-15.35,11.5,-9.8],[-15.35,12.45,-9.8],.028,oro);
  const pantallaGeo=new THREE.ConeGeometry(.40,.35,24,1,true);geometrias.add(pantallaGeo);const pantallaMat=material('#cdbb8c',{side:THREE.DoubleSide});const pantalla=marcar(new THREE.Mesh(pantallaGeo,pantallaMat));pantalla.position.set(-15.35,12.5,-9.8);raiz.add(pantalla);
  const bombillaMat=material('#ffe2a0',{emissive:'#ffc876',emissiveIntensity:1.2});esfera('Estudio · Bombilla',-15.35,12.34,-9.8,.08,.09,.08,bombillaMat);
  // Cortinas enmarcan la ventana, sin taparla.
  const cortinaMat=material('#86666a');for(const z of [-12.83,-11.17])for(let i=0;i<4;i++)esfera('Estudio · Pliegue de cortina',-19.39,13.28,z+(i-1.5)*.055,.11,1.56,.055,cortinaMat);
  varilla([-19.35,14.94,-13.14],[-19.35,14.94,-10.86],.026,oro);
  const cartel=canvas(1024,220),cc=cartel.getContext('2d');cc.fillStyle='#263e40';cc.fillRect(0,0,1024,220);cc.strokeStyle='#c0a064';cc.lineWidth=4;cc.strokeRect(12,12,1000,196);cc.fillStyle='#efdcb0';cc.textAlign='center';cc.font='43px Georgia';cc.fillText('ESTUDIO DE LAS PEQUEÑAS MARAVILLAS',512,95);cc.font='24px Georgia';cc.fillText('Detenerse también es parte del viaje',512,158);plano(cartel,6.7,1.30,-13.5,15.25,-2.40,Math.PI);
  // Caja mecánica con bisagra real y flor de pétalos articulados.
  const cajita=new THREE.Group();cajita.position.set(-13.45,11.42,-9.05);cajita.rotation.y=Math.PI/2;raiz.add(cajita);
  const forro=material('#633b53');caja('Estudio · Fondo de cajita',0,.06,0,1.45,.12,.88,nogal,cajita);
  for(const x of [-.70,.70])caja('Estudio · Lateral de cajita',x,.28,0,.09,.43,.88,moldura,cajita);
  for(const z of [-.40,.40])caja('Estudio · Frente de cajita',0,.28,z,1.33,.43,.08,moldura,cajita);
  caja('Estudio · Forro interior',0,.13,0,1.25,.03,.69,forro,cajita);
  const bisagra=new THREE.Group();bisagra.position.set(0,.49,-.44);cajita.add(bisagra);caja('Estudio · Tapa móvil',0,0,.44,1.5,.10,.90,nogal,bisagra);caja('Estudio · Incrustación de tapa',0,.057,.44,1.30,.018,.70,oro,bisagra);caja('Estudio · Terciopelo de tapa',0,-.058,.44,1.28,.02,.68,forro,bisagra);
  esfera('Estudio · Cierre de la caja',0,.30,.455,.08,.07,.018,oro,cajita);
  const flor=new THREE.Group();flor.position.y=.15;cajita.add(flor);
  cilindro(0,.10,0,.23,.07,oro,flor);varilla([0,.12,0],[0,.73,0],.026,oro,flor);
  const hojaFlorMat=material('#719b94',{metalness:.25,roughness:.4});for(const lado of [-1,1]){const l=esfera('Estudio · Hoja de flor',lado*.12,.43,0,.15,.05,.035,hojaFlorMat,flor);l.rotation.z=lado*.55;}
  const cristalFlor=material('#dbc1a5',{metalness:.28,roughness:.26,transparent:true,opacity:.89,side:THREE.DoubleSide,emissive:'#67452d',emissiveIntensity:.18});
  const petalos=[];for(let i=0;i<12;i++){const p=new THREE.Group();p.position.y=.75;p.rotation.y=i*Math.PI*2/12;flor.add(p);const q=new THREE.Group();p.add(q);esfera('Estudio · Pétalo de cristal',0,.235,0,.105,.27,.040,i%3===0?oro:cristalFlor,q);petalos.push({grupo:q,interior:i%2===0});}
  const centroFlorMat=material('#ffe2a1',{emissive:'#ffc364',emissiveIntensity:.2,roughness:.4});esfera('Estudio · Corazón de flor',0,.79,0,.115,.10,.115,centroFlorMat,flor);
  const engranaje=new THREE.Group();engranaje.position.y=.18;flor.add(engranaje);cilindro(0,0,0,.18,.035,oro,engranaje);for(let i=0;i<12;i++){const a=i*Math.PI/6;const t=caja('Estudio · Diente de engranaje',Math.cos(a)*.18,0,Math.sin(a)*.18,.055,.042,.05,oro,engranaje);t.rotation.y=-a;}
  const glowC=canvas(64,64),gc=glowC.getContext('2d'),gr=gc.createRadialGradient(32,32,0,32,32,31);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.2,'rgba(255,233,179,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');gc.fillStyle=gr;gc.fillRect(0,0,64,64);const glowTex=tex(glowC);
  const fulgorMat=new THREE.SpriteMaterial({map:glowTex,color:'#ffdf95',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});materiales.add(fulgorMat);const fulgor=new THREE.Sprite(fulgorMat);fulgor.position.set(0,.85,0);fulgor.scale.set(.65,.65,1);flor.add(fulgor);
  const semillas=Array.from({length:72},()=>({a:azar()*Math.PI*2,r:.16+azar()*.60,y:azar()})),pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(semillas.length*3),3));geometrias.add(pg);
  const pm=new THREE.PointsMaterial({map:glowTex,color:'#ffe4aa',size:.045,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});materiales.add(pm);const chispas=new THREE.Points(pg,pm);chispas.frustumCulled=false;cajita.add(chispas);
  flor.scale.setScalar(.22);flor.position.y=.13;
  // Reloj de arena reversible, sin colisiones móviles.
  const arenaBase=new THREE.Group();arenaBase.position.set(-14.9,11.42,-8.96);raiz.add(arenaBase);
  const arenaGiro=new THREE.Group();arenaGiro.position.y=.54;arenaBase.add(arenaGiro);const ampolleta=new THREE.Group();ampolleta.position.y=-.54;arenaGiro.add(ampolleta);
  cilindro(0,.035,0,.32,.07,oro,ampolleta);cilindro(0,1.045,0,.32,.07,oro,ampolleta);
  for(let i=0;i<4;i++){const a=i*Math.PI/2;varilla([Math.cos(a)*.30,.07,Math.sin(a)*.30],[Math.cos(a)*.30,1.01,Math.sin(a)*.30],.016,oro,ampolleta);}
  const vidrioArena=material('#ccdcd8',{transparent:true,opacity:.19,depthWrite:false,roughness:.14,side:THREE.DoubleSide});
  for(const [rt,rb,cy] of [[.27,.027,.77],[.027,.27,.31]]){const g=new THREE.CylinderGeometry(rt,rb,.43,28,1,true);geometrias.add(g);const o=marcar(new THREE.Mesh(g,vidrioArena));o.position.y=cy;o.castShadow=false;ampolleta.add(o);}
  const arenaMat=material('#d8bc83',{roughness:1});const gArena=new THREE.ConeGeometry(.244,.4,28);geometrias.add(gArena);
  const arenaArriba=marcar(new THREE.Mesh(gArena,arenaMat));arenaArriba.rotation.z=Math.PI;ampolleta.add(arenaArriba);
  const arenaAbajo=marcar(new THREE.Mesh(gArena,arenaMat));ampolleta.add(arenaAbajo);
  const hilo=cilindro(0,.37,0,.010,.36,arenaMat,ampolleta);hilo.castShadow=false;
  const luz=new THREE.PointLight(0xffd5a4,24,13,2);luz.position.set(-13.5,15.1,-9.6);luz.castShadow=false;raiz.add(luz);marcar(luz);

  // Estado local de esta visita: no lee deseos, notas ni progreso de las otras salas.
  const id='estudio-maravillas',estilo=document.createElement('style');estilo.textContent=`
  #${id}[hidden],#${id} [hidden],#${id}-abrir[hidden]{display:none!important}
  #${id},#${id}-abrir{box-sizing:border-box;font:14px/1.55 system-ui,sans-serif;color:#f3e7ce}
  #${id}{position:fixed;inset:0;z-index:34000;display:flex;align-items:flex-end;justify-content:center;padding:14px;background:transparent}
  #${id} *{box-sizing:border-box}
  #${id} .em-caja{position:relative;width:min(880px,100%);max-height:46dvh;overflow:auto;padding:21px 23px;border:1px solid #b99d62;border-radius:18px;background:linear-gradient(135deg,#203d3ef5,#172b30f5);box-shadow:0 18px 65px #0007}
  #${id} h2{font:clamp(22px,3.5vw,30px) Georgia,serif;color:#f6dfad;margin:0 65px 7px 0}
  #${id} p{margin:8px 0}
  #${id} button,#${id}-abrir{min-height:44px;padding:10px 14px;border:1px solid #b29a64;border-radius:9px;background:#365456;color:#f7e8c8;font:14px system-ui,sans-serif;cursor:pointer;touch-action:manipulation}
  #${id} button:hover,#${id}-abrir:hover{background:#4e6b69}
  #${id} button[aria-pressed=true]{background:#806640;border-color:#dfc083}
  #${id} button:disabled{opacity:.45;cursor:wait}
  #${id} :focus-visible,#${id}-abrir:focus-visible{outline:3px solid #ffdc8a;outline-offset:3px}
  #${id} .em-cerrar{position:absolute;right:12px;top:12px}
  #${id} .em-fila{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
  #${id} .em-estado{color:#ead7ad;white-space:pre-line}
  #${id} .em-mensaje{font:clamp(17px,2.7vw,21px)/1.75 Georgia,serif;color:#f2dfb9;white-space:pre-line}
  #${id} .em-nota{font-size:12px;color:#b2bdb8}
  #${id}-abrir{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:29;max-width:90vw;background:#213f42ed;box-shadow:0 5px 25px #0006}
  @media(max-width:600px){#${id}{padding:7px}#${id} .em-caja{padding:16px 12px;max-height:48dvh}#${id} button{font-size:12px;padding:10px}#${id} h2{font-size:22px}}
  `;document.head.appendChild(estilo);
  const panel=document.createElement('section');panel.id=id;panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby',id+'-titulo');
  panel.innerHTML=`<div class="em-caja"><button type="button" class="em-cerrar">Cerrar</button><h2 id="${id}-titulo">Las pequeñas maravillas</h2><div class="em-fila"><button type="button" data-modo="caja">Caja mecánica</button><button type="button" data-modo="arena">Reloj de arena</button><button type="button" data-modo="mensaje">Una última pausa</button></div><div class="em-caja-controles em-fila"><button type="button" class="em-abrir-caja">Abrir cajita</button><button type="button" class="em-musica">Activar melodía</button></div><div class="em-arena-controles em-fila" hidden><button type="button" class="em-girar">Girar el reloj</button><span class="em-arena-tiempo" role="timer"></span></div><p class="em-mensaje" hidden></p><p class="em-estado" role="status" aria-live="polite"></p><p class="em-nota">La música es opcional y se genera en el navegador. No empieza sola. R: interactuar · Esc: cerrar.</p></div>`;document.body.appendChild(panel);
  const abrirBtn=document.createElement('button');abrirBtn.id=id+'-abrir';abrirBtn.type='button';abrirBtn.hidden=true;abrirBtn.textContent='R · Descubrir el estudio';document.body.appendChild(abrirBtn);
  const titulo=panel.querySelector('h2'),estado=panel.querySelector('.em-estado'),cerrarBtn=panel.querySelector('.em-cerrar'),cajaBtn=panel.querySelector('.em-abrir-caja'),audioBtn=panel.querySelector('.em-musica'),girarBtn=panel.querySelector('.em-girar'),tiempoArena=panel.querySelector('.em-arena-tiempo'),mensaje=panel.querySelector('.em-mensaje');mensaje.textContent=MENSAJE_ESTUDIO;
  const menu=document.getElementById('menu'),reducido=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let controles=null,oclusion=null,liberado=false,abierto=false,dentro=false,cercaCaja=false,cercaArena=false,modo='caja',reloj=0;
  let objetivoCaja=false,apertura=0,fraccionArena=1,arenaActiva=false,giroArena=null,segundoAnterior=-1;
  let recuerdoCamara=null,origenVista=null,destinoVista=null,tiempoVista=0;
  const duracionArena=24,localCam=new THREE.Vector3();
  // Audio sintetizado únicamente tras el clic de la persona.
  let contextoAudio=null,maestro=null,audioActivo=false,audioPreparando=false,versionAudio=0,notaAudio=0,proximaNota=0,avisoAudio='';const nodosAudio=new Set();
  function silenciar(){
    audioActivo=false;audioPreparando=false;versionAudio++;
    if(contextoAudio&&maestro){const t=contextoAudio.currentTime;maestro.gain.cancelScheduledValues(t);maestro.gain.setTargetAtTime(0,t,.025);for(const n of nodosAudio){try{n.osc.stop(t+.08);}catch{}}}
  }
  async function alternarAudio(){
    if(audioActivo||audioPreparando){silenciar();interfaz();return;}
    const version=++versionAudio;audioPreparando=true;avisoAudio='';objetivoCaja=true;interfaz();
    try{
      const Ctor=window.AudioContext||window.webkitAudioContext;if(!Ctor)throw new Error('Este navegador no pudo activar el audio.');
      if(!contextoAudio){contextoAudio=new Ctor();maestro=contextoAudio.createGain();maestro.gain.value=0;maestro.connect(contextoAudio.destination);}
      await contextoAudio.resume();
      if(liberado||!abierto||version!==versionAudio)return;
      if(contextoAudio.state!=='running')throw new Error('Pulsa nuevamente Activar melodía para permitir el audio.');
      audioActivo=true;notaAudio=0;proximaNota=contextoAudio.currentTime+.08;maestro.gain.setTargetAtTime(.085,contextoAudio.currentTime,.12);
    }catch(e){if(!liberado&&version===versionAudio){audioActivo=false;avisoAudio=e.message;}}
    finally{if(version===versionAudio)audioPreparando=false;if(!liberado)interfaz();}
  }
  function programarSonido(){
    if(!audioActivo||!contextoAudio||contextoAudio.state!=='running'||!abierto||!objetivoCaja||apertura<.45)return;
    const ahora=contextoAudio.currentTime;if(proximaNota<ahora-.2)proximaNota=ahora+.05;
    while(proximaNota<ahora+.20){
      const midi=MELODIA_ESTUDIO[notaAudio%MELODIA_ESTUDIO.length],frecuencia=440*Math.pow(2,(midi-69)/12),inicio=proximaNota;
      for(const [multiplicador,volumen,tipo] of [[1,.72,'sine'],[2,.09,'sine']]){
        const osc=contextoAudio.createOscillator(),ganancia=contextoAudio.createGain();osc.type=tipo;osc.frequency.value=frecuencia*multiplicador;ganancia.gain.setValueAtTime(.0001,inicio);ganancia.gain.exponentialRampToValueAtTime(volumen,inicio+.025);ganancia.gain.exponentialRampToValueAtTime(.0001,inicio+1.05);osc.connect(ganancia);ganancia.connect(maestro);
        const nodo={osc,ganancia};nodosAudio.add(nodo);osc.onended=()=>{nodosAudio.delete(nodo);osc.disconnect();ganancia.disconnect();};osc.start(inicio);osc.stop(inicio+1.10);
      }
      notaAudio++;proximaNota+=notaAudio%8===0?.88:.46;
    }
  }
  function destinoPara(m){
    castillo.updateWorldMatrix(true,false);
    const pos=m==='arena'?new THREE.Vector3(-10.7,12.55,-8.1):new THREE.Vector3(-9.5,12.65,-9.0),obj=m==='arena'?new THREE.Vector3(-14.9,11.98,-8.96):new THREE.Vector3(-13.45,12.14,-9.05);
    castillo.localToWorld(pos);castillo.localToWorld(obj);const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(pos,obj,camara.up));
    if(camara.parent){camara.parent.updateWorldMatrix(true,false);camara.parent.worldToLocal(pos);q.premultiply(camara.parent.getWorldQuaternion(new THREE.Quaternion()).invert());}
    return{posicion:pos,quaternion:q};
  }
  function enfocar(m){origenVista={posicion:camara.position.clone(),quaternion:camara.quaternion.clone()};destinoVista=destinoPara(m);tiempoVista=0;}
  function restaurarCamara(){if(recuerdoCamara){camara.position.copy(recuerdoCamara.posicion);camara.quaternion.copy(recuerdoCamara.quaternion);}recuerdoCamara=origenVista=destinoVista=null;}
  function interfaz(){
    if(liberado)return;
    titulo.textContent=modo==='arena'?'El tiempo también merece una pausa':modo==='mensaje'?'Una última pausa':'La flor de las pequeñas maravillas';
    panel.querySelectorAll('[data-modo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modo===modo)));
    panel.querySelector('.em-caja-controles').hidden=modo!=='caja';panel.querySelector('.em-arena-controles').hidden=modo!=='arena';mensaje.hidden=modo!=='mensaje';
    cajaBtn.textContent=objetivoCaja?'Cerrar cajita':'Abrir cajita';audioBtn.textContent=audioPreparando?'Preparando audio…':audioActivo?'Silenciar melodía':'Activar melodía';girarBtn.disabled=Boolean(giroArena);
    estado.textContent=avisoAudio||(modo==='arena'?(giroArena?'El reloj gira…':arenaActiva?'La arena cae sin prisa. Puedes darle la vuelta cuando quieras.':'Dale la vuelta al reloj para ver caer la arena.'):modo==='mensaje'?'Este rincón no guarda mensajes ni registra tus visitas.':objetivoCaja?'Que siempre te quede algo pequeño capaz de asombrarte.':'Abre la cajita y deja que aparezca una pequeña sorpresa.');
  }
  function cambiarModo(m){if(!['caja','arena','mensaje'].includes(m))return;modo=m;avisoAudio='';enfocar(m);interfaz();}
  function abrir(m=null){
    if(liberado||!dentro||(!cercaCaja&&!cercaArena)||abierto)return;
    modo=m==='arena'?'arena':'caja';abierto=true;recuerdoCamara={posicion:camara.position.clone(),quaternion:camara.quaternion.clone()};controles?.pausar?.();if(document.pointerLockElement){try{const p=document.exitPointerLock();p?.catch?.(()=>{});}catch{}}
    panel.hidden=false;abrirBtn.hidden=true;if(menu)menu.hidden=true;enfocar(modo);interfaz();cerrarBtn.focus();
  }
  function cerrar(){
    if(!abierto){silenciar();return;}silenciar();restaurarCamara();abierto=false;panel.hidden=true;
    if(menu){menu.hidden=false;document.getElementById('boton-iniciar')?.focus();}
  }
  function girarArena(){if(liberado||giroArena)return;giroArena={t:0,fraccionInicial:fraccionArena};arenaActiva=false;interfaz();}
  function representarArena(){
    const arriba=Math.cbrt(Math.max(0,1-fraccionArena)),abajo=Math.cbrt(Math.max(0,fraccionArena));
    arenaArriba.scale.set(Math.max(.0001,arriba),Math.max(.0001,arriba),Math.max(.0001,arriba));arenaArriba.position.y=.55+.20*arriba;
    arenaAbajo.scale.set(Math.max(.0001,abajo),Math.max(.0001,abajo),Math.max(.0001,abajo));arenaAbajo.position.y=.13+.20*abajo;
    const fondo=.13+.4*abajo,longitud=Math.max(.015,.54-fondo);hilo.position.y=(.54+fondo)/2;hilo.scale.y=arenaActiva&&!giroArena?longitud/.36:.0001;
    if(abierto&&modo==='arena')tiempoArena.textContent=giroArena?'':arenaActiva?`${Math.ceil((1-fraccionArena)*duracionArena)} s de esta vuelta`:'En reposo';
  }
  function actualizarReloj(){const fecha=new Date(),seg=fecha.getSeconds(),min=fecha.getMinutes(),hora=fecha.getHours()%12;agujas[0].rotation.z=-(hora+min/60)*Math.PI/6;agujas[1].rotation.z=-(min+seg/60)*Math.PI/30;agujas[2].rotation.z=-seg*Math.PI/30;}
  function teclado(e){
    if(abierto){
      if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();cerrar();return;}
      if(e.code==='Tab'){const lista=[...panel.querySelectorAll('button')].filter(b=>!b.disabled&&b.getClientRects().length),primero=lista[0],ultimo=lista[lista.length-1];if(e.shiftKey&&document.activeElement===primero){e.preventDefault();ultimo.focus();}else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primero.focus();}}
      if(['KeyW','KeyA','KeyS','KeyD','KeyE','KeyF','KeyR','KeyG','Space'].includes(e.code))e.stopImmediatePropagation();return;
    }
    if(e.code==='KeyR'&&!e.repeat&&dentro&&(cercaCaja||cercaArena)&&!Boolean(menu&&!menu.hidden)&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&!document.activeElement?.isContentEditable){e.preventDefault();e.stopImmediatePropagation();abrir(cercaArena&&!cercaCaja?'arena':'caja');}
  }
  const raycaster=new THREE.Raycaster(),centro=new THREE.Vector2();
  function clicMundo(){if(!dentro||abierto||document.pointerLockElement!==elemento)return;raycaster.setFromCamera(centro,camara);const hit=raycaster.intersectObjects([cajita,arenaBase],true)[0];if(!hit||hit.distance>7)return;let o=hit.object;while(o&&o!==cajita&&o!==arenaBase)o=o.parent;abrir(o===arenaBase?'arena':'caja');}
  function alDesbloquear(){if(abierto&&menu)menu.hidden=true;}
  function alOcultar(){if(document.hidden)cerrar();}
  cerrarBtn.addEventListener('click',cerrar);abrirBtn.addEventListener('click',()=>abrir(cercaArena&&!cercaCaja?'arena':'caja'));
  cajaBtn.addEventListener('click',()=>{objetivoCaja=!objetivoCaja;if(!objetivoCaja)silenciar();avisoAudio='';interfaz();});audioBtn.addEventListener('click',alternarAudio);girarBtn.addEventListener('click',girarArena);
  panel.querySelectorAll('[data-modo]').forEach(b=>b.addEventListener('click',()=>cambiarModo(b.dataset.modo)));
  document.addEventListener('keydown',teclado,true);document.addEventListener('pointerlockchange',alDesbloquear);document.addEventListener('visibilitychange',alOcultar);window.addEventListener('pagehide',cerrar);elemento.addEventListener('click',clicMundo);
  representarArena();actualizarReloj();
  function actualizar(dt=0){
    if(liberado)return;const paso=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.1));reloj+=paso;
    castillo.updateWorldMatrix(true,false);camara.getWorldPosition(localCam);castillo.worldToLocal(localCam);
    dentro=localCam.x> -19.7&&localCam.x< -7.3&&localCam.z> -17.7&&localCam.z< -2.3&&localCam.y>10&&localCam.y<16.95;
    cercaCaja=dentro&&localCam.distanceTo(new THREE.Vector3(-13.45,12.0,-9.05))<4.4;cercaArena=dentro&&localCam.distanceTo(new THREE.Vector3(-14.9,12.0,-8.96))<4.4;
    const visible=oclusion?.habitaciones?.find(h=>h.id===ROOM)?.visible??true;raiz.visible=visible;luz.visible=visible;abrirBtn.hidden=!dentro||(!cercaCaja&&!cercaArena)||abierto||Boolean(menu&&!menu.hidden);
    apertura=reducido?(objetivoCaja?1:0):THREE.MathUtils.damp(apertura,objetivoCaja?1:0,4,paso);bisagra.rotation.x=-1.64*apertura;
    const crecer=THREE.MathUtils.smoothstep(apertura,.15,.85);flor.position.y=.13+.35*crecer;flor.scale.setScalar(.22+.78*crecer);
    petalos.forEach(p=>p.grupo.rotation.x=.06+crecer*(p.interior ? .92:1.23));centroFlorMat.emissiveIntensity=.2+crecer*1.5;fulgorMat.opacity=crecer*.68;pm.opacity=crecer*.8;
    if(visible){
      pendulo.rotation.z=reducido?0:Math.sin(reloj*2.2)*.15;engranaje.rotation.y+=reducido?0:paso*.38*crecer;
      const a=pg.attributes.position.array;semillas.forEach((s,i)=>{const ang=s.a+(reducido?0:reloj*.4);a[i*3]=Math.cos(ang)*s.r;a[i*3+1]=.45+((s.y+(reducido?0:reloj*.13))%1)*1.1;a[i*3+2]=Math.sin(ang)*s.r;});pg.attributes.position.needsUpdate=true;
      pluma.rotation.z=-.35+(reducido?0:Math.sin(reloj*.8)*.025);
    }
    if(Math.floor(reloj)!==segundoAnterior){segundoAnterior=Math.floor(reloj);actualizarReloj();}
    if(giroArena){giroArena.t+=paso;const p=Math.min(1,giroArena.t/(reducido ? .05:1.15)),s=p*p*(3-2*p);arenaGiro.rotation.z=Math.PI*s;if(p===1){fraccionArena=1-giroArena.fraccionInicial;arenaGiro.rotation.z=0;giroArena=null;arenaActiva=fraccionArena<.999;if(abierto)interfaz();}}
    else if(arenaActiva){fraccionArena=Math.min(1,fraccionArena+paso/duracionArena);if(fraccionArena===1){arenaActiva=false;if(abierto)interfaz();}}
    representarArena();
    if(abierto&&origenVista&&destinoVista){tiempoVista+=paso;const p=Math.min(1,tiempoVista/(reducido ? .05:1.1)),s=p*p*(3-2*p);camara.position.lerpVectors(origenVista.posicion,destinoVista.posicion,s);camara.quaternion.slerpQuaternions(origenVista.quaternion,destinoVista.quaternion,s);if(p===1)origenVista=destinoVista=null;}
    if(abierto&&!dentro)cerrar();if(abierto&&menu&&!menu.hidden)menu.hidden=true;
    if(!dentro&&audioActivo)silenciar();programarSonido();
  }
  const api={raiz,cajita,arenaBase,actualizar,abrir,cerrar,girarArena,
    vincularControles(c){controles=c;},vincularOclusion(o){oclusion=o;},
    get abierto(){return abierto;},get cajaAbierta(){return objetivoCaja;},
    liberar(){
      if(liberado)return;cerrar();liberado=true;silenciar();if(contextoAudio&&contextoAudio.state!=='closed')contextoAudio.close().catch(()=>{});
      document.removeEventListener('keydown',teclado,true);document.removeEventListener('pointerlockchange',alDesbloquear);document.removeEventListener('visibilitychange',alOcultar);window.removeEventListener('pagehide',cerrar);elemento.removeEventListener('click',clicMundo);
      panel.remove();abrirBtn.remove();estilo.remove();raiz.removeFromParent();
      if(Array.isArray(colisiones)){for(const r of propios){const i=colisiones.indexOf(r);if(i>=0)colisiones.splice(i,1);}retirados.sort((a,b)=>a.indice-b.indice).forEach(r=>colisiones.splice(Math.min(r.indice,colisiones.length),0,r.valor));}
      ocultos.forEach(r=>r.objeto.visible=r.visible);for(const g of geometrias)g.dispose();for(const m of materiales)m.dispose();for(const t of texturas)t.dispose();delete castillo.userData.estudioMaravillas;
    }
  };castillo.userData.estudioMaravillas=api;return api;
}
