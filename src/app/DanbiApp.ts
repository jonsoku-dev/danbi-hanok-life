import { ActionController } from '../behaviors/ActionController';
import { ActionRegistry } from '../behaviors/ActionRegistry';
import { DEFAULT_ACTIONS } from '../behaviors/defaultActions';
import type { ActionId } from '../behaviors/types';
import { Danbi } from '../characters/Danbi';
import { World } from '../core/World';
import { InteractionController } from '../interactions/InteractionController';
import { UI } from '../ui/UI';
import { createHanok } from '../world/Hanok';
import { createProps } from '../world/Props';
import { createShadowFloor } from './createShadowFloor';

export class DanbiApp {
  private readonly world: World;
  private readonly danbi: Danbi;
  private readonly actions: ActionRegistry;
  private readonly controller: ActionController;
  private readonly ui: UI;
  private readonly interactions: InteractionController;

  constructor(canvas: HTMLCanvasElement, uiRoot: HTMLElement) {
    this.world = new World(canvas);
    this.danbi = new Danbi();
    this.actions = new ActionRegistry(DEFAULT_ACTIONS);

    const props = createProps();
    this.world.add(createHanok());
    this.world.add(props.root);
    this.world.add(this.danbi.object3d);
    this.world.add(createShadowFloor());

    this.ui = new UI(uiRoot, this.actions, {
      onAction: (id) => this.requestAction(id),
      onToggleAuto: () => this.toggleAuto(),
      onResetCamera: () => this.resetCamera(),
    });

    this.controller = new ActionController({
      character: this.danbi,
      registry: this.actions,
      targets: props.targets,
      onStatus: (message) => this.ui.setStatus(message),
    });

    this.interactions = new InteractionController({
      canvas,
      camera: this.world.camera,
      interactives: props.interactives,
      onSelect: (metadata) => this.ui.showContext(metadata),
      onClear: () => this.ui.hideContext(),
    });

    this.world.addUpdater((deltaSeconds, elapsedSeconds) => {
      this.controller.update(deltaSeconds);
      this.danbi.update(deltaSeconds, elapsedSeconds);
    });
  }

  start(): void {
    this.world.start();
  }

  dispose(): void {
    this.interactions.dispose();
    this.world.dispose();
  }

  private requestAction(id: ActionId): void {
    this.controller.requestAction(id);
    this.ui.showToast('단비에게 알려줬어요!');
  }

  private toggleAuto(): void {
    const next = !this.controller.isAutoEnabled();
    this.controller.setAuto(next);
    this.ui.setAuto(next);
  }

  private resetCamera(): void {
    this.world.resetCamera();
    this.ui.showToast('처음 시점으로 돌아왔어요.');
  }
}
