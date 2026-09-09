import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { ActionId } from '../../behaviors/types';
import { addMesh, makeInteractive, material } from './PropBuilder';

interface InteractivePropDefinition {
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

function createFoodBowl(): InteractivePropDefinition {
  const group = new THREE.Group();
  const bowl = createCeramicBowl('#ede4d6', '#9b654a');
  bowl.position.set(-2.55, 0.82, 0.72);
  group.add(bowl);
  return defineInteractive(group, 'eat', '도자기 밥그릇', '단비가 낮은 밥상 앞에 앉아 냠냠 밥을 먹어요.', new THREE.Vector3(-2.55, 0, 1.35));
}

function createWaterBowl(): InteractivePropDefinition {
  const group = new THREE.Group();
  const bowl = createCeramicBowl('#dce9ed', '#7fb8cb');
  bowl.position.set(-1.85, 0.82, 0.72);
  group.add(bowl);
  return defineInteractive(group, 'drink', '물그릇', '혀를 살짝 내밀고 물을 마시는 단비를 볼 수 있어요.', new THREE.Vector3(-1.85, 0, 1.35));
}

function createCeramicBowl(bodyColor: THREE.ColorRepresentation, fillColor: THREE.ColorRepresentation): THREE.Group {
  const bowl = new THREE.Group();
  addMesh(
    bowl,
    new THREE.CylinderGeometry(0.33, 0.25, 0.18, 28, 1, false),
    material(bodyColor, { roughness: 0.58 }),
    [0, 0.09, 0],
  );
  addMesh(bowl, new THREE.TorusGeometry(0.29, 0.035, 8, 28), material('#f5eee4'), [0, 0.18, 0], undefined, [Math.PI / 2, 0, 0]);
  addMesh(
    bowl,
    new THREE.CylinderGeometry(0.25, 0.25, 0.025, 28),
    material(fillColor, { roughness: 0.48 }),
    [0, 0.18, 0],
  );
  return bowl;
}

function createDogBed(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new RoundedBoxGeometry(1.72, 0.18, 1.2, 8, 0.18), material('#d7aa72'), [0.8, 0.18, -0.5]);
  addMesh(group, new RoundedBoxGeometry(1.28, 0.25, 0.84, 8, 0.2), material('#ead6b9'), [0.8, 0.36, -0.5]);
  addMesh(group, new RoundedBoxGeometry(0.74, 0.16, 0.62, 8, 0.17), material('#f2e4d1'), [0.62, 0.5, -0.54], undefined, [0, 0.16, 0]);
  return defineInteractive(group, 'nap', '강아지 방석', '포근한 방석에 몸을 말고 졸다가 스르르 잠들어요.', new THREE.Vector3(0.75, 0, -0.25));
}

function createBookshelf(): InteractivePropDefinition {
  const group = new THREE.Group();
  const wood = material('#82583a', { roughness: 0.82 });
  const darkWood = material('#63412d', { roughness: 0.86 });

  addMesh(group, new RoundedBoxGeometry(1.25, 1.78, 0.4, 5, 0.045), wood, [-4.1, 0.9, -1.75]);
  addMesh(group, new RoundedBoxGeometry(1.08, 1.58, 0.42, 4, 0.03), material('#6e4932'), [-4.1, 0.92, -1.72]);
  for (const y of [0.3, 0.84, 1.38]) {
    addMesh(group, new THREE.BoxGeometry(1.02, 0.07, 0.48), darkWood, [-4.1, y, -1.66]);
  }

  const colors = ['#b66b5f', '#7893a5', '#d2a455', '#7f9b77', '#aa7b9f', '#718b67'];
  colors.forEach((color, index) => {
    const row = index < 3 ? 0.58 : 1.12;
    const column = index % 3;
    const book = addMesh(
      group,
      new RoundedBoxGeometry(0.18, 0.42 + column * 0.035, 0.25, 3, 0.018),
      material(color),
      [-4.42 + column * 0.3, row, -1.48],
    );
    book.rotation.z = (column - 1) * 0.04;
  });
  return defineInteractive(group, 'read', '작은 책장', '그림책 표지를 하나씩 구경하며 고개를 갸웃해요.', new THREE.Vector3(-3.6, 0, -1.25));
}

function createToyChest(): InteractivePropDefinition {
  const group = new THREE.Group();
  const wood = material('#986a45', { roughness: 0.82 });
  const dark = material('#67442f', { roughness: 0.86 });
  addMesh(group, new RoundedBoxGeometry(1.38, 0.7, 0.82, 6, 0.08), wood, [1.9, 0.4, -1.65]);
  const lid = addMesh(group, new RoundedBoxGeometry(1.42, 0.14, 0.86, 6, 0.065), dark, [1.9, 0.82, -1.72]);
  lid.rotation.x = -0.16;
  addMesh(group, new THREE.TorusGeometry(0.11, 0.025, 7, 16, Math.PI), material('#c7a163'), [1.9, 0.48, -1.22], undefined, [0, 0, Math.PI]);
  addMesh(group, new THREE.SphereGeometry(0.13, 14, 10), material('#e39a72'), [1.55, 0.86, -1.7]);
  addMesh(group, new THREE.CapsuleGeometry(0.07, 0.34, 3, 7), material('#e5cb86'), [2.18, 0.89, -1.6], undefined, [0, 0, 0.8]);
  return defineInteractive(group, 'tidy', '나무 장난감 상자', '앞발로 장난감을 톡톡 밀어 상자에 정리해요.', new THREE.Vector3(1.35, 0, -1.1));
}

function createBall(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new THREE.SphereGeometry(0.3, 28, 20), material('#e58f6f', { roughness: 0.7 }), [4.55, 0.3, 1.8]);
  for (const rotation of [0, Math.PI / 2]) {
    addMesh(
      group,
      new THREE.TorusGeometry(0.215, 0.028, 8, 24),
      material('#f2d36b'),
      [4.55, 0.3, 1.8],
      undefined,
      [Math.PI / 2, rotation, 0],
    );
  }
  return defineInteractive(group, 'play', '공 장난감', '단비가 공을 앞발로 툭 치고 신나게 따라가요.', new THREE.Vector3(4.1, 0, 1.4));
}

function createWindowPlant(): InteractivePropDefinition {
  const group = new THREE.Group();
  addMesh(group, new THREE.LatheGeometry([
    new THREE.Vector2(0.2, 0),
    new THREE.Vector2(0.28, 0.07),
    new THREE.Vector2(0.3, 0.24),
    new THREE.Vector2(0.25, 0.35),
  ], 20), material('#8b644c', { roughness: 0.85 }), [1.85, 0.18, -2.25]);

  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const leaf = addMesh(
      group,
      new THREE.SphereGeometry(0.16, 14, 10),
      material(index % 2 ? '#6f9368' : '#7ba071'),
      [1.85 + Math.cos(angle) * 0.23, 0.54 + (index % 3) * 0.09, -2.25 + Math.sin(angle) * 0.16],
    );
    leaf.scale.set(0.58, 1.45, 0.5);
    leaf.rotation.z = Math.cos(angle) * 0.45;
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
