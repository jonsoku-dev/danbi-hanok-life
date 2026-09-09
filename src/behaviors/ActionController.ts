import type { Vector3 } from 'three';
import type { Character } from '../characters/Character';
import { ActionRegistry } from './ActionRegistry';
import type { ActionDefinition, ActionId, ActionTargetMap } from './types';

type ActionPhase = 'idle' | 'moving' | 'performing';
type StatusListener = (message: string) => void;

export interface ActionControllerOptions {
  readonly character: Character;
  readonly registry: ActionRegistry;
  readonly targets: ActionTargetMap;
  readonly onStatus?: StatusListener;
}

export class ActionController {
  private readonly character: Character;
  private readonly registry: ActionRegistry;
  private readonly targets: ActionTargetMap;
  private readonly onStatus?: StatusListener;

  private autoEnabled = true;
  private currentActionId: ActionId | null = null;
  private previousActionId: ActionId | undefined;
  private phase: ActionPhase = 'idle';
  private elapsed = 0;
  private idleDelay = 1.4;
  private waypointIndex = 0;

  constructor(options: ActionControllerOptions) {
    this.character = options.character;
    this.registry = options.registry;
    this.targets = options.targets;
    this.onStatus = options.onStatus;
    this.requestAction('window');
  }

  isAutoEnabled(): boolean {
    return this.autoEnabled;
  }

  setAuto(enabled: boolean): void {
    this.autoEnabled = enabled;
    if (enabled && !this.currentActionId) this.idleDelay = 0.4;
    this.onStatus?.(enabled ? '자동 행동을 다시 시작했어요.' : '자동 행동을 잠시 멈췄어요.');
  }

  requestAction(id: ActionId): void {
    if (!this.registry.has(id)) return;
    const action = this.registry.get(id);
    this.currentActionId = id;
    this.phase = action.movement?.kind === 'none' ? 'performing' : 'moving';
    this.elapsed = 0;
    this.waypointIndex = 0;

    if (this.phase === 'performing') {
      this.character.setAnimation(action.animation);
      this.onStatus?.(`${action.label} 하는 중`);
    } else {
      this.onStatus?.(`${action.label} 하러 가는 중…`);
    }
  }

  update(deltaSeconds: number): void {
    if (!this.currentActionId) {
      this.updateIdle(deltaSeconds);
      return;
    }

    const action = this.registry.get(this.currentActionId);
    if (this.phase === 'moving') {
      this.updateMoving(action, deltaSeconds);
      return;
    }

    this.updatePerforming(action, deltaSeconds);
  }

  private updateIdle(deltaSeconds: number): void {
    this.character.setAnimation('idle');
    if (!this.autoEnabled) return;
    this.idleDelay -= deltaSeconds;
    if (this.idleDelay <= 0) {
      this.requestAction(this.registry.pickRandom(this.previousActionId).id);
    }
  }

  private updateMoving(action: ActionDefinition, deltaSeconds: number): void {
    const target = this.getInitialTarget(action);
    const speed = this.getMovementSpeed(action, 1.45);

    if (!target || this.moveToward(target, deltaSeconds, speed)) {
      this.phase = 'performing';
      this.elapsed = 0;
      this.character.setAnimation(action.animation);
      this.onStatus?.(`${action.label} 하는 중`);
    }
  }

  private updatePerforming(action: ActionDefinition, deltaSeconds: number): void {
    this.elapsed += deltaSeconds;

    if (action.movement?.kind === 'waypoints') {
      this.followWaypoints(action, deltaSeconds);
    } else {
      this.character.setAnimation(action.animation);
    }

    if (this.elapsed >= action.duration) this.finishCurrentAction(action);
  }

  private getInitialTarget(action: ActionDefinition): Vector3 | undefined {
    if (action.movement?.kind === 'waypoints') return action.movement.waypoints[0];
    if (action.movement?.kind === 'none') return undefined;
    return this.targets[action.id];
  }

  private getMovementSpeed(action: ActionDefinition, fallback: number): number {
    return action.movement?.kind === 'target' || action.movement?.kind === 'waypoints'
      ? action.movement.speed ?? fallback
      : fallback;
  }

  private followWaypoints(action: ActionDefinition, deltaSeconds: number): void {
    if (action.movement?.kind !== 'waypoints' || action.movement.waypoints.length === 0) return;
    const waypoint = action.movement.waypoints[this.waypointIndex];
    if (!waypoint) {
      this.waypointIndex = 0;
      return;
    }

    if (this.moveToward(waypoint, deltaSeconds, action.movement.speed ?? 2.8)) {
      this.waypointIndex = (this.waypointIndex + 1) % action.movement.waypoints.length;
    }
    this.character.setAnimation(action.animation);
  }

  private moveToward(target: Vector3, deltaSeconds: number, speed: number): boolean {
    const position = this.character.object3d.position;
    const delta = target.clone().sub(position);
    const distance = delta.length();
    if (distance < 0.08) return true;

    delta.normalize();
    position.addScaledVector(delta, Math.min(speed * deltaSeconds, distance));
    this.character.faceTowards(target);
    this.character.setAnimation(speed > 2 ? 'run' : 'walk');
    return false;
  }

  private finishCurrentAction(action: ActionDefinition): void {
    this.previousActionId = action.id;
    this.currentActionId = null;
    this.phase = 'idle';
    this.idleDelay = 1.2 + Math.random() * 2.2;
    this.character.setAnimation(Math.random() < 0.18 ? 'yawn' : 'idle');
    this.onStatus?.(`${action.label} 끝! 다음엔 뭘 할까?`);
  }
}
