import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { standardMaterial } from '../shared/three';

const COLORS = {
  wood: '#8a5f3d',
  woodDark: '#5f402d',
  woodLight: '#b98254',
  hanji: '#f4ead7',
  floor: '#d6b483',
  stone: '#8d8a80',
  tile: '#4d514c',
  grass: '#99aa7a',
  earth: '#b89a72',
  pottery: '#86523c',
} as const;

type Vec3 = readonly [number, number, number];

function addMesh(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: Vec3,
  scale?: Vec3,
  rotation?: Vec3,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  if (scale) mesh.scale.set(...scale);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

export function createHanok(): THREE.Group {
  const root = new THREE.Group();
  root.name = '미니 한옥';

  addMesh(root, new RoundedBoxGeometry(13, 0.35, 7.3, 6, 0.12), standardMaterial(COLORS.earth), [0.8, -0.24, 0]);
  addMesh(root, new RoundedBoxGeometry(7.3, 0.22, 5.5, 5, 0.08), standardMaterial(COLORS.floor), [-1.3, 0.02, 0]);
  addMesh(root, new RoundedBoxGeometry(2.25, 0.28, 5.7, 5, 0.08), standardMaterial('#a8774e'), [3.45, 0.08, 0]);
  addMesh(root, new RoundedBoxGeometry(3.1, 0.18, 5.6, 5, 0.08), standardMaterial(COLORS.grass), [6.1, -0.01, 0]);

  addMesh(root, new THREE.BoxGeometry(7.5, 3.4, 0.16), standardMaterial('#e8dbc1'), [-1.25, 1.75, -2.75]);
  addMesh(root, new THREE.BoxGeometry(0.16, 3.4, 5.5), standardMaterial('#e8dbc1'), [-5, 1.75, 0]);

  const pillarGeometry = new RoundedBoxGeometry(0.22, 3.7, 0.22, 4, 0.04);
  [-4.85, -2.35, 0.1, 2.45].forEach((x) => addMesh(root, pillarGeometry, standardMaterial(COLORS.wood), [x, 1.85, -2.62]));
  [-2.55, 0, 2.55].forEach((z) => addMesh(root, pillarGeometry, standardMaterial(COLORS.wood), [-4.86, 1.85, z]));
  addMesh(root, new RoundedBoxGeometry(7.6, 0.23, 0.23, 4, 0.04), standardMaterial(COLORS.woodDark), [-1.25, 3.45, -2.62]);
  addMesh(root, new RoundedBoxGeometry(0.23, 0.23, 5.55, 4, 0.04), standardMaterial(COLORS.woodDark), [-4.86, 3.45, 0]);

  for (let x = -4.8; x <= 3; x += 0.72) {
    addMesh(root, new THREE.BoxGeometry(0.09, 0.11, 6.2), standardMaterial(COLORS.woodDark), [x, 3.7, -0.05]);
  }
  addMesh(root, new THREE.BoxGeometry(8.8, 0.22, 3.5), standardMaterial(COLORS.tile), [-1, 4.05, -1.65], undefined, [0.18, 0, 0]);
  addMesh(root, new THREE.BoxGeometry(8.8, 0.22, 3.5), standardMaterial(COLORS.tile), [-1, 4.05, 1.65], undefined, [-0.18, 0, 0]);
  addMesh(root, new THREE.CylinderGeometry(0.15, 0.15, 8.9, 8), standardMaterial(COLORS.tile), [-1, 4.38, 0], undefined, [0, 0, Math.PI / 2]);

  createHanjiDoors(root);
  createYard(root);
  return root;
}

function createHanjiDoors(root: THREE.Group): void {
  for (let index = 0; index < 3; index += 1) {
    const x = -3.55 + index * 1.4;
    const frame = new THREE.Group();
    const paperMaterial = standardMaterial(COLORS.hanji, {
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    });
    addMesh(frame, new THREE.PlaneGeometry(1.18, 1.85), paperMaterial, [0, 0, 0]);
    [-0.57, 0.57].forEach((px) => addMesh(frame, new THREE.BoxGeometry(0.055, 1.95, 0.055), standardMaterial(COLORS.wood), [px, 0, 0.03]));
    [-0.9, 0, 0.9].forEach((py) => addMesh(frame, new THREE.BoxGeometry(1.2, 0.045, 0.055), standardMaterial(COLORS.woodLight), [0, py, 0.035]));
    frame.position.set(x, 1.65, -2.64);
    root.add(frame);
  }
}

function createYard(root: THREE.Group): void {
  const stoneMaterial = standardMaterial(COLORS.stone);
  const wallStoneGeometry = new RoundedBoxGeometry(0.7, 0.45, 0.55, 4, 0.08);

  for (let x = 4.8; x < 7.8; x += 0.65) addMesh(root, wallStoneGeometry, stoneMaterial, [x, 0.23, -3.1]);
  for (let x = 4.8; x < 7.8; x += 0.65) addMesh(root, wallStoneGeometry, stoneMaterial, [x, 0.23, 3.1]);
  for (let z = -2.5; z < 3; z += 0.6) addMesh(root, wallStoneGeometry, stoneMaterial, [8, 0.23, z], undefined, [0, Math.PI / 2, 0]);

  for (let index = 0; index < 5; index += 1) {
    const stone = addMesh(
      root,
      new THREE.CylinderGeometry(0.42 + 0.05 * (index % 2), 0.5, 0.12, 9),
      stoneMaterial,
      [4.7 + index * 0.63, 0.11, 1.35 - Math.sin(index) * 0.35],
    );
    stone.rotation.y = index * 0.55;
  }

  [5.3, 6.1, 6.9].forEach((x) => {
    addMesh(root, new THREE.CylinderGeometry(0.32, 0.42, 0.7, 16), standardMaterial(COLORS.pottery), [x, 0.4, -1.95]);
    addMesh(root, new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16), standardMaterial('#4d3327'), [x, 0.79, -1.95]);
  });

  addMesh(root, new RoundedBoxGeometry(2.1, 0.2, 1.2, 4, 0.07), standardMaterial(COLORS.woodLight), [6.5, 0.36, 0.2]);
  const benchLegs: readonly Vec3[] = [
    [5.7, 0.18, -0.3],
    [7.3, 0.18, -0.3],
    [5.7, 0.18, 0.7],
    [7.3, 0.18, 0.7],
  ];
  benchLegs.forEach((position) => addMesh(root, new THREE.BoxGeometry(0.13, 0.48, 0.13), standardMaterial(COLORS.woodDark), position));

  const flowers: readonly [number, number, THREE.ColorRepresentation][] = [
    [5.1, 2.1, '#d78f89'],
    [6.2, 2.4, '#e0b95e'],
    [7.2, 1.9, '#d98aaa'],
  ];
  flowers.forEach(([x, z, color]) => {
    addMesh(root, new THREE.CylinderGeometry(0.05, 0.06, 0.65, 7), standardMaterial('#5f7f54'), [x, 0.42, z]);
    addMesh(root, new THREE.SphereGeometry(0.22, 12, 8), standardMaterial(color), [x, 0.78, z]);
  });
}
