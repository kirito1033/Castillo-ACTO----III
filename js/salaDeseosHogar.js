import * as THREE from 'three';

export const FAMILIA_SALA_DESEOS = Object.freeze([
  {
    "altura": 1.2,
    "piel": "#cda383",
    "ropa": "#527c86",
    "pelo": "#45342d"
  },
  {
    "altura": 1.13,
    "piel": "#b98769",
    "ropa": "#ba7e78",
    "pelo": "#362b2a"
  },
  {
    "altura": 0.78,
    "piel": "#c79878",
    "ropa": "#d1aa60",
    "pelo": "#46352d"
  },
  {
    "altura": 0.66,
    "piel": "#c39275",
    "ropa": "#8d9b78",
    "pelo": "#514030"
  }
]);

// El deseo solo existe en el textarea mientras se escribe. Nunca se copia al modelo,
// a la API pública, a una textura, a un registro ni a un almacenamiento persistente.
export function crearSalaDeseosHogar(escena,camara,castillo,elemento,opciones={}){
  if(castillo.userData.salaDeseosHogar)return castillo.userData.salaDeseosHogar;
  const ROOM='Dormitorio este',raiz=new THREE.Group();raiz.name='Sala de los deseos · Un hogar para imaginar';castillo.add(raiz);
  const geometrias=new Set(),materiales=new Set(),texturas=new Set(),propios=[],ocultos=[],retirados=[];
  const colisiones=castillo.userData.colisiones;
  const geoCaja=new THREE.BoxGeometry(1,1,1),geoEsfera=new THREE.SphereGeometry(1,18,12);geometrias.add(geoCaja);geometrias.add(geoEsfera);
  const marcar=o=>{Object.assign(o.userData,{habitacion:ROOM,noAgrupar:true,dinamico:true});return o;};marcar(raiz);
  function material(color,extra={}){const m=new THREE.MeshStandardMaterial({color,roughness:.83,...extra});materiales.add(m);return m;}
  const crema=material('#e6d7bd'),oro=material('#c3a365',{metalness:.48,roughness:.42}),madera=material('#664c3b'),azul=material('#577382'),tela=material('#ad7f78');
  function caja(nombre,x,y,z,w,h,d,mat,padre=raiz,solido=false){const o=marcar(new THREE.Mesh(geoCaja,mat));o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;padre.add(o);if(solido&&Array.isArray(colisiones)){const r={mesh:o,w,h,d,esCaja:true};colisiones.push(r);propios.push(r);}return o;}
  function esfera(nombre,x,y,z,sx,sy,sz,mat,padre=raiz){const o=marcar(new THREE.Mesh(geoEsfera,mat));o.name=nombre;o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=o.receiveShadow=true;padre.add(o);return o;}
  function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function tex(c){const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;texturas.add(t);return t;}
  function plano(c,w,h,x,y,z,ry=0,padre=raiz){const g=new THREE.PlaneGeometry(w,h);geometrias.add(g);const m=new THREE.MeshBasicMaterial({map:tex(c),toneMapped:false});materiales.add(m);const o=marcar(new THREE.Mesh(g,m));o.position.set(x,y,z);o.rotation.y=ry;padre.add(o);return o;}
  function cilindroEntre(a,b,r,mat,padre){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),dir=vb.clone().sub(va);const g=new THREE.CylinderGeometry(r,r,dir.length(),12);geometrias.add(g);const o=marcar(new THREE.Mesh(g,mat));o.position.copy(va.add(vb).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());o.castShadow=o.receiveShadow=true;padre.add(o);return o;}
  // Solo se retiran la cama y la cabecera de este dormitorio.
  const zona=new THREE.Box3(new THREE.Vector3(7.35,9.99,-1.65),new THREE.Vector3(19.7,16.95,17.7));
  castillo.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(castillo.matrixWorld).invert(),bb=new THREE.Box3();
  castillo.traverse(o=>{if(!o.isMesh||!/^(Cama|Cabecera)(\s|$)/i.test(o.name))return;bb.setFromObject(o).applyMatrix4(inv);if(zona.containsBox(bb))ocultos.push({objeto:o,visible:o.visible});});ocultos.forEach(r=>r.objeto.visible=false);
  if(Array.isArray(colisiones)){const quitar=new Set(ocultos.map(r=>r.objeto));for(let i=colisiones.length-1;i>=0;i--)if(quitar.has(colisiones[i].mesh))retirados.push({indice:i,valor:colisiones.splice(i,1)[0]});}
  caja('Deseos · Pared este',19.585,13.5,8,.018,6.96,19.2,crema);
  caja('Deseos · Pared frontal',13.5,13.5,17.585,12.25,6.96,.018,crema);
  caja('Deseos · Pared posterior',13.5,13.5,-1.685,12.25,6.96,.018,crema);
  caja('Deseos · Pared oeste sur',7.335,13.5,2.6,.018,6.96,8.14,crema);
  caja('Deseos · Pared oeste norte',7.335,13.5,13.4,.018,6.96,8.14,crema);
  caja('Deseos · Dintel',7.335,15.3,8,.018,3.36,2.66,crema);
  const sueloMat=material('#ab8c64');caja('Deseos · Piso',13.5,10.05,8,12.22,.012,19.15,sueloMat);
  const tabla=canvas(512,512),tt=tabla.getContext('2d');tt.fillStyle='#ad916c';tt.fillRect(0,0,512,512);
  for(let i=0;i<8;i++){tt.fillStyle=i%2?'#b99b75':'#a78a65';tt.fillRect(0,i*64,512,64);tt.strokeStyle='#725a3d88';tt.strokeRect(0,i*64,512,64);for(let j=0;j<5;j++){tt.beginPath();tt.moveTo(0,i*64+10+j*9);tt.bezierCurveTo(170,i*64+j*9,340,i*64+18+j*9,512,i*64+10+j*9);tt.stroke();}}
  const mapaSuelo=tex(tabla);mapaSuelo.wrapS=mapaSuelo.wrapT=THREE.RepeatWrapping;mapaSuelo.repeat.set(3,5);sueloMat.map=mapaSuelo;sueloMat.color.set('#ffffff');
  for(const z of [-1.55,17.47]){caja('Deseos · Zócalo',13.5,10.3,z,12.1,.4,.14,madera);caja('Deseos · Cornisa',13.5,16.35,z,12.1,.12,.14,oro);}
  caja('Deseos · Cornisa este',19.47,16.35,8,.12,.12,19.0,oro);
  const techo=canvas(768,1024),tc=techo.getContext('2d');const grad=tc.createLinearGradient(0,0,768,1024);grad.addColorStop(0,'#8eaaa9');grad.addColorStop(.5,'#bec9ba');grad.addColorStop(1,'#e0c9ad');tc.fillStyle=grad;tc.fillRect(0,0,768,1024);
  let semilla=64299;const azar=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla/4294967296;};
  tc.fillStyle='#fff0bf';for(let i=0;i<125;i++){const x=azar()*768,y=azar()*1024,r=.8+azar()*2;tc.beginPath();tc.arc(x,y,r,0,Math.PI*2);tc.fill();if(i%15===0){tc.fillRect(x-7,y-.6,14,1.2);tc.fillRect(x-.6,y-7,1.2,14);}}
  tc.strokeStyle='#bf9f66';tc.lineWidth=3;tc.strokeRect(18,18,732,988);const cielo=plano(techo,12.15,19.15,13.5,16.55,8);cielo.rotation.x=Math.PI/2;
  const nubeMat=material('#f4ead8',{transparent:true,opacity:.62,depthWrite:false});
  for(const [x,z] of [[10.2,1.5],[16.9,14.8],[11.5,15]])for(let i=0;i<4;i++){const n=esfera('Deseos · Nube',x+(i-1.5)*.42,16.08+(i%2)*.08,z,.44,.18,.30,nubeMat);n.castShadow=false;}
  const alf=canvas(512,512),ac=alf.getContext('2d');ac.fillStyle='#597580';ac.fillRect(0,0,512,512);for(const d of [12,24,42]){ac.strokeStyle=d===24?'#e6c997':'#a4b0aa';ac.lineWidth=3;ac.strokeRect(d,d,512-2*d,512-2*d);}ac.strokeStyle='#ddc59d';ac.beginPath();ac.arc(256,256,135,0,Math.PI*2);ac.stroke();
  const alfombra=plano(alf,8.2,10,14.0,10.071,9);alfombra.rotation.x=-Math.PI/2;
  // Diorama de una casa y una familia simbólica. No reproduce personas reales.
  const hogar=new THREE.Group();hogar.name='Deseos · Hogar en miniatura';hogar.position.set(14.5,10.58,9);hogar.rotation.y=-Math.PI/2;raiz.add(hogar);
  const cesped=material('#78906c'),paredCasa=material('#e9d9b6'),tejas=material('#9e6d61'),bordeCasa=material('#f1e6ce'),tronco=material('#71533b'),hojas=material('#6c8d68');
  caja('Deseos · Base del jardín',0,0,0,6.8,.24,5.2,cesped,hogar,true);
  caja('Deseos · Zócalo de maqueta',0,-.17,0,6.95,.13,5.35,madera,hogar);
  caja('Deseos · Casa',0,1.12,-.22,3.1,2.0,2.3,paredCasa,hogar);
  const techoGeo=new THREE.BufferGeometry();
  const A=[-1.8,2.1,1.13],B=[1.8,2.1,1.13],C=[0,3.2,1.13],D=[-1.8,2.1,-1.57],E=[1.8,2.1,-1.57],F=[0,3.2,-1.57];
  const vertices=[];for(const t of [[A,B,C],[D,F,E],[A,C,F],[A,F,D],[B,E,F],[B,F,C],[A,D,E],[A,E,B]])vertices.push(...t[0],...t[1],...t[2]);
  techoGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));techoGeo.computeVertexNormals();geometrias.add(techoGeo);const tejado=marcar(new THREE.Mesh(techoGeo,tejas));tejado.name='Deseos · Tejado de la casa';tejado.castShadow=tejado.receiveShadow=true;hogar.add(tejado);
  caja('Deseos · Chimenea',-.92,2.9,-.8,.37,.8,.42,madera,hogar);
  caja('Deseos · Puerta del hogar',0,.73,.946,.60,1.2,.07,madera,hogar);esfera('Deseos · Pomo',.20,.73,.993,.035,.035,.02,oro,hogar);
  const ventanaMat=material('#ffe4aa',{emissive:'#ffd08a',emissiveIntensity:.30,roughness:.4});
  for(const x of [-.91,.91]){
    caja('Deseos · Marco de ventana',x,1.28,.96,.66,.73,.09,bordeCasa,hogar);
    caja('Deseos · Ventana iluminada',x,1.28,1.015,.51,.57,.025,ventanaMat,hogar);
    caja('Deseos · Cruz de ventana',x,1.28,1.037,.035,.59,.025,madera,hogar);caja('Deseos · Cruz de ventana',x,1.28,1.039,.53,.035,.025,madera,hogar);
    for(const dx of [-.46,.46])caja('Deseos · Contraventana',x+dx,1.28,.98,.18,.72,.07,azul,hogar);
  }
  esfera('Deseos · Ventana redonda',0,2.5,1.145,.24,.24,.035,ventanaMat,hogar);
  caja('Deseos · Escalón',0,.18,1.18,1.02,.13,.48,bordeCasa,hogar);
  for(let i=0;i<4;i++)caja('Deseos · Sendero',0,.14,1.55+i*.23,.60,.035,.16,crema,hogar);
  for(const x of [-2.75,2.75]){
    for(let i=0;i<6;i++)caja('Deseos · Estaca del jardín',x,.37,-1.98+i*.71,.07,.5,.07,bordeCasa,hogar);
    caja('Deseos · Valla del jardín',x,.39,-.2,.06,.05,3.9,bordeCasa,hogar);
  }
  const floresMats=['#c18d91','#edd1a2','#a2b3c1'].map(c=>material(c));
  for(let i=0;i<22;i++){const lado=i%2?1:-1,x=lado*(1.9+azar()*.58),z=-1.8+azar()*3.7;cilindroEntre([x,.13,z],[x,.35,z],.012,hojas,hogar);esfera('Deseos · Flor',x,.39,z,.07,.045,.07,floresMats[i%3],hogar);}
  cilindroEntre([-2.17,.13,-1.10],[-2.17,1.45,-1.10],.11,tronco,hogar);
  for(const [x,y,z,s] of [[-2.17,1.8,-1.1,.65],[-2.5,1.6,-1.1,.45],[-1.87,1.65,-1.2,.45]])esfera('Deseos · Copa del árbol',x,y,z,s,s*.9,s,hojas,hogar);
  const personas=[],tinta=material('#3f3433'),brillo=material('#fff3da');
  // FAMILIA_DESEOS_DETALLADA_V2
  function persona(conf,x,z){
    const g=new THREE.Group();g.name='Familia · Figura detallada';g.position.set(x,.12,z);g.scale.setScalar(conf.altura);hogar.add(g);
    const infantil=conf.altura<.9,alternar=personas.length%2===1;
    const piel=material(conf.piel,{roughness:.88}),sombraPiel=material(new THREE.Color(conf.piel).multiplyScalar(.90),{roughness:.9});
    const ropa=material(conf.ropa,{roughness:.96}),pelo=material(conf.pelo,{roughness:.94});
    const mechonMat=material(new THREE.Color(conf.pelo).multiplyScalar(1.18),{roughness:.95});
    const pantalon=material(infantil?'#727f83':'#4c5862',{roughness:.97}),zapato=material('#58453a',{roughness:.65}),suela=material('#3b3633',{roughness:1});
    const labios=material(new THREE.Color(conf.piel).multiply(new THREE.Color('#b88985')),{roughness:.85});
    const iris=material('#604a37',{roughness:.4}),pupila=material('#212527',{roughness:.28}),esclerotica=material('#e9e5d9',{roughness:.4});
    const uña=material(new THREE.Color(conf.piel).lerp(new THREE.Color('#f0d8c7'),.3),{roughness:.65});
    const tejido=canvas(128,128),ct=tejido.getContext('2d');ct.fillStyle='#fafafa';ct.fillRect(0,0,128,128);ct.strokeStyle='#77777716';ct.lineWidth=.6;
    for(let i=0;i<128;i+=4){ct.beginPath();ct.moveTo(i,0);ct.lineTo(i,128);ct.stroke();ct.beginPath();ct.moveTo(0,i);ct.lineTo(128,i);ct.stroke();}
    ropa.map=tex(tejido);ropa.map.wrapS=ropa.map.wrapT=THREE.RepeatWrapping;ropa.map.repeat.set(2,3);ropa.needsUpdate=true;
    // Silueta humana: cadera, muslos, rodillas, pantorrillas y calzado separados.
    esfera('Familia · Torso',0,.615,0,.132,.183,.077,ropa,g);
    esfera('Familia · Cadera',0,.445,-.005,.112,.074,.073,pantalon,g);
    for(const xx of [-.066,.066]){
      cilindroEntre([xx,.438,0],[xx,.247,.014],.050,pantalon,g);
      esfera('Familia · Rodilla',xx,.242,.014,.044,.047,.044,pantalon,g);
      cilindroEntre([xx,.230,.014],[xx,.072,.011],.035,pantalon,g);
      esfera('Familia · Zapato',xx,.039,.042,.046,.034,.084,zapato,g);
      caja('Familia · Suela',xx,.014,.04,.091,.014,.155,suela,g);
      caja('Familia · Dobladillo',xx,.079,.012,.073,.022,.070,pantalon,g);
    }
    cilindroEntre([0,.748,0],[0,.809,.004],.031,piel,g);
    caja('Familia · Cuello izquierdo',-.035,.748,.063,.061,.037,.015,ropa,g).rotation.z=-.40;
    caja('Familia · Cuello derecho',.035,.748,.063,.061,.037,.015,ropa,g).rotation.z=.40;
    for(const yy of [.697,.641,.585])esfera('Familia · Botón',0,yy,.078,.008,.008,.004,crema,g);
    const cabeza=new THREE.Group();cabeza.position.set(0,.884,.006);g.add(cabeza);
    const fx=infantil?1.10:1,fy=infantil?1.05:1;cabeza.scale.set(fx,fy,fx);
    esfera('Familia · Rostro',0,0,0,.076,.101,.077,piel,cabeza);
    esfera('Familia · Mandíbula',0,-.062,.007,.056,.043,.057,piel,cabeza);
    for(const lado of [-1,1]){
      esfera('Familia · Oreja',lado*.077,-.006,-.003,.014,.024,.012,piel,cabeza);
      esfera('Familia · Interior de oreja',lado*.081,-.005,.006,.006,.014,.004,sombraPiel,cabeza);
      esfera('Familia · Mejilla',lado*.040,-.025,.051,.028,.027,.022,piel,cabeza);
    }
    esfera('Familia · Puente de nariz',0,-.002,.073,.010,.023,.012,piel,cabeza);
    esfera('Familia · Punta de nariz',0,-.019,.087,.013,.010,.014,piel,cabeza);
    const ojos=[];
    for(const lado of [-1,1]){
      const ojo=new THREE.Group();ojo.position.set(lado*.030,.018,.066);cabeza.add(ojo);ojos.push(ojo);
      esfera('Familia · Blanco del ojo',0,0,0,.018,.010,.010,esclerotica,ojo);
      esfera('Familia · Iris',0,0,.009,.007,.0075,.003,iris,ojo);
      esfera('Familia · Pupila',0,0,.0115,.0035,.0045,.002,pupila,ojo);
      esfera('Familia · Reflejo del ojo',-.002,.0028,.013,.0018,.0018,.0013,brillo,ojo);
      cilindroEntre([lado*.030-.016,.043,.061],[lado*.030+.016,.046,.061],.0034,pelo,cabeza);
      esfera('Familia · Párpado',lado*.030,.030,.067,.019,.003,.006,piel,cabeza);
    }
    const sonrisa=new THREE.Group();sonrisa.position.set(0,-.049,.066);cabeza.add(sonrisa);
    esfera('Familia · Labio superior',0,0,0,.021,.0037,.004,labios,sonrisa);
    esfera('Familia · Labio inferior',0,-.004,.001,.019,.0036,.0045,labios,sonrisa);
    for(const lado of [-1,1])esfera('Familia · Comisura',lado*.020,.002,0,.003,.003,.003,labios,sonrisa);
    // Cabello en capas y mechones, sin usar fotografías ni modelos externos.
    esfera('Familia · Cabello posterior',0,.038,-.028,.080,.073,.066,pelo,cabeza);
    esfera('Familia · Coronilla',0,.075,-.006,.079,.038,.071,pelo,cabeza);
    if(alternar){
      for(const lado of [-1,1])esfera('Familia · Mechón lateral',lado*.070,-.019,-.027,.021,.100,.044,pelo,cabeza);
      esfera('Familia · Melena posterior',0,-.025,-.057,.079,.115,.034,pelo,cabeza);
    }
    for(let i=0;i<18;i++){
      const a=i*Math.PI*2/18,px=Math.cos(a)*.061,pz=-.018+Math.sin(a)*.051;
      const m=esfera('Familia · Hebra de cabello',px,.082+Math.sin(a)*.008,pz,.008,.024,.012,i%3?mechonMat:pelo,cabeza);m.rotation.z=-Math.cos(a)*.45;
    }
    for(let i=0;i<5;i++){const xx=-.052+i*.024;const m=esfera('Familia · Flequillo',xx,.063-Math.abs(xx)*.10,.055,.014,.022,.014,pelo,cabeza);m.rotation.z=-.35;}
    const brazos=[];
    for(const lado of [-1,1]){
      const b=new THREE.Group();b.position.set(lado*.127,.722,0);b.rotation.z=lado*.14;g.add(b);
      esfera('Familia · Hombro',0,-.025,0,.046,.060,.049,ropa,b);
      cilindroEntre([0,-.025,0],[lado*.024,-.153,.012],.035,ropa,b);
      esfera('Familia · Codo',lado*.024,-.153,.012,.028,.031,.028,piel,b);
      cilindroEntre([lado*.024,-.159,.012],[lado*.038,-.275,.037],.023,piel,b);
      const mano=new THREE.Group();mano.position.set(lado*.038,-.285,.037);b.add(mano);
      esfera('Familia · Palma',0,-.012,0,.024,.033,.012,piel,mano);
      const largos=[.042,.052,.049,.037];
      for(let d=0;d<4;d++){
        const xx=-.017+d*.0115,yy=-.034-largos[d]/2;
        esfera('Familia · Dedo',xx,yy,.001,.0052,largos[d]/2,.0055,piel,mano);
        esfera('Familia · Uña',xx,yy-largos[d]*.27,.006,.0034,.006,.0016,uña,mano);
      }
      const pulgar=esfera('Familia · Pulgar',lado*.026,-.025,.004,.0075,.024,.0075,piel,mano);pulgar.rotation.z=lado*.65;
      brazos.push({grupo:b,lado});
    }
    // Instanciar pequeños detalles por material y articulación conserva los gestos.
    function agruparDetalles(padre){
      for(const hijo of [...padre.children])if(hijo.isGroup)agruparDetalles(hijo);
      const lotes=new Map();for(const o of padre.children){if(!o.isMesh||o.isInstancedMesh||o.geometry!==geoEsfera)continue;if(!lotes.has(o.material))lotes.set(o.material,[]);lotes.get(o.material).push(o);}
      for(const [mat,objetos] of lotes){if(objetos.length<3)continue;const lote=marcar(new THREE.InstancedMesh(geoEsfera,mat,objetos.length));lote.name='Familia · Detalles agrupados';objetos.forEach((o,i)=>{o.updateMatrix();lote.setMatrixAt(i,o.matrix);o.removeFromParent();});lote.instanceMatrix.needsUpdate=true;lote.computeBoundingSphere();lote.castShadow=lote.receiveShadow=true;padre.add(lote);}
    }
    agruparDetalles(g);personas.push({grupo:g,brazos,sonrisa,cabeza,ojos});
  }
  const configuracion=Array.isArray(opciones.personas)&&opciones.personas.length===4?opciones.personas:FAMILIA_SALA_DESEOS;
  persona(configuracion[0],-.73,1.85);persona(configuracion[1],.73,1.85);persona(configuracion[2],-.24,2.28);persona(configuracion[3],.29,2.31);
  const lamparaMat=material('#ffe5b5',{emissive:'#ffc97e',emissiveIntensity:.30});
  for(const x of [-2.28,2.28]){caja('Deseos · Farol del jardín',x,.62,1.65,.055,.98,.055,madera,hogar);esfera('Deseos · Luz del farol',x,1.15,1.65,.12,.16,.12,lamparaMat,hogar);}
  // Mesa para escribir y sobre 3D sin texto. El contenido del deseo nunca se dibuja.
  caja('Deseos · Mesa de los deseos',10.1,10.65,4.1,2.2,1.1,1.25,madera,raiz,true);
  caja('Deseos · Tapa de mesa',10.1,11.25,4.1,2.4,.13,1.45,oro);
  const placa=canvas(768,220),pc=placa.getContext('2d');pc.fillStyle='#435f67';pc.fillRect(0,0,768,220);pc.strokeStyle='#c7ac77';pc.lineWidth=4;pc.strokeRect(12,12,744,196);pc.fillStyle='#f5e5be';pc.font='38px Georgia';pc.textAlign='center';pc.fillText('SALA DE LOS DESEOS',384,95);pc.font='23px Georgia';pc.fillText('Un hogar para imaginar',384,151);plano(placa,5.8,1.5,13.5,15.2,-1.56);
  const letrero=canvas(512,160),lc=letrero.getContext('2d');lc.fillStyle='#405e66';lc.fillRect(0,0,512,160);lc.fillStyle='#eeddb7';lc.font='27px Georgia';lc.textAlign='center';lc.fillText('UN DESEO PARA EL CAMINO',256,70);lc.font='20px Georgia';lc.fillText('Acércate y pulsa R',256,117);plano(letrero,1.8,.57,10.1,11.56,4.78);
  const sobre=new THREE.Group();sobre.name='Deseos · Sobre en blanco';raiz.add(sobre);
  const papelMat=new THREE.MeshBasicMaterial({color:'#fff0cd',transparent:true,opacity:1,toneMapped:false});materiales.add(papelMat);
  caja('Deseos · Papel sin inscripción',0,0,0,.60,.39,.025,papelMat,sobre);
  const flapGeo=new THREE.BufferGeometry();flapGeo.setAttribute('position',new THREE.Float32BufferAttribute([-.28,.17,.018,.28,.17,.018,0,-.02,.018],3));flapGeo.computeVertexNormals();geometrias.add(flapGeo);
  const flapMat=new THREE.MeshBasicMaterial({color:'#d3b47c',side:THREE.DoubleSide,transparent:true,opacity:1,toneMapped:false});materiales.add(flapMat);sobre.add(marcar(new THREE.Mesh(flapGeo,flapMat)));
  const selloMat=new THREE.MeshBasicMaterial({color:'#aa7367',transparent:true,opacity:1,toneMapped:false});materiales.add(selloMat);esfera('Deseos · Sello',0,-.025,.035,.05,.05,.012,selloMat,sobre);
  const inicioSobre=new THREE.Vector3(10.1,11.6,4.3),finSobre=new THREE.Vector3(14.5,15.25,9);sobre.position.copy(inicioSobre);sobre.rotation.y=-.15;
  const brilloCanvas=canvas(64,64),bc=brilloCanvas.getContext('2d'),bg=bc.createRadialGradient(32,32,0,32,32,31);bg.addColorStop(0,'rgba(255,255,255,1)');bg.addColorStop(.18,'rgba(255,241,204,1)');bg.addColorStop(.45,'rgba(255,206,118,.3)');bg.addColorStop(1,'rgba(255,255,255,0)');bc.fillStyle=bg;bc.fillRect(0,0,64,64);const brilloTex=tex(brilloCanvas);
  const estrellaMat=new THREE.SpriteMaterial({map:brilloTex,color:'#ffe1a1',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});materiales.add(estrellaMat);
  const estrella=new THREE.Sprite(estrellaMat);estrella.position.copy(finSobre);estrella.scale.set(1.0,1.0,1);raiz.add(estrella);
  const semillas=[];for(let i=0;i<260;i++)semillas.push({a:azar()*Math.PI*2,r:.25+azar()*2.7,v:.7+azar()*.8,f:azar()});
  const particulasGeo=new THREE.BufferGeometry();particulasGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(semillas.length*3),3));geometrias.add(particulasGeo);
  const particulasMat=new THREE.PointsMaterial({map:brilloTex,color:'#ffe6aa',size:.11,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});materiales.add(particulasMat);
  const particulas=new THREE.Points(particulasGeo,particulasMat);particulas.frustumCulled=false;raiz.add(particulas);
  const corazon=new THREE.Group();corazon.position.set(14.5,14.85,9);corazon.rotation.y=-Math.PI/2;raiz.add(corazon);
  const hpts=[];for(let i=0;i<100;i++){const t=i*Math.PI*2/100;hpts.push(new THREE.Vector3(Math.pow(Math.sin(t),3),(.8125*Math.cos(t)-.3125*Math.cos(2*t)-.125*Math.cos(3*t)-.0625*Math.cos(4*t))*.95,0));}
  const heartGeo=new THREE.BufferGeometry().setFromPoints(hpts);geometrias.add(heartGeo);
  const heartMat=new THREE.LineBasicMaterial({color:'#ffe0a2',transparent:true,opacity:0,toneMapped:false});materiales.add(heartMat);corazon.add(new THREE.LineLoop(heartGeo,heartMat));
  const heartPointsMat=new THREE.PointsMaterial({map:brilloTex,color:'#ffdf9d',size:.09,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});materiales.add(heartPointsMat);corazon.add(new THREE.Points(heartGeo,heartPointsMat));
  const luz=new THREE.PointLight(0xffd5a1,25,13,2);luz.position.set(14.2,15.1,9);luz.castShadow=false;raiz.add(luz);marcar(luz);
  // Acabados de casa, jardín e iluminación, sin añadir dependencias externas.
  const yeso=canvas(256,256),yc=yeso.getContext('2d');yc.fillStyle='#fffaf0';yc.fillRect(0,0,256,256);
  for(let i=0;i<3500;i++){yc.fillStyle=i%2?'#baa9890c':'#ffffff40';yc.fillRect(azar()*256,azar()*256,1+azar(),1+azar());}
  paredCasa.map=tex(yeso);paredCasa.map.wrapS=paredCasa.map.wrapT=THREE.RepeatWrapping;paredCasa.map.repeat.set(2,2);paredCasa.roughness=.96;paredCasa.bumpMap=paredCasa.map;paredCasa.bumpScale=.015;paredCasa.needsUpdate=true;
  const tejaCanvas=canvas(512,512),rt=tejaCanvas.getContext('2d');rt.fillStyle='#b98573';rt.fillRect(0,0,512,512);
  for(let fila=0;fila<8;fila++)for(let col=-1;col<9;col++){
    const xx=col*64+(fila%2)*32,yy=fila*64;rt.fillStyle=(fila+col)%3?'#b78371':'#c3917e';rt.fillRect(xx+2,yy+2,60,60);rt.strokeStyle='#77504388';rt.lineWidth=2;rt.strokeRect(xx+1,yy+1,62,63);rt.strokeStyle='#f0c3a755';rt.beginPath();rt.moveTo(xx+7,yy+7);rt.lineTo(xx+56,yy+7);rt.stroke();
  }
  tejas.map=tex(tejaCanvas);tejas.color.set('#ffffff');tejas.roughness=.95;tejas.bumpMap=tejas.map;tejas.bumpScale=.023;tejas.needsUpdate=true;
  const posTecho=techoGeo.attributes.position,uvTecho=[];
  for(let i=0;i<posTecho.count;i++)uvTecho.push((posTecho.getZ(i)+1.57)/2.70,1-Math.abs(posTecho.getX(i))/1.8);
  techoGeo.setAttribute('uv',new THREE.Float32BufferAttribute(uvTecho,2));techoGeo.clearGroups();techoGeo.addGroup(0,6,0);techoGeo.addGroup(6,posTecho.count-6,1);tejado.material=[paredCasa,tejas];
  // Bordes de tejado y pequeño porche de madera.
  cilindroEntre([-1.83,2.09,1.15],[0,3.24,1.15],.033,bordeCasa,hogar);cilindroEntre([0,3.24,1.15],[1.83,2.09,1.15],.033,bordeCasa,hogar);
  cilindroEntre([0,3.24,-1.60],[0,3.24,1.18],.035,tejas,hogar);
  for(let i=0;i<7;i++)caja('Deseos · Tabla de porche',0,.18,1.12+i*.085,2.32,.035,.077,madera,hogar);
  const cortinaMat=material('#eee1c9',{roughness:1});
  for(const xx of [-.91,.91]){
    caja('Deseos · Jardinera de ventana',xx,.84,1.09,.77,.14,.23,madera,hogar);
    for(const dx of [-.18,.18])caja('Deseos · Cortina',xx+dx,1.28,1.055,.055,.49,.012,cortinaMat,hogar);
    for(let i=0;i<5;i++)esfera('Deseos · Flores de ventana',xx-.28+i*.14,.955,1.16,.05,.04,.05,floresMats[i%3],hogar);
  }
  // Unos pocos lotes de instancias añaden pétalos y hierba sin cientos de mallas.
  const floresOriginales=hogar.children.filter(o=>o.name==='Deseos · Flor'),lotesPetalos=new Map();
  for(const flor of floresOriginales){if(!lotesPetalos.has(flor.material))lotesPetalos.set(flor.material,[]);for(let j=0;j<5;j++){const a=j*Math.PI*2/5;const dummy=new THREE.Object3D();dummy.position.set(flor.position.x+Math.cos(a)*.066,flor.position.y,flor.position.z+Math.sin(a)*.066);dummy.scale.set(.049,.018,.032);dummy.rotation.y=-a;dummy.updateMatrix();lotesPetalos.get(flor.material).push(dummy.matrix.clone());}}
  for(const [mat,matrices] of lotesPetalos){const lote=marcar(new THREE.InstancedMesh(geoEsfera,mat,matrices.length));lote.name='Deseos · Pétalos agrupados';matrices.forEach((m,i)=>lote.setMatrixAt(i,m));lote.instanceMatrix.needsUpdate=true;lote.computeBoundingSphere();hogar.add(lote);}
  const hierbaGeo=new THREE.PlaneGeometry(.025,.15);geometrias.add(hierbaGeo);const hierbaMat=material('#6c8558',{side:THREE.DoubleSide});
  const hierba=marcar(new THREE.InstancedMesh(hierbaGeo,hierbaMat,100));hierba.name='Deseos · Hierba del jardín';
  for(let i=0;i<100;i++){const d=new THREE.Object3D();d.position.set((i%2?1:-1)*(1.92+azar()*.70),.20,-1.9+azar()*3.9);d.rotation.y=azar()*Math.PI;d.rotation.z=(azar()-.5)*.35;d.scale.y=.6+azar()*.65;d.updateMatrix();hierba.setMatrixAt(i,d.matrix);}
  hierba.instanceMatrix.needsUpdate=true;hierba.computeBoundingSphere();hogar.add(hierba);
  const halosVentana=[];
  for(const [xx,yy,zz,tam] of [[-.91,1.28,1.09,.77],[.91,1.28,1.09,.77],[0,2.5,1.20,.61]]){
    const m=new THREE.SpriteMaterial({map:brilloTex,color:'#ffd799',transparent:true,opacity:.04,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});materiales.add(m);halosVentana.push(m);const s=new THREE.Sprite(m);s.position.set(xx,yy,zz);s.scale.set(tam,tam,1);hogar.add(s);
  }
  const rellenoFamilia=new THREE.SpotLight(0xffe4c3,35,12,Math.PI/4,.75,2);rellenoFamilia.name='Deseos · Luz suave de la familia';rellenoFamilia.position.set(9.8,14.7,9);rellenoFamilia.castShadow=false;rellenoFamilia.target.position.set(14.3,11.7,9);raiz.add(rellenoFamilia,rellenoFamilia.target);
  const coloresParticulas=[];const paletaChispas=['#ffe7b0','#f3caad','#fff5dc'].map(c=>new THREE.Color(c));
  for(let i=0;i<semillas.length;i++){const c=paletaChispas[i%3];coloresParticulas.push(c.r,c.g,c.b);}
  particulasGeo.setAttribute('color',new THREE.Float32BufferAttribute(coloresParticulas,3));particulasMat.color.set('#ffffff');particulasMat.vertexColors=true;particulasMat.needsUpdate=true;

  // Interfaz efímera: sin almacenamiento, historial, solicitudes, analítica ni registro del texto.
  const id='sala-deseos-hogar',estilo=document.createElement('style');estilo.textContent=`
  #${id}[hidden],#${id} [hidden],#${id}-abrir[hidden]{display:none!important}
  #${id},#${id}-abrir{font:14px/1.6 system-ui,sans-serif;color:#f5ead2;box-sizing:border-box}
  #${id}{position:fixed;inset:0;z-index:33000;display:grid;place-items:center;padding:16px;background:#172026e8}
  #${id}.dh-animacion{display:flex;align-items:flex-end;justify-content:center;background:transparent}
  #${id} *{box-sizing:border-box}
  #${id} .dh-caja{position:relative;width:min(680px,100%);max-height:calc(100dvh - 32px);overflow:auto;padding:26px;background:linear-gradient(135deg,#3b5960,#253d46);border:1px solid #d2b783;border-radius:20px;box-shadow:0 20px 75px #0006}
  #${id}.dh-animacion .dh-caja{padding:18px 23px;background:#28444ced}
  #${id} h2{font:clamp(25px,4vw,34px) Georgia,serif;color:#ffebc5;margin:0 70px 12px 0}
  #${id} p{margin:10px 0}
  #${id} textarea{display:block;width:100%;min-height:155px;resize:vertical;max-height:35dvh;padding:15px;border:1px solid #c3b284;border-radius:12px;background:#f7eedb;color:#3b4240;font:17px/1.7 Georgia,serif;margin-top:9px}
  #${id} label{display:block;color:#efe0bf}
  #${id} .dh-contador{text-align:right;font-size:12px;color:#d3d2c0}
  #${id} button,#${id}-abrir{min-height:44px;padding:11px 17px;border:1px solid #d1b477;border-radius:10px;background:#526b6b;color:#fff0d2;font:14px system-ui,sans-serif;cursor:pointer;touch-action:manipulation}
  #${id} button:hover,#${id}-abrir:hover{background:#6c827a}
  #${id} :focus-visible,#${id}-abrir:focus-visible{outline:3px solid #ffe0a0;outline-offset:3px}
  #${id} button:disabled{opacity:.5;cursor:wait}
  #${id} .dh-cerrar{position:absolute;right:12px;top:12px}
  #${id} .dh-fila{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 0}
  #${id} .dh-privacidad{font-size:12px;line-height:1.65;color:#cbd0c7;border-top:1px solid #ffffff22;padding-top:12px;margin-top:15px}
  #${id} .dh-estado{color:#ffe0a6;min-height:1.6em;white-space:pre-line}
  #${id}-abrir{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:28;max-width:90vw;background:#2c5056ed;box-shadow:0 5px 25px #0006}
  #${id}.dh-animacion .dh-caja{max-height:45dvh}
  #${id}.dh-animacion .dh-estado{font:18px/1.65 Georgia,serif;color:#fff0cc}
  #${id}.dh-animacion .dh-privacidad{font-size:11px;line-height:1.45;margin-top:8px}
  @media(max-width:600px){#${id}{padding:7px}#${id} .dh-caja{padding:22px 15px;max-height:calc(100dvh - 14px)}#${id} textarea{font-size:16px;min-height:135px}#${id}.dh-animacion .dh-caja{padding:14px}#${id}.dh-animacion h2{font-size:22px}}
  `;document.head.appendChild(estilo);
  const panel=document.createElement('section');panel.id=id;panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby',id+'-titulo');
  panel.innerHTML=`<div class="dh-caja"><button type="button" class="dh-cerrar">Cerrar</button><h2 id="${id}-titulo">Un hogar para tus deseos</h2><div class="dh-escribir"><p>Hay deseos que no necesitan quedarse escritos. Compártelo con este instante y déjalo partir.</p><form class="dh-form" autocomplete="off" method="dialog"><label for="${id}-texto">Tu deseo<textarea id="${id}-texto" maxlength="500" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" placeholder="Escribe aquí tu deseo…"></textarea></label><p class="dh-contador" aria-live="off">0 / 500</p><div class="dh-fila"><button type="button" class="dh-enviar">Enviar mi deseo</button></div></form></div><p class="dh-estado" role="status" aria-live="polite"></p><div class="dh-fila"><button type="button" class="dh-otro" hidden>Escribir otro deseo</button></div><p class="dh-privacidad">Enviar solo activa una animación local. Este módulo no guarda ni transmite el texto. El campo se vacía al enviar, al cerrar o al ocultar esta página. No hay historial. Ctrl + Enter: enviar · Esc: cerrar.</p></div>`;document.body.appendChild(panel);
  const abrirBtn=document.createElement('button');abrirBtn.id=id+'-abrir';abrirBtn.type='button';abrirBtn.hidden=true;abrirBtn.textContent='R · Pedir un deseo';document.body.appendChild(abrirBtn);
  const titulo=panel.querySelector('h2'),formulario=panel.querySelector('form'),campo=panel.querySelector('textarea'),contador=panel.querySelector('.dh-contador'),estado=panel.querySelector('.dh-estado');
  const cerrarBtn=panel.querySelector('.dh-cerrar'),enviarBtn=panel.querySelector('.dh-enviar'),otroBtn=panel.querySelector('.dh-otro'),menu=document.getElementById('menu');
  let controles=null,oclusion=null,abierto=false,liberado=false,dentro=false,cerca=false,fase='cerrado',tiempo=0,reloj=0;
  let recuerdoCamara=null,destinoCamara=null;
  const reducido=window.matchMedia('(prefers-reduced-motion: reduce)').matches,localCam=new THREE.Vector3();
  function limpiarCampo(){campo.value='';campo.defaultValue='';formulario.reset();contador.textContent='0 / 500';}
  limpiarCampo();
  function interfaz(){
    const animando=fase==='animando',finalizado=fase==='finalizado';
    panel.classList.toggle('dh-animacion',animando||finalizado);panel.querySelector('.dh-escribir').hidden=animando||finalizado;
    enviarBtn.disabled=animando||finalizado;campo.disabled=animando||finalizado;otroBtn.hidden=!finalizado;
    titulo.textContent=animando?'Deja que tu deseo vuele…':finalizado?'Que la vida te sorprenda':'Un hogar para tus deseos';
    estado.textContent=animando?"Que este deseo encuentre su camino y la vida te sorprenda con algo bonito.\nMientras tanto, que no te falten amor, calma y compañía.":finalizado?"Que nunca te falte un hogar donde sentir paz, una mano que te acompañe y pequeños motivos para sonreír.\n\nOjalá la vida te acerque, paso a paso, a eso que hoy deseas.":'';
  }
  function enfocar(){
    castillo.updateWorldMatrix(true,false);const posicion=castillo.localToWorld(new THREE.Vector3(9.0,12.5,9.0)),objetivo=castillo.localToWorld(new THREE.Vector3(14.5,12.5,9.0));
    const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(posicion,objetivo,camara.up));
    if(camara.parent){camara.parent.updateWorldMatrix(true,false);camara.parent.worldToLocal(posicion);q.premultiply(camara.parent.getWorldQuaternion(new THREE.Quaternion()).invert());}
    return{posicion,quaternion:q};
  }
  function restaurarCamara(){if(recuerdoCamara){camara.position.copy(recuerdoCamara.posicion);camara.quaternion.copy(recuerdoCamara.quaternion);recuerdoCamara=null;destinoCamara=null;}}
  function resetVisual(){tiempo=0;sobre.position.copy(inicioSobre);sobre.rotation.set(0,-.15,0);sobre.scale.setScalar(1);papelMat.opacity=flapMat.opacity=selloMat.opacity=1;estrellaMat.opacity=0;particulasMat.opacity=0;heartMat.opacity=heartPointsMat.opacity=0;ventanaMat.emissiveIntensity=.30;lamparaMat.emissiveIntensity=.30;}
  function abrir(){
    if(liberado||!dentro||!cerca||abierto)return;
    limpiarCampo();resetVisual();fase='escribiendo';abierto=true;controles?.pausar?.();if(document.pointerLockElement){try{const p=document.exitPointerLock();p?.catch?.(()=>{});}catch{}}
    panel.hidden=false;abrirBtn.hidden=true;if(menu)menu.hidden=true;interfaz();campo.focus({preventScroll:true});
  }
  function enviar(){
    if(liberado||!abierto||fase!=='escribiendo')return;
    // Solo validación. No se crea ninguna copia del contenido ni se pasa a otra función.
    if(!/\S/u.test(campo.value)){estado.textContent='Escribe un deseo antes de enviarlo.';campo.focus();return;}
    if(campo.value.length>500){estado.textContent='El deseo puede tener hasta 500 caracteres.';return;}
    limpiarCampo();campo.blur();fase='animando';tiempo=0;
    recuerdoCamara={posicion:camara.position.clone(),quaternion:camara.quaternion.clone()};destinoCamara=enfocar();interfaz();cerrarBtn.focus();
  }
  function cerrar(){
    limpiarCampo();if(!abierto)return;
    restaurarCamara();resetVisual();fase='cerrado';abierto=false;panel.hidden=true;
    if(menu){menu.hidden=false;document.getElementById('boton-iniciar')?.focus();}
  }
  function otro(){if(liberado||fase!=='finalizado')return;limpiarCampo();restaurarCamara();resetVisual();fase='escribiendo';interfaz();campo.focus();}
  function alOcultar(){if(document.hidden)cerrar();}
  function alSalir(){cerrar();}
  function alMostrar(){limpiarCampo();}
  function alDesbloquear(){if(abierto&&menu)menu.hidden=true;}
  campo.addEventListener('input',()=>{contador.textContent=String(campo.value.length)+' / 500';if(fase==='escribiendo')estado.textContent='';});
  formulario.addEventListener('submit',e=>{e.preventDefault();enviar();});enviarBtn.addEventListener('click',enviar);otroBtn.addEventListener('click',otro);cerrarBtn.addEventListener('click',cerrar);abrirBtn.addEventListener('click',abrir);
  function teclado(e){
    if(abierto){
      if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();cerrar();return;}
      if(e.code==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.stopImmediatePropagation();enviar();return;}
      if(e.code==='Tab'){
        const lista=[...panel.querySelectorAll('button,textarea')].filter(b=>!b.disabled&&b.getClientRects().length),primero=lista[0],ultimo=lista[lista.length-1];
        if(e.shiftKey&&document.activeElement===primero){e.preventDefault();ultimo.focus();}else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primero.focus();}
      }
      if(['KeyW','KeyA','KeyS','KeyD','KeyE','KeyF','KeyR','KeyG','Space'].includes(e.code))e.stopImmediatePropagation();return;
    }
    if(e.code==='KeyR'&&!e.repeat&&dentro&&cerca&&!Boolean(menu&&!menu.hidden)&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&!document.activeElement?.isContentEditable){e.preventDefault();e.stopImmediatePropagation();abrir();}
  }
  document.addEventListener('keydown',teclado,true);document.addEventListener('pointerlockchange',alDesbloquear);document.addEventListener('visibilitychange',alOcultar);window.addEventListener('pagehide',alSalir);window.addEventListener('pageshow',alMostrar);
  function actualizarAnimacion(t){
    const duracion=reducido?2.8:9.5,p=Math.min(1,t/duracion),q=p*p*(3-2*p);
    if(recuerdoCamara&&destinoCamara){const c=Math.min(1,t/(reducido ? .05:1.4)),s=c*c*(3-2*c);camara.position.lerpVectors(recuerdoCamara.posicion,destinoCamara.posicion,s);camara.quaternion.slerpQuaternions(recuerdoCamara.quaternion,destinoCamara.quaternion,s);}
    const vuelo=Math.min(1,p/.37);sobre.position.lerpVectors(inicioSobre,finSobre,vuelo);sobre.position.y+=Math.sin(vuelo*Math.PI)*1.2;sobre.rotation.y=-.15+(reducido?0:vuelo*Math.PI*2);sobre.rotation.z=Math.sin(vuelo*Math.PI)*.18;
    const op=Math.max(0,1-Math.max(0,p-.25)/.15);papelMat.opacity=flapMat.opacity=selloMat.opacity=op;
    estrellaMat.opacity=Math.max(0,Math.min(1,(p-.26)/.12))*(p>.88?1-(p-.88)/.12:1);estrella.scale.setScalar(.8+Math.sin(p*Math.PI)*.9);
    const fuerza=Math.sin(Math.PI*Math.min(1,p*1.25));ventanaMat.emissiveIntensity=.3+fuerza*2.3;lamparaMat.emissiveIntensity=.3+fuerza*1.5;
    const inicio=.20,fin=.88,part=THREE.MathUtils.clamp((p-inicio)/(fin-inicio),0,1);particulasMat.opacity=(p>inicio&&p<.96)?Math.sin(part*Math.PI)*.85:0;
    const a=particulasGeo.attributes.position.array;
    for(let i=0;i<semillas.length;i++){const s=semillas[i],r=s.r*(.3+part*.8),ang=s.a+(reducido?0:part*3);a[i*3]=14.5+Math.cos(ang)*r;a[i*3+1]=11.4+Math.min(4.7,part*4.8*s.v+s.f*.4);a[i*3+2]=9+Math.sin(ang)*r;}
    particulasGeo.attributes.position.needsUpdate=true;
    const aparecer=THREE.MathUtils.clamp((p-.55)/.25,0,1);heartMat.opacity=aparecer*.85;heartPointsMat.opacity=aparecer*.95;
    if(p===1){fase='finalizado';ventanaMat.emissiveIntensity=1.0;lamparaMat.emissiveIntensity=.8;particulasMat.opacity=0;estrellaMat.opacity=0;interfaz();otroBtn.focus();}
  }
  function actualizar(dt=0){
    if(liberado)return;const paso=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.1));reloj+=paso;
    castillo.updateWorldMatrix(true,false);camara.getWorldPosition(localCam);castillo.worldToLocal(localCam);
    dentro=localCam.x>7.3&&localCam.x<19.7&&localCam.z> -1.65&&localCam.z<17.7&&localCam.y>10&&localCam.y<16.95;
    cerca=dentro&&localCam.distanceTo(new THREE.Vector3(10.1,11.7,4.3))<3.5;
    const visible=oclusion?.habitaciones?.find(h=>h.id===ROOM)?.visible??true;raiz.visible=visible;luz.visible=visible;abrirBtn.hidden=!dentro||!cerca||abierto||Boolean(menu&&!menu.hidden);
    if(fase==='animando'){tiempo+=paso;actualizarAnimacion(tiempo);}
    if(visible){
      for(const m of halosVentana)m.opacity=Math.min(.22,ventanaMat.emissiveIntensity*.065);
      const fiesta=fase==='animando'||fase==='finalizado';
      personas.forEach((p,i)=>{if(p.cabeza){p.cabeza.rotation.y=reducido?0:Math.sin(reloj*.55+i)*.055;p.cabeza.rotation.x=reducido?0:Math.sin(reloj*.7+i)*.018;const t=(reloj+i*.67)%5.6,b=t>5.35?1-.94*Math.sin((t-5.35)/.25*Math.PI):1;p.ojos.forEach(o=>o.scale.y=b);p.sonrisa.scale.x=fiesta?1.10:1;}p.grupo.rotation.z=reducido?0:Math.sin(reloj*(fiesta?2:1)+i)*.014;p.brazos.forEach(b=>{const objetivo=fiesta&&b.lado>0?(2.15+(reducido?0:Math.sin(reloj*5+i)*.18)):b.lado*.14;b.grupo.rotation.z=THREE.MathUtils.damp(b.grupo.rotation.z,objetivo,5,paso);});});
      if(fase==='finalizado'&&!reducido){corazon.scale.setScalar(1+Math.sin(reloj*1.7)*.025);heartPointsMat.opacity=.85+Math.sin(reloj*1.6)*.1;}
      if(fase!=='animando'&&fase!=='finalizado')corazon.scale.setScalar(1);
    }
    if(abierto&&!dentro)cerrar();if(abierto&&menu&&!menu.hidden)menu.hidden=true;
  }
  const api={raiz,hogar,actualizar,abrir,cerrar,enviar,
    vincularControles(c){controles=c;},vincularOclusion(o){oclusion=o;},
    get abierto(){return abierto;},get fase(){return fase;},
    liberar(){
      if(liberado)return;cerrar();liberado=true;
      document.removeEventListener('keydown',teclado,true);document.removeEventListener('pointerlockchange',alDesbloquear);document.removeEventListener('visibilitychange',alOcultar);window.removeEventListener('pagehide',alSalir);window.removeEventListener('pageshow',alMostrar);
      panel.remove();abrirBtn.remove();estilo.remove();raiz.removeFromParent();
      if(Array.isArray(colisiones)){for(const r of propios){const i=colisiones.indexOf(r);if(i>=0)colisiones.splice(i,1);}retirados.sort((a,b)=>a.indice-b.indice).forEach(r=>colisiones.splice(Math.min(r.indice,colisiones.length),0,r.valor));}
      ocultos.forEach(r=>r.objeto.visible=r.visible);for(const g of geometrias)g.dispose();for(const m of materiales)m.dispose();for(const t of texturas)t.dispose();delete castillo.userData.salaDeseosHogar;
    }
  };castillo.userData.salaDeseosHogar=api;return api;
}
