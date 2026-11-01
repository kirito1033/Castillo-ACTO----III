export function crearMonitorRendimiento(escena,camara,renderizador,entorno) {
  const sol=escena.getObjectByName('Sol principal');
  const ajustes={perfil:'medio',mostrarPanel:true};
  const metricas={fps:0,msCuadro:0,msCPU:0,llamadasDibujo:0,triangulos:0,texturas:0,geometrias:0};
  const panel=document.createElement('div');panel.style.cssText='position:fixed;top:12px;left:12px;color:#d9ffb0;background:#07110bc9;border-radius:5px;padding:7px 9px;font:12px monospace;pointer-events:none;z-index:9';document.body.appendChild(panel);
  let cuadros=0,tiempo=0,cpu=0,relojSombras=1;
  renderizador.shadowMap.autoUpdate=false;
  function perfil(nombre='medio') {
    const p={bajo:{ratio:0.75,sombras:false,mapa:1024,bosque:65},medio:{ratio:1,sombras:true,mapa:1024,bosque:85},alto:{ratio:1.25,sombras:true,mapa:2048,bosque:105}}[nombre];
    if(!p)throw new Error('Perfil valido: bajo, medio o alto');
    ajustes.perfil=nombre;
    const limite=Math.sqrt(2000000/(window.innerWidth*window.innerHeight));
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio,p.ratio,limite));renderizador.setSize(window.innerWidth,window.innerHeight);
    renderizador.shadowMap.enabled=p.sombras;entorno.ajustes.distanciaVegetacion=p.bosque;
    if(sol){sol.shadow.mapSize.set(p.mapa,p.mapa);if(sol.shadow.map){sol.shadow.map.dispose();sol.shadow.map=null;}sol.shadow.needsUpdate=true;}
    renderizador.shadowMap.needsUpdate=true;
  }
  perfil();
  function antes(dt) {
    relojSombras+=dt;
    renderizador.shadowMap.needsUpdate=relojSombras>=0.1;
    if(relojSombras>=0.1){relojSombras=0;if(sol)sol.shadow.needsUpdate=true;}
  }
  function despues(segundos,cpuMs) {
    if(document.hidden)return;
    tiempo+=segundos;cuadros++;cpu+=cpuMs;
    if(tiempo<0.8)return;
    metricas.fps=Math.round(cuadros/tiempo);metricas.msCuadro=+(tiempo*1000/cuadros).toFixed(1);metricas.msCPU=+(cpu/cuadros).toFixed(1);
    metricas.llamadasDibujo=renderizador.info.render.calls;metricas.triangulos=renderizador.info.render.triangles;
    metricas.texturas=renderizador.info.memory.textures;metricas.geometrias=renderizador.info.memory.geometries;
    panel.hidden=!ajustes.mostrarPanel;
    panel.textContent=`${metricas.fps} FPS | ${metricas.msCuadro} ms | CPU ${metricas.msCPU} ms | draw ${metricas.llamadasDibujo} | ${ajustes.perfil}`;
    tiempo=0;cuadros=0;cpu=0;
  }
  window.addEventListener('resize',()=>perfil(ajustes.perfil));
  return {antes,despues,perfil,metricas,ajustes};
}
