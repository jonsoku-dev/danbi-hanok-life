import type { Group, Object3D } from 'three';
import type { ActionId, ActionTargetMap } from '../behaviors/types';

export interface InteractiveMetadata {
  readonly interactive: true;
  readonly action: ActionId;
  readonly title: string;
  readonly description: string;
}

export interface PropCollection {
  readonly root: Group;
  readonly interactives: Object3D[];
  readonly targets: ActionTargetMap;
}
