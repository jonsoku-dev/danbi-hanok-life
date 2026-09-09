import * as THREE from 'three';

const CREAM = '#f5e8cc';
const CREAM_DARK = '#e6d2ae';
const SKY = '#bcddea';
const YELLOW = '#f3cc5c';
const DARK = '#2d2926';

function mat(color, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

function mesh(geometry, material, cast = true) {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}

export class Danbi {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = '단비';
    this.group.position.set(-0.4, 0, 0.4);
    this.group.rotation.y = 0;
    this.animState = 'idle';
    this.stateTime = 0;
    this.parts = {};
    this.build();
  }

  build() {
    const body = mesh(new THREE.SphereGeometry(0.78, 32, 22), mat(CREAM));
    body.scale.set(0.86, 1.02, 0.72);
    body.position.y = 1.18;
    this.group.add(body);
    this.parts.body = body;

    const chest = mesh(new THREE.SphereGeometry(0.63, 28, 20), mat(SKY));
    chest.scale.set(0.92, 0.9, 0.78);
    chest.position.set(0, 1.18, 0.05);
    chest.material.roughness = 0.72;
    this.group.add(chest);
    this.parts.vest = chest;

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.85, 0.08);
    this.group.add(headPivot);
    this.parts.headPivot = headPivot;

    const head = mesh(new THREE.SphereGeometry(0.72, 32, 24), mat(CREAM));
    head.scale.set(0.95, 0.92, 0.9);
    headPivot.add(head);

    const muzzle = mesh(new THREE.SphereGeometry(0.36, 24, 18), mat('#f9edda'));
    muzzle.scale.set(0.92, 0.62, 0.7);
    muzzle.position.set(0, -0.14, 0.6);
    headPivot.add(muzzle);

    const nose = mesh(new THREE.SphereGeometry(0.11, 18, 14), mat(DARK, 0.42));
    nose.scale.set(1.15, 0.7, 0.8);
    nose.position.set(0, -0.08, 0.87);
    headPivot.add(nose);

    const mouth = mesh(new THREE.SphereGeometry(0.13, 16, 10), mat('#5b3b36', 0.55));
    mouth.scale.set(1.0, 0.18, 0.5);
    mouth.position.set(0, -0.31, 0.75);
    headPivot.add(mouth);
    this.parts.mouth = mouth;

    const tongue = mesh(new THREE.SphereGeometry(0.08, 14, 8), mat('#dd8f91', 0.75));
    tongue.scale.set(0.9, 0.25, 0.7);
    tongue.position.set(0, -0.34, 0.79);
    tongue.visible = false;
    headPivot.add(tongue);
    this.parts.tongue = tongue;

    const eyeGeo = new THREE.SphereGeometry(0.095, 18, 14);
    const eyeMat = mat('#24201d', 0.35);
    const leftEye = mesh(eyeGeo, eyeMat);
    const rightEye = mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.26, 0.13, 0.59);
    rightEye.position.set(0.26, 0.13, 0.59);
    headPivot.add(leftEye, rightEye);
    this.parts.eyes = [leftEye, rightEye];

    const earGeo = new THREE.ConeGeometry(0.25, 0.55, 4);
    const earMat = mat(CREAM_DARK);
    const leftEar = mesh(earGeo, earMat);
    const rightEar = mesh(earGeo, earMat);
    leftEar.position.set(-0.43, 0.53, 0.04);
    rightEar.position.set(0.43, 0.53, 0.04);
    leftEar.rotation.z = -0.15;
    rightEar.rotation.z = 0.15;
    headPivot.add(leftEar, rightEar);
    this.parts.ears = [leftEar, rightEar];

    const scarf = mesh(new THREE.TorusGeometry(0.44, 0.09, 10, 28), mat(YELLOW));
    scarf.position.set(0, -0.48, 0.08);
    scarf.rotation.x = Math.PI / 2;
    headPivot.add(scarf);
    const scarfTip = mesh(new THREE.ConeGeometry(0.12, 0.34, 3), mat(YELLOW));
    scarfTip.position.set(0.22, -0.65, 0.4);
    scarfTip.rotation.z = -0.34;
    headPivot.add(scarfTip);

    const legGeo = new THREE.CapsuleGeometry(0.17, 0.45, 5, 10);
    const legMat = mat(CREAM);
    const pawMat = mat('#f4dec0');
    this.parts.legs = [];
    [[-0.34,0.55,0.3],[0.34,0.55,0.3],[-0.35,0.55,-0.28],[0.35,0.55,-0.28]].forEach(([x,y,z], i) => {
      const leg = mesh(legGeo, legMat);
      leg.position.set(x,y,z);
      leg.rotation.z = i % 2 ? -0.03 : 0.03;
      const paw = mesh(new THREE.SphereGeometry(0.21, 18, 12), pawMat);
      paw.scale.set(1.05, 0.62, 1.3);
      paw.position.y = -0.35;
      leg.add(paw);
      this.group.add(leg);
      this.parts.legs.push(leg);
    });

    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(0.48,0.12,-0.02),
      new THREE.Vector3(0.65,0.5,0.06),
      new THREE.Vector3(0.35,0.72,0.18),
      new THREE.Vector3(0.08,0.58,0.2),
    ]);
    const tail = mesh(new THREE.TubeGeometry(tailCurve, 18, 0.13, 9, false), mat(CREAM_DARK));
    tail.position.set(0.46, 1.15, -0.5);
    tail.rotation.y = -0.35;
    this.group.add(tail);
    this.parts.tail = tail;

    this.group.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  setAnimation(state) {
    if (this.animState === state) return;
    this.animState = state;
    this.stateTime = 0;
  }

  faceTowards(target) {
    const dir = target.clone().sub(this.group.position);
    if (dir.lengthSq() < 0.001) return;
    this.group.rotation.y = Math.atan2(dir.x, dir.z);
  }

  update(dt, t) {
    this.stateTime += dt;
    const s = this.stateTime;
    const ears = this.parts.ears;
    const head = this.parts.headPivot;
    const body = this.parts.body;
    const tail = this.parts.tail;
    const legs = this.parts.legs;

    tail.rotation.z = Math.sin(t * 5.2) * 0.22;
    ears[0].rotation.z = -0.15 + Math.sin(t * 2.1) * 0.035;
    ears[1].rotation.z = 0.15 - Math.sin(t * 2.0 + 0.4) * 0.035;
    head.rotation.z *= 0.88;
    head.rotation.x *= 0.88;
    body.scale.y += (1.02 - body.scale.y) * 0.18;

    const blink = (t % 4.8) > 4.62;
    const idleYawn = this.animState === 'idle' && (t % 18) > 16.7;
    this.parts.eyes.forEach((eye) => { eye.scale.y = blink || idleYawn ? 0.12 : 1; });
    this.parts.mouth.scale.y = idleYawn ? 1.05 : 0.18;
    this.parts.tongue.visible = idleYawn;
    if (idleYawn) head.rotation.x = -0.16;

    legs.forEach((leg, i) => {
      leg.rotation.x *= 0.75;
      if (['walk','run'].includes(this.animState)) {
        const speed = this.animState === 'run' ? 11 : 7;
        leg.rotation.x = Math.sin(t * speed + i * Math.PI) * (this.animState === 'run' ? 0.42 : 0.24);
      }
    });

    switch (this.animState) {
      case 'eat':
      case 'drink':
      case 'sniff':
        head.rotation.x = 0.55 + Math.sin(s * 5) * 0.06;
        head.position.y = 1.8;
        break;
      case 'play':
        head.rotation.z = Math.sin(s * 4) * 0.14;
        body.scale.y = 0.96 + Math.abs(Math.sin(s * 5)) * 0.08;
        legs[0].rotation.x = -0.55 + Math.sin(s * 5) * 0.12;
        break;
      case 'read':
        head.rotation.x = 0.22;
        head.rotation.z = Math.sin(s * 1.5) * 0.07;
        break;
      case 'nap': {
        head.rotation.z = -0.38;
        head.position.y = 1.67;
        body.scale.y = 0.82;
        const sleepy = Math.min(1, s / 1.2);
        this.parts.eyes.forEach((eye) => { eye.scale.y = 1 - sleepy * 0.9; });
        break;
      }
      case 'tidy':
        head.rotation.x = 0.25;
        legs[0].rotation.x = -0.7 + Math.sin(s * 4.6) * 0.22;
        break;
      case 'window':
        head.rotation.z = 0.18 + Math.sin(s * 1.2) * 0.05;
        break;
      case 'shake':
        head.rotation.z = Math.sin(s * 24) * 0.2;
        body.rotation.z = Math.sin(s * 22) * 0.08;
        ears[0].rotation.z = -0.15 + Math.sin(s * 25) * 0.28;
        ears[1].rotation.z = 0.15 - Math.sin(s * 25) * 0.28;
        break;
      case 'yawn':
        head.rotation.x = -0.18;
        head.rotation.z = 0.12;
        break;
      default:
        head.position.y += (1.85 - head.position.y) * 0.12;
        body.rotation.z *= 0.85;
    }
  }
}
