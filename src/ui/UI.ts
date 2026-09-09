import { ActionRegistry } from '../behaviors/ActionRegistry';
import type { ActionId } from '../behaviors/types';
import type { InteractiveMetadata } from '../world/types';

export interface UICallbacks {
  readonly onAction: (id: ActionId) => void;
  readonly onToggleAuto: () => void;
  readonly onResetCamera: () => void;
}

export class UI {
  private selected: InteractiveMetadata | null = null;
  private toastTimer: number | undefined;

  private statusText!: HTMLElement;
  private autoButton!: HTMLButtonElement;
  private contextCard!: HTMLElement;
  private contextTitle!: HTMLElement;
  private contextDescription!: HTMLElement;
  private contextAction!: HTMLButtonElement;
  private toast!: HTMLElement;

  constructor(
    private readonly root: HTMLElement,
    private readonly actions: ActionRegistry,
    private readonly callbacks: UICallbacks,
  ) {
    this.render();
  }

  setStatus(text: string): void {
    this.statusText.textContent = text;
  }

  setAuto(enabled: boolean): void {
    this.autoButton.classList.toggle('active', enabled);
    this.autoButton.textContent = enabled ? '잠시 멈춤' : '다시 시작';
    this.autoButton.classList.toggle('primary', enabled);
  }

  showContext(metadata: InteractiveMetadata): void {
    this.selected = metadata;
    this.contextTitle.textContent = metadata.title;
    this.contextDescription.textContent = metadata.description;
    this.contextAction.textContent = this.actions.get(metadata.action).label;
    this.contextCard.classList.add('visible');
  }

  hideContext(): void {
    this.contextCard.classList.remove('visible');
  }

  showToast(text: string): void {
    this.toast.textContent = text;
    this.toast.classList.add('show');
    if (this.toastTimer !== undefined) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove('show'), 1400);
  }

  private render(): void {
    this.root.innerHTML = `
      <div class="ui-root">
        <div class="card topbar">
          <div class="brand-row">
            <div class="paw">🐾</div>
            <div><h1 class="title">단비의 하루</h1><p class="subtitle">작은 한옥에서 보내는 포근한 오후</p></div>
          </div>
          <div class="status"><span class="status-dot"></span><span id="statusText">단비가 창밖을 구경하러 가요.</span></div>
          <div class="controls">
            <button class="ui-btn warm" data-action="eat">밥 먹기</button>
            <button class="ui-btn" data-action="play">공놀이</button>
            <button class="ui-btn" data-action="nap">낮잠 자기</button>
            <button class="ui-btn" data-action="run">마당 뛰기</button>
            <button class="ui-btn primary active" id="autoBtn">잠시 멈춤</button>
            <button class="ui-btn" id="cameraBtn">카메라 초기화</button>
          </div>
        </div>
        <div class="bottom-row">
          <div class="card help-card">드래그해서 둘러보고 · 스크롤/핀치로 확대 · 가구를 눌러 단비의 행동을 골라보세요.</div>
          <div class="card context-card" id="contextCard">
            <div class="context-kicker">단비와 상호작용</div>
            <h2 class="context-title" id="contextTitle"></h2>
            <p class="context-desc" id="contextDesc"></p>
            <div class="context-actions"><button class="ui-btn primary" id="contextAction"></button><button class="ui-btn" id="closeContext">닫기</button></div>
          </div>
        </div>
      </div>
      <div class="toast" id="toast"></div>
    `;

    this.statusText = this.requireElement('#statusText');
    this.autoButton = this.requireElement<HTMLButtonElement>('#autoBtn');
    this.contextCard = this.requireElement('#contextCard');
    this.contextTitle = this.requireElement('#contextTitle');
    this.contextDescription = this.requireElement('#contextDesc');
    this.contextAction = this.requireElement<HTMLButtonElement>('#contextAction');
    this.toast = this.requireElement('#toast');

    this.root.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.action as ActionId | undefined;
        if (id && this.actions.has(id)) this.callbacks.onAction(id);
      });
    });
    this.autoButton.addEventListener('click', this.callbacks.onToggleAuto);
    this.requireElement<HTMLButtonElement>('#cameraBtn').addEventListener('click', this.callbacks.onResetCamera);
    this.requireElement<HTMLButtonElement>('#closeContext').addEventListener('click', () => this.hideContext());
    this.contextAction.addEventListener('click', () => {
      if (!this.selected) return;
      this.callbacks.onAction(this.selected.action);
      this.hideContext();
    });
  }

  private requireElement<T extends HTMLElement = HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) throw new Error(`UI element not found: ${selector}`);
    return element;
  }
}
