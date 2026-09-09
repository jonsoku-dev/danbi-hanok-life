import type { Object3D, Vector3 } from 'three';
import type { DanbiAnimation } from '../behaviors/types';

export interface Character {
  readonly object3d: Object3D;
  setAnimation(animation: DanbiAnimation): void;
  faceTowards(target: Vector3): void;
  update(deltaSeconds: number, elapsedSeconds: number): void;
}
