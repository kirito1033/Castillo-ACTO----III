import * as THREE from 'three';

// Biblioteca de poesía: recursos dibujados localmente, sin APIs ni imágenes externas.
export const POEMAS_CONSEJO = Object.freeze([
  { titulo: 'Donde empieza el reino', subtitulo: 'Castillos y promesas', color: '#315f69', cielo: '#183647', acento: '#f2d49b', motivo: 'castillo', versos: ['No hace falta una corona', 'para un reino levantar;', 'basta una luz en la ventana', 'y alguien a quien regresar.'] },
  { titulo: 'La torre de la luna', subtitulo: 'Un refugio entre estrellas', color: '#594578', cielo: '#19182f', acento: '#e8d6ff', motivo: 'luna', versos: ['Sobre la torre dormida', 'la luna dejó su voz:', 'hay noches que son eternas', 'si las compartimos dos.'] },
  { titulo: 'El puente del alba', subtitulo: 'Caminos que se encuentran', color: '#9a533e', cielo: '#3e3d60', acento: '#ffdaa8', motivo: 'puente', versos: ['Un puente cruza la niebla,', 'otro cruza el corazón;', 'yo elegí seguir tus pasos', 'sin pedirle al mapa razón.'] },
  { titulo: 'Jardín de piedra', subtitulo: 'Flores junto a las murallas', color: '#41634a', cielo: '#203b3b', acento: '#e6dcab', motivo: 'jardin', versos: ['Entre las viejas murallas', 'una flor quiso nacer;', 'hasta la piedra más fría', 'tiene algo que agradecer.'] },
  { titulo: 'El faro del invierno', subtitulo: 'Una luz para volver', color: '#335b87', cielo: '#162b48', acento: '#e3eeff', motivo: 'faro', versos: ['Cuando el invierno oscurece', 'los caminos hacia el mar,', 'tu recuerdo enciende un faro', 'que me enseña a regresar.'] },
  { titulo: 'Nuestro pequeño castillo', subtitulo: 'El hogar que elegimos', color: '#85445d', cielo: '#38223d', acento: '#ffd5bd', motivo: 'castillo', versos: ['Que el mundo guarde sus tronos,', 'su oro y su inmensidad;', 'yo me quedo con la puerta', 'que a tu lado puedo abrir.'] }
]);

export function crearSalaConsejoPoetica(escena, camara, castillo, elemento, opciones = {}) {
  if (castillo.userData.consejoPoetico) return castillo.userData.consejoPoetico;
  const ROOM = 'Sala del consejo';
  const raiz = new THREE.Group();
  raiz.name = 'Consejo · Biblioteca de los versos';
  Object.assign(raiz.userData, { habitacion: ROOM, noAgrupar: true, dinamico: true });
  castillo.add(raiz);
  const geometrias = new Set(), materiales = new Set(), texturas = new Set();
  const obstaculosPropios = [], originalesOcultos = [], colisionesQuitadas = [];
  const colisiones = castillo.userData.colisiones;
  const geoCaja = new THREE.BoxGeometry(1, 1, 1); geometrias.add(geoCaja);
  const originalBox = new THREE.Box3(), inv = new THREE.Matrix4();
  castillo.updateMatrixWorld(true); inv.copy(castillo.matrixWorld).invert();
  const zona = new THREE.Box3(new THREE.Vector3(7.4, 3, -17.8), new THREE.Vector3(19.7, 9.8, -2.4));
  castillo.traverse(o => {
    if (!o.isMesh || !/^(Mesa|Armario)(\s|$)/i.test(o.name)) return;
    originalBox.setFromObject(o).applyMatrix4(inv);
    if (zona.containsBox(originalBox)) originalesOcultos.push({ objeto: o, visible: o.visible });
  });
  originalesOcultos.forEach(r => { r.objeto.visible = false; });
  if (Array.isArray(colisiones)) {
    const retirados = new Set(originalesOcultos.map(r => r.objeto));
    for (let i = colisiones.length - 1; i >= 0; i--) {
      if (retirados.has(colisiones[i].mesh)) colisionesQuitadas.push({ indice: i, valor: colisiones.splice(i, 1)[0] });
    }
  }
  function material(color, extra = {}) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra }); materiales.add(m); return m;
  }
  const madera = material('#38251f'), borde = material('#644532'), oro = material('#cba75d', { metalness: 0.55, roughness: 0.42 });
  const tela = material('#663b4e'), marfil = material('#edddb7'), cuero = material(POEMAS_CONSEJO[0].color);
  const oscuro = material('#211c24');
  function marcar(o) { Object.assign(o.userData, { habitacion: ROOM, noAgrupar: true, dinamico: true }); return o; }
  function caja(nombre, x, y, z, w, h, d, mat, padre = raiz, solido = false) {
    const o = marcar(new THREE.Mesh(geoCaja, mat)); o.name = nombre; o.position.set(x,y,z); o.scale.set(w,h,d);
    o.castShadow = o.receiveShadow = true; padre.add(o);
    if (solido && Array.isArray(colisiones)) {
      const r = { mesh: o, w, h, d, esCaja: true }; colisiones.push(r); obstaculosPropios.push(r);
    }
    return o;
  }
  function cilindro(x,y,z,r,h,mat,padre=raiz) {
    const geo = new THREE.CylinderGeometry(r,r,h,16); geometrias.add(geo);
    const o = marcar(new THREE.Mesh(geo,mat)); o.position.set(x,y,z); o.castShadow = o.receiveShadow = true; padre.add(o); return o;
  }
  function canvas(ancho, alto) { const c = document.createElement('canvas'); c.width=ancho; c.height=alto; return c; }
  function textura(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; texturas.add(t); return t; }
  function plano(c, w, h, x, y, z, ry=0, padre=raiz) {
    const geo = new THREE.PlaneGeometry(w,h); geometrias.add(geo);
    const mat = new THREE.MeshBasicMaterial({ map: textura(c), side: THREE.DoubleSide, toneMapped: false }); materiales.add(mat);
    const o = marcar(new THREE.Mesh(geo,mat)); o.position.set(x,y,z); o.rotation.y=ry; padre.add(o); return o;
  }
  function textoCentrado(ctx, texto, y, tam, ancho=420) {
    ctx.font = `${tam}px Georgia, serif`; const palabras=texto.split(' '); let linea='', lineas=[];
    for(const p of palabras) { const prueba=linea ? linea+' '+p : p; if(ctx.measureText(prueba).width>ancho && linea){lineas.push(linea);linea=p;}else linea=prueba; }
    if(linea)lineas.push(linea); ctx.textAlign='center';
    lineas.forEach((l,i)=>ctx.fillText(l,256,y+i*tam*1.2)); return y+lineas.length*tam*1.2;
  }
  function paisaje(ctx, p) {
    const grad=ctx.createLinearGradient(0,100,0,600); grad.addColorStop(0,p.cielo); grad.addColorStop(1,p.color);
    ctx.fillStyle=grad; ctx.fillRect(48,210,416,365);
    ctx.fillStyle=p.acento;
    for(let i=0;i<26;i++){ const x=62+(i*83%382), y=226+(i*47%170); ctx.globalAlpha=0.35+(i%3)*0.2; ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill(); }
    ctx.globalAlpha=1; ctx.beginPath();ctx.arc(p.motivo==='luna'?282:355,280,p.motivo==='luna'?42:25,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#15242c';ctx.beginPath();ctx.moveTo(48,500);ctx.lineTo(125,405);ctx.lineTo(215,470);ctx.lineTo(300,390);ctx.lineTo(464,500);ctx.lineTo(464,575);ctx.lineTo(48,575);ctx.fill();
    ctx.fillStyle='#0c1821';ctx.beginPath();ctx.moveTo(48,550);ctx.quadraticCurveTo(250,450,464,535);ctx.lineTo(464,575);ctx.lineTo(48,575);ctx.fill();
    const torre=(x,y,w,h)=>{ctx.fillStyle='#dbc79e';ctx.fillRect(x,y,w,h);for(let n=0;n<3;n++)ctx.fillRect(x+n*w/3,y-9,w/5,12);ctx.fillStyle='#f8d487';ctx.fillRect(x+w*.4,y+25,w*.2,19);};
    if(p.motivo==='puente') {
      ctx.strokeStyle='#d6b887';ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(90,494);ctx.quadraticCurveTo(256,352,422,494);ctx.stroke();
      ctx.fillStyle='#d6b887';ctx.fillRect(118,465,17,80);ctx.fillRect(377,465,17,80);
      ctx.strokeStyle='#8ab8bd';ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(165,530+i*6);ctx.lineTo(345,530+i*6);ctx.stroke();}
    } else if(p.motivo==='faro') {
      ctx.fillStyle='#e7d7b0';ctx.beginPath();ctx.moveTo(228,514);ctx.lineTo(244,345);ctx.lineTo(274,345);ctx.lineTo(289,514);ctx.fill();
      ctx.fillStyle=p.acento;ctx.fillRect(239,329,40,25);ctx.globalAlpha=.2;ctx.beginPath();ctx.moveTo(256,340);ctx.lineTo(452,277);ctx.lineTo(452,390);ctx.fill();ctx.globalAlpha=1;
    } else {
      torre(156,408,48,112);torre(307,408,48,112);torre(232,360,48,160);
      ctx.fillStyle='#d2b78d';ctx.fillRect(200,449,112,71);ctx.fillStyle='#24313a';ctx.beginPath();ctx.arc(256,492,15,Math.PI,0);ctx.lineTo(271,520);ctx.lineTo(241,520);ctx.fill();
      if(p.motivo==='jardin'){for(let i=0;i<11;i++){ctx.fillStyle=['#dbb0b5','#e6cf9d','#abbf92'][i%3];ctx.beginPath();ctx.arc(95+i*32,548-(i%3)*10,5,0,Math.PI*2);ctx.fill();}}
    }
  }
  function portada(p) {
    const c=canvas(512,768),ctx=c.getContext('2d');
    ctx.fillStyle=p.color;ctx.fillRect(0,0,512,768);ctx.strokeStyle=p.acento;ctx.lineWidth=3;ctx.strokeRect(22,22,468,724);ctx.lineWidth=1;ctx.strokeRect(32,32,448,704);
    ctx.fillStyle=p.acento;ctx.font='15px Georgia';ctx.textAlign='center';ctx.fillText('BIBLIOTECA DEL CONSEJO',256,72);
    textoCentrado(ctx,p.titulo,120,31,400);paisaje(ctx,p);
    ctx.strokeStyle=p.acento;ctx.strokeRect(48,210,416,365);ctx.fillStyle=p.acento;textoCentrado(ctx,p.subtitulo,627,21,395);
    ctx.font='14px Georgia';ctx.fillText('POEMAS PARA HABITAR UN CASTILLO',256,708);return c;
  }
  const portadas=POEMAS_CONSEJO.map(portada), mapas=portadas.map(textura);

  // Estanterías de madera con libros geométricos; sin descargas.
  let semilla=721; const azar=()=>{semilla=(Math.imul(semilla,1664525)+1013904223)>>>0;return semilla/4294967296;};
  const lomos=['#6b334c','#3d6566','#8a6a3f','#4e4976','#8e493c','#486247'].map(c=>material(c));
  function estanteria(x,z,ancho,rot=0) {
    const g=new THREE.Group();g.position.set(x,3,z);g.rotation.y=rot;raiz.add(g);
    caja('Consejo · Fondo de estantería',0,2.15,0,ancho,4.3,.65,madera,g,true);
    for(const dx of [-ancho/2,ancho/2])caja('Consejo · Columna',dx,2.15,.39,.14,4.5,.24,borde,g);
    for(let f=0;f<5;f++) {
      const y=.28+f*.82;caja('Consejo · Repisa',0,y,.43,ancho+.18,.12,.95,borde,g);
      let xLibro=-ancho/2+.15;
      while(xLibro<ancho/2-.22) {
        const w=.13+azar()*.15,h=.42+azar()*.25;
        caja('Consejo · Libro de estante',xLibro+w/2,y+.06+h/2,.43,w,h,.45,lomos[Math.floor(azar()*lomos.length)],g);
        caja('Consejo · Dorado del lomo',xLibro+w/2,y+.06+h*.75,.661,w*.74,.018,.012,oro,g);xLibro+=w+.035;
      }
    }
    caja('Consejo · Cornisa tallada',0,4.5,.08,ancho+.28,.22,1.02,oro,g);
  }
  estanteria(10.35,-17.15,4.25);estanteria(16.8,-17.15,4.25);
  estanteria(19.05,-5.65,4.5,-Math.PI/2);estanteria(19.05,-14.8,3.2,-Math.PI/2);

  // Alfombra y zócalos; se mantiene libre la puerta del oeste.
  const alf=canvas(512,512),ac=alf.getContext('2d');ac.fillStyle='#503044';ac.fillRect(0,0,512,512);
  for(const inset of [12,21,40]){ac.strokeStyle=inset===21?'#b48e56':'#806345';ac.lineWidth=3;ac.strokeRect(inset,inset,512-2*inset,512-2*inset);}
  ac.strokeStyle='#b48e56';ac.lineWidth=2;ac.beginPath();ac.moveTo(256,140);ac.lineTo(340,256);ac.lineTo(256,372);ac.lineTo(172,256);ac.closePath();ac.stroke();
  const alfombra=plano(alf,8.2,10.8,13.4,3.025,-9.7);alfombra.rotation.x=-Math.PI/2;
  caja('Consejo · Zócalo posterior',13.5,3.27,-17.52,12.3,.45,.15,borde);
  caja('Consejo · Zócalo oriental',19.51,3.27,-10,.15,.45,15,borde);

  // Atril central y libro tridimensional.
  caja('Consejo · Base del atril',13.6,3.18,-10.1,1.9,.32,1.45,madera,raiz,true);
  caja('Consejo · Pedestal',13.6,3.84,-10.1,1.12,1.05,.92,borde,raiz,true);
  caja('Consejo · Moldura de atril',13.6,4.41,-10.1,1.95,.15,1.45,oro);
  const libro=new THREE.Group();libro.position.set(13.6,5.49,-10.1);libro.rotation.y=-Math.PI/2;raiz.add(libro);marcar(libro);
  caja('Consejo · Páginas',0,0,0,1.62,2.02,.27,marfil,libro);
  caja('Consejo · Contraportada',0,0,-.17,1.77,2.16,.07,cuero,libro);
  caja('Consejo · Lomo',-.865,0,0,.1,2.16,.4,cuero,libro);
  for(const y of [-.84,-.67,.67,.84])caja('Consejo · Nervio dorado',-.923,y,0,.02,.035,.41,oro,libro);
  const hoja=canvas(512,768), hc=hoja.getContext('2d');
  const pagina=plano(hoja,1.56,1.96,0,0,.141,0,libro);
  const pivote=new THREE.Group();pivote.position.set(-.885,0,.2);libro.add(pivote);marcar(pivote);
  caja('Consejo · Tapa móvil',.885,0,0,1.77,2.16,.075,cuero,pivote);
  const geoPortada=new THREE.PlaneGeometry(1.7,2.09);geometrias.add(geoPortada);
  const matPortada=new THREE.MeshBasicMaterial({map:mapas[0],toneMapped:false});materiales.add(matPortada);
  const caratula=marcar(new THREE.Mesh(geoPortada,matPortada));caratula.position.set(.885,0,.04);pivote.add(caratula);
  function pintarPagina(p) {
    hc.fillStyle='#efe1bf';hc.fillRect(0,0,512,768);hc.strokeStyle='#b19862';hc.strokeRect(24,24,464,720);hc.fillStyle='#4d3942';
    textoCentrado(hc,p.titulo,150,31,420);hc.font='22px Georgia';hc.textAlign='center';p.versos.forEach((v,i)=>hc.fillText(v,256,300+i*56));
    hc.font='16px Georgia';hc.fillText('Biblioteca de los versos',256,660);pagina.material.map.needsUpdate=true;
  }
  pintarPagina(POEMAS_CONSEJO[0]);

  function sillon(x,z,rot) {
    const g=new THREE.Group();g.position.set(x,3,z);g.rotation.y=rot;raiz.add(g);
    caja('Consejo · Butaca',0,.48,0,1.3,.65,1.25,tela,g,true);
    caja('Consejo · Respaldo',0,1.08,-.53,1.3,1.1,.23,tela,g);
    for(const dx of [-.68,.68])caja('Consejo · Brazo tallado',dx,.85,0,.16,.55,1.2,borde,g);
    for(const dx of [-.49,.49])for(const dz of [-.43,.43])caja('Consejo · Pata',dx,.14,dz,.12,.28,.12,oro,g);
  }
  sillon(10.2,-5.1,Math.PI/2);sillon(16.5,-5.1,-Math.PI/2);
  caja('Consejo · Mesa de lectura',13.35,3.68,-5.1,1.55,1.32,1.2,madera,raiz,true);
  caja('Consejo · Tapa de mesa',13.35,4.39,-5.1,1.8,.12,1.4,borde);
  for(let i=0;i<3;i++)caja('Consejo · Volumen apilado',13.4,4.52+i*.12,-5.1,.7,.1,.49,lomos[i]);

  // Cartela, cuadro y lámpara ornamental.
  const cartel=canvas(512,256),cc=cartel.getContext('2d');cc.fillStyle='#302831';cc.fillRect(0,0,512,256);cc.strokeStyle='#cba75d';cc.lineWidth=5;cc.strokeRect(12,12,488,232);cc.fillStyle='#eddbb6';
  textoCentrado(cc,'LA BIBLIOTECA',93,35);textoCentrado(cc,'DE LOS VERSOS',145,30);cc.font='17px Georgia';cc.fillText('SALA DEL CONSEJO',256,210);
  plano(cartel,3.4,1.7,13.5,8.3,-17.53);
  const arte=portada(POEMAS_CONSEJO[1]);caja('Consejo · Marco del cuadro',19.48,6.3,-9.1,.12,3.0,2.08,oro);
  plano(arte,1.9,2.82,19.40,6.3,-9.1,-Math.PI/2);
  const llama=material('#ffe2a0',{emissive:'#ffb85b',emissiveIntensity:1.4});
  const geoLlama=new THREE.SphereGeometry(.065,8,6);geometrias.add(geoLlama);
  function vela(x,y,z) {
    cilindro(x,y+.17,z,.065,.34,marfil);cilindro(x,y-.025,z,.14,.06,oro);
    const f=marcar(new THREE.Mesh(geoLlama,llama));f.position.set(x,y+.39,z);f.scale.y=1.9;raiz.add(f);
  }
  cilindro(13.6,8.4,-10.1,1.12,.09,oro);
  cilindro(13.6,9.0,-10.1,.028,1.15,oro);
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7;vela(13.6+Math.cos(a)*1.03,8.48,-10.1+Math.sin(a)*1.03);}
  vela(12.8,4.5,-5.1);vela(14.3,4.5,-5.1);
  const luz=new THREE.PointLight(0xffd39c,23,12,2);luz.position.set(13.6,7.4,-10.1);luz.castShadow=false;raiz.add(luz);marcar(luz);

  // Libros estáticos agrupados por material para reducir llamadas de dibujo.
  raiz.updateWorldMatrix(true,true);
  const inversaRaiz=new THREE.Matrix4().copy(raiz.matrixWorld).invert();
  const lotes=new Map(),aRetirar=[];
  raiz.traverse(o=>{
    if(!o.isMesh || !/^Consejo · (Libro de estante|Dorado del lomo)$/.test(o.name))return;
    if(!lotes.has(o.material))lotes.set(o.material,[]);
    lotes.get(o.material).push(new THREE.Matrix4().multiplyMatrices(inversaRaiz,o.matrixWorld));
    aRetirar.push(o);
  });
  aRetirar.forEach(o=>o.removeFromParent());
  for(const [mat,matrices] of lotes){
    const lote=marcar(new THREE.InstancedMesh(geoCaja,mat,matrices.length));
    lote.name='Consejo · Libros agrupados';lote.castShadow=lote.receiveShadow=true;
    matrices.forEach((m,i)=>lote.setMatrixAt(i,m));lote.instanceMatrix.needsUpdate=true;
    lote.computeBoundingSphere();raiz.add(lote);
  }

  // Lector accesible y controles táctiles. No vuelve a bloquear el mouse automáticamente.
  const id='consejo-poetico';
  const estilo=document.createElement('style');estilo.textContent=`
  #${id},#${id}-abrir{box-sizing:border-box;font-family:Georgia,serif;color:#f4e7ce}
  #${id}[hidden],#${id}-abrir[hidden]{display:none!important}
  #${id}{position:fixed;inset:0;z-index:30000;background:rgba(12,15,23,.94);display:grid;place-items:center;padding:18px;overflow:auto;overscroll-behavior:contain}
  #${id} *{box-sizing:border-box}
  #${id} .cp-caja{position:relative;width:min(900px,100%);max-height:calc(100dvh - 36px);overflow:auto;border:1px solid #9d814a;border-radius:20px;background:linear-gradient(135deg,#282430,#171c27);box-shadow:0 24px 100px #0009;padding:28px}
  #${id} .cp-cabecera{font:12px system-ui,sans-serif;letter-spacing:.18em;color:#d6bc87;margin:0 45px 24px 0}
  #${id} .cp-contenido{display:grid;grid-template-columns:minmax(150px,240px) 1fr;gap:35px;align-items:center}
  #${id} canvas{display:block;width:100%;height:auto;border-radius:3px 10px 10px 3px;box-shadow:-7px 6px 0 #806d50,0 18px 40px #0008}
  #${id} h2{font-size:clamp(25px,4vw,39px);line-height:1.15;margin:4px 0 12px;color:#f8e7be}
  #${id} .cp-sub{color:#bcb4b6;font:14px system-ui,sans-serif;margin-bottom:24px}
  #${id} .cp-versos{font-size:clamp(18px,2.8vw,24px);line-height:1.9;white-space:pre-line;margin:0}
  #${id} .cp-pie{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-top:28px;padding-top:18px;border-top:1px solid #ffffff18}
  #${id} button,#${id}-abrir{border:1px solid #b49358;background:#322b35;color:#f4e7ce;padding:12px 18px;border-radius:10px;cursor:pointer;font:14px system-ui,sans-serif;min-height:44px;touch-action:manipulation}
  #${id} button:hover,#${id}-abrir:hover{background:#53414a}
  #${id} button:focus-visible,#${id}-abrir:focus-visible{outline:3px solid #f1cf82;outline-offset:3px}
  #${id} button:disabled{opacity:.45;cursor:wait}
  #${id} .cp-cerrar{position:absolute;right:16px;top:12px;padding:10px 14px}
  #${id} .cp-contador{font:13px system-ui,sans-serif;color:#c7bda9}
  #${id} .cp-nota{font:12px/1.6 system-ui,sans-serif;color:#aaa2a6;margin:18px 0 0}
  #${id}-abrir{position:fixed;bottom:110px;left:50%;transform:translateX(-50%);z-index:25;background:#241f2bef;box-shadow:0 4px 30px #0006;max-width:85vw}
  @media(max-width:600px){#${id}{padding:8px}#${id} .cp-caja{padding:22px 18px;max-height:calc(100dvh - 16px)}#${id} .cp-contenido{grid-template-columns:1fr;gap:25px}#${id} canvas{width:130px;margin:auto}#${id} .cp-versos{font-size:18px}#${id} h2{font-size:27px}#${id} .cp-pie button{padding:11px 13px}}
  @media(prefers-reduced-motion:reduce){#${id} *{scroll-behavior:auto!important}}
  `;document.head.appendChild(estilo);
  const panel=document.createElement('section');panel.id=id;panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby',id+'-titulo');
  panel.innerHTML=`<div class="cp-caja"><button type="button" class="cp-cerrar" aria-label="Cerrar biblioteca">✕</button><p class="cp-cabecera">SALA DEL CONSEJO · BIBLIOTECA DE LOS VERSOS</p><div class="cp-contenido"><canvas width="512" height="768" role="img" aria-label="Portada ilustrada del poema"></canvas><article aria-live="polite" aria-atomic="true"><h2 id="${id}-titulo"></h2><p class="cp-sub"></p><p class="cp-versos"></p></article></div><div class="cp-pie"><button type="button" class="cp-anterior">← Anterior</button><span class="cp-contador"></span><button type="button" class="cp-siguiente">Siguiente →</button></div><p class="cp-nota">Poemas originales creados para esta biblioteca. Ilustraciones generadas en el código, sin imágenes externas. Flechas: cambiar poema · Esc: cerrar.</p></div>`;
  document.body.appendChild(panel);
  const abrirBtn=document.createElement('button');abrirBtn.type='button';abrirBtn.id=id+'-abrir';abrirBtn.textContent='R · Leer el libro del consejo';abrirBtn.hidden=true;document.body.appendChild(abrirBtn);
  const preview=panel.querySelector('canvas'),titulo=panel.querySelector('h2'),sub=panel.querySelector('.cp-sub'),versos=panel.querySelector('.cp-versos'),contador=panel.querySelector('.cp-contador');
  const anterior=panel.querySelector('.cp-anterior'),siguiente=panel.querySelector('.cp-siguiente'),cerrarBtn=panel.querySelector('.cp-cerrar');
  let controles=null, oclusion=null, indice=0, abierto=false, liberado=false, cerca=false, transicion=null;
  let activoAnterior=null;const menu=document.getElementById('menu');
  const reducido=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const localCam=new THREE.Vector3(),centroLibro=new THREE.Vector3(13.6,5.49,-10.1);
  function interfaz() {
    const p=POEMAS_CONSEJO[indice];titulo.textContent=p.titulo;sub.textContent=p.subtitulo;versos.textContent=p.versos.join('\n');contador.textContent=`${indice+1} / ${POEMAS_CONSEJO.length}`;
    preview.getContext('2d').drawImage(portadas[indice],0,0);preview.setAttribute('aria-label',`Portada ilustrada: ${p.titulo}`);
    anterior.disabled=siguiente.disabled=Boolean(transicion);
  }
  function aplicarIndice(n) {
    indice=n;cuero.color.set(POEMAS_CONSEJO[n].color);matPortada.map=mapas[n];matPortada.needsUpdate=true;pintarPagina(POEMAS_CONSEJO[n]);interfaz();
  }
  function cambiar(direccion) {
    if(transicion || liberado)return;
    const n=(indice+direccion+POEMAS_CONSEJO.length)%POEMAS_CONSEJO.length;
    if(reducido){aplicarIndice(n);return;}
    transicion={t:0,n,cambiado:false};interfaz();
  }
  function abrir() {
    if(liberado || !cerca || abierto)return;
    abierto=true;activoAnterior=document.activeElement;
    controles?.pausar?.();
    if(document.pointerLockElement){try{const p=document.exitPointerLock();p?.catch?.(()=>{});}catch{}}
    panel.hidden=false;abrirBtn.hidden=true;interfaz();cerrarBtn.focus();
  }
  function cerrar() {
    if(!abierto)return;abierto=false;panel.hidden=true;
    // El usuario pulsa el botón real de Continuar; nunca usamos .click().
    if(menu){menu.hidden=false;const boton=document.getElementById('boton-iniciar');boton?.focus();}
    else if(activoAnterior?.isConnected)activoAnterior.focus();
  }
  function teclado(e) {
    if(abierto){
      if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();cerrar();return;}
      if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();e.stopImmediatePropagation();cambiar(e.code==='ArrowLeft'?-1:1);return;}
      if(e.code==='Tab'){
        const lista=[...panel.querySelectorAll('button:not(:disabled)')];const primero=lista[0],ultimo=lista[lista.length-1];
        if(e.shiftKey && document.activeElement===primero){e.preventDefault();ultimo.focus();}
        else if(!e.shiftKey && document.activeElement===ultimo){e.preventDefault();primero.focus();}
      }
      // No dejar que las teclas del lector lleguen al movimiento del castillo.
      if(['KeyW','KeyA','KeyS','KeyD','Space','KeyE','KeyF','KeyR'].includes(e.code))e.stopImmediatePropagation();
    } else if(e.code==='KeyR' && cerca && !e.repeat && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName) && !document.activeElement?.isContentEditable && (!menu || menu.hidden || document.pointerLockElement===elemento)) {
      e.preventDefault();e.stopImmediatePropagation();abrir();
    }
  }
  abrirBtn.addEventListener('click',abrir);cerrarBtn.addEventListener('click',cerrar);
  anterior.addEventListener('click',()=>cambiar(-1));siguiente.addEventListener('click',()=>cambiar(1));
  document.addEventListener('keydown',teclado,true);
  function alDesbloquear(){if(abierto && menu)menu.hidden=true;}
  document.addEventListener('pointerlockchange',alDesbloquear);
  interfaz();
  function actualizar(dt=0) {
    if(liberado)return;
    const paso=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.1));
    castillo.updateWorldMatrix(true,false);camara.getWorldPosition(localCam);castillo.worldToLocal(localCam);
    const dentro=localCam.x>7.3&&localCam.x<19.7&&localCam.z> -17.7&&localCam.z< -2.3&&localCam.y>3&&localCam.y<9.8;
    cerca=dentro&&localCam.distanceTo(centroLibro)<(opciones.distanciaLectura??4.6);
    const visible=oclusion?.habitaciones?.find(h=>h.id===ROOM)?.visible??true;
    raiz.visible=visible;luz.visible=visible;
    abrirBtn.hidden=!cerca||abierto||Boolean(menu&&!menu.hidden);
    if(abierto && !dentro)cerrar();
    if(transicion){
      transicion.t+=paso;const p=Math.min(1,transicion.t/.95);
      pivote.rotation.y=-Math.sin(Math.PI*p)*1.35;
      if(p>=.5&&!transicion.cambiado){transicion.cambiado=true;aplicarIndice(transicion.n);}
      if(p>=1){pivote.rotation.y=0;transicion=null;interfaz();}
    }
    // Respaldo frente al orden de los listeners de unlock del controlador.
    if(abierto&&menu&&!menu.hidden)menu.hidden=true;
  }
  const api={raiz,libro,poemas:POEMAS_CONSEJO,actualizar,abrir,cerrar,
    siguiente:()=>cambiar(1),anterior:()=>cambiar(-1),
    vincularControles(c){controles=c;},vincularOclusion(o){oclusion=o;},
    get indice(){return indice;},get abierto(){return abierto;},
    liberar(){
      if(liberado)return;cerrar();liberado=true;
      document.removeEventListener('keydown',teclado,true);document.removeEventListener('pointerlockchange',alDesbloquear);
      panel.remove();abrirBtn.remove();estilo.remove();raiz.removeFromParent();
      if(Array.isArray(colisiones)){
        for(const r of obstaculosPropios){const i=colisiones.indexOf(r);if(i>=0)colisiones.splice(i,1);}
        colisionesQuitadas.sort((a,b)=>a.indice-b.indice).forEach(r=>colisiones.splice(Math.min(r.indice,colisiones.length),0,r.valor));
      }
      originalesOcultos.forEach(r=>r.objeto.visible=r.visible);
      for(const g of geometrias)g.dispose();for(const m of materiales)m.dispose();for(const t of texturas)t.dispose();
      delete castillo.userData.consejoPoetico;
    }
  };
  castillo.userData.consejoPoetico=api;return api;
}
