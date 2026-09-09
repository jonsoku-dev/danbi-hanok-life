import { Raycaster, Vector2, type Camera, type Object3D } from 'three';
import type { InteractiveMetadata } from '../world/types';

export interface InteractionControllerOptions {
  readonly canvas: HTMLCanvasElement;
  readonly camera: Camera;
  readonly interactives: Object3D[];
  readonly onSelect: (metadata: InteractiveMetadata) => void;
  readonly onClear: () => void;
}

interface PointerDownPosition {
  readonly x: number;
  readonly y: number;
}

export class InteractionController {
  private readonly canvas: HTMLCanvasElement;
  private readonly camera: Camera;
  private readonly interactives: Object3D[];
  private readonly onSelect: (metadata: InteractiveMetadata) => void;
  private readonly onClear: () => void;
  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();
  private down: PointerDownPosition | null = null;

  constructor(options: InteractionControllerOptions) {
    this.canvas = options.canvas;
    this.camera = options.camera;
    this.interactives = options.interactives;
    this.onSelect = options.onSelect;
    this.onClear = options.onClear;
    this.bindEvents();
  }

  dispose(): void {
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    this.down = { x: event.clientX, y: event.clientY };
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    if (!this.down) return;
    const moved = Math.hypot(event.clientX - this.down.x, event.clientY - this.down.y);
    if (moved < 6) this.pick(event);
    this.down = null;
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    this.updateRay(event);
    this.canvas.style.cursor = this.raycaster.intersectObjects(this.interactives, true).length
      ? 'pointer'
      : 'grab';
  };

  private bindEvents(): void {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
  }

  private pick(event: PointerEvent): void {
    this.updateRay(event);
    const hit = this.raycaster.intersectObjects(this.interactives, true)[0];
    const selected = hit ? this.findInteractiveParent(hit.object) : null;

    if (!selected) {
      this.onClear();
      return;
    }

    this.onSelect(selected);
    this.canvas.style.cursor = 'pointer';
  }

  private updateRay(event: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
  }

  private findInteractiveParent(object: Object3D): InteractiveMetadata | null {
    let node: Object3D | null = object;
    while (node) {
      if (this.isInteractiveMetadata(node.userData)) return node.userData;
      node = node.parent;
    }
    return null;
  }

  private isInteractiveMetadata(value: unknown): value is InteractiveMetadata {
    if (typeof value !== 'object' || value === null) return false;
    const data = value as Record<string, unknown>;
    return (
      data.interactive === true &&
      typeof data.action === 'string' &&
      typeof data.title === 'string' &&
      typeof data.description === 'string'
    );
  }
}
