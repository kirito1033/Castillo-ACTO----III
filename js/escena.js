import * as THREE from 'three';
import { CONFIG } from './config.js';

export function crearEscena(contenedor) {
  const escena=new THREE.Scene();
  escena.background=new THREE.Color(CONFIG.ambiente.cielo);
  escena.fog=new THREE.Fog(CONFIG.ambiente.cielo,CONFIG.ambiente.nieblaCerca,CONFIG.ambiente.nieblaLejos);
  const camara=new THREE.PerspectiveCamera(CONFIG.camara.fov,window.innerWidth/window.innerHeight,0.15,CONFIG.camara.lejos);
  camara.position.set(CONFIG.jugador.posicionInicial.x,CONFIG.jugador.altura,CONFIG.jugador.posicionInicial.z);
  camara.lookAt(0,CONFIG.jugador.altura,0);
  const renderizador=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio,1));
  renderizador.setSize(window.innerWidth,window.innerHeight);
  renderizador.outputColorSpace=THREE.SRGBColorSpace;
  renderizador.toneMapping=THREE.ACESFilmicToneMapping;
  renderizador.toneMappingExposure=1;
  renderizador.shadowMap.enabled=true;
  renderizador.shadowMap.type=THREE.PCFSoftShadowMap;
  contenedor.appendChild(renderizador.domElement);
  // Esta luz ilumina tambien interiores: mantener moderada para evitar lavarlos.
  const ambiente=new THREE.HemisphereLight(0xe0edff,0x676044,0.65);escena.add(ambiente);
  const sol=new THREE.DirectionalLight(0xffead2,2.2);
  sol.name='Sol principal';sol.position.set(-35,65,15);
  sol.target.position.set(0,10,-20);escena.add(sol,sol.target);
  sol.castShadow=true;sol.shadow.mapSize.set(1024,1024);
  Object.assign(sol.shadow.camera,{left:-65,right:65,top:65,bottom:-65,near:1,far:180});
  sol.shadow.camera.updateProjectionMatrix();
  // Valores iniciales, no una correccion universal para cualquier artefacto.
  sol.shadow.bias=-0.00015;sol.shadow.normalBias=0.035;
  function redimensionar() {
    camara.aspect=window.innerWidth/window.innerHeight;camara.updateProjectionMatrix();
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio,1));
    renderizador.setSize(window.innerWidth,window.innerHeight);
  }
  window.addEventListener('resize',redimensionar);
  return {escena,camara,renderizador};
}
