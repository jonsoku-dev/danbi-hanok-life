import * as THREE from 'three';
import type { DanbiAnimation } from '../behaviors/types';
import { standardMaterial } from '../shared/three';
import type { Character } from './Character';

type StandardMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;

interface DanbiParts {
  body: StandardMesh;
  vest: StandardMesh;
  headPivot: THREE.Group;
  mouth: StandardMesh;
  tongue: StandardMesh;
  eyes: [StandardMesh, StandardMesh];
  ears: [StandardMesh, StandardMesh];
  legs: StandardMesh[];
  tail: StandardMesh;
}

const COLORS = {
  cream: '#f5e8cc',
  creamDark: '#e6d2ae',
  sky: '#bcddea',
  yellow: '#f3cc5c',
  dark: '#2d2926',
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
    this.object3d.position.set(-0.4, 0, 0.4);
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
    const stateTime = this.stateTime;
    const { ears, headPivot, body, tail, legs, eyes, mouth, tongue } = this.parts;

    tail.rotation.z = Math.sin(elapsedSeconds * 5.2) * 0.22;
    ears[0].rotation.z = -0.15 + Math.sin(elapsedSeconds * 2.1) * 0.035;
    ears[1].rotation.z = 0.15 - Math.sin(elapsedSeconds * 2 + 0.4) * 0.035;
    headPivot.rotation.z *= 0.88;
    headPivot.rotation.x *= 0.88;
    body.scale.y += (1.02 - body.scale.y) * 0.18;

    const blinking = elapsedSeconds % 4.8 > 4.62;
    const idleYawn = this.animation === 'idle' && elapsedSeconds % 18 > 16.7;
    eyes.forEach((eye) => {
      eye.scale.y = blinking || idleYawn ? 0.12 : 1;
    });
    mouth.scale.y = idleYawn ? 1.05 : 0.18;
    tongue.visible = idleYawn;
    if (idleYawn) headPivot.rotation.x = -0.16;

    this.animateLegs(elapsedSeconds);
    this.applyAnimationPose(stateTime);
  }

  private build(): DanbiParts {
    const body = createMesh(new THREE.SphereGeometry(0.78, 32, 22), standardMaterial(COLORS.cream));
    body.scale.set(0.86, 1.02, 0.72);
    body.position.y = 1.18;
    this.object3d.add(body);

    const vest = createMesh(
      new THREE.SphereGeometry(0.63, 28, 20),
      standardMaterial(COLORS.sky, { roughness: 0.72 }),
    );
    vest.scale.set(0.92, 0.9, 0.78);
    vest.position.set(0, 1.18, 0.05);
    this.object3d.add(vest);

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.85, 0.08);
    this.object3d.add(headPivot);

    const head = createMesh(new THREE.SphereGeometry(0.72, 32, 24), standardMaterial(COLORS.cream));
    head.scale.set(0.95, 0.92, 0.9);
    headPivot.add(head);

    const muzzle = createMesh(new THREE.SphereGeometry(0.36, 24, 18), standardMaterial('#f9edda'));
    muzzle.scale.set(0.92, 0.62, 0.7);
    muzzle.position.set(0, -0.14, 0.6);
    headPivot.add(muzzle);

    const nose = createMesh(
      new THREE.SphereGeometry(0.11, 18, 14),
      standardMaterial(COLORS.dark, { roughness: 0.42 }),
    );
    nose.scale.set(1.15, 0.7, 0.8);
    nose.position.set(0, -0.08, 0.87);
    headPivot.add(nose);

    const mouth = createMesh(
      new THREE.SphereGeometry(0.13, 16, 10),
      standardMaterial('#5b3b36', { roughness: 0.55 }),
    );
    mouth.scale.set(1, 0.18, 0.5);
    mouth.position.set(0, -0.31, 0.75);
    headPivot.add(mouth);

    const tongue = createMesh(
      new THREE.SphereGeometry(0.08, 14, 8),
      standardMaterial('#dd8f91', { roughness: 0.75 }),
    );
    tongue.scale.set(0.9, 0.25, 0.7);
    tongue.position.set(0, -0.34, 0.79);
    tongue.visible = false;
    headPivot.add(tongue);

    const eyeGeometry = new THREE.SphereGeometry(0.095, 18, 14);
    const eyeMaterial = standardMaterial('#24201d', { roughness: 0.35 });
    const leftEye = createMesh(eyeGeometry, eyeMaterial);
    const rightEye = createMesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.26, 0.13, 0.59);
    rightEye.position.set(0.26, 0.13, 0.59);
    headPivot.add(leftEye, rightEye);

    const earGeometry = new THREE.ConeGeometry(0.25, 0.55, 4);
    const earMaterial = standardMaterial(COLORS.creamDark);
    const leftEar = createMesh(earGeometry, earMaterial);
    const rightEar = createMesh(earGeometry, earMaterial);
    leftEar.position.set(-0.43, 0.53, 0.04);
    rightEar.position.set(0.43, 0.53, 0.04);
    leftEar.rotation.z = -0.15;
    rightEar.rotation.z = 0.15;
    headPivot.add(leftEar, rightEar);

    const scarf = createMesh(new THREE.TorusGeometry(0.44, 0.09, 10, 28), standardMaterial(COLORS.yellow));
    scarf.position.set(0, -0.48, 0.08);
    scarf.rotation.x = Math.PI / 2;
    headPivot.add(scarf);

    const scarfTip = createMesh(new THREE.ConeGeometry(0.12, 0.34, 3), standardMaterial(COLORS.yellow));
    scarfTip.position.set(0.22, -0.65, 0.4);
    scarfTip.rotation.z = -0.34;
    headPivot.add(scarfTip);

    const legs = this.buildLegs();
    const tail = this.buildTail();

    return {
      body,
      vest,
      headPivot,
      mouth,
      tongue,
      eyes: [leftEye, rightEye],
      ears: [leftEar, rightEar],
      legs,
      tail,
    };
  }

  private buildLegs(): StandardMesh[] {
    const legGeometry = new THREE.CapsuleGeometry(0.17, 0.45, 5, 10);
    const legMaterial = standardMaterial(COLORS.cream);
    const pawMaterial = standardMaterial('#f4dec0');
    const positions: readonly [number, number, number][] = [
      [-0.34, 0.55, 0.3],
      [0.34, 0.55, 0.3],
      [-0.35, 0.55, -0.28],
      [0.35, 0.55, -0.28],
    ];

    return positions.map(([x, y, z], index) => {
      const leg = createMesh(legGeometry, legMaterial);
      leg.position.set(x, y, z);
      leg.rotation.z = index % 2 ? -0.03 : 0.03;

      const paw = createMesh(new THREE.SphereGeometry(0.21, 18, 12), pawMaterial);
      paw.scale.set(1.05, 0.62, 1.3);
      paw.position.y = -0.35;
      leg.add(paw);
      this.object3d.add(leg);
      return leg;
    });
  }

  private buildTail(): StandardMesh {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.48, 0.12, -0.02),
      new THREE.Vector3(0.65, 0.5, 0.06),
      new THREE.Vector3(0.35, 0.72, 0.18),
      new THREE.Vector3(0.08, 0.58, 0.2),
    ]);
    const tail = createMesh(
      new THREE.TubeGeometry(curve, 18, 0.13, 9, false),
      standardMaterial(COLORS.creamDark),
    );
    tail.position.set(0.46, 1.15, -0.5);
    tail.rotation.y = -0.35;
    this.object3d.add(tail);
    return tail;
  }

  private animateLegs(elapsedSeconds: number): void {
    this.parts.legs.forEach((leg, index) => {
      leg.rotation.x *= 0.75;
      if (this.animation !== 'walk' && this.animation !== 'run') return;
      const speed = this.animation === 'run' ? 11 : 7;
      const amplitude = this.animation === 'run' ? 0.42 : 0.24;
      leg.rotation.x = Math.sin(elapsedSeconds * speed + index * Math.PI) * amplitude;
    });
  }

  private applyAnimationPose(stateTime: number): void {
    const { headPivot, body, legs, eyes, ears } = this.parts;

    switch (this.animation) {
      case 'eat':
      case 'drink':
      case 'sniff':
        headPivot.rotation.x = 0.55 + Math.sin(stateTime * 5) * 0.06;
        headPivot.position.y = 1.8;
        break;
      case 'play':
        headPivot.rotation.z = Math.sin(stateTime * 4) * 0.14;
        body.scale.y = 0.96 + Math.abs(Math.sin(stateTime * 5)) * 0.08;
        if (legs[0]) legs[0].rotation.x = -0.55 + Math.sin(stateTime * 5) * 0.12;
        break;
      case 'read':
        headPivot.rotation.x = 0.22;
        headPivot.rotation.z = Math.sin(stateTime * 1.5) * 0.07;
        break;
      case 'nap': {
        headPivot.rotation.z = -0.38;
        headPivot.position.y = 1.67;
        body.scale.y = 0.82;
        const sleepy = Math.min(1, stateTime / 1.2);
        eyes.forEach((eye) => {
          eye.scale.y = 1 - sleepy * 0.9;
        });
        break;
      }
      case 'tidy':
        headPivot.rotation.x = 0.25;
        if (legs[0]) legs[0].rotation.x = -0.7 + Math.sin(stateTime * 4.6) * 0.22;
        break;
      case 'window':
        headPivot.rotation.z = 0.18 + Math.sin(stateTime * 1.2) * 0.05;
        break;
      case 'shake':
        headPivot.rotation.z = Math.sin(stateTime * 24) * 0.2;
        body.rotation.z = Math.sin(stateTime * 22) * 0.08;
        ears[0].rotation.z = -0.15 + Math.sin(stateTime * 25) * 0.28;
        ears[1].rotation.z = 0.15 - Math.sin(stateTime * 25) * 0.28;
        break;
      case 'yawn':
        headPivot.rotation.x = -0.18;
        headPivot.rotation.z = 0.12;
        break;
      default:
        headPivot.position.y += (1.85 - headPivot.position.y) * 0.12;
        body.rotation.z *= 0.85;
    }
  }
}
