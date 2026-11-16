import * as THREE from 'three';

export const CUADROS_MAPAS = Object.freeze([
  {
    "id": "cuadro-1",
    "titulo": "Un mapa de recuerdos",
    "x": 8.9,
    "y": 12.9,
    "z": -17.53,
    "w": 2.35,
    "h": 2.5,
    "rot": 0
  },
  {
    "id": "cuadro-2",
    "titulo": "Instantes para guardar",
    "x": 11.9,
    "y": 12.9,
    "z": -17.53,
    "w": 2.35,
    "h": 2.5,
    "rot": 0
  },
  {
    "id": "cuadro-3",
    "titulo": "Un rincón para sonreír",
    "x": 14.9,
    "y": 12.9,
    "z": -17.53,
    "w": 2.35,
    "h": 2.5,
    "rot": 0
  },
  {
    "id": "cuadro-4",
    "titulo": "La magia de lo sencillo",
    "x": 17.9,
    "y": 12.9,
    "z": -17.53,
    "w": 2.35,
    "h": 2.5,
    "rot": 0
  },
  {
    "id": "cuadro-5",
    "titulo": "Donde nace la alegría",
    "x": 19.48,
    "y": 12.9,
    "z": -5.1,
    "w": 2.65,
    "h": 2.9,
    "rot": -1.5707963267948966
  },
  {
    "id": "cuadro-6",
    "titulo": "Recuerdos que abrazan",
    "x": 19.48,
    "y": 12.9,
    "z": -9,
    "w": 2.65,
    "h": 2.9,
    "rot": -1.5707963267948966
  },
  {
    "id": "cuadro-7",
    "titulo": "Un día para volver",
    "x": 19.48,
    "y": 12.9,
    "z": -15.1,
    "w": 2.65,
    "h": 2.9,
    "rot": -1.5707963267948966
  },
  {
    "id": "cuadro-8",
    "titulo": "Entre luz y compañía",
    "x": 8.9,
    "y": 12.9,
    "z": -2.39,
    "w": 2.35,
    "h": 2.5,
    "rot": 3.141592653589793
  },
  {
    "id": "cuadro-9",
    "titulo": "Pequeñas grandes historias",
    "x": 11.9,
    "y": 12.9,
    "z": -2.39,
    "w": 2.35,
    "h": 2.5,
    "rot": 3.141592653589793
  },
  {
    "id": "cuadro-10",
    "titulo": "El hogar en una mirada",
    "x": 14.9,
    "y": 12.9,
    "z": -2.39,
    "w": 2.35,
    "h": 2.5,
    "rot": 3.141592653589793
  },
  {
    "id": "cuadro-11",
    "titulo": "Caminos que compartimos",
    "x": 17.9,
    "y": 12.9,
    "z": -2.39,
    "w": 2.35,
    "h": 2.5,
    "rot": 3.141592653589793
  },
  {
    "id": "cuadro-12",
    "titulo": "Un pedacito de felicidad",
    "x": 7.39,
    "y": 12.9,
    "z": -14.6,
    "w": 2.5,
    "h": 2.7,
    "rot": 1.5707963267948966
  },
  {
    "id": "cuadro-13",
    "titulo": "Siempre en nuestra memoria",
    "x": 7.39,
    "y": 12.9,
    "z": -5.1,
    "w": 2.5,
    "h": 2.7,
    "rot": 1.5707963267948966
  }
]);

export function crearSalaMapasGaleria(escena,camara,castillo,elemento,opciones={}){
  if(castillo.userData.galeriaMapas)return castillo.userData.galeriaMapas;
  const ROOM='Sala de mapas',raiz=new THREE.Group();raiz.name='Sala de mapas · Galería de recuerdos';castillo.add(raiz);
  const geometrias=new Set(),materiales=new Set(),texturas=new Set(),propios=[],ocultos=[],retirados=[];
  const colisiones=castillo.userData.colisiones;
  const cajaGeo=new THREE.BoxGeometry(1,1,1),esferaGeo=new THREE.SphereGeometry(1,20,14),peloGeo=new THREE.SphereGeometry(1,7,5);
  [cajaGeo,esferaGeo,peloGeo].forEach(g=>geometrias.add(g));
  const marcar=o=>{Object.assign(o.userData,{habitacion:ROOM,noAgrupar:true,dinamico:true});return o;};marcar(raiz);
  function material(color,extra={}){const m=new THREE.MeshStandardMaterial({color,roughness:.8,...extra});materiales.add(m);return m;}
  const marfil=material('#e0d5bc'),nogal=material('#3e3029'),oro=material('#c3a065',{metalness:.55,roughness:.4}),azul=material('#334b60');
  const lienzoFondo=material('#eee4cd'),piedraClara=material('#b9b4a5');
  function caja(nombre,x,y,z,w,h,d,mat,padre=raiz,solido=false){
    const o=marcar(new THREE.Mesh(cajaGeo,mat));o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;padre.add(o);
    if(solido&&Array.isArray(colisiones)){const r={mesh:o,w,h,d,esCaja:true};colisiones.push(r);propios.push(r);}return o;
  }
  function esfera(nombre,x,y,z,sx,sy,sz,mat,padre=raiz){const o=marcar(new THREE.Mesh(esferaGeo,mat));o.name=nombre;o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=o.receiveShadow=true;padre.add(o);return o;}
  function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function tex(c){const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;texturas.add(t);return t;}
  function plano(c,w,h,x,y,z,padre=raiz){
    const g=new THREE.PlaneGeometry(w,h);geometrias.add(g);const m=new THREE.MeshBasicMaterial({map:tex(c),toneMapped:false});materiales.add(m);
    const o=marcar(new THREE.Mesh(g,m));o.position.set(x,y,z);padre.add(o);return o;
  }
  // Retirar únicamente el mobiliario antiguo que está dentro de esta habitación.
  castillo.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(castillo.matrixWorld).invert(),bb=new THREE.Box3();
  const zona=new THREE.Box3(new THREE.Vector3(7.35,9.99,-17.8),new THREE.Vector3(19.7,16.95,-2.32));
  castillo.traverse(o=>{
    if(!o.isMesh||!/^(Mesa|Armario)(\s|$)/i.test(o.name))return;
    bb.setFromObject(o).applyMatrix4(inv);if(zona.containsBox(bb))ocultos.push({objeto:o,visible:o.visible});
  });ocultos.forEach(r=>r.objeto.visible=false);
  if(Array.isArray(colisiones)){const quitar=new Set(ocultos.map(r=>r.objeto));for(let i=colisiones.length-1;i>=0;i--)if(quitar.has(colisiones[i].mesh))retirados.push({indice:i,valor:colisiones.splice(i,1)[0]});}
  // Revestimientos locales. La puerta oeste y la ventana oriental quedan libres.
  caja('Galería · Pared posterior',13.5,13.5,-17.585,12.3,6.96,.018,marfil);
  caja('Galería · Pared oriental',19.585,13.5,-9.96,.018,6.96,15.25,marfil);
  caja('Galería · Pared frontal',13.5,13.5,-2.315,12.3,6.96,.018,marfil);
  caja('Galería · Pared oeste norte',7.335,13.5,-14.5,.018,6.96,6.34,marfil);
  caja('Galería · Pared oeste sur',7.335,13.5,-5.5,.018,6.96,6.34,marfil);
  caja('Galería · Dintel',7.335,15.3,-10,.018,3.36,2.66,marfil);
  const piso=material('#76563d');caja('Galería · Suelo de nogal',13.46,10.05,-9.98,12.2,.012,15.22,piso);
  const vetas=canvas(512,512),vc=vetas.getContext('2d');vc.fillStyle='#795b43';vc.fillRect(0,0,512,512);
  for(let i=0;i<8;i++){vc.fillStyle=i%2?'#87684c':'#71523d';vc.fillRect(0,i*64,512,64);vc.strokeStyle='#392e2666';vc.lineWidth=2;vc.strokeRect(0,i*64,512,64);for(let j=0;j<6;j++){vc.beginPath();vc.moveTo(0,i*64+10+j*8);vc.bezierCurveTo(170,i*64+j*8,340,i*64+18+j*8,512,i*64+9+j*8);vc.stroke();}}
  const tp=tex(vetas);tp.wrapS=tp.wrapT=THREE.RepeatWrapping;tp.repeat.set(3,4);piso.map=tp;piso.color.set('#ffffff');
  for(const z of [-17.48,-2.43]){caja('Galería · Zócalo',13.45,10.32,z,12.2,.45,.14,nogal);caja('Galería · Moldura alta',13.45,15.55,z,12.2,.08,.1,oro);}
  caja('Galería · Zócalo este',19.48,10.32,-10,.14,.45,15.1,nogal);
  const alf=canvas(512,512),ac=alf.getContext('2d');ac.fillStyle='#243d51';ac.fillRect(0,0,512,512);
  for(const d of [12,22,43]){ac.strokeStyle=d===22?'#bba16d':'#65788a';ac.lineWidth=3;ac.strokeRect(d,d,512-2*d,512-2*d);}
  ac.translate(256,256);ac.strokeStyle='#c4ae7c';ac.lineWidth=2;
  for(let i=0;i<8;i++){ac.rotate(Math.PI/4);ac.beginPath();ac.moveTo(0,-100);ac.lineTo(12,-25);ac.lineTo(0,-40);ac.lineTo(-12,-25);ac.closePath();ac.stroke();}
  const alfombra=plano(alf,5.7,8.2,13.4,10.071,-10.1);alfombra.rotation.x=-Math.PI/2;
  caja('Galería · Banco',13.5,10.57,-4.6,3.8,.54,1.1,azul,raiz,true);
  for(const x of [12,15])for(const z of [-4.98,-4.22])caja('Galería · Pata de banco',x,10.26,z,.14,.4,.14,oro);
  const placa=canvas(768,256),pc=placa.getContext('2d');pc.fillStyle='#233943';pc.fillRect(0,0,768,256);pc.strokeStyle='#c6a868';pc.lineWidth=5;pc.strokeRect(12,12,744,232);pc.fillStyle='#f1dfb4';pc.textAlign='center';pc.font='40px Georgia';pc.fillText('GALERÍA DE RECUERDOS',384,112);pc.font='22px Georgia';pc.fillText('Sala de mapas · Cada imagen guarda un viaje',384,174);
  plano(placa,5.6,1.6,13.5,15.6,-17.53);
  // Dos macetas, fuera del recorrido principal.
  const hojaMat=material('#425e42'),barro=material('#9b6a4d');
  for(const x of [8.2,18.6]){
    const g=new THREE.CylinderGeometry(.34,.26,.65,14);geometrias.add(g);const maceta=marcar(new THREE.Mesh(g,barro));maceta.position.set(x,10.39,-3.25);raiz.add(maceta);
    for(let i=0;i<5;i++){const a=i*2.4;const h=esfera('Galería · Follaje',x+Math.cos(a)*.2,11.15+(i%2)*.25,-3.25+Math.sin(a)*.2,.19,.55,.14,hojaMat);h.rotation.z=Math.cos(a)*.4;}
  }
  // Cuadros con molduras en capas, esquinas talladas y etiquetas.
  const cuadros=[],seleccionables=[];
  function dibujarInicial(c,n){
    const ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.fillStyle=['#ddd0ad','#d7c9b7','#b9c6b2'][n%3];ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#74644966';ctx.lineWidth=1;
    for(let i=1;i<12;i++){ctx.beginPath();ctx.moveTo(i*w/12,0);ctx.lineTo(i*w/12,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*h/12);ctx.lineTo(w,i*h/12);ctx.stroke();}
    ctx.fillStyle='#799183';ctx.beginPath();ctx.moveTo(0,h*.7);for(let i=0;i<9;i++)ctx.lineTo(i*w/8,h*(.38+((i*7+n*3)%9)/30));ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
    ctx.strokeStyle='#e3d3a0';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(w*.15,h*.9);ctx.bezierCurveTo(w*.7,h*.45,w*.1,h*.3,w*.85,h*.14);ctx.stroke();
    ctx.fillStyle='#434b4d';const xx=w*.57,yy=h*.43;ctx.fillRect(xx,yy,w*.16,h*.2);for(const dx of [-.02,.13]){ctx.fillRect(xx+dx*w,yy-h*.08,w*.06,h*.28);ctx.beginPath();ctx.moveTo(xx+(dx-.01)*w,yy-h*.08);ctx.lineTo(xx+(dx+.03)*w,yy-h*.15);ctx.lineTo(xx+(dx+.07)*w,yy-h*.08);ctx.fill();}
    ctx.strokeStyle='#f8edcd';ctx.lineWidth=3;ctx.strokeRect(18,18,w-36,h-36);ctx.fillStyle='#f7edcc';ctx.textAlign='center';ctx.font=`${Math.round(w*.036)}px Georgia`;ctx.fillText('UN RECUERDO POR COLOCAR',w/2,h*.86);ctx.font=`${Math.round(w*.026)}px Georgia`;ctx.fillText('Abre la galería para elegir tu imagen',w/2,h*.915);
  }
  function rotulo(c,titulo){const ctx=c.getContext('2d');ctx.fillStyle='#e6d9bd';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#473e35';ctx.textAlign='center';let tam=30;do{ctx.font=`${tam}px Georgia`;if(ctx.measureText(titulo).width<c.width-30)break;tam--;}while(tam>12);ctx.fillText(titulo,c.width/2,c.height*.64);}
  CUADROS_MAPAS.forEach((d,i)=>{
    const g=new THREE.Group();g.name='Galería · Marco '+d.id;g.position.set(d.x,d.y,d.z);g.rotation.y=d.rot;raiz.add(g);
    caja('Galería · Fondo de cuadro',0,0,0,d.w+.22,d.h+.22,.14,nogal,g);
    for(const x of [-d.w/2,d.w/2]){caja('Galería · Marco tallado',x,0,.10,.17,d.h+.28,.15,oro,g);caja('Galería · Filete interior',x-Math.sign(x)*.11,0,.17,.035,d.h,.045,piedraClara,g);}
    for(const y of [-d.h/2,d.h/2]){caja('Galería · Marco tallado',0,y,.10,d.w+.28,.17,.15,oro,g);caja('Galería · Filete interior',0,y-Math.sign(y)*.11,.17,d.w,.035,.045,piedraClara,g);}
    for(const x of [-d.w/2,d.w/2])for(const y of [-d.h/2,d.h/2]){const adorno=esfera('Galería · Esquina labrada',x,y,.20,.12,.12,.055,oro,g);adorno.rotation.z=Math.PI/4;}
    const ancho=d.w/d.h>=1?768:Math.round(768*d.w/d.h),alto=d.w/d.h>=1?Math.round(768*d.h/d.w):768;
    const c=canvas(ancho,alto);dibujarInicial(c,i);const o=plano(c,d.w-.26,d.h-.26,0,0,.19,g);o.userData.cuadro=d.id;seleccionables.push(o);
    const label=canvas(768,90);rotulo(label,d.titulo);const cartel=plano(label,2.6,.30,0,-d.h/2-.37,.11,g);
    // Aplique decorativo; no añade una luz por cuadro.
    caja('Galería · Aplique',0,d.h/2+.34,.18,.72,.10,.22,oro,g);
    cuadros.push({def:d,canvas:c,mesh:o,label,cartel,titulo:d.titulo,publicado:null,local:null,version:0});
  });
  const luz=new THREE.PointLight(0xffdfb6,28,13,2);luz.position.set(13.3,15.5,-10);luz.castShadow=false;raiz.add(luz);marcar(luz);
  // GALERIA_FIJA_13_TECHO_PERRO_V2
  // Artesonado local de madera, paños azules, filetes dorados y medallón celeste.
  caja('Galería · Base del artesonado',13.5,16.60,-10,12.2,.10,15.2,nogal);
  const panoTecho=material('#344d61',{roughness:.94});
  for(const x of [8.95,11.95,14.95,17.95])for(const z of [-15.7,-11.9,-8.1,-4.3]){
    caja('Galería · Casetón azul',x,16.525,z,2.76,.045,3.52,panoTecho);
    for(const dx of [-1.30,1.30])caja('Galería · Filete del casetón',x+dx,16.49,z,.025,.025,3.32,oro);
    for(const dz of [-1.65,1.65])caja('Galería · Filete del casetón',x,16.49,z+dz,2.62,.025,.025,oro);
    esfera('Galería · Florón del casetón',x,16.47,z,.11,.045,.11,oro);
  }
  for(const x of [7.45,10.45,13.45,16.45,19.45]){
    caja('Galería · Viga longitudinal',x,16.44,-10,.15,.22,15.2,nogal);
    caja('Galería · Perfil dorado de viga',x,16.32,-10,.035,.025,15.15,oro);
  }
  for(const z of [-17.6,-13.8,-10,-6.2,-2.4]){
    caja('Galería · Viga transversal',13.45,16.435,z,12.15,.23,.15,nogal);
    caja('Galería · Perfil dorado transversal',13.45,16.31,z,12.15,.025,.035,oro);
  }
  const cielo=canvas(768,768),ct=cielo.getContext('2d');ct.fillStyle='#1f354b';ct.fillRect(0,0,768,768);ct.strokeStyle='#c8ab70';ct.lineWidth=5;ct.strokeRect(15,15,738,738);ct.lineWidth=2;ct.strokeRect(30,30,708,708);
  ct.translate(384,384);ct.strokeStyle='#dec58b';ct.lineWidth=3;
  for(let i=0;i<16;i++){ct.save();ct.rotate(i*Math.PI/8);ct.beginPath();ct.moveTo(0,-290);ct.lineTo(25,-64);ct.lineTo(0,-102);ct.lineTo(-25,-64);ct.closePath();ct.stroke();ct.restore();}
  ct.beginPath();ct.arc(0,0,65,0,Math.PI*2);ct.stroke();ct.font='30px Georgia';ct.textAlign='center';ct.fillStyle='#efdbad';ct.fillText('N',0,-305);ct.fillText('S',0,327);ct.fillText('E',321,12);ct.fillText('O',-321,12);
  for(let i=0;i<32;i++){const a=i*2.39996,r=110+(i*73%230);ct.fillStyle='#f3d99b';ct.beginPath();ct.arc(Math.cos(a)*r,Math.sin(a)*r,2+(i%2),0,Math.PI*2);ct.fill();}
  const medallon=plano(cielo,3.1,3.1,13.45,16.29,-10);medallon.rotation.x=Math.PI/2;
  const geoAro=new THREE.TorusGeometry(.85,.045,8,40);geometrias.add(geoAro);
  const aro=marcar(new THREE.Mesh(geoAro,oro));aro.name='Galería · Aro de la lámpara';aro.rotation.x=Math.PI/2;aro.position.set(13.45,15.35,-10);raiz.add(aro);
  caja('Galería · Soporte de lámpara',13.45,15.82,-10,.055,.93,.055,oro);
  const luzVela=material('#ffe2a0',{emissive:'#ffc472',emissiveIntensity:1.4});
  for(let i=0;i<6;i++){const a=i*Math.PI/3,x=13.45+Math.cos(a)*.82,z=-10+Math.sin(a)*.82;
    caja('Galería · Vela de lámpara',x,15.51,z,.085,.30,.085,marfil);
    esfera('Galería · Llama ornamental',x,15.70,z,.045,.09,.045,luzVela);
  }
  // Perrito estilizado inspirado en la referencia: pelo blanco, orejas oscuras,
  // máscara marrón, ojos grandes y hocico corto con barba. No es un modelo fotorealista.
  const perro=new THREE.Group();perro.name='Galería · Perrito guardián';perro.position.set(13.2,10.18,-11.1);perro.rotation.y=-Math.PI/2;perro.scale.setScalar(.72);raiz.add(perro);marcar(perro);
  const blanco=material('#eee9dc'),blancoCalido=material('#d4cbb8'),cafe=material('#594039'),oscuro=material('#302a2a');
  const negro=material('#171719',{roughness:.22}),brillo=material('#ffffff',{roughness:.1}),collarMat=material('#567484');
  const cuerpo=new THREE.Group();perro.add(cuerpo);
  esfera('Perrito · Cuerpo',0,.62,-.16,.48,.57,.63,blanco,cuerpo);
  esfera('Perrito · Pecho',0,.66,.23,.39,.51,.36,blanco,cuerpo);
  for(const x of [-.31,.31]){esfera('Perrito · Patita trasera',x,.22,-.34,.24,.23,.3,blanco,cuerpo);esfera('Perrito · Pata delantera',x*.8,.36,.30,.14,.29,.16,blanco,cuerpo);esfera('Perrito · Huellita',x*.8,.14,.4,.17,.12,.24,blancoCalido,cuerpo);}
  const cabeza=new THREE.Group();cabeza.position.set(0,1.24,.32);cuerpo.add(cabeza);
  esfera('Perrito · Cabeza',0,0,0,.53,.47,.46,blanco,cabeza);
  esfera('Perrito · Coronilla oscura',0,.15,-.09,.5,.37,.37,cafe,cabeza);
  for(const x of [-.23,.23])esfera('Perrito · Mancha del rostro',x,.07,.30,.28,.29,.20,cafe,cabeza);
  esfera('Perrito · Franja blanca',0,.19,.34,.125,.37,.15,blanco,cabeza);
  const ojos=[];
  for(const x of [-.225,.225]){
    const ojo=new THREE.Group();ojo.position.set(x,.075,.476);cabeza.add(ojo);ojos.push(ojo);
    esfera('Perrito · Ojo',0,0,0,.102,.109,.074,negro,ojo);esfera('Perrito · Reflejo',-.026,.035,.064,.026,.026,.014,brillo,ojo);
    esfera('Perrito · Reflejo pequeño',.027,-.023,.069,.012,.012,.008,brillo,ojo);
    esfera('Perrito · Ceja clara',x,.245,.43,.18,.07,.075,blanco,cabeza);
  }
  for(const x of [-.145,.145])esfera('Perrito · Bigote',x,-.205,.50,.22,.15,.20,blanco,cabeza);
  esfera('Perrito · Barba',0,-.37,.32,.33,.24,.21,blanco,cabeza);
  esfera('Perrito · Nariz',0,-.10,.689,.11,.079,.074,negro,cabeza);
  esfera('Perrito · Brillo de nariz',-.025,-.077,.753,.028,.012,.008,brillo,cabeza);
  const boca=material('#6c4847');esfera('Perrito · Sonrisa',0,-.29,.55,.12,.028,.025,boca,cabeza);
  const lenguaMat=material('#cf8790',{transparent:true,opacity:0,depthWrite:false});esfera('Perrito · Lengüita',0,-.33,.59,.06,.074,.018,lenguaMat,cabeza);
  let semilla=13579;const azar=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla/4294967296;};
  function pelo(padre,cantidad,muestreo,mat){
    const lote=marcar(new THREE.InstancedMesh(peloGeo,mat,cantidad));lote.name='Perrito · Mechones agrupados';const dummy=new THREE.Object3D();
    for(let i=0;i<cantidad;i++){const p=muestreo(i);dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.sx??.055,p.sy??.11,p.sz??.05);dummy.rotation.set(p.rx??0,p.ry??0,p.rz??0);dummy.updateMatrix();lote.setMatrixAt(i,dummy.matrix);}
    lote.instanceMatrix.needsUpdate=true;lote.computeBoundingSphere();lote.castShadow=lote.receiveShadow=true;padre.add(lote);return lote;
  }
  pelo(cuerpo,110,()=>{const u=azar()*Math.PI*2,v=Math.acos(2*azar()-1);return{x:.48*Math.sin(v)*Math.cos(u),y:.63+.55*Math.cos(v),z:-.13+.61*Math.sin(v)*Math.sin(u),sy:.08+azar()*.08,rz:(azar()-.5)*.6};},blanco);
  for(const lado of [-1,1]){
    const oreja=new THREE.Group();oreja.position.set(lado*.49,-.08,-.015);oreja.rotation.z=lado*.10;cabeza.add(oreja);
    esfera('Perrito · Oreja caída',0,-.13,0,.205,.43,.23,oscuro,oreja);
    pelo(oreja,46,()=>{const u=azar()*Math.PI*2,v=Math.acos(2*azar()-1);return{x:.18*Math.sin(v)*Math.cos(u),y:-.13+.39*Math.cos(v),z:.21*Math.sin(v)*Math.sin(u),sx:.038,sy:.14+azar()*.08,sz:.035,rz:lado*.1};},cafe);
    pelo(cabeza,13,()=>({x:lado*(.10+azar()*.22),y:-.24-azar()*.12,z:.54+azar()*.07,sx:.035,sy:.13+azar()*.06,sz:.035,rz:lado*(-.25-azar()*.55)}),blanco);
  }
  pelo(cabeza,28,()=>({x:(azar()-.5)*.29,y:.31+azar()*.12,z:.12+azar()*.27,sx:.045,sy:.12+azar()*.06,sz:.045,rz:(azar()-.5)*.8}),blanco);
  const cola=new THREE.Group();cola.position.set(0,.66,-.66);cuerpo.add(cola);
  const tg=new THREE.TorusGeometry(.25,.095,9,25,Math.PI*1.7);geometrias.add(tg);const rizo=marcar(new THREE.Mesh(tg,blanco));rizo.position.set(.13,.15,-.03);cola.add(rizo);
  esfera('Perrito · Punta de cola',.28,.39,-.03,.11,.16,.11,blanco,cola);
  const cg=new THREE.TorusGeometry(.31,.037,8,24);geometrias.add(cg);const collar=marcar(new THREE.Mesh(cg,collarMat));collar.rotation.x=Math.PI/2;collar.position.set(0,.96,.18);cuerpo.add(collar);
  esfera('Perrito · Medalla',0,.84,.45,.075,.085,.025,oro,cuerpo);
  const coj=material('#667f85');esfera('Galería · Cojín del perrito',13.2,10.13,-11.1,.91,.065,.72,coj);
  const proxyMat=material('#ffffff');proxyMat.visible=false;
  const proxy=caja('Galería · Colisión del perrito',13.2,10.84,-11.1,1.55,1.32,.94,proxyMat,raiz,true);proxy.castShadow=proxy.receiveShadow=false;
  // Galería fija: únicamente archivos publicados. Sin IndexedDB ni editor.
  const carpeta=new URL('./assets/galeriaMapas/',document.baseURI);
  const baseProyecto=new URL('./',document.baseURI),assetsPermitidos=new URL('./assets/',document.baseURI);
  let liberado=false,controles=null,oclusion=null,abierto=false,dentro=false,cercaPerro=false,indice=0,modo='perro';
  let reloj=0,accion=null,avisoCarga='Cargando los trece recuerdos…';
  const localCam=new THREE.Vector3(),paraPerro=new THREE.Vector3();
  const abortador=new AbortController();
  // Una patita articulada reutiliza las piezas del modelo que ya está instalado.
  const patita=new THREE.Group();patita.name='Perrito · Articulación de saludo';patita.position.set(.248,.55,.30);cuerpo.add(patita);
  const piezasPatita=[...cuerpo.children].filter(o=>o!==patita&&o.position.x>0&&['Perrito · Pata delantera','Perrito · Huellita'].includes(o.name));
  cuerpo.updateWorldMatrix(true,true);piezasPatita.forEach(o=>patita.attach(o));
  const pelota=new THREE.Group();pelota.name='Perrito · Pelota de juego';perro.add(pelota);
  const goma=material('#bf6b5b',{roughness:.5});esfera('Perrito · Pelota',0,0,0,.19,.19,.19,goma,pelota);
  const gp=new THREE.TorusGeometry(.186,.014,7,24);geometrias.add(gp);
  for(const giro of [0,Math.PI/2]){const aro=marcar(new THREE.Mesh(gp,azul));aro.rotation.y=giro;pelota.add(aro);}
  // La escala oculta el juguete sin interferir con los cambios de visibilidad de la oclusión.
  pelota.scale.setScalar(.0001);pelota.position.set(0,.3,1.05);
  const premio=new THREE.Group();premio.name='Perrito · Galletita animada';cabeza.add(premio);premio.position.set(.03,-.15,.82);premio.rotation.x=Math.PI/2;
  const gm=new THREE.CylinderGeometry(.12,.12,.045,14);geometrias.add(gm);
  const galletaMat=material('#c79557',{roughness:.95}),galleta=marcar(new THREE.Mesh(gm,galletaMat));premio.add(galleta);
  const relieveGalleta=material('#80603d');
  for(let i=0;i<5;i++){const a=i*2.4;esfera('Perrito · Relieve de galletita',Math.cos(a)*.065,.026,Math.sin(a)*.065,.012,.008,.012,relieveGalleta,premio);}
  premio.scale.setScalar(.0001);
  function imagenURL(url){return new Promise((resolve,reject)=>{
    const im=new Image();const timer=setTimeout(()=>{im.onload=im.onerror=null;im.src='';reject(new Error('La imagen tardó demasiado en cargar.'));},18000);
    im.onload=()=>{clearTimeout(timer);resolve(im);};im.onerror=()=>{clearTimeout(timer);reject(new Error('No se encontró la imagen publicada.'));};im.src=url;
  });}
  function pintarImagen(c,im){const ctx=c.getContext('2d');ctx.fillStyle='#efe6d1';ctx.fillRect(0,0,c.width,c.height);const s=Math.min(c.width/im.width,c.height/im.height),w=im.width*s,h=im.height*s;ctx.drawImage(im,(c.width-w)/2,(c.height-h)/2,w,h);}
  async function cargar(){
    const timer=setTimeout(()=>abortador.abort(),12000);
    try{
      const r=await fetch(new URL('galeria.json',carpeta),{cache:'no-store',signal:abortador.signal});
      if(!r.ok)throw new Error('No se encontró assets/galeriaMapas/galeria.json.');
      const datos=await r.json();if(!Array.isArray(datos.cuadros)||datos.cuadros.length!==13)throw new Error('galeria.json debe contener los trece cuadros.');
      const ids=new Set(datos.cuadros.map(c=>c.id));if(ids.size!==13||!cuadros.every(f=>ids.has(f.def.id)))throw new Error('Los identificadores de galeria.json no coinciden con los trece cuadros.');
      const fallos=[];
      // Carga con tres tareas simultáneas para evitar decodificar las 13 fotos a la vez.
      let cursor=0;
      async function trabajador(){while(cursor<cuadros.length&&!liberado){
        const f=cuadros[cursor++],item=datos.cuadros.find(c=>c.id===f.def.id);
        try{
          if(typeof item.archivo!=='string'||!item.archivo)throw new Error('Falta el nombre de la imagen.');
          const u=new URL(item.archivo,baseProyecto);if(u.origin!==assetsPermitidos.origin||!u.href.startsWith(assetsPermitidos.href))throw new Error('La imagen debe pertenecer a assets/ de este proyecto.');
          const im=await imagenURL(u.href);if(liberado)return;
          pintarImagen(f.canvas,im);f.titulo=String(item.titulo||f.def.titulo).slice(0,90);rotulo(f.label,f.titulo);f.mesh.material.map.needsUpdate=f.cartel.material.map.needsUpdate=true;
          if(abierto&&modo==='foto'&&cuadros[indice]===f)interfaz();
        }catch(e){if(!liberado)fallos.push(`${f.def.id}: ${e.message}`);}
      }}
      await Promise.all([trabajador(),trabajador(),trabajador()]);
      if(!liberado)avisoCarga=fallos.length?`No cargaron ${fallos.length} imágenes. Revisa que hayas publicado la carpeta completa.\n${fallos.join('\n')}`:'13 recuerdos · Galería de solo lectura';
    }catch(e){if(!liberado)avisoCarga=e.message;}
    finally{clearTimeout(timer);if(!liberado&&abierto)interfaz();}
  }
  const id='galeria-mapas',estilo=document.createElement('style');estilo.textContent=`
  #${id}[hidden],#${id} [hidden],#${id}-acciones[hidden]{display:none!important}
  #${id},#${id}-acciones{font:14px/1.5 system-ui,sans-serif;color:#f5e8ce;box-sizing:border-box}
  #${id}{position:fixed;inset:0;z-index:31000;display:flex;justify-content:center;align-items:flex-end;padding:15px;background:transparent}
  #${id}.gm-modo-foto{align-items:center;background:#10151ce8}
  #${id} *{box-sizing:border-box}
  #${id} .gm-caja{position:relative;width:min(880px,100%);max-height:calc(100dvh - 30px);overflow:auto;padding:22px;background:#1f3039f5;border:1px solid #b99c63;border-radius:18px;box-shadow:0 14px 55px #0008}
  #${id} h2{font:27px Georgia,serif;color:#f6dfad;margin:0 65px 10px 0}
  #${id} .gm-cerrar{position:absolute;right:13px;top:13px}
  #${id} button,#${id}-acciones button{min-height:44px;padding:10px 14px;border:1px solid #b59b61;border-radius:9px;background:#344950;color:#f5e8ce;font:14px system-ui,sans-serif;cursor:pointer;touch-action:manipulation}
  #${id} button:hover,#${id}-acciones button:hover{background:#4a626b}
  #${id} button:disabled{opacity:.5;cursor:wait}
  #${id} :focus-visible,#${id}-acciones :focus-visible{outline:3px solid #f0cb7b;outline-offset:3px}
  #${id} .gm-botones{display:flex;flex-wrap:wrap;gap:9px;margin:12px 0}
  #${id} canvas{display:block;max-width:100%;max-height:65dvh;width:auto;height:auto;margin:auto;border:8px ridge #b6975b}
  #${id} .gm-aviso{white-space:pre-line;color:#d5c398;font-size:13px;margin:10px 0 0}
  #${id} .gm-ayuda{color:#c7c6bd;margin:0 0 9px}
  #${id}-acciones{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:26;display:flex;gap:9px;max-width:92vw;width:max-content;flex-wrap:wrap;justify-content:center}
  #${id}-acciones button{background:#20343bee;box-shadow:0 5px 20px #0007}
  @media(max-width:600px){#${id}{padding:7px}#${id} .gm-caja{padding:18px 12px}#${id} h2{font-size:22px}#${id} button{font-size:12px;padding:10px}#${id} canvas{max-height:58dvh}}
  `;document.head.appendChild(estilo);
  const panel=document.createElement('section');panel.id=id;panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby',id+'-titulo');
  panel.innerHTML=`<div class="gm-caja"><button type="button" class="gm-cerrar">Cerrar</button><h2 id="${id}-titulo"></h2><div class="gm-foto"><canvas width="768" height="768" role="img" aria-label="Fotografía de la galería"></canvas><div class="gm-botones"><button type="button" class="gm-anterior">← Anterior</button><button type="button" class="gm-siguiente">Siguiente →</button></div></div><div class="gm-perro"><p class="gm-ayuda">Tu pequeño guardián está listo para pasar un rato contigo.</p><div class="gm-botones"><button type="button" data-accion="mimos">Acariciar</button><button type="button" data-accion="patita">Pedir la patita</button><button type="button" data-accion="pelota">Jugar con la pelota</button><button type="button" data-accion="galleta">Dar una galletita</button><button type="button" data-accion="descanso">Descansar</button></div></div><p class="gm-aviso" role="status" aria-live="polite"></p></div>`;document.body.appendChild(panel);
  const acciones=document.createElement('div');acciones.id=id+'-acciones';acciones.hidden=true;acciones.innerHTML='<button type="button" class="gm-abrir">R · Ver recuerdo</button><button type="button" class="gm-mimos">G · Acariciar</button>';document.body.appendChild(acciones);
  const titulo=panel.querySelector('h2'),preview=panel.querySelector('canvas'),aviso=panel.querySelector('.gm-aviso'),fotoDiv=panel.querySelector('.gm-foto'),perroDiv=panel.querySelector('.gm-perro');
  const cerrarBtn=panel.querySelector('.gm-cerrar'),abrirBtn=acciones.querySelector('.gm-abrir'),mimosBtn=acciones.querySelector('.gm-mimos'),botonesPerro=[...panel.querySelectorAll('[data-accion]')];
  const menu=document.getElementById('menu');
  const duraciones={mimos:3.5,patita:3.5,pelota:6,galleta:3.6,descanso:6};
  const mensajes={mimos:'Disfrutando los mimos…',patita:'¡Te está dando la patita!',pelota:'¡A jugar con la pelota!',galleta:'¡Una galletita para el pequeño guardián!',descanso:'Un momento tranquilo para descansar…'};
  function interfaz(){
    if(liberado)return;const esFoto=modo==='foto';panel.classList.toggle('gm-modo-foto',esFoto);fotoDiv.hidden=!esFoto;perroDiv.hidden=esFoto;
    if(esFoto){const f=cuadros[indice];titulo.textContent=f.titulo;preview.width=f.canvas.width;preview.height=f.canvas.height;preview.getContext('2d').drawImage(f.canvas,0,0);preview.setAttribute('aria-label',f.titulo);aviso.textContent=`${indice+1} / ${cuadros.length} · Solo lectura\n${avisoCarga}`;}
    else{titulo.textContent='El pequeño guardián';aviso.textContent=accion?mensajes[accion.tipo]:'Elige una interacción. Esc para cerrar.';}
    botonesPerro.forEach(b=>b.disabled=Boolean(accion));
  }
  function abrir(n=null){
    if(liberado||!dentro||abierto)return;
    if(Number.isInteger(n)){indice=THREE.MathUtils.clamp(n,0,cuadros.length-1);modo='foto';}else modo=cercaPerro?'perro':'foto';
    abierto=true;controles?.pausar?.();if(document.pointerLockElement){try{const p=document.exitPointerLock();p?.catch?.(()=>{});}catch{}}
    acciones.hidden=true;panel.hidden=false;if(menu)menu.hidden=true;interfaz();cerrarBtn.focus();
  }
  function cerrar(){if(!abierto)return;abierto=false;panel.hidden=true;if(menu){menu.hidden=false;document.getElementById('boton-iniciar')?.focus();}}
  function interactuar(tipo){
    if(liberado||accion||!cercaPerro||!Object.prototype.hasOwnProperty.call(duraciones,tipo))return;
    accion={tipo,t:0,duracion:duraciones[tipo]};if(abierto)interfaz();
  }
  function acariciar(){interactuar('mimos');}
  function cambiar(d){indice=(indice+d+cuadros.length)%cuadros.length;interfaz();}
  function cercano(){let n=0,d=Infinity;cuadros.forEach((f,i)=>{const x=localCam.distanceToSquared(new THREE.Vector3(f.def.x,f.def.y,f.def.z));if(x<d){d=x;n=i;}});return n;}
  const raycaster=new THREE.Raycaster(),centro=new THREE.Vector2();
  function clicMundo(){if(!dentro||abierto||document.pointerLockElement!==elemento)return;raycaster.setFromCamera(centro,camara);const g=raycaster.intersectObjects(seleccionables,false)[0];if(g&&g.distance<10)abrir(cuadros.findIndex(f=>f.mesh===g.object));}
  function teclado(e){
    if(abierto){
      if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();cerrar();return;}
      if(modo==='foto'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)cambiar(e.code==='ArrowLeft'?-1:1);return;}
      if(e.code==='Tab'){
        const lista=[...panel.querySelectorAll('button')].filter(b=>!b.disabled&&b.getClientRects().length),primero=lista[0],ultimo=lista[lista.length-1];
        if(e.shiftKey&&document.activeElement===primero){e.preventDefault();ultimo.focus();}else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primero.focus();}
      }
      if(['KeyW','KeyA','KeyS','KeyD','KeyE','KeyF','KeyR','KeyG','Space'].includes(e.code))e.stopImmediatePropagation();return;
    }
    if(!dentro||e.repeat||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable||Boolean(menu&&!menu.hidden))return;
    if(e.code==='KeyR'){e.preventDefault();e.stopImmediatePropagation();abrir(cercaPerro?null:cercano());}
    if(e.code==='KeyG'&&cercaPerro){e.preventDefault();e.stopImmediatePropagation();acariciar();}
  }
  function alDesbloquear(){if(abierto&&menu)menu.hidden=true;}
  cerrarBtn.addEventListener('click',cerrar);abrirBtn.addEventListener('click',()=>abrir(cercaPerro?null:cercano()));mimosBtn.addEventListener('click',acariciar);
  panel.querySelector('.gm-anterior').addEventListener('click',()=>cambiar(-1));panel.querySelector('.gm-siguiente').addEventListener('click',()=>cambiar(1));
  botonesPerro.forEach(b=>b.addEventListener('click',()=>interactuar(b.dataset.accion)));
  document.addEventListener('keydown',teclado,true);document.addEventListener('pointerlockchange',alDesbloquear);elemento.addEventListener('click',clicMundo);
  function actualizar(dt=0){
    if(liberado)return;const paso=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.1));reloj+=paso;
    castillo.updateWorldMatrix(true,false);camara.getWorldPosition(localCam);castillo.worldToLocal(localCam);
    dentro=localCam.x>7.3&&localCam.x<19.7&&localCam.z> -17.7&&localCam.z< -2.3&&localCam.y>10&&localCam.y<16.95;
    cercaPerro=dentro&&Math.hypot(localCam.x-perro.position.x,localCam.z-perro.position.z,localCam.y-(perro.position.y+.8))<3.1;
    const visible=oclusion?.habitaciones?.find(h=>h.id===ROOM)?.visible??true;raiz.visible=visible;luz.visible=visible;
    acciones.hidden=!dentro||abierto||Boolean(menu&&!menu.hidden);abrirBtn.textContent=cercaPerro?'R · Interactuar con el perrito':'R · Ver recuerdo';mimosBtn.hidden=!cercaPerro;
    if(accion){accion.t+=paso;if(accion.t>=accion.duracion){accion=null;if(abierto)interfaz();}}
    if(visible){
      const tipo=accion?.tipo,t=accion?.t??0,p=accion?Math.min(1,t/accion.duracion):0;
      const entrada=accion?Math.min(1,t/.35,(accion.duracion-t)/.35):0;
      paraPerro.copy(localCam).sub(perro.position).applyAxisAngle(THREE.Object3D.DEFAULT_UP,-perro.rotation.y);
      let giro=cercaPerro?THREE.MathUtils.clamp(Math.atan2(paraPerro.x,paraPerro.z),-.42,.42):Math.sin(reloj*.5)*.07;
      if(tipo==='pelota')giro=Math.sin(t*5)*.25;
      cabeza.rotation.y=THREE.MathUtils.damp(cabeza.rotation.y,giro,5,paso);
      const inclinar=tipo==='mimos' ? .18+Math.sin(t*3)*.05:tipo==='patita'?-.14:tipo==='descanso' ? .09:Math.sin(reloj*.8)*.025;
      cabeza.rotation.z=THREE.MathUtils.damp(cabeza.rotation.z,inclinar,5,paso);
      cabeza.rotation.x=tipo==='galleta'?Math.sin(t*16)*.05:tipo==='pelota'?-.04+Math.sin(t*5)*.09:tipo==='descanso' ? .20*entrada:Math.sin(reloj*.8)*.022;
      cola.rotation.y=Math.sin(reloj*(tipo==='descanso'?1:tipo?14:cercaPerro?8:2.8))*(tipo==='descanso' ? .025:tipo ? .58:cercaPerro ? .40:.12);
      cuerpo.scale.y=1+Math.sin(reloj*(tipo==='descanso'?1.5:2.3))*.009;
      cuerpo.position.y=THREE.MathUtils.damp(cuerpo.position.y,tipo==='descanso'?-.055:0,5,paso);
      const objetivo=tipo==='patita'?(-1.10+Math.sin(t*9)*.13)*entrada:tipo==='pelota'?(-.3-Math.abs(Math.sin(t*5))*.35)*entrada:0;
      patita.rotation.x=THREE.MathUtils.damp(patita.rotation.x,objetivo,10,paso);
      const ciclo=reloj%5.4,parpadeo=ciclo>5.15?1-.94*Math.sin((ciclo-5.15)/.25*Math.PI):1;
      ojos.forEach(o=>o.scale.y=tipo==='descanso'?Math.max(.06,1-.94*entrada):parpadeo);
      lenguaMat.opacity=['mimos','pelota','galleta'].includes(tipo)?entrada:0;
      pelota.scale.setScalar(tipo==='pelota'?Math.max(.0001,entrada):.0001);pelota.position.set(Math.sin(t*4)*.22,.23+Math.abs(Math.sin(t*5))*.55,1.10+Math.cos(t*4)*.08);pelota.rotation.x=t*3;pelota.rotation.z=t*2;
      const tam=tipo==='galleta'?Math.min(1,t/.35)*Math.max(0,1-Math.max(0,p-.4)/.5):0;premio.scale.setScalar(Math.max(.0001,tam));premio.rotation.z=Math.sin(t*8)*.12;
    }
    if(abierto&&!dentro)cerrar();if(abierto&&menu&&!menu.hidden)menu.hidden=true;
  }
  const listo=cargar();
  const api={raiz,perro,cuadros,actualizar,abrir,cerrar,acariciar,interactuar,listo,
    vincularControles(c){controles=c;},vincularOclusion(o){oclusion=o;},
    get abierto(){return abierto;},get soloLectura(){return true;},get accionActual(){return accion?.tipo??null;},
    liberar(){
      if(liberado)return;cerrar();liberado=true;abortador.abort();
      document.removeEventListener('keydown',teclado,true);document.removeEventListener('pointerlockchange',alDesbloquear);elemento.removeEventListener('click',clicMundo);
      panel.remove();acciones.remove();estilo.remove();raiz.removeFromParent();
      if(Array.isArray(colisiones)){for(const r of propios){const i=colisiones.indexOf(r);if(i>=0)colisiones.splice(i,1);}retirados.sort((a,b)=>a.indice-b.indice).forEach(r=>colisiones.splice(Math.min(r.indice,colisiones.length),0,r.valor));}
      ocultos.forEach(r=>r.objeto.visible=r.visible);for(const g of geometrias)g.dispose();for(const m of materiales)m.dispose();for(const t of texturas)t.dispose();delete castillo.userData.galeriaMapas;
    }
  };castillo.userData.galeriaMapas=api;return api;
}
