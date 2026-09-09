import type { ActionDefinition, ActionId } from './types';

export class ActionRegistry {
  private readonly actions = new Map<ActionId, ActionDefinition>();

  constructor(definitions: readonly ActionDefinition[] = []) {
    definitions.forEach((definition) => this.register(definition));
  }

  register(definition: ActionDefinition): this {
    if (this.actions.has(definition.id)) {
      throw new Error(`Action "${definition.id}" is already registered.`);
    }
    this.actions.set(definition.id, definition);
    return this;
  }

  get(id: ActionId): ActionDefinition {
    const action = this.actions.get(id);
    if (!action) throw new Error(`Unknown action: ${id}`);
    return action;
  }

  has(id: ActionId): boolean {
    return this.actions.has(id);
  }

  list(): readonly ActionDefinition[] {
    return [...this.actions.values()];
  }

  pickRandom(exclude?: ActionId): ActionDefinition {
    const candidates = this.list().filter((action) => action.id !== exclude);
    if (candidates.length === 0) throw new Error('No actions are registered.');
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    if (!selected) throw new Error('Failed to select an action.');
    return selected;
  }
}
