export function crearControlesTactiles(accion) {
  const estado={x:0,y:0,mirarX:0,mirarY:0,correr:false,subir:false,bajar:false};
  const estilo=document.createElement('style');
  estilo.textContent=`
    #controles-tactiles{position:fixed;inset:0;z-index:8;pointer-events:none;user-select:none;-webkit-user-select:none}
    #controles-tactiles[hidden]{display:none!important}
    #controles-tactiles *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
    #ct-mirada{position:absolute;right:0;top:0;width:58%;height:100%;pointer-events:auto;touch-action:none}
    #ct-mirada span{position:absolute;top:35%;left:20%;color:#fff8;font:12px Arial;text-shadow:0 1px 3px #000;pointer-events:none}
    #ct-joystick{position:absolute;left:max(18px,env(safe-area-inset-left));bottom:calc(24px + env(safe-area-inset-bottom));width:clamp(105px,27vw,145px);aspect-ratio:1;border:2px solid #ffffff70;border-radius:50%;background:#13232b75;pointer-events:auto;touch-action:none}
    #ct-palanca{position:absolute;left:50%;top:50%;width:44%;height:44%;border-radius:50%;border:1px solid #ffffffa0;background:#d1b783a8;transform:translate(-50%,-50%);pointer-events:none}
    #ct-acciones{position:absolute;right:max(14px,env(safe-area-inset-right));bottom:calc(20px + env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(2,clamp(62px,17vw,82px));gap:9px;pointer-events:none}
    .ct-boton{min-height:48px;border:1px solid #ffffff80;border-radius:12px;background:#172932c9;color:white;font:600 13px Arial;pointer-events:auto;touch-action:none;padding:8px;box-shadow:0 2px 8px #0005}
    .ct-boton:active,.ct-boton.ct-activo{background:#8a713ddd;border-color:#ffe2a0}
    #ct-menu{position:absolute;left:max(16px,env(safe-area-inset-left));top:calc(65px + env(safe-area-inset-top));min-width:72px;min-height:44px}
    .ct-vuelo[hidden]{display:none!important}
    body.ct-jugando #ayuda{display:none}
    @media(max-height:450px){#ct-acciones{gap:6px;grid-template-columns:repeat(3,65px)}.ct-boton{min-height:42px;font-size:12px}#ct-joystick{width:112px;bottom:16px}#ct-menu{top:12px;left:calc(50% - 36px)}}
  `;
  document.head.appendChild(estilo);
  const meta=document.querySelector('meta[name="viewport"]');
  if(meta&&!meta.content.includes('viewport-fit'))meta.content+=', viewport-fit=cover';
  const raiz=document.createElement('div');raiz.id='controles-tactiles';raiz.hidden=true;
  raiz.innerHTML='<div id="ct-mirada"><span>Desliza para mirar</span></div><div id="ct-joystick" aria-label="Joystick para caminar"><div id="ct-palanca"></div></div><div id="ct-acciones"></div>';
  document.body.appendChild(raiz);
  const zona=raiz.querySelector('#ct-mirada'),joystick=raiz.querySelector('#ct-joystick'),palanca=raiz.querySelector('#ct-palanca'),acciones=raiz.querySelector('#ct-acciones');
  let activo=false,idJoy=null,idMirada=null,ultimoX=0,ultimoY=0,ultimoVuelo=null;
  const retenidos=new Map();
  function capturar(el,e){try{el.setPointerCapture(e.pointerId);}catch{}}
  function impedir(e){e.preventDefault();e.stopPropagation();}
  function palancaMover(e){
    const r=joystick.getBoundingClientRect(),radio=r.width*0.34;
    let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
    const n=Math.hypot(dx,dy);if(n>radio){dx*=radio/n;dy*=radio/n;}
    let x=dx/radio,y=-dy/radio;
    const longitud=Math.hypot(x,y),muerta=0.10;
    if(longitud<muerta){x=0;y=0;}else{const factor=(longitud-muerta)/(1-muerta)/longitud;x*=factor;y*=factor;}
    estado.x=x;estado.y=y;palanca.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
  }
  joystick.addEventListener('pointerdown',e=>{if(!activo||idJoy!==null)return;impedir(e);idJoy=e.pointerId;capturar(joystick,e);palancaMover(e);});
  joystick.addEventListener('pointermove',e=>{if(e.pointerId!==idJoy)return;impedir(e);palancaMover(e);});
  function soltarJoy(e){if(e.pointerId!==idJoy)return;idJoy=null;estado.x=estado.y=0;palanca.style.transform='translate(-50%,-50%)';}
  for(const tipo of ['pointerup','pointercancel','lostpointercapture'])joystick.addEventListener(tipo,soltarJoy);
  zona.addEventListener('pointerdown',e=>{if(!activo||idMirada!==null)return;impedir(e);idMirada=e.pointerId;ultimoX=e.clientX;ultimoY=e.clientY;capturar(zona,e);});
  zona.addEventListener('pointermove',e=>{if(!activo||e.pointerId!==idMirada)return;impedir(e);estado.mirarX+=e.clientX-ultimoX;estado.mirarY+=e.clientY-ultimoY;ultimoX=e.clientX;ultimoY=e.clientY;});
  function soltarMirada(e){if(e.pointerId===idMirada)idMirada=null;}
  for(const tipo of ['pointerup','pointercancel','lostpointercapture'])zona.addEventListener(tipo,soltarMirada);
  function boton(texto,id,sostenido=false) {
    const b=document.createElement('button');b.type='button';b.className='ct-boton';b.textContent=texto;b.setAttribute('aria-label',texto);acciones.appendChild(b);
    const ids=new Set();retenidos.set(b,{ids,id});
    b.addEventListener('pointerdown',e=>{
      if(!activo)return;impedir(e);capturar(b,e);
      if(sostenido){ids.add(e.pointerId);estado[id]=true;b.classList.add('ct-activo');}
      else accion(id);
    });
    function fin(e){if(!ids.has(e.pointerId))return;ids.delete(e.pointerId);estado[id]=ids.size>0;if(!ids.size)b.classList.remove('ct-activo');}
    for(const tipo of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(tipo,fin);
    b.addEventListener('click',e=>{e.preventDefault();if(activo&&e.detail===0&&!sostenido)accion(id);});
    return b;
  }
  const puerta=boton('Puerta','puerta');
  const vuelo=boton('Volar','vuelo');
  boton('Correr','correr',true);
  const subir=boton('Subir ↑','subir',true),bajar=boton('Bajar ↓','bajar',true);
  subir.classList.add('ct-vuelo');bajar.classList.add('ct-vuelo');
  const menu=boton('Menú','menu');menu.id='ct-menu';raiz.appendChild(menu);
  function reiniciar(){
    estado.x=estado.y=estado.mirarX=estado.mirarY=0;estado.correr=estado.subir=estado.bajar=false;idJoy=idMirada=null;
    palanca.style.transform='translate(-50%,-50%)';
    for(const [b,r] of retenidos){r.ids.clear();b.classList.remove('ct-activo');}
  }
  function setActivo(valor){activo=Boolean(valor);raiz.hidden=!activo;document.body.classList.toggle('ct-jugando',activo);if(!activo)reiniciar();}
  function setVuelo(valor){
    if(valor===ultimoVuelo)return;ultimoVuelo=valor;vuelo.textContent=valor?'Aterrizar':'Volar';vuelo.classList.toggle('ct-activo',valor);subir.hidden=bajar.hidden=!valor;
    if(!valor){estado.subir=estado.bajar=false;for(const b of [subir,bajar]){retenidos.get(b).ids.clear();b.classList.remove('ct-activo');}}
  }
  function setPuerta(p){puerta.style.opacity=p?'1':'0.65';puerta.setAttribute('aria-label',p?`${p.abierta?'Cerrar':'Abrir'} ${p.nombre}`:'Puerta cercana');}
  raiz.addEventListener('contextmenu',e=>e.preventDefault());setVuelo(false);
  return {estado,setActivo,setVuelo,setPuerta,reiniciar};
}
