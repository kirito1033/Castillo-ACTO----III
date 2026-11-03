import { crearEscena } from './escena.js';
import { crearPiso } from './piso.js';
import { crearControles } from './controles.js';
import { crearCastillo } from './castillo.js';
import { crearRenderizadoDinamico } from './renderizadoDinamico.js';
import { crearOclusionHabitaciones } from './oclusionHabitaciones.js';
import { corregirPisosEIluminacion } from './correccionesCastillo.js';
import { crearEntornoMontana } from './entornoMontana.js';
import { crearCicloDiaNoche } from './cicloDiaNoche.js';
import { crearAmbienteAvanzado } from './ambienteAvanzado.js';
import { ampliarParteSuperior } from './ampliacionSuperior.js';
import { agruparEstructura } from './agruparEstructura.js';
import { crearMonitorRendimiento } from './monitorRendimiento.js';
import { crearAccesosTresPisos } from './accesosTresPisos.js';
import { corregirTechoYTerraza } from './techoYTerraza.js';
import { reconstruirLosaCompleta } from './reconstruirLosaCompleta.js';
import { abrirPasoExteriorTercerPiso } from './pasoExteriorTercerPiso.js';
import { despejarEscaleraYSalida } from './despejarEscaleraYSalida.js';
import { quitarBarandasTercerPiso } from './quitarBarandasTercerPiso.js';
import { configurarInicioLejano } from './inicioLejano.js';
import { crearSalaBibliotecaVideo } from './salaBibliotecaVideo.js';
import {
  crearComedorRompecabezas
} from './comedorRompecabezas.js';

const {escena,camara,renderizador}=crearEscena(document.getElementById('contenedor'));
crearPiso(escena);
const castillo=crearCastillo(escena);
ampliarParteSuperior(castillo);
const correcciones=corregirPisosEIluminacion(escena,camara,castillo);
const entorno=crearEntornoMontana(escena,camara,castillo);
crearAccesosTresPisos(castillo);
corregirTechoYTerraza(castillo);
window.reparacionLosa=reconstruirLosaCompleta(castillo);
window.pasoExteriorTercerPiso=abrirPasoExteriorTercerPiso(castillo);
window.despejeCastillo=despejarEscaleraYSalida(castillo);
window.barandasTercerPiso=quitarBarandasTercerPiso(castillo);
// Puedes agregar fuentes propias aqui, o cargar archivos desde el panel.
const sala = crearSalaBibliotecaVideo(
  escena,
  camara,
  castillo,
  {
    // Configuración general de los focos.
    separacionFocos: 0.7,
    halosFocos: true,

    // Color de respaldo si una canción no especifica uno.
    colorFocos: 0xffd39a,

    videos: [
      {
        titulo: 'Alex Ubago — Sin miedo a nada',
        src: '../../assets/videos/alex-ubago-sin-miedo-a-nada.mp4',
        colorFocos: 0xffd39a // Dorado cálido
      },
      {
        titulo: 'Andrés Cepeda — Un Ratito',
        src: '../../assets/videos/Andrés-Cepeda-Un-Ratito.mp4',
        colorFocos: 0x75cfff // Azul claro
      },
      {
        titulo: 'Chayanne — Dejaría Todo',
        src: '../../assets/videos/Chayanne-Dejaría-Todo.mp4',
        colorFocos: 0xffffff // Blanco
      },
      {
        titulo: 'Esperón — Luma',
        src: '../../assets/videos/Esperón-Luma.mp4',
        colorFocos: 0xff8c69 // Coral
      },
      {
        titulo: 'Zoé — Labios Rotos',
        src: '../../assets/videos/Zoé-Labios-Rotos.mp4',
        colorFocos: 0xc08cff // Violeta
      }
    ]
  }
);
window.bibliotecaVideo=sala;
const comedor = crearComedorRompecabezas(
  escena,
  camara,
  castillo,
  renderizador.domElement,
  {
    carpetaImagenes: '../../assets/imagen/rompecabezas/'
  }
);

window.comedorRompecabezas = comedor;
window.inicioJugador=configurarInicioLejano(camara,castillo);
const ciclo=crearCicloDiaNoche(escena);
const controles=crearControles(camara,renderizador.domElement,castillo.userData);
sala.vincularControles(controles);
comedor.vincularControles(controles);
const dinamico=crearRenderizadoDinamico(escena,camara,renderizador,castillo);
const ambiente=crearAmbienteAvanzado(escena,camara,castillo,entorno,ciclo);
const oclusion=crearOclusionHabitaciones(escena,camara,castillo);
sala.vincularOclusion(oclusion);
comedor.vincularOclusion(oclusion);
castillo.userData.prepararColisiones();
window.informeAgrupacion=agruparEstructura(castillo);
const rendimiento=crearMonitorRendimiento(escena,camara,renderizador,entorno);
Object.assign(window,{rendimientoCastillo:rendimiento,metricasCastillo:dinamico.metricas,
  oclusionCastillo:oclusion,correccionesCastillo:correcciones,entornoCastillo:entorno,
  cicloCastillo:ciclo,controlesCastillo:controles});
let anterior=null,relojOclusion=0,relojEntorno=0;
const ultimaPos=camara.position.clone(),ultimaRot=camara.quaternion.clone();
renderizador.setAnimationLoop(t=>{
  const crudo=anterior===null?1/60:(t-anterior)/1000,dt=Math.min(crudo,0.05);anterior=t;
  const inicio=performance.now();
  controles.actualizar(dt);correcciones.actualizar(dt);ciclo.actualizar(dt);
  ambiente.prepararLuces();dinamico.actualizar(dt);ambiente.actualizar(dt);
  relojOclusion+=dt;relojEntorno+=dt;
  if(relojOclusion>=1/30||camara.position.distanceToSquared(ultimaPos)>0.04||camara.quaternion.angleTo(ultimaRot)>0.04){
    oclusion.actualizar(relojOclusion);relojOclusion=0;ultimaPos.copy(camara.position);ultimaRot.copy(camara.quaternion);
  }
  if(relojEntorno>=0.12){entorno.actualizar();relojEntorno=0;}
  sala.actualizar(dt);
  comedor.actualizar(dt);
  rendimiento.antes(dt);renderizador.render(escena,camara);dinamico.registrarMetricas();
  rendimiento.despues(crudo,performance.now()-inicio);
});
