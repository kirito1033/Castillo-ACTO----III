import * as THREE from 'three';
import { crearApiPlantas } from './apiPlantas.js';

// Crear despues de construir habitaciones y ANTES de cachear/fusionar geometria.
export function crearBoticarioArmeria(escena, camara, castillo, elemento, opciones = {}) {
  const limpio=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const puerta=castillo.userData.puertas.find(p=>limpio(p.nombre)==='armeria');
  if(!puerta)throw new Error('No se encontró la puerta Armeria.');
  const habitacion=puerta.nombre,api=crearApiPlantas(opciones);
  const recursos={g:new Set(),m:new Set(),t:new Set()};
  let controles=null,oclusion=null,abierto=false,destruido=false;
  let busqueda=opciones.busquedaInicial || '',pagina=1,total=0,resultados=[],actual=null,pestana='catalogo';
  let cargaBusqueda=null,cargaDetalle=null,versionBusqueda=0,versionDetalle=0,consultado=false;
  const inv=new THREE.Matrix4(),p=new THREE.Vector3();castillo.updateMatrixWorld(true);inv.copy(castillo.matrixWorld).invert();
  const dentro=v=>v.x>-19.95&&v.x<-7.05&&v.z>-17.95&&v.z<-2.05&&v.y>3&&v.y<9.95;
  const protegidos=new Set();puerta.marco.traverse(o=>protegidos.add(o));

  // 01. RETIRAR ARMARIOS, MESAS Y LUMINARIAS ANTERIORES DE LA ARMERIA.
  const quitar=new Set(),muebles=/^(Mesa|Armario|Estanteria|Libros|Cama|Cabecera|Cadena candelabro|Brazo candelabro|Vela|Soporte antorcha)/i;
  castillo.traverse(o=>{if(protegidos.has(o))return;o.getWorldPosition(p).applyMatrix4(inv);if(!dentro(p))return;
    if(o.isPointLight||(o.isMesh&&muebles.test(o.name))){quitar.add(o);return;}
    if(o.isMesh&&o.material){const ms=Array.isArray(o.material)?o.material:[o.material];if(ms.some(m=>m?.emissive&&m.emissive.r>.2&&m.emissive.r>m.emissive.g))quitar.add(o);}
  });
  const todos=new Set();for(const o of quitar)o.traverse(c=>todos.add(c));const colisiones=castillo.userData.colisiones;let retiradas=0;
  for(let i=colisiones.length-1;i>=0;i--)if(todos.has(colisiones[i].mesh)){colisiones.splice(i,1);retiradas++;}
  for(const o of quitar)o.removeFromParent();

  // 02. DECORACION: MADERA, PAREDES VERDES Y MATERIALES SIN LUCES NUEVAS.
  function mat(color){const m=new THREE.MeshBasicMaterial({color,toneMapped:false});recursos.m.add(m);return m;}
  const madera=mat(0x594735),marco=mat(0x303d32),verde=mat(0x6f8170),crema=mat(0xc4bea3),oro=mat(0xb4a06c),tierra=mat(0x835c44),hojas=mat(0x477155);
  const grupo=new THREE.Group();grupo.name='Boticario Armeria';grupo.visible=false;castillo.add(grupo);
  const cube=new THREE.BoxGeometry(1,1,1);recursos.g.add(cube);
  function caja(nombre,x,y,z,w,h,d,material,solido=false){const o=new THREE.Mesh(cube,material);o.name=nombre;o.position.set(x,y,z);o.scale.set(w,h,d);o.userData.habitacion=habitacion;grupo.add(o);if(solido)colisiones.push({mesh:o,w,h,d,esCaja:true});return o;}
  caja('Suelo boticario',-13.45,3.025,-10,12.2,.02,15.2,madera);
  caja('Techo boticario',-13.45,9.675,-10,12.2,.02,15.2,marco);
  caja('Mural boticario fondo',-19.55,6.35,-10,.025,6.6,15.2,verde);
  caja('Mural boticario sur',-13.45,6.35,-17.6,12.2,6.6,.025,crema);
  caja('Mural boticario norte',-13.45,6.35,-2.4,12.2,6.6,.025,crema);
  caja('Entrada boticario sur',-7.35,6.35,-14.45,.025,6.6,6.3,verde);
  caja('Entrada boticario norte',-7.35,6.35,-5.55,.025,6.6,6.3,verde);
  caja('Dintel boticario',-7.35,8.15,-10,.025,3,2.6,verde);
  caja('Mueble herbario',-13.8,3.6,-10,4.4,1.2,2,madera,true);
  caja('Tablero mesa herbario',-13.8,4.25,-10,4.6,.1,2.15,marco);
  caja('Estante botanico',-19.0,4.75,-10,.8,3.1,10.5,madera,true);
  for(const y of [3.4,4.6,5.8,6.35])caja('Balda boticario',-18.86,y,-10,1.04,.12,10.7,marco);
  for(const z of [-15.2,-10,-4.8])caja('Separador boticario',-18.86,4.9,z,1.04,2.9,.08,marco);
  for(const z of [-17.5,-2.5])for(const y of [3.18,9.5])caja('Remate boticario',-13.45,y,z,12.1,.06,.04,oro);

  // Macetas genericas: decoracion, no modelos identificados como una especie real.
  const potGeo=new THREE.CylinderGeometry(.30,.22,.46,10),leafGeo=new THREE.SphereGeometry(1,6,4);recursos.g.add(potGeo);recursos.g.add(leafGeo);
  const posiciones=[[-18.6,6.65,-14],[-18.6,6.65,-10],[-18.6,6.65,-6],[-15.4,4.55,-10.5],[-12.3,4.55,-10.5]];
  const pots=new THREE.InstancedMesh(potGeo,tierra,posiciones.length),leaves=new THREE.InstancedMesh(leafGeo,hojas,posiciones.length*5),dummy=new THREE.Object3D();
  posiciones.forEach(([x,y,z],i)=>{dummy.position.set(x,y,z);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();pots.setMatrixAt(i,dummy.matrix);
    for(let j=0;j<5;j++){const a=j*Math.PI*2/5;dummy.position.set(x+Math.cos(a)*.18,y+.5,z+Math.sin(a)*.18);dummy.rotation.set(Math.sin(a)*.5,a,Math.cos(a)*.5);dummy.scale.set(.14,.5,.2);dummy.updateMatrix();leaves.setMatrixAt(i*5+j,dummy.matrix);}
  });
  for(const o of [pots,leaves]){o.instanceMatrix.needsUpdate=true;o.computeBoundingBox();o.computeBoundingSphere();o.userData.habitacion=habitacion;grupo.add(o);}

  // 03. HERBARIO INTERACTIVO Y CARTEL.
  caja('Soporte herbario',-11.65,4.38,-10,.16,.25,2.4,marco);
  const cartel=document.createElement('canvas');cartel.width=768;cartel.height=384;const cg=cartel.getContext('2d');cg.fillStyle='#d1c5a4';cg.fillRect(0,0,768,384);cg.strokeStyle='#596b4d';cg.lineWidth=8;cg.strokeRect(18,18,732,348);cg.textAlign='center';cg.fillStyle='#294638';cg.font='bold 66px Georgia';cg.fillText('HERBARIO',384,125);cg.font='31px Georgia';cg.fillText('El boticario del castillo',384,190);cg.font='26px Arial';cg.fillText('Haz clic para aprender sobre plantas',384,265);cg.font='22px Arial';cg.fillText('Observar también es una forma de cuidar',384,320);
  const tex=new THREE.CanvasTexture(cartel);tex.colorSpace=THREE.SRGBColorSpace;recursos.t.add(tex);const bookMat=new THREE.MeshBasicMaterial({map:tex,toneMapped:false});recursos.m.add(bookMat);
  const bookGeo=new THREE.PlaneGeometry(2.8,1.4);recursos.g.add(bookGeo);const libro=new THREE.Mesh(bookGeo,bookMat);libro.name='Abrir boticario';libro.position.set(-11.5,5.05,-10);libro.rotation.y=Math.PI/2;libro.userData.habitacion=habitacion;libro.userData.interactivo=true;grupo.add(libro);

  // 04. HERBARIO PERSONAL LOCAL. NO ESCRIBE DATOS EN LAS APIS.
  const clave='castillo.boticario.v1';let guardado={favoritos:{},estudiadas:[],notas:{}};
  try{const data=JSON.parse(localStorage.getItem(clave)||'null');if(data&&typeof data==='object')guardado={favoritos:data.favoritos||{},estudiadas:Array.isArray(data.estudiadas)?data.estudiadas:[],notas:data.notas||{}};}catch{}
  function guardar(){try{localStorage.setItem(clave,JSON.stringify(guardado));}catch{estado('Tu navegador no permitió guardar el herbario local.');}}

  // 05. INTERFAZ EN ESPAÑOL, TACTIL Y SIN HTML PROCEDENTE DE LA API.
  const estilo=document.createElement('style');estilo.textContent=`
    #bt-abrir[hidden],#bt-modal[hidden]{display:none!important}
    #bt-abrir{position:fixed;bottom:calc(14px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:9;padding:12px 18px;background:#294e3d;color:#fff5d9;border:1px solid #b2aa77;border-radius:22px;min-height:44px;font:600 13px system-ui;touch-action:manipulation}
    #bt-modal{position:fixed;inset:0;z-index:78;display:flex;align-items:center;justify-content:center;padding:14px;background:#0c191af2;color:#f1ecd9;font:14px system-ui;overflow:auto}
    #bt-panel{width:min(1180px,100%);max-height:96dvh;overflow:auto;background:#18342e;border:1px solid #b3aa7b;border-radius:14px;padding:18px;box-sizing:border-box}
    #bt-panel *{box-sizing:border-box}#bt-panel h2{font:400 28px Georgia;margin:0}#bt-panel h3{margin:0 0 6px;font-size:19px}#bt-panel p{line-height:1.6}.bt-fila{display:flex;gap:9px;flex-wrap:wrap;align-items:center;justify-content:space-between}.bt-herramientas{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
    #bt-panel input,#bt-panel button,#bt-panel textarea{font:inherit;border:1px solid #8f9d76;border-radius:8px;padding:10px;background:#284b40;color:#fff8e5;min-height:44px}#bt-panel input[type=search]{flex:1;min-width:160px}#bt-panel button{cursor:pointer;touch-action:manipulation}#bt-panel button:disabled{opacity:.45;cursor:default}#bt-panel button[aria-pressed=true]{background:#86774e}#bt-panel a{color:#edda9c}#bt-panel textarea{width:100%;min-height:85px;resize:vertical}
    #bt-estado{min-height:1.4em;color:#e4d092}#bt-cuerpo{display:grid;grid-template-columns:minmax(250px,1fr) minmax(280px,1fr);gap:16px;align-items:start}#bt-lista{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
    .bt-planta{display:flex;flex-direction:column;gap:6px;text-align:left;min-width:0}.bt-planta strong{font-size:14px}.bt-planta em{font-size:12px;font-weight:400}.bt-planta img{width:100%;height:125px;object-fit:cover;border-radius:5px}.bt-sin-foto{display:grid;place-items:center;min-height:90px;border:1px dashed #829275;color:#c8d0b4;font:12px system-ui;text-align:center;padding:10px}
    #bt-detalle{padding:16px;background:#102922;border:1px solid #81916a;border-radius:10px;min-height:220px}#bt-detalle>img{display:block;max-height:300px;width:100%;object-fit:contain;background:#0c201b;border-radius:7px}#bt-detalle small{display:block;line-height:1.5;color:#c5cdb7;margin:7px 0}.bt-datos{display:grid;grid-template-columns:minmax(90px,.8fr) 1.2fr;gap:7px 12px;margin:14px 0}.bt-datos dt{color:#bec9a9}.bt-datos dd{margin:0;overflow-wrap:anywhere}#bt-descripcion{white-space:pre-line}#bt-panel .bt-aviso{font-size:12px;color:#c9ceb6;border-top:1px solid #718367;padding-top:10px;margin-top:14px}
    #bt-panel :focus-visible{outline:2px solid #f2d58c;outline-offset:3px}
    @media(max-width:700px){#bt-modal{padding:8px}#bt-panel{padding:12px}#bt-cuerpo{grid-template-columns:1fr}#bt-lista{grid-template-columns:repeat(2,minmax(0,1fr))}.bt-planta img{height:105px}#bt-panel h2{font-size:24px}}
  `;document.head.appendChild(estilo);
  const activar=document.createElement('button');activar.type='button';activar.id='bt-abrir';activar.textContent='Explorar plantas · B';activar.hidden=true;document.body.appendChild(activar);
  const modal=document.createElement('div');modal.id='bt-modal';modal.hidden=true;modal.innerHTML=`<section id="bt-panel" role="dialog" aria-modal="true" aria-labelledby="bt-titulo"><div class="bt-fila"><h2 id="bt-titulo">El boticario · Herbario vivo</h2><button type="button" id="bt-volver">Volver al castillo</button></div><p>Explora especies y crea tu colección de aprendizaje. Datos de iNaturalist; descripciones de Wikipedia en español cuando están disponibles.</p><form id="bt-form" class="bt-herramientas"><input id="bt-busqueda" type="search" maxlength="80" placeholder="Nombre común o científico" aria-label="Buscar plantas"><button type="submit" id="bt-buscar">Buscar</button></form><div class="bt-herramientas"><button type="button" id="bt-catalogo" aria-pressed="true">Catálogo</button><button type="button" id="bt-favoritos" aria-pressed="false">Mi herbario</button><button type="button" data-bt-q="Rosa">Rosa</button><button type="button" data-bt-q="Lavandula">Lavandula</button><button type="button" data-bt-q="Salvia">Salvia</button><button type="button" data-bt-q="Origanum">Origanum</button></div><p id="bt-estado" role="status" aria-live="polite"></p><div id="bt-cuerpo"><div><div id="bt-lista"></div><div class="bt-herramientas"><button type="button" id="bt-anterior">Anterior</button><span id="bt-pagina"></span><button type="button" id="bt-siguiente">Siguiente</button></div></div><article id="bt-detalle"><p>Selecciona una planta para abrir su ficha.</p></article></div><p class="bt-aviso">Herbario educativo: no determina si una planta puede consumirse o usarse como tratamiento. Los registros son observaciones de una plataforma, no un censo de la población. No se ofrecen dosis, recetas ni guías de cultivo inventadas.</p></section>`;document.body.appendChild(modal);
  const $=id=>modal.querySelector('#'+id);$('bt-busqueda').value=busqueda;
  const estado=t=>{$('bt-estado').textContent=t;};
  function texto(tag,t){const o=document.createElement(tag);o.textContent=t;return o;}
  function enlace(label,url){const seguro=api.urlSegura(url);if(!seguro)return texto('span','Fuente no disponible');const a=texto('a',label);a.href=seguro;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function imagen(foto,alt){
    if(!foto){const o=texto('div','Sin fotografía con licencia permitida');o.className='bt-sin-foto';return o;}
    const img=document.createElement('img');img.src=foto.src;img.alt=alt;img.loading='lazy';img.referrerPolicy='no-referrer';img.addEventListener('error',()=>{const o=texto('div','No se pudo mostrar la fotografía.');o.className='bt-sin-foto';img.replaceWith(o);},{once:true});return img;
  }
  function paginaUI(){const local=pestana==='favoritos';$('bt-anterior').disabled=local||pagina<=1;$('bt-siguiente').disabled=local||pagina*12>=total;$('bt-pagina').textContent=local?Object.keys(guardado.favoritos).length+' guardadas':'Página '+pagina;}
  function mostrarLista(items){
    $('bt-lista').replaceChildren();
    if(!items.length){$('bt-lista').appendChild(texto('p',pestana==='favoritos'?'Todavía no has guardado plantas.':'No se encontraron plantas. Prueba un nombre científico.'));return;}
    for(const item of items){
      const b=document.createElement('button');b.type='button';b.className='bt-planta';
      if(pestana!=='favoritos')b.appendChild(imagen(item.foto,item.nombre));
      b.append(texto('strong',item.nombre),texto('em',item.cientifico));
      if(guardado.estudiadas.includes(item.id))b.appendChild(texto('small','Marcada como estudiada'));
      b.addEventListener('click',()=>verPlanta(item.id));$('bt-lista').appendChild(b);
    }
  }
  function tab(nombre){pestana=nombre;$('bt-catalogo').setAttribute('aria-pressed',String(nombre==='catalogo'));$('bt-favoritos').setAttribute('aria-pressed',String(nombre==='favoritos'));}
  function verFavoritos(){cargaBusqueda?.abort();versionBusqueda++;tab('favoritos');mostrarLista(Object.values(guardado.favoritos));paginaUI();estado('Tu herbario se guarda únicamente en este navegador.');}
  async function buscar(p=1){
    if(!abierto||destruido)return;tab('catalogo');pagina=Math.max(1,p);busqueda=$('bt-busqueda').value.trim();
    const v=++versionBusqueda;cargaBusqueda?.abort();cargaBusqueda=new AbortController();
    estado('Consultando plantas…');$('bt-buscar').disabled=true;$('bt-anterior').disabled=$('bt-siguiente').disabled=true;
    try{
      const data=await api.buscar(busqueda,pagina,cargaBusqueda.signal);if(destruido||!abierto||v!==versionBusqueda)return;
      resultados=data.plantas;total=data.total;consultado=true;mostrarLista(resultados);paginaUI();estado(resultados.length+' plantas en esta página. Nombres en español cuando la fuente los dispone.');
    }catch(error){if(error.name!=='AbortError'&&v===versionBusqueda&&!destruido)estado('No se pudo consultar: '+error.message+' Comprueba tu conexión o reintenta.');}
    finally{if(!destruido&&v===versionBusqueda){$('bt-buscar').disabled=false;paginaUI();}}
  }
  const rangos={kingdom:'Reino',phylum:'Filo',subphylum:'Subfilo',class:'Clase',order:'Orden',family:'Familia',genus:'Género',species:'Especie'};
  function renderDetalle(planta){
    actual=planta;const cont=$('bt-detalle');cont.replaceChildren();
    cont.append(texto('h3',planta.nombre),texto('p',planta.cientifico),imagen(planta.foto,planta.nombre));
    if(planta.foto){cont.appendChild(texto('small',planta.foto.atribucion+' · Licencia: '+planta.foto.licencia));if(planta.foto.id)cont.appendChild(enlace('Fuente de la fotografía','https://www.inaturalist.org/photos/'+planta.foto.id));}
    const datos=document.createElement('dl');datos.className='bt-datos';
    function dato(k,v){datos.append(texto('dt',k),texto('dd',v));}
    dato('Nombre científico',planta.cientifico);dato('Nombre común',planta.nombre===planta.cientifico?'No disponible en la fuente':planta.nombre);
    dato('Rango',rangos[planta.rango]||planta.rango);dato('Registros',planta.registros===null?'No disponibles':new Intl.NumberFormat('es').format(planta.registros));
    for(const a of planta.ancestros)if(rangos[a.rank]&&['kingdom','phylum','class','order','family','genus'].includes(a.rank))dato(rangos[a.rank],a.name||'No disponible');
    cont.appendChild(datos);
    const acciones=document.createElement('div');acciones.className='bt-herramientas';const favorito=document.createElement('button'),estudiada=document.createElement('button');favorito.type=estudiada.type='button';
    function etiquetas(){favorito.textContent=guardado.favoritos[planta.id]?'Quitar de mi herbario':'Guardar en mi herbario';estudiada.textContent=guardado.estudiadas.includes(planta.id)?'Estudiada: sí':'Marcar como estudiada';}
    favorito.addEventListener('click',()=>{if(guardado.favoritos[planta.id])delete guardado.favoritos[planta.id];else guardado.favoritos[planta.id]={id:planta.id,nombre:planta.nombre,cientifico:planta.cientifico};guardar();etiquetas();if(pestana==='favoritos'){mostrarLista(Object.values(guardado.favoritos));paginaUI();}});
    estudiada.addEventListener('click',()=>{const i=guardado.estudiadas.indexOf(planta.id);if(i>=0)guardado.estudiadas.splice(i,1);else guardado.estudiadas.push(planta.id);guardar();etiquetas();});etiquetas();acciones.append(favorito,estudiada);cont.appendChild(acciones);
    cont.appendChild(texto('h3','Sobre esta planta'));const desc=texto('p','Buscando una descripción en español…');desc.id='bt-descripcion';cont.appendChild(desc);const fuenteDesc=document.createElement('div');fuenteDesc.id='bt-fuente-descripcion';cont.appendChild(fuenteDesc);
    cont.appendChild(texto('h3','Conservación según la fuente'));
    if(!planta.estados.length)cont.appendChild(texto('p','No se recibió un estado de conservación. Esto no equivale a una clasificación de seguridad o abundancia.'));
    for(const e of planta.estados.slice(0,5)){const lugar=e.place?.display_name||e.place?.name||'Ámbito no indicado';cont.appendChild(texto('p',[e.authority||'Autoridad no indicada',e.status_name||e.status||'Estado no indicado',lugar].join(' · ')));}
    cont.appendChild(enlace('Ver ficha en iNaturalist',planta.fuente));
    if(planta.wikipedia){cont.appendChild(texto('span',' · '));cont.appendChild(enlace('Artículo indicado por la fuente',planta.wikipedia));}
    cont.appendChild(texto('h3','Mis notas'));const notas=document.createElement('textarea');notas.maxLength=2000;notas.setAttribute('aria-label','Notas sobre esta planta');notas.value=guardado.notas[planta.id]||'';notas.placeholder='Qué aprendiste, qué quieres observar…';notas.addEventListener('change',()=>{guardado.notas[planta.id]=notas.value;guardar();});cont.appendChild(notas);
  }
  async function verPlanta(id){
    if(!abierto||destruido)return;const v=++versionDetalle;cargaDetalle?.abort();cargaDetalle=new AbortController();const signal=cargaDetalle.signal;
    $('bt-detalle').replaceChildren(texto('p','Cargando ficha…'));
    try{
      const planta=await api.detalle(id,signal);if(destruido||!abierto||v!==versionDetalle)return;renderDetalle(planta);
      if(window.innerWidth<700)$('bt-detalle').scrollIntoView({behavior:'smooth',block:'start'});
      try{
        const descripcion=await api.descripcion(planta.cientifico,signal);if(destruido||!abierto||v!==versionDetalle)return;
        $('bt-descripcion').textContent=descripcion?.texto||'No se encontró una descripción en español para este nombre científico. Puedes consultar la ficha original.';
        if(descripcion)$('bt-fuente-descripcion').append(enlace('Fuente y licencia del extracto: Wikipedia',descripcion.fuente));
      }catch(error){if(error.name!=='AbortError'&&v===versionDetalle&&!destruido&&$('bt-descripcion'))$('bt-descripcion').textContent='No se pudo consultar la descripción. Los datos taxonómicos de iNaturalist siguen disponibles.';}
    }catch(error){if(error.name!=='AbortError'&&v===versionDetalle&&!destruido)$('bt-detalle').replaceChildren(texto('p','No se pudo cargar la ficha: '+error.message));}
  }

  // 06. INTERACCION CON EL HERBARIO, PC/MOVIL Y VISIBILIDAD.
  const ray=new THREE.Raycaster(),centro=new THREE.Vector2(0,0),cursor=new THREE.Vector2(),mundo=new THREE.Vector3();
  function jugadorLocal(){castillo.updateWorldMatrix(true,false);inv.copy(castillo.matrixWorld).invert();return camara.getWorldPosition(p).applyMatrix4(inv);}
  function disponible(){if(destruido||abierto||!dentro(jugadorLocal()))return false;libro.getWorldPosition(mundo);return camara.position.distanceTo(mundo)<5;}
  function ocultarMenu(){if(abierto){const m=document.getElementById('menu');if(m)m.hidden=true;}}
  function abrir(){if(!disponible())return;abierto=true;modal.hidden=false;activar.hidden=true;controles?.pausar?.();if(document.pointerLockElement)document.exitPointerLock();ocultarMenu();$('bt-busqueda').focus();if(pestana==='favoritos')verFavoritos();else if(!consultado)buscar(1);}
  function cerrar(reanudar=true){if(!abierto)return;abierto=false;modal.hidden=true;cargaBusqueda?.abort();cargaDetalle?.abort();versionBusqueda++;versionDetalle++;$('bt-buscar').disabled=false;if(reanudar)document.getElementById('boton-iniciar')?.click();}
  function click(e){if(e.target!==elemento||!document.getElementById('menu')?.hidden||!disponible())return;if(document.pointerLockElement===elemento)ray.setFromCamera(centro,camara);else{const r=elemento.getBoundingClientRect();cursor.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(cursor,camara);}libro.updateWorldMatrix(true,false);if(ray.intersectObject(libro,false).length)abrir();}
  function tecla(e){if(e.repeat)return;if(abierto&&e.code==='Escape'){e.preventDefault();cerrar(true);return;}if(e.code==='KeyB'&&document.getElementById('menu')?.hidden&&disponible()){e.preventDefault();abrir();}}
  function pointerLock(){if(abierto)queueMicrotask(ocultarMenu);}
  activar.addEventListener('click',abrir);$('bt-volver').addEventListener('click',()=>cerrar(true));$('bt-form').addEventListener('submit',e=>{e.preventDefault();buscar(1);});
  $('bt-catalogo').addEventListener('click',()=>buscar(pagina));$('bt-favoritos').addEventListener('click',verFavoritos);
  $('bt-anterior').addEventListener('click',()=>{if(pagina>1)buscar(pagina-1);});$('bt-siguiente').addEventListener('click',()=>{if(pagina*12<total)buscar(pagina+1);});
  for(const b of modal.querySelectorAll('[data-bt-q]'))b.addEventListener('click',()=>{$('bt-busqueda').value=b.dataset.btQ;buscar(1);});
  elemento.addEventListener('click',click);document.addEventListener('keydown',tecla);document.addEventListener('pointerlockchange',pointerLock);
  function actualizar(){if(destruido)return;const estaDentro=dentro(jugadorLocal()),abierta=Boolean(puerta.abierta&&Math.abs(puerta.angulo??puerta.pivote.rotation.y)>.015),visible=oclusion?.estadisticas?.habitacionesVisibles?.includes(habitacion)??true;grupo.visible=(estaDentro||abierta)&&(estaDentro||visible);if(estaDentro)for(const o of grupo.children)o.visible=true;activar.hidden=abierto||!disponible()||!document.getElementById('menu')?.hidden;if(abierto)ocultarMenu();}
  return {actualizar,vincularControles(c){controles=c;},vincularOclusion(o){oclusion=o;},abrir,cerrar,
    informe:{habitacion,objetosRetirados:quitar.size,colisionesRetiradas:retiradas,fuente:'iNaturalist + Wikipedia en español',requiereClave:false,lucesNuevas:0},
    liberar(){if(destruido)return;if(abierto)cerrar(false);destruido=true;cargaBusqueda?.abort();cargaDetalle?.abort();api.liberar();elemento.removeEventListener('click',click);document.removeEventListener('keydown',tecla);document.removeEventListener('pointerlockchange',pointerLock);activar.remove();modal.remove();estilo.remove();grupo.removeFromParent();pots.dispose();leaves.dispose();for(const g of recursos.g)g.dispose();for(const m of recursos.m)m.dispose();for(const t of recursos.t)t.dispose();}
  };
}
