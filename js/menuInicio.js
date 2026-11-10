// =============================================================
// MENU DE INICIO: NO SUSTITUYE EL CONTROLADOR NI INICIA OTRA ESCENA.
// =============================================================
const CONFIG_MENU = {
  nombreDestinatario: '', // Escribe aqui el nombre si deseas personalizarlo.
  sobretitulo: 'UN PEQUEÑO MUNDO, SOLO PARA TI',
  titulo: 'Un castillo',
  tituloDestacado: 'para ti.',
  descripcion: 'Entre canciones, imágenes y pequeños desafíos, hay algo que quiero recordarte: mis lugares favoritos son los que puedo compartir contigo.',
  dedicatoria: 'Construí este pequeño lugar para guardar algunas de las cosas que me hacen pensar en ti.\n\nExplora sin prisa. Escucha una canción, descubre una imagen y recuerda que detrás de cada detalle hay alguien que quiso hacerte sonreír.\n\nMis recuerdos favoritos también son los que todavía nos faltan por vivir.'
};

export function inicializarMenuInicio(configuracion = CONFIG_MENU) {
  const menu = document.getElementById('menu');
  const entrar = document.getElementById('boton-iniciar');
  if (!menu?.matches('[data-mi-menu="romantico"]') || !entrar) return;
  if (menu.dataset.miListo === 'true') return;
  menu.dataset.miListo = 'true';

  const $ = id => document.getElementById(id);
  const tarjeta = $('mi-tarjeta'), dedicatoria = $('mi-dedicatoria'), ayuda = $('mi-ayuda');
  const verDedicatoria = $('mi-ver-dedicatoria'), verAyuda = $('mi-ver-ayuda');
  const cerrar = $('mi-cerrar-tarjeta'), calidad = $('mi-calidad'), pantalla = $('mi-pantalla-completa');
  const textoEntrar = $('mi-texto-entrar'), estado = $('estado');
  let primerRecorrido = true, ultimoBoton = null, perfilAnterior = 'medio';

  $('mi-sobretitulo').textContent = configuracion.sobretitulo || CONFIG_MENU.sobretitulo;
  $('mi-titulo-principal').textContent = configuracion.titulo || CONFIG_MENU.titulo;
  $('mi-titulo-destacado').textContent = configuracion.tituloDestacado || CONFIG_MENU.tituloDestacado;
  $('mi-descripcion').textContent = configuracion.descripcion || CONFIG_MENU.descripcion;
  dedicatoria.textContent = configuracion.dedicatoria || CONFIG_MENU.dedicatoria;
  const destinatario = configuracion.nombreDestinatario?.trim();

  function cerrarTarjeta(devolverFoco = true) {
    tarjeta.hidden = true;
    verDedicatoria.setAttribute('aria-expanded','false'); verAyuda.setAttribute('aria-expanded','false');
    if (devolverFoco && !menu.hidden) ultimoBoton?.focus();
  }
  function abrirTarjeta(tipo) {
    const esAyuda = tipo === 'ayuda';
    ultimoBoton = esAyuda ? verAyuda : verDedicatoria;
    tarjeta.hidden = false; ayuda.hidden = !esAyuda; dedicatoria.hidden = esAyuda;
    $('mi-tarjeta-etiqueta').textContent = esAyuda ? 'TU RECORRIDO' : destinatario ? 'PARA '+destinatario.toUpperCase() : 'PARA ALGUIEN MUY ESPECIAL';
    $('mi-tarjeta-titulo').textContent = esAyuda ? 'Explora a tu ritmo' : destinatario ? 'Este lugar es para ti, '+destinatario : 'Este lugar es para ti';
    verAyuda.setAttribute('aria-expanded',String(esAyuda));verDedicatoria.setAttribute('aria-expanded',String(!esAyuda));cerrar.focus();
  }
  verDedicatoria.addEventListener('click',()=>abrirTarjeta('dedicatoria'));
  verAyuda.addEventListener('click',()=>abrirTarjeta('ayuda'));
  cerrar.addEventListener('click',()=>cerrarTarjeta());
  document.addEventListener('keydown',e=>{
    if (!menu.hidden && !tarjeta.hidden && e.code==='Escape') {e.preventDefault();e.stopPropagation();cerrarTarjeta();}
  },true);

  // El controlador existente maneja este mismo boton. NO llamar lock() aqui.
  entrar.addEventListener('click',()=>cerrarTarjeta(false));
  const observar = new MutationObserver(()=>{
    if (menu.hidden) {primerRecorrido=false;cerrarTarjeta(false);}
    else textoEntrar.textContent = primerRecorrido ? 'Comenzar nuestro recorrido' : 'Continuar el recorrido';
  });
  observar.observe(menu,{attributes:true,attributeFilter:['hidden']});

  calidad.addEventListener('change',()=>{
    const gestor = window.rendimientoCastillo;
    if (!gestor?.perfil) {calidad.value=perfilAnterior;estado.textContent='Las opciones de calidad estarán disponibles cuando termine de preparar el castillo.';return;}
    try {gestor.perfil(calidad.value);perfilAnterior=calidad.value;estado.textContent='Calidad aplicada. Puedes cambiarla cuando quieras desde este menú.';}
    catch {calidad.value=perfilAnterior;estado.textContent='No se pudo cambiar la calidad.';}
  });
  function textoPantalla() {pantalla.innerHTML=document.fullscreenElement?'Salir de pantalla completa <span aria-hidden="true">↙</span>':'Pantalla completa <span aria-hidden="true">↗</span>';}
  if (!document.documentElement.requestFullscreen || document.fullscreenEnabled===false) {
    pantalla.disabled=true;pantalla.title='El navegador no ofrece pantalla completa para esta página.';
  }
  pantalla.addEventListener('click',async()=>{
    try {if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
    catch {estado.textContent='Este navegador no permitió activar la pantalla completa.';}
  });
  document.addEventListener('fullscreenchange',textoPantalla);
  const tactil = window.matchMedia('(pointer: coarse)').matches;
  $('mi-pista-dispositivo').textContent=tactil?'JOYSTICK PARA CAMINAR · DESLIZA PARA MIRAR':'WASD PARA CAMINAR · MOUSE PARA MIRAR · ESC PARA PAUSAR';
  return {cerrarTarjeta,abrirTarjeta};
}

inicializarMenuInicio();
