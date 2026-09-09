import * as THREE from 'three';
import type { ActionTargetMap } from '../behaviors/types';
import { createDecorativeProps } from './props/decorativeProps';
import { INTERACTIVE_PROP_FACTORIES } from './props/interactiveProps';
import type { PropCollection } from './types';

export function createProps(): PropCollection {
  const root = new THREE.Group();
  root.name = '생활 가구와 소품';
  const interactives: THREE.Object3D[] = [];
  const targets: ActionTargetMap = {
    sniff: new THREE.Vector3(-0.8, 0, 1.45),
    shake: new THREE.Vector3(2.8, 0, 0.6),
    run: new THREE.Vector3(5.4, 0, 0.8),
  };

  root.add(createDecorativeProps());

  INTERACTIVE_PROP_FACTORIES.forEach((factory) => {
    const definition = factory();
    root.add(definition.object);
    interactives.push(definition.object);
    targets[definition.action] = definition.target;
  });

  return { root, interactives, targets };
}
