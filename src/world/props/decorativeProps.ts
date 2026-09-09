import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { addMesh, material, type Vec3 } from './PropBuilder';

export function createDecorativeProps(): THREE.Group {
  const root = new THREE.Group();
  root.add(createLowTable(), createRadio(), createBroom(), createChewBasket(), createPaperLantern());
  return root;
}

function createLowTable(): THREE.Group {
  const table = new THREE.Group();
  const topMaterial = material('#a8754d', { roughness: 0.76 });
  const darkWood = material('#63412c', { roughness: 0.84 });
  addMesh(table, new RoundedBoxGeometry(1.74, 0.13, 1.02, 5, 0.055), topMaterial, [-2.2, 0.66, 0.7]);
  addMesh(table, new RoundedBoxGeometry(1.5, 0.08, 0.08, 3, 0.025), darkWood, [-2.2, 0.55, 0.27]);
  addMesh(table, new RoundedBoxGeometry(1.5, 0.08, 0.08, 3, 0.025), darkWood, [-2.2, 0.55, 1.13]);

  const legs: readonly Vec3[] = [
    [-2.84, 0.43, 0.33],
    [-1.56, 0.43, 0.33],
    [-2.84, 0.43, 1.07],
    [-1.56, 0.43, 1.07],
  ];
  for (const position of legs) {
    addMesh(table, new RoundedBoxGeometry(0.11, 0.45, 0.11, 3, 0.025), darkWood, position);
  }
  return table;
}

function createRadio(): THREE.Group {
  const radio = new THREE.Group();
  addMesh(radio, new RoundedBoxGeometry(0.8, 0.5, 0.36, 5, 0.065), material('#72858a'), [-0.5, 0.48, -2.1]);
  addMesh(
    radio,
    new THREE.CylinderGeometry(0.145, 0.145, 0.025, 24),
    material('#324044'),
    [-0.7, 0.49, -1.91],
    undefined,
    [Math.PI / 2, 0, 0],
  );
  for (let index = 0; index < 4; index += 1) {
    addMesh(radio, new THREE.BoxGeometry(0.025, 0.26, 0.025), material('#56686c'), [-0.7 + index * 0.07, 0.49, -1.895]);
  }
  addMesh(radio, new RoundedBoxGeometry(0.22, 0.055, 0.035, 3, 0.015), material('#e6c86b'), [-0.27, 0.59, -1.9]);
  addMesh(radio, new THREE.CylinderGeometry(0.04, 0.04, 0.055, 14), material('#374448'), [-0.27, 0.43, -1.9], undefined, [Math.PI / 2, 0, 0]);
  addMesh(radio, new THREE.CylinderGeometry(0.012, 0.012, 0.62, 8), material('#5f6462'), [-0.23, 0.87, -2.08], undefined, [0, 0, -0.18]);
  return radio;
}

function createBroom(): THREE.Group {
  const broom = new THREE.Group();
  addMesh(broom, new THREE.CylinderGeometry(0.032, 0.038, 1.38, 8), material('#845b3d'), [2.7, 0.83, -2.35], undefined, [0, 0, 0.22]);
  const bristles = addMesh(broom, new THREE.ConeGeometry(0.27, 0.58, 12), material('#c5a56d'), [2.84, 0.2, -2.35], undefined, [0, 0, 0.04]);
  bristles.scale.z = 0.7;
  addMesh(broom, new THREE.TorusGeometry(0.11, 0.02, 7, 14), material('#755039'), [2.81, 0.46, -2.35], undefined, [Math.PI / 2, 0, 0]);
  return broom;
}

function createChewBasket(): THREE.Group {
  const basket = new THREE.Group();
  const wicker = material('#ad8052', { roughness: 0.96 });
  addMesh(
    basket,
    new THREE.CylinderGeometry(0.46, 0.39, 0.38, 18, 1, true),
    wicker,
    [-3.7, 0.22, 1.75],
  );
  for (const y of [0.08, 0.2, 0.34]) {
    addMesh(basket, new THREE.TorusGeometry(0.42 - y * 0.07, 0.018, 6, 18), material('#8b623f'), [-3.7, y, 1.75], undefined, [Math.PI / 2, 0, 0]);
  }
  for (let index = 0; index < 4; index += 1) {
    addMesh(
      basket,
      new THREE.CapsuleGeometry(0.055, 0.4, 3, 7),
      material('#e6cd99'),
      [-3.86 + index * 0.12, 0.45, 1.75],
      undefined,
      [0, 0, 0.7 - index * 0.25],
    );
  }
  return basket;
}

function createPaperLantern(): THREE.Group {
  const lantern = new THREE.Group();
  const frame = material('#5d3b27');
  const paper = material('#f2d59a', {
    emissive: '#b66f32',
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.92,
  });

  addMesh(lantern, new RoundedBoxGeometry(0.42, 0.7, 0.42, 4, 0.04), paper, [-4.45, 0.48, 2.0]);
  for (const y of [0.14, 0.82]) {
    addMesh(lantern, new RoundedBoxGeometry(0.5, 0.055, 0.5, 3, 0.02), frame, [-4.45, y, 2.0]);
  }
  for (const x of [-4.66, -4.24]) {
    addMesh(lantern, new THREE.BoxGeometry(0.035, 0.76, 0.035), frame, [x, 0.48, 2.2]);
  }
  return lantern;
}
