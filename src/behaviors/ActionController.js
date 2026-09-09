import * as THREE from 'three';

export const ACTIONS = {
  eat: { label: '밥 먹기', anim: 'eat', duration: 5.4 },
  drink: { label: '물 마시기', anim: 'drink', duration: 4.6 },
  play: { label: '공놀이', anim: 'play', duration: 6.2 },
  read: { label: '책 구경하기', anim: 'read', duration: 5.6 },
  nap: { label: '낮잠 자기', anim: 'nap', duration: 8.5 },
  run: { label: '마당 뛰어다니기', anim: 'run', duration: 7.2 },
  tidy: { label: '장난감 정리하기', anim: 'tidy', duration: 5.4 },
  window: { label: '창밖 구경하기', anim: 'window', duration: 6.4 },
  shake: { label: '몸 털기', anim: 'shake', duration: 2.4 },
  sniff: { label: '바닥 냄새 맡기', anim: 'sniff', duration: 4.8 },
};

export class ActionController {
  constructor(danbi, targets, onStatus) {
    this.danbi = danbi;
    this.targets = targets;
    this.onStatus = onStatus;
    this.auto = true;
    this.current = null;
    this.phase = 'idle';
    this.elapsed = 0;
    this.idleDelay = 1.4;
    this.runWaypoints = [
      new THREE.Vector3(4.3,0,-1.1), new THREE.Vector3(6.5,0,-1.3),
      new THREE.Vector3(7.1,0,1.55), new THREE.Vector3(5.2,0,2.0),
      new THREE.Vector3(4.2,0,.4)
    ];
    this.runIndex = 0;
    this.requestAction('window');
  }

  setAuto(enabled) {
    this.auto = enabled;
    if (enabled && !this.current) this.idleDelay = .4;
    this.onStatus?.(enabled ? '자동 행동을 다시 시작했어요.' : '자동 행동을 잠시 멈췄어요.');
  }

  requestAction(id) {
    if (!ACTIONS[id]) return;
    this.current = id;
    this.phase = 'moving';
    this.elapsed = 0;
    this.runIndex = 0;
    this.onStatus?.(`${ACTIONS[id].label} 하러 가는 중…`);
  }

  pickRandom() {
    const ids = Object.keys(ACTIONS).filter((id) => id !== this.current);
    return ids[Math.floor(Math.random() * ids.length)];
  }

  moveToward(target, dt, speed = 1.5) {
    const pos = this.danbi.group.position;
    const delta = target.clone().sub(pos);
    const dist = delta.length();
    if (dist < .08) return true;
    delta.normalize();
    pos.addScaledVector(delta, Math.min(speed * dt, dist));
    this.danbi.faceTowards(target);
    this.danbi.setAnimation(speed > 2 ? 'run' : 'walk');
    return false;
  }

  update(dt) {
    if (!this.current) {
      this.danbi.setAnimation('idle');
      if (!this.auto) return;
      this.idleDelay -= dt;
      if (this.idleDelay <= 0) this.requestAction(this.pickRandom());
      return;
    }

    const action = ACTIONS[this.current];
    let target = this.targets[this.current];

    if (this.phase === 'moving') {
      if (this.current === 'run') target = this.runWaypoints[0];
      if (!target || this.moveToward(target, dt, this.current === 'run' ? 2.6 : 1.45)) {
        this.phase = 'performing';
        this.elapsed = 0;
        this.danbi.setAnimation(action.anim);
        this.onStatus?.(`${action.label} 하는 중`);
      }
      return;
    }

    this.elapsed += dt;
    if (this.current === 'run') {
      const next = this.runWaypoints[this.runIndex];
      if (this.moveToward(next, dt, 2.8)) this.runIndex = (this.runIndex + 1) % this.runWaypoints.length;
      this.danbi.setAnimation('run');
    } else {
      this.danbi.setAnimation(action.anim);
    }

    if (this.elapsed >= action.duration) {
      const completed = action.label;
      this.current = null;
      this.phase = 'idle';
      this.idleDelay = 1.2 + Math.random() * 2.2;
      this.danbi.setAnimation(Math.random() < .18 ? 'yawn' : 'idle');
      this.onStatus?.(`${completed} 끝! 다음엔 뭘 할까?`);
    }
  }
}
