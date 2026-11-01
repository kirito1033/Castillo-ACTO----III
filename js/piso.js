import * as THREE from 'three';
import { CONFIG } from './config.js';

export function crearPiso(escena) {
  const grupo = new THREE.Group();
  grupo.name = 'terreno';

  const geometriaTerreno = new THREE.PlaneGeometry(
    CONFIG.terreno.ancho,
    CONFIG.terreno.largo
  );

  const materialTerreno = new THREE.MeshStandardMaterial({
    color: CONFIG.terreno.color,
    roughness: 1,
    metalness: 0
  });

  const terreno = new THREE.Mesh(
    geometriaTerreno,
    materialTerreno
  );

  terreno.name = 'suelo';
  terreno.rotation.x = -Math.PI / 2;

  grupo.add(terreno);

  const geometriaCamino = new THREE.PlaneGeometry(
    CONFIG.camino.ancho,
    CONFIG.camino.largo
  );

  const materialCamino = new THREE.MeshStandardMaterial({
    color: CONFIG.camino.color,
    roughness: 1,
    metalness: 0
  });

  const camino = new THREE.Mesh(
    geometriaCamino,
    materialCamino
  );

  camino.name = 'camino';
  camino.rotation.x = -Math.PI / 2;

  // Lo separamos ligeramente del suelo para evitar parpadeos.
  camino.position.set(
    0,
    0.015,
    CONFIG.camino.centroZ
  );

  grupo.add(camino);
  escena.add(grupo);

  return grupo;
}