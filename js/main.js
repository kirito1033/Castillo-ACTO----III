import { crearBoticarioArmeria } from './boticarioArmeria.js';
// BOTICARIO_ARMERIA_INTEGRADO

import { crearEscena } from './escena.js';
import { crearPiso } from './piso.js';
import { crearControles } from './controles.js';
import { crearCastillo } from './castillo.js';

import {
  crearRenderizadoDinamico
} from './renderizadoDinamico.js';

import {
  crearOclusionHabitaciones
} from './oclusionHabitaciones.js';

import {
  corregirPisosEIluminacion
} from './correccionesCastillo.js';

import { crearEntornoMontana } from './entornoMontana.js';
import { crearCicloDiaNoche } from './cicloDiaNoche.js';
import { crearAmbienteAvanzado } from './ambienteAvanzado.js';
import { ampliarParteSuperior } from './ampliacionSuperior.js';
import { agruparEstructura } from './agruparEstructura.js';

import {
  crearMonitorRendimiento
} from './monitorRendimiento.js';

import { crearAccesosTresPisos } from './accesosTresPisos.js';
import { corregirTechoYTerraza } from './techoYTerraza.js';

import {
  reconstruirLosaCompleta
} from './reconstruirLosaCompleta.js';

import {
  abrirPasoExteriorTercerPiso
} from './pasoExteriorTercerPiso.js';

import {
  despejarEscaleraYSalida
} from './despejarEscaleraYSalida.js';

import {
  quitarBarandasTercerPiso
} from './quitarBarandasTercerPiso.js';

import { configurarInicioLejano } from './inicioLejano.js';

import {
  crearSalaBibliotecaVideo
} from './salaBibliotecaVideo.js';

import {
  crearComedorRompecabezas
} from './comedorRompecabezas.js';

// =============================================================
// 01. RUTAS DE LOS RECURSOS
//
// Estructura esperada:
// index.html
// assets/
//   videos/
//   imagen/rompecabezas/
//
// Se calculan desde el HTML, no desde la carpeta js.
// =============================================================

const carpetaAssets = new URL(
  './assets/',
  document.baseURI
);

const carpetaVideos = new URL(
  'videos/',
  carpetaAssets
);

const carpetaRompecabezas = new URL(
  'imagen/rompecabezas/',
  carpetaAssets
);

function videoURL(nombreArchivo) {
  return new URL(
    nombreArchivo,
    carpetaVideos
  ).href;
}

// =============================================================
// 02. ESCENA Y TERRENO
// =============================================================

const {
  escena,
  camara,
  renderizador
} = crearEscena(
  document.getElementById('contenedor')
);

crearPiso(escena);

const castillo = crearCastillo(escena);

// =============================================================
// 03. CONSTRUCCIÓN Y CORRECCIONES DEL CASTILLO
// =============================================================

ampliarParteSuperior(castillo);

const correcciones = corregirPisosEIluminacion(
  escena,
  camara,
  castillo
);

const entorno = crearEntornoMontana(
  escena,
  camara,
  castillo
);

crearAccesosTresPisos(castillo);

corregirTechoYTerraza(castillo);

window.reparacionLosa = reconstruirLosaCompleta(
  castillo
);

window.pasoExteriorTercerPiso =
  abrirPasoExteriorTercerPiso(castillo);

window.despejeCastillo =
  despejarEscaleraYSalida(castillo);

window.barandasTercerPiso =
  quitarBarandasTercerPiso(castillo);

// =============================================================
// 04. BIBLIOTECA: VÍDEOS, COLORES Y FOCOS
// =============================================================

const sala = crearSalaBibliotecaVideo(
  escena,
  camara,
  castillo,
  {
    separacionFocos: 0.7,
    halosFocos: true,

    // Color general si una canción no especifica otro.
    colorFocos: 0xffd39a,

    videos: [
      {
        titulo: 'Alex Ubago — Sin miedo a nada',
        src: videoURL(
          'alex-ubago-sin-miedo-a-nada.mp4'
        ),
        colorFocos: 0xffd39a
      },
      {
        titulo: 'Andrés Cepeda — Un Ratito',
        src: videoURL(
          'Andrés-Cepeda-Un-Ratito.mp4'
        ),
        colorFocos: 0x75cfff
      },
      {
        titulo: 'Chayanne — Dejaría Todo',
        src: videoURL(
          'Chayanne-Dejaría-Todo.mp4'
        ),
        colorFocos: 0xffffff
      },
      {
        titulo: 'Esperón — Luma',
        src: videoURL(
          'Esperón-Luma.mp4'
        ),
        colorFocos: 0xff8c69
      },
      {
        titulo: 'Zoé — Labios Rotos',
        src: videoURL(
          'Zoé-Labios-Rotos.mp4'
        ),
        colorFocos: 0xc08cff
      }
    ]
  }
);

window.bibliotecaVideo = sala;

// =============================================================
// 05. COMEDOR: ROMPECABEZAS PERSONALIZADOS
// =============================================================

const comedor = crearComedorRompecabezas(
  escena,
  camara,
  castillo,
  renderizador.domElement,
  {
    carpetaImagenes: carpetaRompecabezas.href
  }
);

window.comedorRompecabezas = comedor;

// =============================================================
// 06. ARMERÍA: BOTICARIO
// =============================================================

const boticario = crearBoticarioArmeria(
  escena,
  camara,
  castillo,
  renderizador.domElement
);

window.boticarioArmeria = boticario;

// =============================================================
// 07. POSICIÓN INICIAL Y CICLO DE DÍA/NOCHE
// =============================================================

window.inicioJugador = configurarInicioLejano(
  camara,
  castillo
);

const ciclo = crearCicloDiaNoche(escena);

// =============================================================
// 08. CONTROLES Y VINCULACIÓN DE HABITACIONES
// =============================================================

const controles = crearControles(
  camara,
  renderizador.domElement,
  castillo.userData
);

sala.vincularControles(controles);
comedor.vincularControles(controles);
boticario.vincularControles(controles);

// =============================================================
// 09. RENDERIZADO DINÁMICO Y AMBIENTE
// =============================================================

const dinamico = crearRenderizadoDinamico(
  escena,
  camara,
  renderizador,
  castillo
);

const ambiente = crearAmbienteAvanzado(
  escena,
  camara,
  castillo,
  entorno,
  ciclo
);

// =============================================================
// 10. OCLUSIÓN DE HABITACIONES
// =============================================================

const oclusion = crearOclusionHabitaciones(
  escena,
  camara,
  castillo
);

sala.vincularOclusion(oclusion);
comedor.vincularOclusion(oclusion);
boticario.vincularOclusion(oclusion);

// =============================================================
// 11. COLISIONES Y OPTIMIZACIÓN
//
// Ejecutar después de construir y modificar las habitaciones.
// =============================================================

castillo.userData.prepararColisiones();

window.informeAgrupacion = agruparEstructura(
  castillo
);

const rendimiento = crearMonitorRendimiento(
  escena,
  camara,
  renderizador,
  entorno
);

// =============================================================
// 12. REFERENCIAS PARA LA CONSOLA
// =============================================================

Object.assign(window, {
  rendimientoCastillo: rendimiento,
  metricasCastillo: dinamico.metricas,
  oclusionCastillo: oclusion,
  correccionesCastillo: correcciones,
  entornoCastillo: entorno,
  cicloCastillo: ciclo,
  controlesCastillo: controles
});

// =============================================================
// 13. BUCLE PRINCIPAL
// =============================================================

let anterior = null;
let relojOclusion = 0;
let relojEntorno = 0;

const ultimaPos = camara.position.clone();
const ultimaRot = camara.quaternion.clone();

renderizador.setAnimationLoop(t => {
  const crudo = anterior === null
    ? 1 / 60
    : (t - anterior) / 1000;

  const dt = Math.min(crudo, 0.05);

  anterior = t;

  const inicio = performance.now();

  // Movimiento y presentación general.
  controles.actualizar(dt);
  correcciones.actualizar(dt);
  ciclo.actualizar(dt);

  // Restaurar la intensidad base antes del ajuste ambiental.
  ambiente.prepararLuces();
  dinamico.actualizar(dt);
  ambiente.actualizar(dt);

  relojOclusion += dt;
  relojEntorno += dt;

  // Actualizar antes si la cámara cambia suficientemente.
  const cambioPosicion =
    camara.position.distanceToSquared(ultimaPos) > 0.04;

  const cambioRotacion =
    camara.quaternion.angleTo(ultimaRot) > 0.04;

  if (
    relojOclusion >= 1 / 30 ||
    cambioPosicion ||
    cambioRotacion
  ) {
    oclusion.actualizar(relojOclusion);

    relojOclusion = 0;

    ultimaPos.copy(camara.position);
    ultimaRot.copy(camara.quaternion);
  }

  // Descarte por distancia del entorno.
  if (relojEntorno >= 0.12) {
    entorno.actualizar();
    relojEntorno = 0;
  }

  // Habitaciones interactivas.
  sala.actualizar(dt);
  comedor.actualizar(dt);
  boticario.actualizar(dt);

  // Renderizado y métricas.
  rendimiento.antes(dt);

  renderizador.render(
    escena,
    camara
  );

  dinamico.registrarMetricas();

  rendimiento.despues(
    crudo,
    performance.now() - inicio
  );
});