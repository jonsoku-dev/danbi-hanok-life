import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { standardMaterial } from '../shared/three';

const COLORS = {
  wood: '#87562f',
  woodDark: '#52331f',
  woodLight: '#b87d47',
  plaster: '#e8dbc2',
  hanji: '#f7eedc',
  floor: '#d7b37c',
  porch: '#ad7040',
  stone: '#8b877b',
  stoneLight: '#aaa392',
  tile: '#3f443f',
  tileEdge: '#2e332f',
  grass: '#91a66f',
  earth: '#b99a70',
  pottery: '#8a4d32',
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

  createFoundation(root);
  createStructure(root);
  createHanjiDoors(root);
  createRoof(root);
  createYard(root);
  return root;
}

function createFoundation(root: THREE.Group): void {
  addMesh(
    root,
    new RoundedBoxGeometry(13.2, 0.34, 7.45, 6, 0.12),
    standardMaterial(COLORS.earth, { roughness: 0.98 }),
    [0.8, -0.24, 0],
  );
  addMesh(
    root,
    new RoundedBoxGeometry(7.4, 0.22, 5.55, 5, 0.07),
    standardMaterial(COLORS.floor, { roughness: 0.9 }),
    [-1.28, 0.01, 0],
  );
  addMesh(
    root,
    new RoundedBoxGeometry(2.3, 0.28, 5.72, 5, 0.07),
    standardMaterial(COLORS.porch, { roughness: 0.78 }),
    [3.47, 0.08, 0],
  );
  addMesh(
    root,
    new RoundedBoxGeometry(3.18, 0.18, 5.65, 5, 0.08),
    standardMaterial(COLORS.grass, { roughness: 1 }),
    [6.12, -0.01, 0],
  );

  const seamMaterial = standardMaterial('#7e4d2b', { roughness: 0.9 });
  for (let x = 2.55; x <= 4.4; x += 0.32) {
    addMesh(root, new THREE.BoxGeometry(0.018, 0.018, 5.35), seamMaterial, [x, 0.235, 0]);
  }

  const tatamiEdge = standardMaterial('#967345', { roughness: 0.95 });
  for (const x of [-3.6, -1.2, 1.2]) {
    addMesh(root, new THREE.BoxGeometry(0.025, 0.018, 5.1), tatamiEdge, [x, 0.14, 0]);
  }
}

function createStructure(root: THREE.Group): void {
  const plaster = standardMaterial(COLORS.plaster, { roughness: 0.98 });
  addMesh(root, new THREE.BoxGeometry(7.45, 3.25, 0.14), plaster, [-1.25, 1.7, -2.73]);
  addMesh(root, new THREE.BoxGeometry(0.14, 3.25, 5.48), plaster, [-4.96, 1.7, 0]);

  const pillarMaterial = standardMaterial(COLORS.wood, { roughness: 0.78 });
  const darkWood = standardMaterial(COLORS.woodDark, { roughness: 0.82 });
  const pillarGeometry = new RoundedBoxGeometry(0.24, 3.48, 0.24, 4, 0.035);
  const columns: readonly Vec3[] = [
    [-4.78, 1.79, -2.55],
    [-2.38, 1.79, -2.55],
    [0.02, 1.79, -2.55],
    [2.38, 1.79, -2.55],
    [-4.78, 1.79, 2.48],
    [2.38, 1.79, 2.48],
  ];

  for (const position of columns) {
    addMesh(root, pillarGeometry, pillarMaterial, position);
    addMesh(
      root,
      new THREE.CylinderGeometry(0.23, 0.29, 0.14, 12),
      standardMaterial(COLORS.stoneLight, { roughness: 1 }),
      [position[0], 0.11, position[2]],
    );
  }

  addMesh(root, new RoundedBoxGeometry(7.55, 0.24, 0.24, 4, 0.035), darkWood, [-1.2, 3.38, -2.55]);
  addMesh(root, new RoundedBoxGeometry(7.55, 0.18, 0.18, 4, 0.03), pillarMaterial, [-1.2, 2.95, -2.55]);
  addMesh(root, new RoundedBoxGeometry(0.24, 0.24, 5.3, 4, 0.035), darkWood, [-4.78, 3.38, -0.03]);

  for (const x of [-4.78, -2.38, 0.02, 2.38]) {
    const bracket = new THREE.Group();
    addMesh(bracket, new RoundedBoxGeometry(0.72, 0.13, 0.16, 4, 0.025), darkWood, [0, 0, 0]);
    addMesh(bracket, new RoundedBoxGeometry(0.16, 0.13, 0.58, 4, 0.025), pillarMaterial, [0, -0.12, 0.04]);
    bracket.position.set(x, 3.28, -2.45);
    root.add(bracket);
  }

  const rafterMaterial = standardMaterial(COLORS.woodDark, { roughness: 0.86 });
  for (let x = -4.72; x <= 2.45; x += 0.52) {
    addMesh(root, new THREE.BoxGeometry(0.1, 0.11, 3.5), rafterMaterial, [x, 3.52, -1.02]);
  }
}

function createHanjiDoors(root: THREE.Group): void {
  const paperMaterial = standardMaterial(COLORS.hanji, {
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    roughness: 1,
  });
  const frameMaterial = standardMaterial(COLORS.wood, { roughness: 0.82 });
  const latticeMaterial = standardMaterial(COLORS.woodLight, { roughness: 0.88 });

  for (let index = 0; index < 4; index += 1) {
    const frame = new THREE.Group();
    addMesh(frame, new THREE.PlaneGeometry(1.16, 1.9), paperMaterial, [0, 0, 0]);

    for (const x of [-0.58, 0.58]) {
      addMesh(frame, new THREE.BoxGeometry(0.055, 2, 0.055), frameMaterial, [x, 0, 0.035]);
    }
    for (const y of [-0.94, 0.94]) {
      addMesh(frame, new THREE.BoxGeometry(1.2, 0.055, 0.055), frameMaterial, [0, y, 0.035]);
    }
    for (const x of [-0.29, 0, 0.29]) {
      addMesh(frame, new THREE.BoxGeometry(0.028, 1.82, 0.035), latticeMaterial, [x, 0, 0.055]);
    }
    for (const y of [-0.6, -0.3, 0, 0.3, 0.6]) {
      addMesh(frame, new THREE.BoxGeometry(1.08, 0.028, 0.035), latticeMaterial, [0, y, 0.055]);
    }

    frame.position.set(-3.95 + index * 1.38, 1.68, -2.64);
    root.add(frame);
  }
}

function roofHeight(z: number, x = 0): number {
  const ridgeZ = -1.42;
  const distance = Math.max(0, ridgeZ - z);
  const normalized = Math.min(1, distance / 1.82);
  const slope = 3.83 - normalized * 0.46;
  const cornerLift = Math.pow(Math.abs(x + 1.05) / 4.55, 2) * normalized * 0.14;
  return slope + cornerLift;
}

function createRoof(root: THREE.Group): void {
  const tileMaterial = standardMaterial(COLORS.tile, { roughness: 0.68, metalness: 0.025 });
  const tileEdgeMaterial = standardMaterial(COLORS.tileEdge, { roughness: 0.74 });

  const surface = new THREE.Mesh(createRoofSurface(), tileMaterial);
  surface.castShadow = true;
  surface.receiveShadow = true;
  root.add(surface);

  for (let x = -5.08; x <= 3.02; x += 0.42) {
    const curve = new THREE.CatmullRomCurve3(
      [-3.23, -2.8, -2.35, -1.9, -1.43].map(
        (z) => new THREE.Vector3(x, roofHeight(z, x) + 0.035, z),
      ),
    );
    const rib = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.035, 7, false), tileEdgeMaterial);
    rib.castShadow = true;
    root.add(rib);
  }

  addMesh(
    root,
    new THREE.CylinderGeometry(0.12, 0.12, 8.55, 12),
    tileEdgeMaterial,
    [-1.03, 3.88, -1.4],
    undefined,
    [0, 0, Math.PI / 2],
  );
  addMesh(
    root,
    new RoundedBoxGeometry(8.75, 0.13, 0.17, 4, 0.025),
    tileEdgeMaterial,
    [-1.03, roofHeight(-3.25) - 0.03, -3.25],
  );

  for (const x of [-5.2, 3.15]) {
    const endCap = addMesh(
      root,
      new THREE.CylinderGeometry(0.16, 0.18, 0.22, 12),
      tileEdgeMaterial,
      [x, 3.87, -1.4],
      undefined,
      [0, 0, Math.PI / 2],
    );
    endCap.scale.y = 0.85;
  }
}

function createRoofSurface(): THREE.BufferGeometry {
  const xSegments = 18;
  const zSegments = 8;
  const minX = -5.15;
  const maxX = 3.1;
  const minZ = -3.28;
  const maxZ = -1.42;
  const positions: number[] = [];
  const indices: number[] = [];

  for (let iz = 0; iz <= zSegments; iz += 1) {
    const zRatio = iz / zSegments;
    const z = THREE.MathUtils.lerp(minZ, maxZ, zRatio);
    for (let ix = 0; ix <= xSegments; ix += 1) {
      const xRatio = ix / xSegments;
      const x = THREE.MathUtils.lerp(minX, maxX, xRatio);
      positions.push(x, roofHeight(z, x), z);
    }
  }

  for (let iz = 0; iz < zSegments; iz += 1) {
    for (let ix = 0; ix < xSegments; ix += 1) {
      const a = iz * (xSegments + 1) + ix;
      const b = a + 1;
      const c = a + xSegments + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createYard(root: THREE.Group): void {
  const stoneMaterial = standardMaterial(COLORS.stone, { roughness: 1 });
  const wallStoneGeometry = new RoundedBoxGeometry(0.7, 0.45, 0.55, 4, 0.08);

  for (let index = 0; index < 5; index += 1) {
    const x = 4.78 + index * 0.68;
    addStone(root, wallStoneGeometry, stoneMaterial, [x, 0.23, -3.08], index);
    addStone(root, wallStoneGeometry, stoneMaterial, [x, 0.23, 3.08], index + 4);
  }
  for (let index = 0; index < 9; index += 1) {
    addStone(root, wallStoneGeometry, stoneMaterial, [8.0, 0.23, -2.42 + index * 0.6], index + 9, true);
  }

  for (let index = 0; index < 5; index += 1) {
    const stone = addMesh(
      root,
      new THREE.SphereGeometry(0.48, 16, 10),
      standardMaterial(index % 2 ? COLORS.stoneLight : COLORS.stone, { roughness: 1 }),
      [4.75 + index * 0.62, 0.1, 1.35 - Math.sin(index * 1.3) * 0.34],
      [1, 0.2, 0.82],
    );
    stone.rotation.y = index * 0.58;
  }

  [5.25, 6.08, 6.9].forEach((x, index) => createOnggi(root, x, -1.92, 0.86 + index * 0.04));
  createPyeongsang(root);

  createFlower(root, 5.1, 2.15, '#d98f87');
  createFlower(root, 6.2, 2.42, '#e0b657');
  createFlower(root, 7.18, 1.92, '#d788a8');
  createShrub(root, 7.35, 2.55, 0.72);
  createShrub(root, 4.9, -2.48, 0.58);
}

function addStone(
  root: THREE.Group,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: Vec3,
  index: number,
  rotate = false,
): void {
  const stone = addMesh(root, geometry, material, position);
  const scale = 0.9 + (Math.sin(index * 2.17) + 1) * 0.06;
  stone.scale.set(scale, 0.86 + (index % 3) * 0.04, 0.94 + (index % 2) * 0.08);
  stone.rotation.y = (rotate ? Math.PI / 2 : 0) + Math.sin(index * 0.93) * 0.08;
}

function createOnggi(root: THREE.Group, x: number, z: number, scale: number): void {
  const profile = [
    new THREE.Vector2(0.2, 0),
    new THREE.Vector2(0.35, 0.08),
    new THREE.Vector2(0.43, 0.28),
    new THREE.Vector2(0.45, 0.52),
    new THREE.Vector2(0.39, 0.7),
    new THREE.Vector2(0.31, 0.78),
    new THREE.Vector2(0.32, 0.84),
  ];
  const body = addMesh(
    root,
    new THREE.LatheGeometry(profile, 28),
    standardMaterial(COLORS.pottery, { roughness: 0.72 }),
    [x, 0.12, z],
    [scale, scale, scale],
  );
  body.rotation.y = x * 0.17;

  addMesh(
    root,
    new THREE.CylinderGeometry(0.34 * scale, 0.38 * scale, 0.075, 24),
    standardMaterial('#4c3025', { roughness: 0.72 }),
    [x, 0.92 * scale, z],
  );
}

function createPyeongsang(root: THREE.Group): void {
  const topMaterial = standardMaterial(COLORS.woodLight, { roughness: 0.84 });
  const legMaterial = standardMaterial(COLORS.woodDark, { roughness: 0.85 });
  addMesh(root, new RoundedBoxGeometry(2.15, 0.18, 1.22, 4, 0.055), topMaterial, [6.5, 0.38, 0.2]);

  for (let z = -0.25; z <= 0.65; z += 0.18) {
    addMesh(root, new THREE.BoxGeometry(1.95, 0.018, 0.025), legMaterial, [6.5, 0.48, z]);
  }

  const legs: readonly Vec3[] = [
    [5.72, 0.18, -0.28],
    [7.28, 0.18, -0.28],
    [5.72, 0.18, 0.68],
    [7.28, 0.18, 0.68],
  ];
  for (const position of legs) {
    addMesh(root, new RoundedBoxGeometry(0.14, 0.5, 0.14, 3, 0.025), legMaterial, position);
  }
}

function createFlower(root: THREE.Group, x: number, z: number, color: THREE.ColorRepresentation): void {
  const stemMaterial = standardMaterial('#587b4d', { roughness: 1 });
  const petalMaterial = standardMaterial(color, { roughness: 0.92 });
  addMesh(root, new THREE.CylinderGeometry(0.035, 0.045, 0.62, 7), stemMaterial, [x, 0.4, z]);

  for (let index = 0; index < 5; index += 1) {
    const angle = (index / 5) * Math.PI * 2;
    const petal = addMesh(
      root,
      new THREE.SphereGeometry(0.12, 12, 8),
      petalMaterial,
      [x + Math.cos(angle) * 0.13, 0.76 + Math.sin(angle) * 0.02, z + Math.sin(angle) * 0.13],
      [1.25, 0.55, 0.8],
    );
    petal.rotation.y = -angle;
  }
  addMesh(root, new THREE.SphereGeometry(0.075, 12, 8), standardMaterial('#d9ad4a'), [x, 0.76, z]);
}

function createShrub(root: THREE.Group, x: number, z: number, scale: number): void {
  const leafMaterial = standardMaterial('#607c51', { roughness: 1 });
  for (let index = 0; index < 5; index += 1) {
    addMesh(
      root,
      new THREE.SphereGeometry(0.36, 14, 10),
      leafMaterial,
      [x + Math.cos(index * 2.2) * 0.24 * scale, 0.34 + (index % 2) * 0.16, z + Math.sin(index * 2.2) * 0.2 * scale],
      [scale, scale * 0.8, scale],
    );
  }
}
