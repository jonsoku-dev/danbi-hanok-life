import type { Vector3 } from 'three';

type KnownActionId =
  | 'eat'
  | 'drink'
  | 'play'
  | 'read'
  | 'nap'
  | 'run'
  | 'tidy'
  | 'window'
  | 'shake'
  | 'sniff';

export type ActionId = KnownActionId | (string & {});

type KnownDanbiAnimation =
  | 'idle'
  | 'walk'
  | 'run'
  | 'eat'
  | 'drink'
  | 'play'
  | 'read'
  | 'nap'
  | 'tidy'
  | 'window'
  | 'shake'
  | 'sniff'
  | 'yawn';

export type DanbiAnimation = KnownDanbiAnimation | (string & {});

type ActionMovement =
  | { readonly kind: 'target'; readonly speed?: number }
  | { readonly kind: 'waypoints'; readonly speed?: number; readonly waypoints: readonly Vector3[] }
  | { readonly kind: 'none' };

export interface ActionDefinition {
  readonly id: ActionId;
  readonly label: string;
  readonly animation: DanbiAnimation;
  readonly duration: number;
  readonly movement?: ActionMovement;
}

export type ActionTargetMap = Partial<Record<ActionId, Vector3>>;
