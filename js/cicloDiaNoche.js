import * as THREE from 'three';

export function crearCicloDiaNoche(escena) {
  const sol=escena.getObjectByName('Sol principal');
  if(!sol)throw new Error('Se requiere escena.js del paquete de renderizado dinamico.');
  const ambiente=escena.children.find(o=>o.isHemisphereLight);
  const luna=new THREE.DirectionalLight(0x9fb7ff,0);luna.name='Luz de luna';luna.castShadow=false;
  luna.target.position.set(0,16,-18);escena.add(luna,luna.target);
  const ajustes={duracionSegundos:360,hora:10,pausado:false};
  const noche=new THREE.Color(0x101c35),dia=new THREE.Color(0xb9d8eb),ocaso=new THREE.Color(0xc88e79);
  const blanco=new THREE.Color(0xffedcf),calido=new THREE.Color(0xffaa6b),cielo=new THREE.Color();
  function actualizar(dt) {
    if(!ajustes.pausado)ajustes.hora=(ajustes.hora+dt*24/Math.max(30,ajustes.duracionSegundos))%24;
    const a=(ajustes.hora-6)/24*Math.PI*2,h=Math.sin(a);
    const claridad=THREE.MathUtils.smoothstep(h,-0.12,0.25);
    sol.position.set(Math.cos(a)*80,16+h*100,-18+Math.cos(a)*35);
    sol.target.position.set(0,16,-18);
    sol.intensity=2.2*THREE.MathUtils.smoothstep(h,0,0.3);
    sol.color.copy(calido).lerp(blanco,THREE.MathUtils.smoothstep(h,0.05,0.55));
    // La luna no usa otro mapa de sombras.
    luna.position.set(-Math.cos(a)*80,16-h*100,-18-Math.cos(a)*35);
    luna.intensity=0.22*(1-claridad);
    if(ambiente)ambiente.intensity=THREE.MathUtils.lerp(0.22,0.65,claridad);
    cielo.copy(noche).lerp(dia,claridad);
    const atardecer=(1-THREE.MathUtils.smoothstep(Math.abs(h),0,0.25))*0.35;
    cielo.lerp(ocaso,atardecer);
    escena.background.copy(cielo);if(escena.fog)escena.fog.color.copy(cielo);
  }
  actualizar(0);
  return {actualizar,ajustes};
}
