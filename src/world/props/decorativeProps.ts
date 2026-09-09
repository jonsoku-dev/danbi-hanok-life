import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { addMesh, material, type Vec3 } from './PropBuilder';

export function createDecorativeProps(): THREE.Group {
  const root = new THREE.Group();
  root.add(createLowTable(), createRadio(), createBroom(), createChewBasket());
  return root;
}

function createLowTable(): THREE.Group {
  const table = new THREE.Group();
  addMesh(table, new RoundedBoxGeometry(1.7, 0.12, 1, 4, 0.06), material('#a8754d'), [-2.2, 0.65, 0.7]);
  const legs: readonly Vec3[] = [
    [-2.85, 0.45, 0.32],
    [-1.55, 0.45, 0.32],
    [-2.85, 0.45, 1.08],
    [-1.55, 0.45, 1.08],
  ];
  legs.forEach((position) => addMesh(table, new THREE.BoxGeometry(0.1, 0.42, 0.1), material('#6b4934'), position));
  return table;
}

function createRadio(): THREE.Group {
  const radio = new THREE.Group();
  addMesh(radio, new RoundedBoxGeometry(0.78, 0.5, 0.35, 4, 0.07), material('#748b92'), [-0.5, 0.47, -2.1]);
  addMesh(radio, new THREE.CylinderGeometry(0.14, 0.14, 0.03, 20), material('#39484d'), [-0.7, 0.48, -1.91], undefined, [Math.PI / 2, 0, 0]);
  addMesh(radio, new THREE.BoxGeometry(0.22, 0.05, 0.04), material('#e8c96b'), [-0.28, 0.58, -1.91]);
  return radio;
}

function createBroom(): THREE.Group {
  const broom = new THREE.Group();
  addMesh(broom, new THREE.CylinderGeometry(0.035, 0.035, 1.35, 8), material('#8b6042'), [2.7, 0.82, -2.35], undefined, [0, 0, 0.22]);
  addMesh(broom, new THREE.ConeGeometry(0.26, 0.55, 10), material('#c5a56d'), [2.84, 0.2, -2.35], undefined, [0, 0, 0.04]);
  return broom;
}

function createChewBasket(): THREE.Group {
  const basket = new THREE.Group();
  addMesh(basket, new THREE.CylinderGeometry(0.45, 0.38, 0.38, 12, 1, true), material('#b68a5b', { side: THREE.DoubleSide }), [-3.7, 0.22, 1.75]);
  for (let index = 0; index < 4; index += 1) {
    addMesh(
      basket,
      new THREE.CapsuleGeometry(0.06, 0.42, 3, 7),
      material('#e7cf9b'),
      [-3.85 + index * 0.12, 0.45, 1.75],
      undefined,
      [0, 0, 0.7 - index * 0.25],
    );
  }
  return basket;
}
