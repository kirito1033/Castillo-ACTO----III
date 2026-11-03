import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { CONFIG } from './config.js';
import { crearControlesTactiles } from './controlesTactiles.js';

export function crearControles (camara, elemento, mundo) {
  const control = new PointerLockControls (camara, elemento);
  const teclas = new Set();
  control.pointerSpeed = 0.8; 
  control.minPolarAngle = Math.PI * 0.05; 
  control.maxPolarAngle = Math.PI * 0.95;

  const menu = document.getElementById('menu');
  const boton = document.getElementById('boton-iniciar');
  const mira = document.getElementById('mira');
  const estado = document.getElementById('estado');
  const ayuda = document.getElementById('ayuda');

  let modoTactil = window.matchMedia('(pointer: coarse)').matches;
  let activoTactil = false;

  const aviso = document.createElement('div');
  aviso.style.cssText = 'position:fixed;top:54%;left:50%;transform:translateX(-50%);color:white;background:#0009;padding:7px 12px;border-radius:6px;pointer-events:none;z-index:6;font:13px Arial;max-width:85%;text-align:center;display:none';
  document.body.appendChild(aviso);

  const altura = CONFIG.jugador.altura;
  const ajustes = { 
    escalonMaximo: 0.30, 
    suavizadoVertical: 18, // Suavizado gradual para la altura de cámara
    gravedad: 18, 
    velocidadEscaleras: 2.4, 
    transicionVelocidad: 12, 
    sensibilidadTactil: 0.003 
  };

  const diagnostico = { rechazosAltura: 0, ultimoRechazo: null, enEscalera: false, velocidadActual: 0 };

  let pies = camara.position.y - altura;
  let caida = 0;
  let volando = false;
  let mensajeTemporal = '';
  let tiempoMensaje = 0;
  let velocidadActual = 0;

  const frente = new THREE.Vector3();
  const derecha = new THREE.Vector3();
  const direccion = new THREE.Vector3();
  const euler = new THREE.Euler(0, 0, 0, 'YXZ');

  const tactil = crearControlesTactiles(accion => {
    if (!activoTactil) return;
    if (accion === 'puerta') mundo.interactuar(camara);
    if (accion === 'vuelo') alternarVuelo();
    if (accion === 'menu') pausar();
  });

  elemento.style.touchAction = 'none';
  elemento.addEventListener('contextmenu', e => { if (modoTactil) e.preventDefault(); });

  function activo() { return modoTactil ? activoTactil : control.isLocked; }

  function mostrarJuego (valor) {
    if (menu) menu.hidden = valor;
    if (mira) mira.hidden = !valor;
    if (estado && valor) estado.textContent = '';
    tactil.setActivo(modoTactil && valor);
    if (ayuda) ayuda.textContent = modoTactil 
      ? 'Joystick: caminar\nDerecha: mirar\nE: puertas\nF: vuelo' 
      : 'WASD: mover\nShift: correr\nEspacio/Ctrl: subir/bajar\nEsc: menú';
    if (!valor) { teclas.clear(); velocidadActual = 0; aviso.style.display = 'none'; }
  }

  function sueloValido (x, z, referencia) {
    const y = mundo.alturaSuelo(x, z, referencia);
    return Number.isFinite(y) ? y : null;
  }

  function alternarVuelo() {
    if (!volando) {
      volando = true; caida = 0; velocidadActual = 0;
      pies = camara.position.y - altura;
      tactil.setVuelo(true);
      return;
    }
    const actual = camara.position.y - altura;
    if (mundo.bloqueado(camara.position.x, camara.position.z, actual, altura)) {
      mensajeTemporal = 'Sal del muro o del objeto antes de aterrizar';
      tiempoMensaje = 2;
      return;
    }
    volando = false; pies = actual; caida = 0; velocidadActual = 0;
    tactil.setVuelo(false);
  }

  boton?.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') modoTactil = true;
    else if (e.pointerType === 'mouse' && !window.matchMedia('(pointer: coarse)').matches) modoTactil = false;
  });

  boton?.addEventListener('click', () => {
    if (modoTactil) {
      if (control.isLocked) control.unlock();
      activoTactil = true; mostrarJuego(true);
    } else {
      control.lock();
    }
  });

  control.addEventListener('lock', () => mostrarJuego(true));
  control.addEventListener('unlock', () => { if (!modoTactil) mostrarJuego(false); });

  document.addEventListener('pointerlockerror', () => {
    if (!modoTactil && estado) estado.textContent = 'No se pudo capturar el mouse. Abre el juego en el navegador y vuelve a pulsar Entrar.';
  });

  document.addEventListener('keydown', e => {
    if (!activo()) return;
    if (e.code === 'Escape' && modoTactil) { e.preventDefault(); pausar(); return; }
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyE', 'Space', 'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
      e.preventDefault();
      teclas.add(e.code);
    }
    if (e.repeat) return;
    if (e.code === 'KeyF') alternarVuelo();
    if (e.code === 'KeyE') mundo.interactuar(camara);
  });

  document.addEventListener('keyup', e => teclas.delete(e.code));

  function pausar() {
    teclas.clear(); tactil.reiniciar(); activoTactil = false;
    if (control.isLocked) control.unlock();
    mostrarJuego(false);
  }

  window.addEventListener('blur', pausar);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pausar(); });

  // [REPARACIÓN DE CÁMARA]: Transición fluida de los pies durante el desplazamiento
  function mover (dx, dz, dt) {
    if (Math.abs(dx) + Math.abs(dz) < 1e-10) return;
    const x = camara.position.x + dx, z = camara.position.z + dz;
    if (Math.abs(x) > CONFIG.terreno.ancho / 2 - 1 || Math.abs(z) > CONFIG.terreno.largo / 2 - 1) return;
    const suelo = sueloValido(x, z, pies);
    if (suelo === null) return;

    if (suelo - pies > ajustes.escalonMaximo + 0.0001) {
      diagnostico.rechazosAltura++;
      diagnostico.ultimoRechazo = { desde: pies, hasta: suelo, x, z };
      return;
    }

    const nuevo = Math.max(suelo, pies);
    if (!mundo.bloqueado(x, z, nuevo, altura)) {
      camara.position.x = x;
      camara.position.z = z;
      if (suelo > pies) {
        // En lugar de pies = suelo (salto brusco), suavizamos progresivamente
        pies = THREE.MathUtils.damp(pies, suelo, ajustes.suavizadoVertical, dt);
        caida = 0;
      }
    }
  }

  function vertical (dt) {
    const suelo = sueloValido(camara.position.x, camara.position.z, pies);
    if (suelo === null) return;
    const d = suelo - pies;

    if (d > ajustes.escalonMaximo + 0.0001) { caida = 0; return; }

    if (d >= -0.015) {
      pies = THREE.MathUtils.damp(pies, suelo, ajustes.suavizadoVertical, dt);
      caida = 0;
      return;
    }

    caida += ajustes.gravedad * dt;
    pies = Math.max(suelo, pies - caida * dt);
    if (Math.abs(pies - suelo) < 0.001) { pies = suelo; caida = 0; }
  }

  function actualizar (dt) {
    if (!activo()) return;
    dt = Math.max(0, Math.min(dt, 0.05));
    tiempoMensaje = Math.max(0, tiempoMensaje - dt);
    const t = tactil.estado;

    if (modoTactil) {
      euler.setFromQuaternion(camara.quaternion, 'YXZ');
      euler.y -= t.mirarX * ajustes.sensibilidadTactil;
      euler.x = THREE.MathUtils.clamp(euler.x - t.mirarY * ajustes.sensibilidadTactil, -Math.PI * 0.45, Math.PI * 0.45);
      camara.quaternion.setFromEuler(euler);
      t.mirarX = t.mirarY = 0;
    }

    const a = Number(teclas.has('KeyW')) - Number(teclas.has('KeyS')) + (modoTactil ? t.y : 0);
    const l = Number(teclas.has('KeyD')) - Number(teclas.has('KeyA')) + (modoTactil ? t.x : 0);
    const rapido = teclas.has('ShiftLeft') || teclas.has('ShiftRight') || (modoTactil && t.correr);

    camara.getWorldDirection(frente);
    derecha.crossVectors(frente, camara.up).normalize();

    if (volando) {
      const v = Number(teclas.has('Space') || (modoTactil && t.subir)) - Number(teclas.has('ControlLeft') || teclas.has('ControlRight') || (modoTactil && t.bajar));
      direccion.copy(frente).multiplyScalar(a).addScaledVector(derecha, l);
      direccion.y += v;
      const longitud = direccion.length();
      if (longitud > 0) camara.position.addScaledVector(direccion.normalize(), dt * (rapido ? 26 : 12) * Math.min(1, longitud));
      camara.position.x = THREE.MathUtils.clamp(camara.position.x, -CONFIG.terreno.ancho / 2 + 1, CONFIG.terreno.ancho / 2 - 1);
      camara.position.z = THREE.MathUtils.clamp(camara.position.z, -CONFIG.terreno.largo / 2 + 1, CONFIG.terreno.largo / 2 - 1);
      const base = sueloValido(camara.position.x, camara.position.z, 0) ?? 0;
      camara.position.y = THREE.MathUtils.clamp(camara.position.y, base + altura, 120);
      pies = camara.position.y - altura;
      diagnostico.enEscalera = false;
    } else {
      frente.y = 0; 
      frente.normalize();
      const n = Math.hypot(a, l), intensidad = Math.min(1, n);
      const ux = n ? (frente.x * a + derecha.x * l) / n : 0;
      const uz = n ? (frente.z * a + derecha.z * l) / n : 0;

      const enEscalera = Boolean(
        mundo.esZonaEscalera?.(camara.position.x, camara.position.z, pies) ||
        mundo.esZonaEscalera?.(camara.position.x + ux * 0.25, camara.position.z + uz * 0.25, pies)
      );
      diagnostico.enEscalera = enEscalera;

      const objetivo = intensidad * (enEscalera ? ajustes.velocidadEscaleras : CONFIG.jugador.velocidad * (rapido ? CONFIG.jugador.multiplicadorCarrera : 1));
      velocidadActual = THREE.MathUtils.damp(velocidadActual, objetivo, ajustes.transicionVelocidad, dt);
      if (enEscalera) velocidadActual = Math.min(velocidadActual, ajustes.velocidadEscaleras);
      diagnostico.velocidadActual = velocidadActual;

      const dx = ux * velocidadActual * dt, dz = uz * velocidadActual * dt;
      const pasos = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.06));

      for (let i = 0; i < pasos; i++) {
        mover(dx / pasos, 0, dt / pasos);
        mover(0, dz / pasos, dt / pasos);
        vertical(dt / pasos);
      }

      // Sincronización continua de la cámara con los pies
      camara.position.y = THREE.MathUtils.damp(camara.position.y, pies + altura, ajustes.suavizadoVertical, dt);
      camara.position.y = Math.max(camara.position.y, pies + 0.5);
    }

    mundo.actualizar(dt, camara, pies);
    const p = mundo.puertaCercana(camara);
    tactil.setVuelo(volando);
    if (modoTactil) tactil.setPuerta(p);

    const texto = tiempoMensaje > 0 ? mensajeTemporal : p ? `${modoTactil ? 'Puerta' : 'E'} • ${p.abierta ? 'Cerrar' : 'Abrir'} ${p.nombre}` : volando ? `${modoTactil ? 'Vuelo libre' : 'Vuelo libre • Espacio/Ctrl F: aterrizar'}` : '';
    aviso.style.display = texto ? 'block' : 'none';
    if (aviso.textContent !== texto) aviso.textContent = texto;
  }

  return { actualizar, get volando() { return volando; }, get pies() { return pies; }, get modoTactil() { return modoTactil; }, alternarVuelo, ajustes, diagnostico, pausar };
}