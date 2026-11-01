import * as THREE from 'three';

export function crearAmbienteAvanzado(escena,camara,castillo,entorno,ciclo) {
  let semilla=123;
  const azar=()=>{semilla=(Math.imul(1664525,semilla)+1013904223)>>>0;return semilla/4294967296;};
  function canvas(n=256){const c=document.createElement('canvas');c.width=c.height=n;return [c,c.getContext('2d')];}
  function mapa(tipo) {
    const [c,x]=canvas();
    x.fillStyle=tipo==='corteza'?'#735336':tipo==='hojas'?'#597949':'#8e8a7a';x.fillRect(0,0,256,256);
    if(tipo==='adoquin') {
      x.fillStyle='#45483f';x.fillRect(0,0,256,256);
      for(let f=0;f<8;f++)for(let j=-1;j<5;j++) {
        const v=110+Math.floor(azar()*50);x.fillStyle=`rgb(${v+10},${v+5},${v-5})`;
        x.fillRect(j*64+(f%2)*32+2,f*32+2,59,27);
      }
    } else for(let i=0;i<1800;i++) {
      const v=azar();x.fillStyle=tipo==='corteza'?`rgba(30,17,5,${v*0.4})`:tipo==='hojas'?`rgba(${20+Math.floor(v*60)},${65+Math.floor(v*65)},25,0.5)`:`rgba(${v>0.5?210:40},${v>0.5?210:40},${v>0.5?190:35},0.2)`;
      const px=azar()*256,py=azar()*256;
      if(tipo==='corteza')x.fillRect(px,py,1+azar()*3,12+azar()*55);
      else{x.beginPath();x.ellipse(px,py,2+azar()*8,1+azar()*5,azar()*3,0,Math.PI*2);x.fill();}
    }
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
  }
  const texturas={corteza:mapa('corteza'),hojas:mapa('hojas'),roca:mapa('roca'),adoquin:mapa('adoquin')};
  texturas.corteza.repeat.set(2,3);texturas.hojas.repeat.set(3,3);texturas.roca.repeat.set(2,2);texturas.adoquin.repeat.set(2,18);
  const usados=new Set();
  escena.traverse(o=>{
    let tipo=null;
    if(o.name.startsWith('Vegetacion '))tipo=o.name.endsWith('tronco')?'corteza':o.name.endsWith('roca')?'roca':'hojas';
    if(o.name==='Sendero en pendiente')tipo='adoquin';
    if(!tipo||!o.material)return;
    for(const m of Array.isArray(o.material)?o.material:[o.material]){
      if(usados.has(m))continue;usados.add(m);m.map=texturas[tipo];m.color.setHex(0xffffff);m.roughness=0.95;m.needsUpdate=true;
    }
  });
  function disco(luna=false) {
    const [c,x]=canvas();x.clearRect(0,0,256,256);
    x.fillStyle=luna?'#d8dfeb':'#fff0b0';x.beginPath();x.arc(128,128,103,0,Math.PI*2);x.fill();
    if(luna)for(let i=0;i<40;i++) {x.fillStyle='rgba(75,88,110,0.20)';x.beginPath();const a=azar()*Math.PI*2,r=Math.sqrt(azar())*80;x.arc(128+Math.cos(a)*r,128+Math.sin(a)*r,3+azar()*12,0,Math.PI*2);x.fill();}
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
  }
  const solSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:disco(),transparent:true,depthWrite:false,fog:false,toneMapped:false}));
  const lunaSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:disco(true),transparent:true,depthWrite:false,fog:false,toneMapped:false}));
  solSprite.scale.set(13,13,1);lunaSprite.scale.set(10,10,1);escena.add(solSprite,lunaSprite);
  const estrellaPos=[];
  for(let i=0;i<650;i++) {
    const a=azar()*Math.PI*2,y=0.03+azar()*0.97,r=Math.sqrt(1-y*y);
    estrellaPos.push(Math.cos(a)*r*210,y*210,Math.sin(a)*r*210);
  }
  const estrellasGeo=new THREE.BufferGeometry();estrellasGeo.setAttribute('position',new THREE.Float32BufferAttribute(estrellaPos,3));
  const estrellas=new THREE.Points(estrellasGeo,new THREE.PointsMaterial({color:0xe3eaff,size:0.65,sizeAttenuation:true,transparent:true,opacity:0,depthWrite:false,fog:false,toneMapped:false}));escena.add(estrellas);
  const [cc,cx]=canvas(64),grad=cx.createRadialGradient(32,32,0,32,32,30);
  grad.addColorStop(0,'rgba(255,255,210,1)');grad.addColorStop(0.2,'rgba(200,255,95,0.9)');grad.addColorStop(1,'rgba(160,255,30,0)');cx.fillStyle=grad;cx.fillRect(0,0,64,64);
  const brillo=new THREE.CanvasTexture(cc);brillo.colorSpace=THREE.SRGBColorSpace;
  const grupos=new Map();
  for(let i=0;i<180;i++) {
    const x=(azar()-0.5)*140,z=(azar()-0.5)*140;
    if(Math.abs(x)<29&&z>-45&&z<27)continue;
    const k=`${Math.floor(x/24)},${Math.floor(z/24)}`;
    if(!grupos.has(k))grupos.set(k,[]);grupos.get(k).push({x,y:entorno.altura(x,z)+1+azar()*2,z,fase:azar()*6.28});
  }
  const enjambres=[];
  for(const items of grupos.values()) {
    const g=new THREE.BufferGeometry(),v=new Float32Array(items.length*3);
    items.forEach((p,i)=>v.set([p.x,p.y,p.z],i*3));g.setAttribute('position',new THREE.BufferAttribute(v,3));g.computeBoundingSphere();g.boundingSphere.radius+=2;
    const m=new THREE.PointsMaterial({map:brillo,color:0xd9ff85,size:0.5,transparent:true,depthWrite:false,opacity:0,blending:THREE.AdditiveBlending,toneMapped:false});
    const points=new THREE.Points(g,m);escena.add(points);enjambres.push({points,items});
  }
  const lamparasMat=new THREE.MeshStandardMaterial({color:0xffd28b,emissive:0xffae45,emissiveIntensity:0.1});
  const lamparaGeo=new THREE.BoxGeometry(0.28,0.6,0.28);
  for(const [x,y,z] of [[-2,5,18.6],[2,5,18.6],[-2,3,43.4],[2,3,43.4]]) {
    const o=new THREE.Mesh(lamparaGeo,lamparasMat);o.position.set(x,y,z);castillo.add(o);
  }
  const lucesExterior=[];
  for(const [y,z] of [[5,19.4],[3,42.8]]) {
    const luz=new THREE.PointLight(0xffc579,0,14,2);luz.position.set(0,y,z);castillo.add(luz);lucesExterior.push(luz);
  }
  const emisivos=new Set();castillo.traverse(o=>{
    if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material])
      if(m?.emissive&&m.name!== 'ignorar'&&m.emissive.g>m.emissive.r*1.5&&m.emissive.g>0.1)emisivos.add(m);
  });
  // Se crean despues del gestor dinamico; sus luces no son absorbidas por el pool.
  const pool=[];escena.traverse(o=>{if(o.isPointLight&&o.name.startsWith('Luz interior dinamica '))pool.push(o);});
  const intensidades=new Map();
  const panel=document.createElement('div');panel.style.cssText='position:fixed;top:12px;right:12px;padding:9px 12px;background:#101725bf;color:#fff;border-radius:8px;font:13px Arial;pointer-events:none;z-index:7';document.body.appendChild(panel);
  let tiempo=0,relojParticulas=0;
  const target=new THREE.Vector3(),direccion=new THREE.Vector3();
  function prepararLuces(){for(const l of pool)if(intensidades.has(l))l.intensity=intensidades.get(l);}
  function actualizar(dt) {
    tiempo+=dt;relojParticulas+=dt;const moverParticulas=relojParticulas>=1/24;if(moverParticulas)relojParticulas=0;const hora=((ciclo.ajustes.hora%24)+24)%24,a=(hora-6)/24*Math.PI*2;
    const noche=1-THREE.MathUtils.smoothstep(Math.sin(a),-0.1,0.18);
    direccion.set(Math.cos(a)*80,Math.sin(a)*100,Math.cos(a)*35).normalize();
    camara.getWorldPosition(target);
    solSprite.position.copy(target).addScaledVector(direccion,180);solSprite.visible=direccion.y>-0.03;
    lunaSprite.position.copy(target).addScaledVector(direccion,-180);lunaSprite.visible=direccion.y<0.03;lunaSprite.material.opacity=0.4+0.6*noche;
    estrellas.position.copy(target);estrellas.material.opacity=noche;estrellas.visible=noche>0.01;
    for(const e of enjambres) {
      e.points.visible=noche>0.02&&e.points.geometry.boundingSphere.center.distanceTo(camara.position)<45+e.points.geometry.boundingSphere.radius;e.points.material.opacity=noche*(0.7+0.3*Math.sin(tiempo*1.7));
      if(!e.points.visible||!moverParticulas)continue;
      const pos=e.points.geometry.attributes.position;
      e.items.forEach((p,i)=>pos.setXYZ(i,p.x+Math.sin(tiempo*0.7+p.fase)*0.7,p.y+Math.sin(tiempo+p.fase)*0.4,p.z+Math.cos(tiempo*0.6+p.fase)*0.7));pos.needsUpdate=true;
    }
    for(const l of pool){intensidades.set(l,l.intensity);l.intensity*=0.35+0.65*noche;}
    for(const l of lucesExterior)l.intensity=55*noche;
    lamparasMat.emissiveIntensity=0.1+2*noche;
    for(const m of emisivos)m.emissiveIntensity=0.15+1.8*noche;
    const esDia=hora>=6&&hora<18;
    const horasFaltantes=esDia?18-hora:hora<6?6-hora:30-hora;
    const segundos=Math.ceil(horasFaltantes/24*Math.max(30,ciclo.ajustes.duracionSegundos));
    const textoPanel=`${String(Math.floor(hora)).padStart(2,'0')}:${String(Math.floor((hora%1)*60)).padStart(2,'0')} · ${esDia?'Anochece':'Amanece'} en ${Math.floor(segundos/60)}:${String(segundos%60).padStart(2,'0')}${ciclo.ajustes.pausado?' · Pausado':''}`;if(panel.textContent!==textoPanel)panel.textContent=textoPanel;
  }
  return {prepararLuces,actualizar};
}
