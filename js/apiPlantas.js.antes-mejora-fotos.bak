// API publica: solo lecturas. No necesita claves en el frontend.
export function crearApiPlantas(opciones = {}) {
  const base = new URL(opciones.baseApi || 'https://api.inaturalist.org/v1/');
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  const wikiBase = opciones.wikipediaApi || 'https://es.wikipedia.org/w/api.php';
  const peticion = opciones.fetch || globalThis.fetch.bind(globalThis);
  const intervalo = opciones.intervaloMs ?? 1200;
  const timeoutMs = opciones.timeoutMs ?? 15000;
  const cache = new Map();
  let cola = Promise.resolve(), ultima = 0, esperarHasta = 0, destruido = false;
  const cierre = new AbortController();
  const errorAbort = () => new DOMException('Consulta cancelada', 'AbortError');

  function esPlanta(t) {
    return t && (t.id === 47126 || t.iconic_taxon_name === 'Plantae' ||
      t.ancestor_ids?.includes(47126) || t.ancestors?.some(a => a.id === 47126));
  }
  function urlSegura(valor) {
    if (typeof valor !== 'string' || !valor.trim()) return null;
    try { const u = new URL(valor); return ['http:','https:'].includes(u.protocol) ? u.href : null; }
    catch { return null; }
  }
  function fotoPermitida(t) {
    const fotos = [t.default_photo, ...(t.taxon_photos || []).map(p => p.photo || p)];
    const permitidas = new Set(opciones.licenciasFotos || ['cc0','cc-by','cc-by-sa']);
    for (const f of fotos) {
      const licencia = f?.license_code?.toLowerCase();
      const src = urlSegura(f?.medium_url || f?.url || f?.square_url);
      if (f && src && permitidas.has(licencia)) return {src, licencia, atribucion:f.attribution || 'Autor no indicado', id:f.id};
    }
    return null;
  }
  function normalizar(t) {
    return {id:t.id, nombre:t.preferred_common_name || t.name || 'Nombre no disponible',
      cientifico:t.name || 'No disponible', rango:t.rank || 'No disponible',
      registros:Number.isFinite(t.observations_count) ? t.observations_count : null,
      foto:fotoPermitida(t), ancestros:Array.isArray(t.ancestors)?t.ancestors:[],
      estados:Array.isArray(t.conservation_statuses)?t.conservation_statuses:[],
      fuente:'https://www.inaturalist.org/taxa/'+encodeURIComponent(t.id),
      wikipedia:urlSegura(t.wikipedia_url)};
  }
  function dormir(ms, signal) {
    return new Promise((resolve,reject) => {
      if (signal?.aborted || cierre.signal.aborted) {reject(errorAbort());return;}
      const cancelar=()=>{clearTimeout(timer);limpiar();reject(errorAbort());};
      const limpiar=()=>{signal?.removeEventListener('abort',cancelar);cierre.signal.removeEventListener('abort',cancelar);};
      const timer=setTimeout(()=>{limpiar();resolve();},Math.max(0,ms));
      signal?.addEventListener('abort',cancelar,{once:true});cierre.signal.addEventListener('abort',cancelar,{once:true});
    });
  }
  function json(url,signal) {
    if (signal?.aborted || destruido) return Promise.reject(errorAbort());
    const guardado=cache.get(url);
    if(guardado && Date.now()-guardado.tiempo<300000) return Promise.resolve(guardado.valor);
    const tarea=cola.catch(()=>{}).then(async()=>{
      if(destruido||signal?.aborted)throw errorAbort();
      const pausa=Math.max(0,intervalo-(Date.now()-ultima),esperarHasta-Date.now());
      if(pausa)await dormir(pausa,signal);
      if(destruido||signal?.aborted)throw errorAbort();
      ultima=Date.now();const abortar=new AbortController();let timeout=false;
      const cancelar=()=>abortar.abort();
      signal?.addEventListener('abort',cancelar,{once:true});cierre.signal.addEventListener('abort',cancelar,{once:true});
      const timer=setTimeout(()=>{timeout=true;abortar.abort();},timeoutMs);
      try {
        const r=await peticion(url,{signal:abortar.signal,credentials:'omit',headers:{Accept:'application/json'}});
        if(r.status===429){const s=Number(r.headers.get('Retry-After'));const espera=Number.isFinite(s)&&s>0?s:30;esperarHasta=Date.now()+espera*1000;throw new Error('La fuente limitó las consultas. Espera '+Math.ceil(espera)+' segundos.');}
        if(!r.ok)throw new Error('La fuente respondió HTTP '+r.status+'.');
        const datos=await r.json();if(datos.error)throw new Error(datos.error.info || 'Error comunicado por la fuente.');
        cache.set(url,{tiempo:Date.now(),valor:datos});while(cache.size>50)cache.delete(cache.keys().next().value);return datos;
      }catch(error){if(timeout)throw new Error('La consulta tardó demasiado. Inténtalo de nuevo.');throw error;}
      finally{clearTimeout(timer);signal?.removeEventListener('abort',cancelar);cierre.signal.removeEventListener('abort',cancelar);}
    });
    cola=tarea.catch(()=>{});return tarea;
  }
  async function buscar(texto='',pagina=1,signal) {
    const u=new URL('taxa',base);u.search=new URLSearchParams({taxon_id:'47126',rank:'species',is_active:'true',locale:'es',per_page:'12',page:String(Math.max(1,pagina)),...(texto.trim()?{q:texto.trim().slice(0,80)}:{})});
    const data=await json(u.href,signal);
    const plantas=(data.results || []).filter(esPlanta).map(normalizar);
    return {plantas,total:Number(data.total_results)||0,pagina,porPagina:12};
  }
  async function detalle(id,signal) {
    if(!/^\d+$/.test(String(id)))throw new Error('Identificador de planta inválido.');
    const u=new URL('taxa/'+id,base);u.searchParams.set('locale','es');
    const data=await json(u.href,signal);const t=data.results?.[0];
    if(!t)throw new Error('No se encontró la planta.');
    if(!esPlanta(t))throw new Error('La fuente no confirmó que este registro pertenece al reino Plantae.');
    return normalizar(t);
  }
  async function descripcion(cientifico,signal) {
    if(!cientifico || cientifico==='No disponible')return null;
    const u=new URL(wikiBase);u.search=new URLSearchParams({action:'query',format:'json',origin:'*',prop:'extracts|pageprops|info',inprop:'url',exintro:'1',explaintext:'1',exchars:'1100',redirects:'1',titles:cientifico});
    const data=await json(u.href,signal);
    const pagina=Object.values(data.query?.pages || {}).find(p=>p.pageid>0 && !p.pageprops?.hasOwnProperty('disambiguation') && p.extract?.trim());
    if(!pagina)return null;
    return {texto:pagina.extract, titulo:pagina.title,
      fuente:urlSegura(pagina.fullurl) || 'https://es.wikipedia.org/wiki/'+encodeURIComponent(pagina.title.replaceAll(' ','_'))};
  }
  return {buscar,detalle,descripcion,esPlanta,normalizar,urlSegura,
    liberar(){destruido=true;cierre.abort();cache.clear();}};
}
