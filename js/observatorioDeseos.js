import * as THREE from 'three';

export const CONSTELACIONES_DESEOS = Object.freeze([
  {
    "id": "corona",
    "nombre": "La corona",
    "puntos": [
      [
        0.18,
        0.75
      ],
      [
        0.1,
        0.18
      ],
      [
        0.32,
        0.45
      ],
      [
        0.5,
        0.1
      ],
      [
        0.68,
        0.45
      ],
      [
        0.9,
        0.18
      ],
      [
        0.82,
        0.75
      ],
      [
        0.8,
        0.88
      ],
      [
        0.2,
        0.88
      ]
    ],
    "aristas": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        8,
        0
      ]
    ],
    "mensaje": "Un reino no vale por su corona, sino por quienes encuentran refugio en él."
  },
  {
    "id": "corazon",
    "nombre": "El corazón",
    "puntos": [
      [
        0.5,
        0.87
      ],
      [
        0.16,
        0.53
      ],
      [
        0.1,
        0.3
      ],
      [
        0.18,
        0.12
      ],
      [
        0.34,
        0.1
      ],
      [
        0.5,
        0.29
      ],
      [
        0.66,
        0.1
      ],
      [
        0.82,
        0.12
      ],
      [
        0.9,
        0.3
      ],
      [
        0.84,
        0.53
      ]
    ],
    "aristas": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        8,
        9
      ],
      [
        9,
        0
      ]
    ],
    "mensaje": "Hay luces que no vienen de las estrellas, sino de las personas que nos acompañan."
  },
  {
    "id": "perrito",
    "nombre": "El pequeño guardián",
    "puntos": [
      [
        0.5,
        0.12
      ],
      [
        0.32,
        0.18
      ],
      [
        0.2,
        0.24
      ],
      [
        0.18,
        0.5
      ],
      [
        0.3,
        0.53
      ],
      [
        0.35,
        0.42
      ],
      [
        0.33,
        0.79
      ],
      [
        0.26,
        0.88
      ],
      [
        0.74,
        0.88
      ],
      [
        0.67,
        0.79
      ],
      [
        0.65,
        0.42
      ],
      [
        0.7,
        0.53
      ],
      [
        0.82,
        0.5
      ],
      [
        0.8,
        0.24
      ],
      [
        0.68,
        0.18
      ],
      [
        0.5,
        0.42
      ],
      [
        0.5,
        0.72
      ],
      [
        0.42,
        0.3
      ],
      [
        0.58,
        0.3
      ]
    ],
    "aristas": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        8,
        9
      ],
      [
        9,
        10
      ],
      [
        10,
        11
      ],
      [
        11,
        12
      ],
      [
        12,
        13
      ],
      [
        13,
        14
      ],
      [
        14,
        0
      ],
      [
        17,
        15
      ],
      [
        15,
        18
      ],
      [
        15,
        16
      ],
      [
        16,
        7
      ],
      [
        16,
        8
      ]
    ],
    "mensaje": "A veces, la compañía más grande llega caminando sobre cuatro patitas."
  },
  {
    "id": "castillo",
    "nombre": "La fortaleza",
    "puntos": [
      [
        0.12,
        0.88
      ],
      [
        0.12,
        0.32
      ],
      [
        0.2,
        0.32
      ],
      [
        0.2,
        0.22
      ],
      [
        0.28,
        0.22
      ],
      [
        0.28,
        0.32
      ],
      [
        0.38,
        0.32
      ],
      [
        0.38,
        0.1
      ],
      [
        0.47,
        0.1
      ],
      [
        0.47,
        0.2
      ],
      [
        0.53,
        0.2
      ],
      [
        0.53,
        0.1
      ],
      [
        0.62,
        0.1
      ],
      [
        0.62,
        0.32
      ],
      [
        0.72,
        0.32
      ],
      [
        0.72,
        0.22
      ],
      [
        0.8,
        0.22
      ],
      [
        0.8,
        0.32
      ],
      [
        0.88,
        0.32
      ],
      [
        0.88,
        0.88
      ],
      [
        0.43,
        0.88
      ],
      [
        0.43,
        0.66
      ],
      [
        0.57,
        0.66
      ],
      [
        0.57,
        0.88
      ]
    ],
    "aristas": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        4
      ],
      [
        4,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        7
      ],
      [
        7,
        8
      ],
      [
        8,
        9
      ],
      [
        9,
        10
      ],
      [
        10,
        11
      ],
      [
        11,
        12
      ],
      [
        12,
        13
      ],
      [
        13,
        14
      ],
      [
        14,
        15
      ],
      [
        15,
        16
      ],
      [
        16,
        17
      ],
      [
        17,
        18
      ],
      [
        18,
        19
      ],
      [
        19,
        0
      ],
      [
        20,
        21
      ],
      [
        21,
        22
      ],
      [
        22,
        23
      ]
    ],
    "mensaje": "El mejor castillo no nos separa del mundo: nos da un lugar desde el que volver a empezar."
  }
]);

export const claveEstelar=(a,b)=>a<b?`${a}-${b}`:`${b}-${a}`;
export function normalizarAvanceEstelar(datos){
  const resultado={};
  for(const f of CONSTELACIONES_DESEOS){
    const permitidas=new Set(f.aristas.map(([a,b])=>claveEstelar(a,b)));
    const recibidas=Array.isArray(datos?.[f.id])?datos[f.id]:[];
    resultado[f.id]=new Set(recibidas.filter(k=>typeof k==='string'&&permitidas.has(k)));
  }
  return resultado;
}

export function crearObservatorioDeseos(escena,camara,castillo,elemento,opciones={}){
  if(castillo.userData.observatorioDeseos)return castillo.userData.observatorioDeseos;
  const ROOM='Dormitorio oeste',raiz=new THREE.Group();raiz.name='Observatorio de los deseos';castillo.add(raiz);
  const geometrias=new Set(),materiales=new Set(),texturas=new Set(),propios=[],ocultos=[],retirados=[];
  const colisiones=castillo.userData.colisiones,geoCaja=new THREE.BoxGeometry(1,1,1);geometrias.add(geoCaja);
  const marcar=o=>{Object.assign(o.userData,{habitacion:ROOM,noAgrupar:true,dinamico:true});return o;};marcar(raiz);
  function material(color,extra={}){const m=new THREE.MeshStandardMaterial({color,roughness:.8,...extra});materiales.add(m);return m;}
  const azul=material('#172c4a'),oro=material('#c5a365',{metalness:.6,roughness:.36}),nogal=material('#352a2b'),crema=material('#d9c8a1');
  function caja(nombre,x,y,z,w,h,d,mat,padre=raiz,solido=false){
    const o=marcar(new THREE.Mesh(geoCaja,mat));o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;padre.add(o);
    if(solido&&Array.isArray(colisiones)){const r={mesh:o,w,h,d,esCaja:true};colisiones.push(r);propios.push(r);}return o;
  }
  function esfera(nombre,x,y,z,r,mat,padre=raiz){const g=new THREE.SphereGeometry(r,24,18);geometrias.add(g);const o=marcar(new THREE.Mesh(g,mat));o.name=nombre;o.position.set(x,y,z);padre.add(o);return o;}
  function cilindroEntre(a,b,r,mat,padre=raiz){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),dir=vb.clone().sub(va);const g=new THREE.CylinderGeometry(r,r,dir.length(),14);geometrias.add(g);const o=marcar(new THREE.Mesh(g,mat));o.position.copy(va.add(vb).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());o.castShadow=o.receiveShadow=true;padre.add(o);return o;}
  function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function tex(c){const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;texturas.add(t);return t;}
  function plano(c,w,h,x,y,z,rotX=0){const g=new THREE.PlaneGeometry(w,h);geometrias.add(g);const m=new THREE.MeshBasicMaterial({map:tex(c),toneMapped:false});materiales.add(m);const o=marcar(new THREE.Mesh(g,m));o.position.set(x,y,z);o.rotation.x=rotX;raiz.add(o);return o;}
  const zona=new THREE.Box3(new THREE.Vector3(-19.7,9.99,-1.65),new THREE.Vector3(-7.35,16.95,17.7));
  castillo.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(castillo.matrixWorld).invert(),bb=new THREE.Box3();
  castillo.traverse(o=>{if(!o.isMesh||!/^(Cama|Cabecera)(\s|$)/i.test(o.name))return;bb.setFromObject(o).applyMatrix4(inv);if(zona.containsBox(bb))ocultos.push({objeto:o,visible:o.visible});});
  ocultos.forEach(r=>r.objeto.visible=false);
  if(Array.isArray(colisiones)){const quitar=new Set(ocultos.map(r=>r.objeto));for(let i=colisiones.length-1;i>=0;i--)if(quitar.has(colisiones[i].mesh))retirados.push({indice:i,valor:colisiones.splice(i,1)[0]});}
  caja('Observatorio · Muro oeste',-19.585,13.5,8,.018,6.96,19.2,azul);
  caja('Observatorio · Muro frontal',-13.5,13.5,17.585,12.25,6.96,.018,azul);
  caja('Observatorio · Muro posterior',-13.5,13.5,-1.685,12.25,6.96,.018,azul);
  caja('Observatorio · Muro este sur',-7.335,13.5,2.6,.018,6.96,8.14,azul);
  caja('Observatorio · Muro este norte',-7.335,13.5,13.4,.018,6.96,8.14,azul);
  caja('Observatorio · Dintel',-7.335,15.3,8,.018,3.36,2.66,azul);
  caja('Observatorio · Suelo',-13.5,10.05,8,12.22,.012,19.15,nogal);
  for(const z of [-1.55,17.47]){caja('Observatorio · Cornisa',-13.5,16.34,z,12.1,.12,.12,oro);caja('Observatorio · Zócalo',-13.5,10.3,z,12.1,.4,.14,oro);}
  caja('Observatorio · Cornisa oeste',-19.47,16.34,8,.12,.12,19.0,oro);
  const techo=canvas(768,1024),tc=techo.getContext('2d');const grad=tc.createRadialGradient(380,470,20,380,470,700);grad.addColorStop(0,'#294469');grad.addColorStop(.5,'#172a48');grad.addColorStop(1,'#080f23');tc.fillStyle=grad;tc.fillRect(0,0,768,1024);
  let semilla=7062;const azar=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla/4294967296;};
  for(let i=0;i<420;i++){const x=azar()*768,y=azar()*1024,r=.5+azar()*2.0;tc.fillStyle=i%4?'#e6e9ef':'#efd498';tc.globalAlpha=.3+azar()*.7;tc.beginPath();tc.arc(x,y,r,0,Math.PI*2);tc.fill();if(i%29===0){tc.fillRect(x-r*3,y-.5,r*6,1);tc.fillRect(x-.5,y-r*3,1,r*6);}}
  tc.globalAlpha=1;tc.strokeStyle='#b69a6166';tc.lineWidth=2;tc.strokeRect(22,22,724,980);
  const cielo=plano(techo,12.15,19.15,-13.5,16.55,8,Math.PI/2);
  const alf=canvas(512,512),ac=alf.getContext('2d');ac.fillStyle='#203e5a';ac.fillRect(0,0,512,512);ac.strokeStyle='#bfa16a';ac.lineWidth=4;ac.strokeRect(12,12,488,488);ac.strokeRect(27,27,458,458);ac.beginPath();ac.arc(256,256,160,0,Math.PI*2);ac.stroke();
  for(let i=0;i<12;i++){const a=i*Math.PI/6;ac.beginPath();ac.moveTo(256+Math.cos(a)*143,256+Math.sin(a)*143);ac.lineTo(256+Math.cos(a)*158,256+Math.sin(a)*158);ac.stroke();}
  const alfombra=plano(alf,7.0,9.0,-13.4,10.071,8,-Math.PI/2);
  caja('Observatorio · Banco',-13.4,10.6,15.6,4.0,.7,1.2,azul,raiz,true);
  for(const x of [-15,-11.8])for(const z of [15.2,16])caja('Observatorio · Pata del banco',x,10.3,z,.13,.45,.13,oro);
  const rotulo=canvas(1024,220),rc=rotulo.getContext('2d');rc.fillStyle='#14273e';rc.fillRect(0,0,1024,220);rc.strokeStyle='#bfa16a';rc.lineWidth=4;rc.strokeRect(10,10,1004,200);rc.fillStyle='#f2dfb4';rc.font='45px Georgia';rc.textAlign='center';rc.fillText('OBSERVATORIO DE LOS DESEOS',512,100);rc.font='23px Georgia';rc.fillText('Cuatro figuras · Un cielo para compartir',512,157);plano(rotulo,6.9,1.3,-13.5,15.2,-1.56);
  // Telescopio orientado hacia la ventana occidental.
  for(const a of [0,Math.PI*2/3,Math.PI*4/3])cilindroEntre([-17.8,11.8,11.9],[-17.8+Math.cos(a)*.8,10.08,11.9+Math.sin(a)*.8],.055,oro);
  cilindroEntre([-17.8,11.6,11.9],[-17.8,12.2,11.9],.10,nogal);
  cilindroEntre([-17.45,12.10,11.75],[-18.85,12.97,12.0],.205,azul);
  cilindroEntre([-18.72,12.89,11.98],[-18.94,13.03,12.02],.23,oro);
  cilindroEntre([-17.28,11.99,11.72],[-17.53,12.15,11.77],.10,oro);
  const lente=material('#79b9db',{metalness:.15,roughness:.16,emissive:'#244562',emissiveIntensity:.65});esfera('Observatorio · Lente',-18.96,13.04,12.02,.19,lente).scale.set(.17,1,1);
  const invisible=material('#ffffff');invisible.visible=false;
  const proxyTel=caja('Observatorio · Colisión del trípode',-17.8,10.9,11.9,1.5,1.65,1.5,invisible,raiz,true);proxyTel.castShadow=proxyTel.receiveShadow=false;
  // Globo celeste con meridianos, paralelos y estrellas seleccionables.
  caja('Observatorio · Pedestal celeste',-10.3,10.68,2.1,1.45,1.24,1.45,nogal,raiz,true);
  caja('Observatorio · Borde del pedestal',-10.3,11.35,2.1,1.65,.12,1.65,oro);
  const baseGlobo=new THREE.Group();baseGlobo.position.set(-10.3,12.5,2.1);raiz.add(baseGlobo);
  const globo=new THREE.Group();globo.name='Observatorio · Globo giratorio';baseGlobo.add(globo);
  const esferaGlobo=esfera('Observatorio · Esfera celeste',0,0,0,1,material('#102f48',{roughness:.45,metalness:.2}),globo);esferaGlobo.userData.esferaCentral=true;
  const anillos=material('#a48b54',{metalness:.55,roughness:.5});
  for(const lat of [-Math.PI/3,-Math.PI/6,0,Math.PI/6,Math.PI/3]){const g=new THREE.TorusGeometry(Math.cos(lat)*1.008,.008,5,56);geometrias.add(g);const o=marcar(new THREE.Mesh(g,anillos));o.position.y=Math.sin(lat);o.rotation.x=Math.PI/2;globo.add(o);}
  for(let i=0;i<6;i++){const g=new THREE.TorusGeometry(1.008,.007,5,64);geometrias.add(g);const o=marcar(new THREE.Mesh(g,anillos));o.rotation.y=i*Math.PI/6;globo.add(o);}
  const brilloCanvas=canvas(64,64),bc=brilloCanvas.getContext('2d');const bg=bc.createRadialGradient(32,32,0,32,32,31);bg.addColorStop(0,'rgba(255,255,255,1)');bg.addColorStop(.15,'rgba(255,247,211,1)');bg.addColorStop(.4,'rgba(255,220,145,.3)');bg.addColorStop(1,'rgba(255,255,255,0)');bc.fillStyle=bg;bc.fillRect(0,0,64,64);const brilloTex=tex(brilloCanvas);
  const materialesFiguras=new Map();
  CONSTELACIONES_DESEOS.forEach((f,indice)=>{
    const posiciones=f.puntos.map(([x,y])=>{const lon=indice*Math.PI/2+(x-.5)*.96,lat=(.5-y)*1.0;return new THREE.Vector3(Math.sin(lon)*Math.cos(lat),Math.sin(lat),Math.cos(lon)*Math.cos(lat)).multiplyScalar(1.025);});
    const g=new THREE.BufferGeometry().setFromPoints(posiciones);geometrias.add(g);const m=new THREE.PointsMaterial({map:brilloTex,color:'#dde9ff',size:.095,transparent:true,depthWrite:false,alphaTest:.01,toneMapped:false});materiales.add(m);
    const o=new THREE.Points(g,m);o.name='Estrellas · '+f.nombre;o.userData.figuraId=f.id;globo.add(o);
    const segmentos=[];
    for(const [a,b] of f.aristas)for(let j=0;j<8;j++){for(const t of [j/8,(j+1)/8]){const v=posiciones[a].clone().lerp(posiciones[b],t).normalize().multiplyScalar(1.022);segmentos.push(v.x,v.y,v.z);}}
    const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(segmentos,3));geometrias.add(lg);
    const lm=new THREE.LineBasicMaterial({color:'#8299ae',transparent:true,opacity:.20,toneMapped:false});materiales.add(lm);globo.add(new THREE.LineSegments(lg,lm));materialesFiguras.set(f.id,{puntos:m,lineas:lm});
  });
  const luz=new THREE.PointLight(0xffddaa,24,13,2);luz.position.set(-13.5,14.8,8);luz.castShadow=false;raiz.add(luz);marcar(luz);
  // Progreso propio y validado. No utiliza datos de las otras habitaciones.
  const claveGuardado='castillo-observatorio-deseos:v1:'+new URL('./',document.baseURI).pathname;
  let guardadoDisponible=true,bruto=null;
  try{const entrada=localStorage.getItem(claveGuardado);if(entrada){const d=JSON.parse(entrada);if(d?.version===1)bruto=d.avances;}}catch{guardadoDisponible=false;}
  let avances=normalizarAvanceEstelar(bruto);
  const terminada=f=>avances[f.id].size===f.aristas.length;
  const todas=()=>CONSTELACIONES_DESEOS.every(terminada);
  function guardar(){try{localStorage.setItem(claveGuardado,JSON.stringify({version:1,avances:Object.fromEntries(CONSTELACIONES_DESEOS.map(f=>[f.id,[...avances[f.id]]]))}));guardadoDisponible=true;}catch{guardadoDisponible=false;}}
  // Un castillo realmente tridimensional construido con líneas y partículas.
  const palacio=new THREE.Group();palacio.name='Observatorio · Castillo de estrellas';palacio.position.set(-13.4,14.2,8);raiz.add(palacio);
  const segmentosCastillo=[];
  function arista(a,b){segmentosCastillo.push(...a,...b);}
  function cajaAlambre(cx,cy,cz,w,h,d){const v=[];for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])v.push([cx+x*w/2,cy+y*h/2,cz+z*d/2]);for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([0,1,2].filter(k=>v[i][k]!==v[j][k]).length===1)arista(v[i],v[j]);}
  cajaAlambre(0,-.5,0,2.9,.8,1.5);
  for(const x of [-1.65,1.65])for(const z of [-.8,.8]){
    cajaAlambre(x,-.02,z,.65,1.8,.65);
    const base=[[x-.42,.88,z-.42],[x+.42,.88,z-.42],[x+.42,.88,z+.42],[x-.42,.88,z+.42]],punta=[x,1.52,z];
    for(let i=0;i<4;i++){arista(base[i],base[(i+1)%4]);arista(base[i],punta);}
  }
  cajaAlambre(0,.2,0,.82,1.9,.82);
  for(const x of [-.49,.49])for(const z of [-.49,.49])arista([x,1.15,z],[0,1.83,0]);
  arista([-.32,-.9,.765],[-.32,-.35,.765]);arista([.32,-.9,.765],[.32,-.35,.765]);
  for(let i=0;i<10;i++){const a=Math.PI-i*Math.PI/10,b=Math.PI-(i+1)*Math.PI/10;arista([Math.cos(a)*.32,-.35+Math.sin(a)*.32,.765],[Math.cos(b)*.32,-.35+Math.sin(b)*.32,.765]);}
  const destino=[];
  for(let i=0;i<segmentosCastillo.length;i+=6){const a=new THREE.Vector3(...segmentosCastillo.slice(i,i+3)),b=new THREE.Vector3(...segmentosCastillo.slice(i+3,i+6)),n=Math.max(2,Math.ceil(a.distanceTo(b)/.11));for(let j=0;j<=n;j++){const v=a.clone().lerp(b,j/n);destino.push(v.x,v.y,v.z);}}
  const destinos=new Float32Array(destino),origenes=new Float32Array(destinos.length);
  for(let i=0;i<origenes.length;i+=3){origenes[i]=(azar()-.5)*10.6;origenes[i+1]=1.8+azar()*.45;origenes[i+2]=(azar()-.5)*17.0;}
  const estrellasGeo=new THREE.BufferGeometry();estrellasGeo.setAttribute('position',new THREE.BufferAttribute(origenes.slice(),3));geometrias.add(estrellasGeo);
  const estrellasMat=new THREE.PointsMaterial({map:brilloTex,color:'#ffe4a4',size:.095,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});materiales.add(estrellasMat);
  const estrellas=new THREE.Points(estrellasGeo,estrellasMat);estrellas.frustumCulled=false;palacio.add(estrellas);
  const wireGeo=new THREE.BufferGeometry();wireGeo.setAttribute('position',new THREE.Float32BufferAttribute(segmentosCastillo,3));geometrias.add(wireGeo);
  const wireMat=new THREE.LineBasicMaterial({color:'#ffe1a0',transparent:true,opacity:0,toneMapped:false});materiales.add(wireMat);palacio.add(new THREE.LineSegments(wireGeo,wireMat));
  const estrellaMat=new THREE.SpriteMaterial({map:brilloTex,color:'#ffe7a4',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});materiales.add(estrellaMat);
  const estrellaRecuerdo=new THREE.Sprite(estrellaMat);estrellaRecuerdo.position.set(0,1.88,0);estrellaRecuerdo.scale.set(.8,.8,1);palacio.add(estrellaRecuerdo);
  let morph=todas()?1:0;estrellaMat.opacity=todas()?1:0;
  function colocarCastillo(p){const a=estrellasGeo.attributes.position.array;const s=p*p*(3-2*p);for(let i=0;i<a.length;i++)a[i]=origenes[i]+(destinos[i]-origenes[i])*s;estrellasGeo.attributes.position.needsUpdate=true;wireMat.opacity=Math.max(0,(p-.65)/.35)*.7;estrellaMat.opacity=Math.max(0,(p-.9)/.1);}
  colocarCastillo(morph);

  // Interfaz del telescopio y del globo. Las figuras son imaginarias, no cartas astronómicas.
  const id='observatorio-deseos',estilo=document.createElement('style');estilo.textContent=`
  #${id}[hidden],#${id} [hidden],#${id}-acciones[hidden],#${id}-acciones button[hidden]{display:none!important}
  #${id},#${id}-acciones{font:14px/1.5 system-ui,sans-serif;color:#f3e9d4;box-sizing:border-box}
  #${id}{position:fixed;inset:0;z-index:32000;background:#070f20ef;display:grid;place-items:center;padding:14px;overscroll-behavior:contain}
  #${id}.od-final{display:flex;align-items:flex-end;justify-content:center;background:transparent}
  #${id} *{box-sizing:border-box}
  #${id} .od-caja{position:relative;width:min(1000px,100%);max-height:calc(100dvh - 28px);overflow:auto;padding:22px;background:linear-gradient(135deg,#162c48,#0d172d);border:1px solid #b99b61;border-radius:18px;box-shadow:0 20px 75px #0007}
  #${id}.od-final .od-caja{width:min(760px,100%);background:#10233aeb}
  #${id} h2{font:clamp(22px,3.5vw,32px) Georgia,serif;color:#f3dca8;margin:0 70px 7px 0}
  #${id} p{margin:8px 0}
  #${id} .od-intro,#${id} .od-progreso{font-size:13px;color:#c5c6cc}
  #${id} .od-cerrar{position:absolute;right:12px;top:12px}
  #${id} button,#${id}-acciones button{min-height:44px;padding:10px 14px;border:1px solid #aa925e;border-radius:9px;background:#233d59;color:#f3e9d4;font:14px system-ui,sans-serif;cursor:pointer;touch-action:manipulation}
  #${id} button:hover,#${id}-acciones button:hover{background:#3b5774}
  #${id} button[aria-pressed=true]{background:#6c5735;border-color:#f0d493}
  #${id} button:disabled{opacity:.45;cursor:not-allowed}
  #${id} :focus-visible,#${id}-acciones :focus-visible{outline:3px solid #ffdc8b;outline-offset:3px}
  #${id} .od-filas{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
  #${id} .od-svg{display:block;width:100%;max-height:54dvh;background:radial-gradient(ellipse at center,#1b3556,#071327);border:1px solid #576781;border-radius:12px;touch-action:none;user-select:none}
  #${id} .od-nodo{cursor:pointer;outline:none}
  #${id} .od-nodo:focus .od-aro{stroke:#fff4cf;stroke-width:4;opacity:1}
  #${id} .od-estado{min-height:2em;color:#edd7aa;white-space:pre-line}
  #${id} .od-globo-vista{width:100%;height:clamp(240px,50vh,430px);border:1px solid #566580;border-radius:12px;overflow:hidden;background:#091627}
  #${id} .od-globo-vista canvas{display:block;width:100%;height:100%;touch-action:none}
  #${id} select{min-height:44px;padding:8px;border:1px solid #aa925e;background:#172f49;color:#f3e9d4;border-radius:8px;font:14px system-ui}
  #${id} .od-nota{font-size:12px;color:#acb2c0;margin-top:12px}
  #${id}-acciones{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:27;display:flex;justify-content:center;gap:9px;flex-wrap:wrap;width:max-content;max-width:92vw}
  #${id}-acciones button{background:#122b45ef;box-shadow:0 5px 25px #0008}
  @media(max-width:600px){#${id}{padding:6px}#${id} .od-caja{padding:18px 11px;max-height:calc(100dvh - 12px)}#${id} button{padding:10px;font-size:12px}#${id} .od-svg{max-height:46dvh}#${id} .od-intro{font-size:12px}}
  `;document.head.appendChild(estilo);
  const panel=document.createElement('section');panel.id=id;panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby',id+'-titulo');
  panel.innerHTML=`<div class="od-caja"><button type="button" class="od-cerrar">Cerrar</button><h2 id="${id}-titulo">Observatorio de los deseos</h2><p class="od-progreso" role="status" aria-live="polite"></p><div class="od-normal"><div class="od-filas"><button type="button" data-modo="telescopio">Telescopio</button><button type="button" data-modo="globo">Globo celeste</button></div><div class="od-figuras od-filas"></div><div class="od-telescopio"><p class="od-intro">Selecciona dos estrellas para unirlas. También puedes arrastrar de una a otra. Descubre los enlaces de la figura; un intento incorrecto no borra tu avance.</p><svg class="od-svg" viewBox="0 0 1000 640" role="group" aria-label="Estrellas de la constelación"></svg><div class="od-filas"><label>Estrella <select class="od-estrella" aria-label="Elegir estrella por número"></select></label><button type="button" class="od-elegir">Seleccionar estrella</button></div><div class="od-filas"><button type="button" class="od-pista">Mostrar un enlace pendiente</button></div></div><div class="od-globo" hidden><p class="od-intro">Arrastra para girar el globo y toca una estrella. También puedes usar las flechas del teclado o los botones de las figuras.</p><div class="od-globo-vista"></div><p class="od-seleccion" role="status" aria-live="polite">Selecciona una estrella del globo.</p><button type="button" class="od-trazar">Trazar esta figura</button></div></div><p class="od-estado" role="status" aria-live="polite"></p><div class="od-filas"><button type="button" class="od-ver-final">Ver castillo luminoso</button><button type="button" class="od-volver" hidden>Volver al telescopio</button><button type="button" class="od-reiniciar">Reiniciar este observatorio</button></div><p class="od-nota">Constelaciones imaginarias creadas para este castillo. El progreso se guarda solo en este navegador; no se sincroniza entre dispositivos.</p></div>`;
  document.body.appendChild(panel);
  const acciones=document.createElement('div');acciones.id=id+'-acciones';acciones.hidden=true;acciones.innerHTML='<button type="button" class="od-interactuar">R · Mirar por el telescopio</button><button type="button" class="od-recuerdo" hidden>Ver castillo luminoso</button>';document.body.appendChild(acciones);
  const svg=panel.querySelector('svg'),titulo=panel.querySelector('h2'),progreso=panel.querySelector('.od-progreso'),estado=panel.querySelector('.od-estado'),figurasDiv=panel.querySelector('.od-figuras');
  const cerrarBtn=panel.querySelector('.od-cerrar'),interactuarBtn=acciones.querySelector('.od-interactuar'),recuerdoBtn=acciones.querySelector('.od-recuerdo'),finalBtn=panel.querySelector('.od-ver-final'),volverBtn=panel.querySelector('.od-volver');
  const menu=document.getElementById('menu'),reducido=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let controles=null,oclusion=null,liberado=false,abierto=false,modo='telescopio',indice=0,seleccionada=null,pista=null,nota='';
  let dentro=false,cercaTel=false,cercaGlobo=false,reloj=0,finalTiempo=-1,recuerdoCamara=null,destinoCamara=null;
  let rendererGlobo=null,escenaGlobo=null,camaraGlobo=null,miniGlobo=null,esferaMini=null,halo=null,ro=null;
  const estrellasMini=[],localCam=new THREE.Vector3(),raycaster=new THREE.Raycaster(),puntero=new THREE.Vector2();
  let arrastre=null,arrastreSVG=null,ignorarClic=false;
  CONSTELACIONES_DESEOS.forEach((f,i)=>{const b=document.createElement('button');b.type='button';b.dataset.figura=String(i);b.addEventListener('click',()=>{indice=i;seleccionada=null;pista=null;nota='';if(modo==='globo'){panel.querySelector('.od-seleccion').textContent=`${f.nombre}: seleccionada con el botón. Puedes buscar sus estrellas girando el globo.`;}interfaz();});figurasDiv.appendChild(b);});
  function actualizarMateriales(){for(const f of CONSTELACIONES_DESEOS){const m=materialesFiguras.get(f.id);m.puntos.color.set(terminada(f)?'#ffdd89':'#dfecff');m.lineas.color.set(terminada(f)?'#efca7a':'#8299ae');m.lineas.opacity=terminada(f) ? .85:.20;}}
  function dibujarSVG(){
    const f=CONSTELACIONES_DESEOS[indice],hechas=avances[f.id];const foco=document.activeElement?.getAttribute?.('data-estrella');
    const pos=n=>[80+f.puntos[n][0]*840,45+f.puntos[n][1]*530];
    let fondo='';for(let i=0;i<55;i++){const x=30+(i*137%940),y=20+(i*83%580);fondo+=`<circle cx="${x}" cy="${y}" r="${i%4===0?1.7:.9}" fill="#d5e1f5" opacity=".35"/>`;}
    let lineas='';for(const [a,b] of f.aristas){const clave=claveEstelar(a,b);if(!hechas.has(clave)&&pista!==clave)continue;const [x1,y1]=pos(a),[x2,y2]=pos(b);lineas+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${hechas.has(clave)?'#f4d791':'#9bbbd7'}" stroke-width="${hechas.has(clave)?4:3}" ${hechas.has(clave)?'':'stroke-dasharray="10 9"'} opacity=".9"/>`;}
    const nodos=f.puntos.map((_,n)=>{const [x,y]=pos(n),sel=n===seleccionada;return `<g class="od-nodo" data-estrella="${n}" role="button" tabindex="0" aria-label="Estrella ${n+1} de ${f.nombre}${sel?', seleccionada':''}" aria-pressed="${sel}"><circle cx="${x}" cy="${y}" r="24" fill="transparent"/><circle class="od-aro" cx="${x}" cy="${y}" r="17" fill="none" stroke="#edce88" stroke-width="2" opacity="${sel?1:.15}"/><circle cx="${x}" cy="${y}" r="10" fill="#dce9ff" opacity=".14"/><circle cx="${x}" cy="${y}" r="5.7" fill="${sel?'#ffe1a0':'#f4f7ff'}"/><text x="${x+14}" y="${y-13}" fill="#bbc9de" font-size="16" font-family="system-ui" pointer-events="none">${n+1}</text></g>`;}).join('');
    svg.innerHTML=fondo+lineas+nodos;svg.setAttribute('aria-label',`${f.nombre}: ${hechas.size} de ${f.aristas.length} enlaces`);
    const selector=panel.querySelector('.od-estrella');if(selector.dataset.figura!==f.id){selector.innerHTML=f.puntos.map((_,n)=>`<option value="${n}">${n+1}</option>`).join('');selector.dataset.figura=f.id;}
    if(foco!==null&&foco!==undefined)svg.querySelector(`[data-estrella="${foco}"]`)?.focus();
  }
  function interfaz(){
    if(liberado)return;const esFinal=modo==='final',f=CONSTELACIONES_DESEOS[indice],completadas=CONSTELACIONES_DESEOS.filter(terminada).length;
    panel.classList.toggle('od-final',esFinal);panel.querySelector('.od-normal').hidden=esFinal;panel.querySelector('.od-telescopio').hidden=modo!=='telescopio';panel.querySelector('.od-globo').hidden=modo!=='globo';
    titulo.textContent=esFinal?'El castillo de los deseos':modo==='globo'?'Globo celeste':`Telescopio · ${f.nombre}`;
    progreso.textContent=`${completadas} de 4 constelaciones completas${guardadoDisponible?' · Progreso local':' · No se pudo guardar: progreso solo de esta sesión'}`;
    panel.querySelectorAll('[data-modo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modo===modo)));
    figurasDiv.querySelectorAll('button').forEach((b,i)=>{const c=CONSTELACIONES_DESEOS[i];b.textContent=c.nombre+(terminada(c)?' · Completa':'');b.setAttribute('aria-pressed',String(i===indice));});
    finalBtn.disabled=!todas();finalBtn.hidden=esFinal;volverBtn.hidden=!esFinal;recuerdoBtn.hidden=!todas();panel.querySelector('.od-reiniciar').hidden=esFinal;
    estado.textContent=esFinal?'Las luces que reuniste están construyendo un refugio entre las estrellas.\nLa estrella de la torre quedará encendida como recuerdo.':nota||(terminada(f)?f.mensaje:`${avances[f.id].size} de ${f.aristas.length} enlaces · Elige dos estrellas para comenzar.`);
    if(modo==='telescopio')dibujarSVG();if(modo==='globo')prepararGlobo();actualizarMateriales();
  }
  function seleccionarEstrella(n){
    const f=CONSTELACIONES_DESEOS[indice];if(!Number.isInteger(n)||n<0||n>=f.puntos.length||terminada(f))return;
    if(seleccionada===null){seleccionada=n;nota=`Estrella ${n+1} seleccionada. Elige otra para unirlas.`;interfaz();return;}
    if(seleccionada===n){seleccionada=null;nota='Selección cancelada.';interfaz();return;}
    const clave=claveEstelar(seleccionada,n),permitida=f.aristas.some(([a,b])=>claveEstelar(a,b)===clave);
    if(permitida){
      if(avances[f.id].has(clave))nota='Ese enlace ya está trazado. Puedes continuar desde esta estrella.';
      else{avances[f.id].add(clave);pista=null;guardar();nota='Bien: un nuevo hilo de luz.';}
      seleccionada=n;
      if(terminada(f)){seleccionada=null;nota=f.mensaje;guardar();if(todas()){interfaz();empezarFinal();return;}}
    }else{seleccionada=n;nota='Esas dos estrellas no forman un enlace de esta figura. No perdiste tu avance. Puedes pedir una pista.';}
    interfaz();
  }
  svg.addEventListener('click',e=>{if(ignorarClic){ignorarClic=false;return;}const n=e.target.closest?.('[data-estrella]');if(n)seleccionarEstrella(Number(n.dataset.estrella));});
  svg.addEventListener('keydown',e=>{const n=e.target.closest?.('[data-estrella]');if(n&&(e.key==='Enter'||e.key===' ')){e.preventDefault();seleccionarEstrella(Number(n.dataset.estrella));}});
  svg.addEventListener('pointerdown',e=>{const n=e.target.closest?.('[data-estrella]');arrastreSVG=n?{n:Number(n.dataset.estrella),x:e.clientX,y:e.clientY}:null;});
  svg.addEventListener('pointerup',e=>{if(!arrastreSVG)return;const origen=arrastreSVG;arrastreSVG=null;const objetivo=document.elementFromPoint(e.clientX,e.clientY)?.closest?.('[data-estrella]');if(objetivo&&svg.contains(objetivo)&&Number(objetivo.dataset.estrella)!==origen.n&&Math.hypot(e.clientX-origen.x,e.clientY-origen.y)>6){seleccionada=origen.n;seleccionarEstrella(Number(objetivo.dataset.estrella));ignorarClic=true;setTimeout(()=>{ignorarClic=false;},0);}});
  svg.addEventListener('pointercancel',()=>{arrastreSVG=null;});
  panel.querySelector('.od-elegir').addEventListener('click',()=>seleccionarEstrella(Number(panel.querySelector('.od-estrella').value)));
  panel.querySelector('.od-pista').addEventListener('click',()=>{const f=CONSTELACIONES_DESEOS[indice],arista=f.aristas.find(([a,b])=>!avances[f.id].has(claveEstelar(a,b)));pista=arista?claveEstelar(...arista):null;nota=arista?`Prueba a unir las estrellas ${arista[0]+1} y ${arista[1]+1}.`:f.mensaje;interfaz();});
  // Segundo visor WebGL solo para manipular el globo; se crea al abrirlo por primera vez.
  function redimensionarGlobo(){if(!rendererGlobo)return;const div=panel.querySelector('.od-globo-vista'),w=Math.floor(div.clientWidth),h=Math.floor(div.clientHeight);if(w<1||h<1)return;rendererGlobo.setSize(w,h,false);camaraGlobo.aspect=w/h;camaraGlobo.updateProjectionMatrix();}
  function prepararGlobo(){
    if(rendererGlobo){redimensionarGlobo();return;}
    try{
      rendererGlobo=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});rendererGlobo.setPixelRatio(Math.min(window.devicePixelRatio||1,1.35));rendererGlobo.outputColorSpace=THREE.SRGBColorSpace;
      escenaGlobo=new THREE.Scene();escenaGlobo.background=new THREE.Color('#081426');camaraGlobo=new THREE.PerspectiveCamera(40,1,.1,30);camaraGlobo.position.set(0,.15,3.65);camaraGlobo.lookAt(0,0,0);
      escenaGlobo.add(new THREE.HemisphereLight(0xe0eeff,0x263347,2));const l=new THREE.DirectionalLight(0xffdf9e,2.4);l.position.set(3,4,5);escenaGlobo.add(l);
      estrellasMini.length=0;miniGlobo=globo.clone(true);miniGlobo.rotation.set(.12,globo.rotation.y,0);escenaGlobo.add(miniGlobo);miniGlobo.traverse(o=>{if(o.userData.figuraId)estrellasMini.push(o);if(o.userData.esferaCentral)esferaMini=o;});
      const hg=new THREE.SphereGeometry(.055,12,8);geometrias.add(hg);const hm=new THREE.MeshBasicMaterial({color:'#ffe18e',toneMapped:false});materiales.add(hm);halo=new THREE.Mesh(hg,hm);halo.visible=false;miniGlobo.add(halo);
      const c=rendererGlobo.domElement;c.tabIndex=0;c.setAttribute('role','img');c.setAttribute('aria-label','Globo celeste 3D. Arrastra o usa las flechas para girar; toca una estrella para seleccionarla.');panel.querySelector('.od-globo-vista').appendChild(c);
      c.addEventListener('pointerdown',e=>{e.preventDefault();c.focus();arrastre={id:e.pointerId,x:e.clientX,y:e.clientY,ultimoX:e.clientX,ultimoY:e.clientY,movido:false};c.setPointerCapture(e.pointerId);});
      c.addEventListener('pointermove',e=>{if(!arrastre||arrastre.id!==e.pointerId)return;e.preventDefault();const dx=e.clientX-arrastre.ultimoX,dy=e.clientY-arrastre.ultimoY;miniGlobo.rotation.y+=dx*.008;miniGlobo.rotation.x=THREE.MathUtils.clamp(miniGlobo.rotation.x+dy*.008,-1.15,1.15);arrastre.movido ||=Math.hypot(e.clientX-arrastre.x,e.clientY-arrastre.y)>6;arrastre.ultimoX=e.clientX;arrastre.ultimoY=e.clientY;});
      c.addEventListener('pointerup',e=>{if(!arrastre||arrastre.id!==e.pointerId)return;const clic=!arrastre.movido;arrastre=null;if(c.hasPointerCapture(e.pointerId))c.releasePointerCapture(e.pointerId);if(clic)elegirEnGlobo(e);});
      c.addEventListener('pointercancel',()=>{arrastre=null;});
      c.addEventListener('wheel',e=>{e.preventDefault();camaraGlobo.position.z=THREE.MathUtils.clamp(camaraGlobo.position.z+e.deltaY*.002,2.6,5.2);},{passive:false});
      if(typeof ResizeObserver!=='undefined'){ro=new ResizeObserver(redimensionarGlobo);ro.observe(panel.querySelector('.od-globo-vista'));}redimensionarGlobo();
    }catch(e){if(rendererGlobo){rendererGlobo.dispose();rendererGlobo.domElement.remove();rendererGlobo.forceContextLoss?.();rendererGlobo=null;}panel.querySelector('.od-seleccion').textContent='No se pudo abrir este visor 3D. Puedes seleccionar una figura con los botones y trazarla en el telescopio.';}
  }
  function elegirEnGlobo(e){
    const r=rendererGlobo.domElement.getBoundingClientRect();puntero.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);miniGlobo.updateMatrixWorld(true);camaraGlobo.updateMatrixWorld(true);raycaster.params.Points.threshold=.09;raycaster.setFromCamera(puntero,camaraGlobo);
    const fondo=raycaster.intersectObject(esferaMini,false)[0],candidatas=raycaster.intersectObjects(estrellasMini,false);const hit=candidatas.find(h=>!fondo||h.distance<=fondo.distance+.16);
    if(!hit){panel.querySelector('.od-seleccion').textContent='No seleccionaste una estrella. Gira el globo e inténtalo otra vez.';return;}
    indice=CONSTELACIONES_DESEOS.findIndex(f=>f.id===hit.object.userData.figuraId);seleccionada=null;pista=null;
    halo.position.fromBufferAttribute(hit.object.geometry.attributes.position,hit.index);halo.visible=true;
    panel.querySelector('.od-seleccion').textContent=`Estrella ${hit.index+1} · ${CONSTELACIONES_DESEOS[indice].nombre}. Puedes trazar esta figura en el telescopio.`;nota='';interfaz();
  }
  function enfocarFinal(){
    const posicion=castillo.localToWorld(new THREE.Vector3(-13.4,11.85,13.2)),objetivo=castillo.localToWorld(new THREE.Vector3(-13.4,14.45,8));
    const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(posicion,objetivo,camara.up));
    if(camara.parent){camara.parent.updateWorldMatrix(true,false);camara.parent.worldToLocal(posicion);q.premultiply(camara.parent.getWorldQuaternion(new THREE.Quaternion()).invert());}
    return{posicion,quaternion:q};
  }
  function empezarFinal(){
    if(!todas()||liberado||!dentro)return;if(!abierto)abrir('telescopio');
    if(!recuerdoCamara)recuerdoCamara={posicion:camara.position.clone(),quaternion:camara.quaternion.clone()};
    destinoCamara=enfocarFinal();modo='final';finalTiempo=0;morph=0;colocarCastillo(0);interfaz();cerrarBtn.focus();
  }
  function restaurarCamara(){if(recuerdoCamara){camara.position.copy(recuerdoCamara.posicion);camara.quaternion.copy(recuerdoCamara.quaternion);recuerdoCamara=null;destinoCamara=null;}}
  function abrir(m='telescopio'){
    if(liberado||!dentro||abierto)return;modo=m==='globo'?'globo':'telescopio';abierto=true;controles?.pausar?.();if(document.pointerLockElement){try{const p=document.exitPointerLock();p?.catch?.(()=>{});}catch{}}
    panel.hidden=false;acciones.hidden=true;if(menu)menu.hidden=true;nota='';interfaz();cerrarBtn.focus();
  }
  function cerrar(){if(!abierto)return;restaurarCamara();abierto=false;panel.hidden=true;if(menu){menu.hidden=false;document.getElementById('boton-iniciar')?.focus();}}
  function alDesbloquear(){if(abierto&&menu)menu.hidden=true;}
  function teclado(e){
    if(abierto){
      if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();cerrar();return;}
      if(e.code==='Tab'){
        const lista=[...panel.querySelectorAll('button,select,[tabindex="0"]')].filter(b=>!b.disabled&&b.getClientRects().length),primero=lista[0],ultimo=lista[lista.length-1];
        if(e.shiftKey&&document.activeElement===primero){e.preventDefault();ultimo.focus();}else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primero.focus();}
      }
      if(modo==='globo'&&miniGlobo&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();miniGlobo.rotation.y+=(e.code==='ArrowLeft'?-.12:e.code==='ArrowRight' ? .12:0);miniGlobo.rotation.x=THREE.MathUtils.clamp(miniGlobo.rotation.x+(e.code==='ArrowUp'?-.10:e.code==='ArrowDown' ? .10:0),-1.15,1.15);return;}
      const nodo=e.target.closest?.('[data-estrella]');
      if(modo==='telescopio'&&nodo&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();const n=Number(nodo.dataset.estrella),longitud=CONSTELACIONES_DESEOS[indice].puntos.length,paso=['ArrowLeft','ArrowUp'].includes(e.code)?-1:1;svg.querySelector(`[data-estrella="${(n+paso+longitud)%longitud}"]`)?.focus();return;}
      if(e.code==='Space'&&nodo){e.preventDefault();e.stopImmediatePropagation();seleccionarEstrella(Number(nodo.dataset.estrella));return;}
      if(['KeyW','KeyA','KeyS','KeyD','KeyE','KeyF','KeyR','KeyG','Space'].includes(e.code))e.stopImmediatePropagation();return;
    }
    if(e.code!=='KeyR'||e.repeat||!dentro||(!cercaTel&&!cercaGlobo)||Boolean(menu&&!menu.hidden)||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable)return;
    e.preventDefault();e.stopImmediatePropagation();abrir(cercaGlobo?'globo':'telescopio');
  }
  cerrarBtn.addEventListener('click',cerrar);interactuarBtn.addEventListener('click',()=>abrir(cercaGlobo?'globo':'telescopio'));recuerdoBtn.addEventListener('click',empezarFinal);finalBtn.addEventListener('click',empezarFinal);
  volverBtn.addEventListener('click',()=>{restaurarCamara();modo='telescopio';nota='';interfaz();});
  panel.querySelectorAll('[data-modo]').forEach(b=>b.addEventListener('click',()=>{modo=b.dataset.modo;nota='';interfaz();}));
  panel.querySelector('.od-trazar').addEventListener('click',()=>{modo='telescopio';seleccionada=null;nota='';interfaz();});
  panel.querySelector('.od-reiniciar').addEventListener('click',()=>{if(!window.confirm('¿Borrar únicamente el progreso de las cuatro constelaciones de este observatorio?'))return;avances=normalizarAvanceEstelar(null);guardar();seleccionada=null;pista=null;morph=0;finalTiempo=-1;palacio.rotation.y=0;colocarCastillo(0);nota='Un cielo nuevo para empezar otra vez.';interfaz();});
  document.addEventListener('keydown',teclado,true);document.addEventListener('pointerlockchange',alDesbloquear);window.addEventListener('resize',redimensionarGlobo);
  function actualizar(dt=0){
    if(liberado)return;const paso=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.1));reloj+=paso;
    castillo.updateWorldMatrix(true,false);camara.getWorldPosition(localCam);castillo.worldToLocal(localCam);
    dentro=localCam.x> -19.7&&localCam.x< -7.3&&localCam.z> -1.65&&localCam.z<17.7&&localCam.y>10&&localCam.y<16.95;
    cercaTel=dentro&&localCam.distanceTo(new THREE.Vector3(-17.8,11.9,11.9))<3.4;cercaGlobo=dentro&&localCam.distanceTo(new THREE.Vector3(-10.3,12.5,2.1))<3.2;
    const visible=oclusion?.habitaciones?.find(h=>h.id===ROOM)?.visible??true;raiz.visible=visible;luz.visible=visible;
    acciones.hidden=!dentro||abierto||Boolean(menu&&!menu.hidden)||(!cercaTel&&!cercaGlobo&&!todas());interactuarBtn.hidden=!cercaTel&&!cercaGlobo;interactuarBtn.textContent=cercaGlobo?'R · Explorar el globo celeste':'R · Mirar por el telescopio';recuerdoBtn.hidden=!todas();
    if(visible&&!reducido)globo.rotation.y+=paso*.065;
    if(finalTiempo>=0){
      finalTiempo+=paso;morph=Math.min(1,finalTiempo/(reducido ? .05:7.0));colocarCastillo(morph);
      if(modo==='final'&&abierto&&recuerdoCamara&&destinoCamara){const p=Math.min(1,finalTiempo/(reducido ? .05:1.3)),s=p*p*(3-2*p);camara.position.lerpVectors(recuerdoCamara.posicion,destinoCamara.posicion,s);camara.quaternion.slerpQuaternions(recuerdoCamara.quaternion,destinoCamara.quaternion,s);}
      if(morph===1)finalTiempo=-1;
    }
    if(morph===1&&visible){if(!reducido)palacio.rotation.y+=paso*.055;estrellaRecuerdo.scale.setScalar(.8+(reducido?0:Math.sin(reloj*2)*.1));}
    if(abierto&&modo==='globo'&&rendererGlobo){if(!arrastre&&!reducido)miniGlobo.rotation.y+=paso*.045;rendererGlobo.render(escenaGlobo,camaraGlobo);}
    if(abierto&&!dentro&&modo!=='final')cerrar();if(abierto&&menu&&!menu.hidden)menu.hidden=true;
  }
  actualizarMateriales();
  const api={raiz,globo,telescopio:proxyTel,actualizar,abrir,cerrar,verCastillo:empezarFinal,
    vincularControles(c){controles=c;},vincularOclusion(o){oclusion=o;},
    get completadas(){return CONSTELACIONES_DESEOS.filter(terminada).map(f=>f.id);},get abierto(){return abierto;},get modo(){return modo;},
    liberar(){
      if(liberado)return;cerrar();liberado=true;ro?.disconnect();rendererGlobo?.dispose();rendererGlobo?.forceContextLoss?.();
      document.removeEventListener('keydown',teclado,true);document.removeEventListener('pointerlockchange',alDesbloquear);window.removeEventListener('resize',redimensionarGlobo);
      panel.remove();acciones.remove();estilo.remove();raiz.removeFromParent();
      if(Array.isArray(colisiones)){for(const r of propios){const i=colisiones.indexOf(r);if(i>=0)colisiones.splice(i,1);}retirados.sort((a,b)=>a.indice-b.indice).forEach(r=>colisiones.splice(Math.min(r.indice,colisiones.length),0,r.valor));}
      ocultos.forEach(r=>r.objeto.visible=r.visible);for(const g of geometrias)g.dispose();for(const m of materiales)m.dispose();for(const t of texturas)t.dispose();delete castillo.userData.observatorioDeseos;
    }
  };castillo.userData.observatorioDeseos=api;return api;
}
