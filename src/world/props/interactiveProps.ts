import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { ActionId } from '../../behaviors/types';
import { addMesh, makeInteractive, material } from './PropBuilder';

export interface InteractivePropDefinition {
  readonly object: THREE.Group;
  readonly action: ActionId;
  readonly target: THREE.Vector3;
}

function defineInteractive(
  object: THREE.Group,
  action: ActionId,
  title: string,
  description: string,
  target: THREE.Vector3,
): InteractivePropDefinition {
  return {
    object: makeInteractive(object, { action, title, description }),
    action,
    target,
  };
}

export function createFoodBowl(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new THREE.CylinderGeometry(0.33, 0.26, 0.18, 24), material('#e9e0d4'), [-2.55, 0.82, 0.72]);
  addMesh(group, new THREE.CylinderGeometry(0.25, 0.25, 0.03, 24), material('#9a684e'), [-2.55, 0.925, 0.72]);
  return defineInteractive(group, 'eat', '도자기 밥그릇', '단비가 낮은 밥상 앞에 앉아 냠냠 밥을 먹어요.', new THREE.Vector3(-2.55, 0, 1.35));
}

export function createWaterBowl(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new THREE.CylinderGeometry(0.32, 0.26, 0.18, 24), material('#d9e8ed'), [-1.85, 0.82, 0.72]);
  addMesh(group, new THREE.CylinderGeometry(0.24, 0.24, 0.025, 24), material('#83b8cb', { metalness: 0.05 }), [-1.85, 0.925, 0.72]);
  return defineInteractive(group, 'drink', '물그릇', '혀를 살짝 내밀고 물을 마시는 단비를 볼 수 있어요.', new THREE.Vector3(-1.85, 0, 1.35));
}

export function createDogBed(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new RoundedBoxGeometry(1.65, 0.16, 1.15, 7, 0.18), material('#e6be8a'), [0.8, 0.18, -0.5]);
  addMesh(group, new RoundedBoxGeometry(1.15, 0.24, 0.82, 7, 0.2), material('#e8d3b8'), [0.8, 0.37, -0.5]);
  return defineInteractive(group, 'nap', '강아지 방석', '포근한 방석에 몸을 말고 졸다가 스르르 잠들어요.', new THREE.Vector3(0.75, 0, -0.25));
}

export function createBookshelf(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new RoundedBoxGeometry(1.25, 1.75, 0.4, 4, 0.05), material('#875c3e'), [-4.1, 0.9, -1.75]);
  [0.25, 0.85, 1.45].forEach((y) => addMesh(group, new THREE.BoxGeometry(1.08, 0.07, 0.45), material('#6f4b35'), [-4.1, y, -1.75]));
  ['#b66b5f', '#7893a5', '#d2a455', '#7f9b77'].forEach((color, index) => {
    addMesh(group, new THREE.BoxGeometry(0.16, 0.5, 0.27), material(color), [-4.48 + index * 0.25, 0.55, -1.5]);
  });
  return defineInteractive(group, 'read', '작은 책장', '그림책 표지를 하나씩 구경하며 고개를 갸웃해요.', new THREE.Vector3(-3.6, 0, -1.25));
}

export function createToyChest(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new RoundedBoxGeometry(1.35, 0.72, 0.8, 5, 0.08), material('#9f734c'), [1.9, 0.4, -1.65]);
  addMesh(group, new RoundedBoxGeometry(1.38, 0.11, 0.82, 4, 0.06), material('#704c35'), [1.9, 0.82, -1.65]);
  return defineInteractive(group, 'tidy', '나무 장난감 상자', '앞발로 장난감을 톡톡 밀어 상자에 정리해요.', new THREE.Vector3(1.35, 0, -1.1));
}

export function createBall(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new THREE.SphereGeometry(0.3, 24, 16), material('#e79674'), [4.55, 0.3, 1.8]);
  addMesh(group, new THREE.TorusGeometry(0.21, 0.035, 8, 20), material('#f0d47b'), [4.55, 0.3, 1.8], [1, 1, 1], [Math.PI / 2, 0, 0]);
  return defineInteractive(group, 'play', '공 장난감', '단비가 공을 앞발로 툭 치고 신나게 따라가요.', new THREE.Vector3(4.1, 0, 1.4));
}

export function createWindowPlant(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new THREE.CylinderGeometry(0.28, 0.23, 0.33, 14), material('#8f6a50'), [1.85, 0.22, -2.25]);
  for (let index = 0; index < 6; index += 1) {
    const leaf = addMesh(
      group,
      new THREE.SphereGeometry(0.16, 12, 8),
      material('#78966e'),
      [1.85 + Math.cos(index) * 0.22, 0.55 + Math.sin(index * 0.8) * 0.08, -2.25 + Math.sin(index) * 0.12],
    );
    leaf.scale.set(0.65, 1.5, 0.55);
  }
  return defineInteractive(group, 'window', '창가 화분', '화분 옆 창가에 서서 마당을 한참 바라봐요.', new THREE.Vector3(1.25, 0, -1.75));
}

export const INTERACTIVE_PROP_FACTORIES = [
  createFoodBowl,
  createWaterBowl,
  createDogBed,
  createBookshelf,
  createToyChest,
  createBall,
  createWindowPlant,
] as const;
