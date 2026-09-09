import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { DanbiAnimation } from '../behaviors/types';
import { standardMaterial } from '../shared/three';
import type { Character } from './Character';

type StandardMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;

interface DanbiParts {
  torsoPivot: THREE.Group;
  headPivot: THREE.Group;
  mouth: StandardMesh;
  tongue: StandardMesh;
  eyes: [StandardMesh, StandardMesh];
  ears: [THREE.Group, THREE.Group];
  legs: THREE.Group[];
  tailPivot: THREE.Group;
}

const COLORS = {
  fur: '#f4e5c7',
  furLight: '#fff3df',
  furShadow: '#dfc69f',
  sky: '#acd4e6',
  skyDark: '#79aec7',
  trim: '#f7f0e4',
  yellow: '#f1c84e',
  pink: '#d99b94',
  dark: '#2a2724',
} as const;

function createMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.MeshStandardMaterial,
  castShadow = true,
): StandardMesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  return mesh;
}

export class Danbi implements Character {
  readonly object3d = new THREE.Group();
  private animation: DanbiAnimation = 'idle';
  private stateTime = 0;
  private readonly parts: DanbiParts;

  constructor() {
    this.object3d.name = '단비';
    this.object3d.position.set(-0.35, 0, 0.35);
    this.parts = this.build();
  }

  setAnimation(animation: DanbiAnimation): void {
    if (this.animation === animation) return;
    this.animation = animation;
    this.stateTime = 0;
  }

  faceTowards(target: THREE.Vector3): void {
    const direction = target.clone().sub(this.object3d.position);
    if (direction.lengthSq() < 0.001) return;
    this.object3d.rotation.y = Math.atan2(direction.x, direction.z);
  }

  update(deltaSeconds: number, elapsedSeconds: number): void {
    this.stateTime += deltaSeconds;
    const { torsoPivot, headPivot, tailPivot, eyes, ears, mouth, tongue } = this.parts;

    torsoPivot.position.y = Math.sin(elapsedSeconds * 2.2) * 0.012;
    torsoPivot.scale.y += (1 - torsoPivot.scale.y) * 0.16;
    torsoPivot.rotation.z *= 0.82;
    headPivot.position.y += (1.67 - headPivot.position.y) * 0.16;
    headPivot.rotation.x *= 0.82;
    headPivot.rotation.z *= 0.82;

    tailPivot.rotation.z = Math.sin(elapsedSeconds * 6.1) * 0.22;
    tailPivot.rotation.x = Math.sin(elapsedSeconds * 3.2) * 0.05;

    ears[0].rotation.z = -0.1 + Math.sin(elapsedSeconds * 2.2) * 0.025;
    ears[1].rotation.z = 0.1 - Math.sin(elapsedSeconds * 2.1 + 0.5) * 0.025;

    const blinking = elapsedSeconds % 4.6 > 4.42;
    const idleYawn = this.animation === 'idle' && elapsedSeconds % 17.5 > 16.2;
    for (const eye of eyes) eye.scale.y = blinking || idleYawn ? 0.12 : 1;

    mouth.scale.y = idleYawn ? 0.95 : 0.2;
    tongue.visible = idleYawn || this.animation === 'drink';
    if (idleYawn) headPivot.rotation.x = -0.16;

    this.animateLegs(elapsedSeconds);
    this.applyAnimationPose(this.stateTime);
  }

  private build(): DanbiParts {
    const torsoPivot = new THREE.Group();
    this.object3d.add(torsoPivot);

    const body = createMesh(
      new THREE.SphereGeometry(0.72, 32, 24),
      standardMaterial(COLORS.fur, { roughness: 0.92 }),
    );
    body.scale.set(0.84, 0.92, 0.68);
    body.position.y = 0.98;
    torsoPivot.add(body);

    const chest = createMesh(
      new THREE.SphereGeometry(0.42, 24, 18),
      standardMaterial(COLORS.furLight, { roughness: 0.95 }),
    );
    chest.scale.set(0.86, 1.05, 0.38);
    chest.position.set(0, 1.03, 0.48);
    torsoPivot.add(chest);

    this.buildHanbok(torsoPivot);

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.67, 0.08);
    this.object3d.add(headPivot);

    const head = createMesh(
      new THREE.SphereGeometry(0.77, 36, 28),
      standardMaterial(COLORS.fur, { roughness: 0.94 }),
    );
    head.scale.set(0.96, 0.9, 0.9);
    headPivot.add(head);

    const cheekGeometry = new THREE.SphereGeometry(0.31, 24, 18);
    const muzzleMaterial = standardMaterial(COLORS.furLight, { roughness: 0.96 });
    const leftCheek = createMesh(cheekGeometry, muzzleMaterial);
    const rightCheek = createMesh(cheekGeometry, muzzleMaterial);
    leftCheek.scale.set(0.95, 0.66, 0.62);
    rightCheek.scale.copy(leftCheek.scale);
    leftCheek.position.set(-0.17, -0.13, 0.59);
    rightCheek.position.set(0.17, -0.13, 0.59);
    headPivot.add(leftCheek, rightCheek);

    const chin = createMesh(new THREE.SphereGeometry(0.2, 18, 14), muzzleMaterial);
    chin.scale.set(1.05, 0.45, 0.62);
    chin.position.set(0, -0.31, 0.57);
    headPivot.add(chin);

    const nose = createMesh(
      new THREE.SphereGeometry(0.105, 20, 16),
      standardMaterial(COLORS.dark, { roughness: 0.3 }),
    );
    nose.scale.set(1.18, 0.72, 0.82);
    nose.position.set(0, -0.08, 0.84);
    headPivot.add(nose);

    const mouth = createMesh(
      new THREE.SphereGeometry(0.12, 16, 10),
      standardMaterial('#5d3a34', { roughness: 0.6 }),
    );
    mouth.scale.set(1, 0.2, 0.45);
    mouth.position.set(0, -0.3, 0.73);
    headPivot.add(mouth);

    const tongue = createMesh(
      new THREE.SphereGeometry(0.075, 14, 8),
      standardMaterial('#df8f91', { roughness: 0.72 }),
    );
    tongue.scale.set(0.88, 0.32, 0.72);
    tongue.position.set(0, -0.35, 0.77);
    tongue.visible = false;
    headPivot.add(tongue);

    const eyes = this.buildEyes(headPivot);
    const ears = this.buildEars(headPivot);
    this.buildScarf(headPivot);

    const legs = this.buildLegs();
    const tailPivot = this.buildTail();

    return {
      torsoPivot,
      headPivot,
      mouth,
      tongue,
      eyes,
      ears,
      legs,
      tailPivot,
    };
  }

  private buildHanbok(parent: THREE.Group): void {
    const vestMaterial = standardMaterial(COLORS.sky, { roughness: 0.78 });
    const trimMaterial = standardMaterial(COLORS.trim, { roughness: 0.9 });

    const front = createMesh(new RoundedBoxGeometry(0.9, 0.7, 0.1, 5, 0.08), vestMaterial);
    front.position.set(0, 0.98, 0.56);
    parent.add(front);

    const back = createMesh(new RoundedBoxGeometry(0.94, 0.72, 0.1, 5, 0.08), vestMaterial);
    back.position.set(0, 0.98, -0.51);
    parent.add(back);

    for (const x of [-0.4, 0.4]) {
      const side = createMesh(new RoundedBoxGeometry(0.12, 0.62, 0.82, 4, 0.05), vestMaterial);
      side.position.set(x, 0.98, 0.02);
      parent.add(side);
    }

    const collarLeft = createMesh(new RoundedBoxGeometry(0.09, 0.5, 0.08, 4, 0.035), trimMaterial, false);
    collarLeft.position.set(-0.17, 1.08, 0.625);
    collarLeft.rotation.z = -0.52;
    parent.add(collarLeft);

    const collarRight = collarLeft.clone();
    collarRight.position.x = 0.17;
    collarRight.rotation.z = 0.52;
    parent.add(collarRight);

    const hem = createMesh(new RoundedBoxGeometry(0.82, 0.08, 0.075, 4, 0.03), trimMaterial, false);
    hem.position.set(0, 0.69, 0.625);
    parent.add(hem);

    const knot = createMesh(new THREE.SphereGeometry(0.11, 18, 12), standardMaterial(COLORS.skyDark));
    knot.scale.set(1.2, 0.8, 0.65);
    knot.position.set(0, 0.96, 0.67);
    parent.add(knot);
  }

  private buildEyes(parent: THREE.Group): [StandardMesh, StandardMesh] {
    const eyeGeometry = new THREE.SphereGeometry(0.105, 20, 16);
    const eyeMaterial = standardMaterial(COLORS.dark, { roughness: 0.25 });
    const left = createMesh(eyeGeometry, eyeMaterial);
    const right = createMesh(eyeGeometry, eyeMaterial);
    left.position.set(-0.26, 0.11, 0.61);
    right.position.set(0.26, 0.11, 0.61);
    parent.add(left, right);

    const highlightMaterial = standardMaterial('#fffdf8', { roughness: 0.2 });
    for (const x of [-0.26, 0.26]) {
      const highlight = createMesh(new THREE.SphereGeometry(0.032, 12, 8), highlightMaterial, false);
      highlight.position.set(x - 0.028, 0.145, 0.7);
      parent.add(highlight);
    }

    return [left, right];
  }

  private buildEars(parent: THREE.Group): [THREE.Group, THREE.Group] {
    const createEar = (side: -1 | 1): THREE.Group => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.43, 0.51, 0.02);

      const outer = createMesh(
        new THREE.ConeGeometry(0.28, 0.58, 3),
        standardMaterial(COLORS.furShadow, { roughness: 0.95 }),
      );
      outer.rotation.z = side * 0.04;
      pivot.add(outer);

      const inner = createMesh(
        new THREE.ConeGeometry(0.17, 0.39, 3),
        standardMaterial(COLORS.pink, { roughness: 0.92 }),
        false,
      );
      inner.position.set(0, -0.015, 0.04);
      inner.scale.z = 0.55;
      pivot.add(inner);

      parent.add(pivot);
      return pivot;
    };

    return [createEar(-1), createEar(1)];
  }

  private buildScarf(parent: THREE.Group): void {
    const scarfMaterial = standardMaterial(COLORS.yellow, { roughness: 0.82 });
    const collar = createMesh(new THREE.TorusGeometry(0.43, 0.07, 10, 30), scarfMaterial);
    collar.position.set(0, -0.48, 0.07);
    collar.rotation.x = Math.PI / 2;
    parent.add(collar);

    const knot = createMesh(new THREE.SphereGeometry(0.11, 16, 12), scarfMaterial);
    knot.position.set(0, -0.51, 0.48);
    parent.add(knot);

    const leftTip = createMesh(new THREE.ConeGeometry(0.11, 0.34, 4), scarfMaterial);
    leftTip.position.set(-0.11, -0.68, 0.47);
    leftTip.rotation.z = 0.25;
    parent.add(leftTip);

    const rightTip = leftTip.clone();
    rightTip.position.x = 0.12;
    rightTip.rotation.z = -0.28;
    parent.add(rightTip);
  }

  private buildLegs(): THREE.Group[] {
    const legMaterial = standardMaterial(COLORS.fur, { roughness: 0.95 });
    const pawMaterial = standardMaterial(COLORS.furLight, { roughness: 0.96 });
    const positions: readonly [number, number, number][] = [
      [-0.32, 0.46, 0.31],
      [0.32, 0.46, 0.31],
      [-0.34, 0.46, -0.27],
      [0.34, 0.46, -0.27],
    ];

    return positions.map(([x, y, z], index) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, y, z);

      const leg = createMesh(new THREE.CapsuleGeometry(0.15, 0.3, 5, 9), legMaterial);
      leg.position.y = 0.02;
      pivot.add(leg);

      const paw = createMesh(new THREE.SphereGeometry(0.2, 18, 12), pawMaterial);
      paw.scale.set(1.08, 0.56, 1.34);
      paw.position.set(0, -0.26, 0.08);
      pivot.add(paw);

      pivot.rotation.z = index % 2 ? -0.025 : 0.025;
      this.object3d.add(pivot);
      return pivot;
    });
  }

  private buildTail(): THREE.Group {
    const pivot = new THREE.Group();
    pivot.position.set(0.48, 1.08, -0.48);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.36, 0.08, -0.06),
      new THREE.Vector3(0.58, 0.36, 0.02),
      new THREE.Vector3(0.48, 0.67, 0.16),
      new THREE.Vector3(0.17, 0.75, 0.24),
      new THREE.Vector3(-0.02, 0.56, 0.2),
    ]);
    const tail = createMesh(
      new THREE.TubeGeometry(curve, 28, 0.13, 10, false),
      standardMaterial(COLORS.furShadow, { roughness: 0.95 }),
    );
    pivot.add(tail);
    this.object3d.add(pivot);
    return pivot;
  }

  private animateLegs(elapsedSeconds: number): void {
    this.parts.legs.forEach((leg, index) => {
      leg.rotation.x *= 0.72;
      if (this.animation !== 'walk' && this.animation !== 'run') return;
      const speed = this.animation === 'run' ? 11.5 : 7.2;
      const amplitude = this.animation === 'run' ? 0.45 : 0.27;
      leg.rotation.x = Math.sin(elapsedSeconds * speed + index * Math.PI) * amplitude;
    });
  }

  private applyAnimationPose(stateTime: number): void {
    const { headPivot, torsoPivot, legs, eyes, ears, tailPivot } = this.parts;

    switch (this.animation) {
      case 'eat':
      case 'drink':
      case 'sniff':
        headPivot.rotation.x = 0.52 + Math.sin(stateTime * 5) * 0.055;
        headPivot.position.y = 1.55;
        tailPivot.rotation.z *= 0.6;
        break;
      case 'play':
        headPivot.rotation.z = Math.sin(stateTime * 4.2) * 0.12;
        torsoPivot.position.y += Math.abs(Math.sin(stateTime * 5.4)) * 0.055;
        if (legs[0]) legs[0].rotation.x = -0.62 + Math.sin(stateTime * 5) * 0.15;
        break;
      case 'read':
        headPivot.rotation.x = 0.18;
        headPivot.rotation.z = Math.sin(stateTime * 1.5) * 0.075;
        break;
      case 'nap': {
        headPivot.rotation.z = -0.32;
        headPivot.position.y = 1.47;
        torsoPivot.scale.y = 0.82;
        const sleepy = Math.min(1, stateTime / 1.1);
        for (const eye of eyes) eye.scale.y = 1 - sleepy * 0.9;
        tailPivot.rotation.z = 0.08;
        break;
      }
      case 'tidy':
        headPivot.rotation.x = 0.22;
        if (legs[0]) legs[0].rotation.x = -0.72 + Math.sin(stateTime * 4.8) * 0.2;
        break;
      case 'window':
        headPivot.rotation.z = 0.16 + Math.sin(stateTime * 1.1) * 0.045;
        break;
      case 'shake':
        headPivot.rotation.z = Math.sin(stateTime * 25) * 0.2;
        torsoPivot.rotation.z = Math.sin(stateTime * 22) * 0.075;
        ears[0].rotation.z = -0.1 + Math.sin(stateTime * 25) * 0.26;
        ears[1].rotation.z = 0.1 - Math.sin(stateTime * 25) * 0.26;
        break;
      case 'yawn':
        headPivot.rotation.x = -0.18;
        headPivot.rotation.z = 0.1;
        break;
      default:
        break;
    }
  }
}
