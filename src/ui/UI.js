import { ACTIONS } from '../behaviors/ActionController.js';

export class UI {
  constructor(root, callbacks) {
    this.root = root;
    this.callbacks = callbacks;
    this.selected = null;
    this.toastTimer = null;
    this.render();
  }

  render() {
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

    this.statusText = this.root.querySelector('#statusText');
    this.autoBtn = this.root.querySelector('#autoBtn');
    this.contextCard = this.root.querySelector('#contextCard');
    this.contextTitle = this.root.querySelector('#contextTitle');
    this.contextDesc = this.root.querySelector('#contextDesc');
    this.contextAction = this.root.querySelector('#contextAction');
    this.toast = this.root.querySelector('#toast');

    this.root.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => this.callbacks.onAction(btn.dataset.action));
    });
    this.autoBtn.addEventListener('click', () => this.callbacks.onToggleAuto());
    this.root.querySelector('#cameraBtn').addEventListener('click', () => this.callbacks.onResetCamera());
    this.root.querySelector('#closeContext').addEventListener('click', () => this.hideContext());
    this.contextAction.addEventListener('click', () => {
      if (!this.selected) return;
      this.callbacks.onAction(this.selected.action);
      this.hideContext();
    });
  }

  setStatus(text) { this.statusText.textContent = text; }
  setAuto(enabled) {
    this.autoBtn.classList.toggle('active', enabled);
    this.autoBtn.textContent = enabled ? '잠시 멈춤' : '다시 시작';
    this.autoBtn.classList.toggle('primary', enabled);
  }
  showContext(data) {
    this.selected = data;
    this.contextTitle.textContent = data.title;
    this.contextDesc.textContent = data.description;
    this.contextAction.textContent = ACTIONS[data.action]?.label ?? '행동하기';
    this.contextCard.classList.add('visible');
  }
  hideContext() { this.contextCard.classList.remove('visible'); }
  showToast(text) {
    this.toast.textContent = text;
    this.toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.classList.remove('show'), 1400);
  }
}
