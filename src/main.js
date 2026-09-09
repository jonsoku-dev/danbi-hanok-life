import * as THREE from 'three';
import './styles.css';
import { World } from './core/World.js';
import { Danbi } from './characters/Danbi.js';
import { createHanok } from './world/Hanok.js';
import { createProps } from './world/Props.js';
import { ActionController } from './behaviors/ActionController.js';
import { UI } from './ui/UI.js';

const canvas = document.querySelector('#scene');
const world = new World(canvas);
const hanok = createHanok();
const danbi = new Danbi();
const { root: props, interactives, targets } = createProps();

world.add(hanok);
world.add(props);
world.add(danbi.group);

const shadowFloor = new THREE.Mesh(
  new THREE.CircleGeometry(9.5, 64),
  new THREE.ShadowMaterial({ color: '#6d5a49', opacity: .14 })
);
shadowFloor.rotation.x = -Math.PI / 2;
shadowFloor.position.y = -0.42;
shadowFloor.receiveShadow = true;
world.add(shadowFloor);

let autoEnabled = true;
let controller;
const ui = new UI(document.querySelector('#ui'), {
  onAction: (id) => {
    controller.requestAction(id);
    ui.showToast('단비에게 알려줬어요!');
  },
  onToggleAuto: () => {
    autoEnabled = !autoEnabled;
    controller.setAuto(autoEnabled);
    ui.setAuto(autoEnabled);
  },
  onResetCamera: () => {
    world.resetCamera();
    ui.showToast('처음 시점으로 돌아왔어요.');
  },
});

controller = new ActionController(danbi, targets, (text) => ui.setStatus(text));
world.addUpdater((dt, t) => {
  controller.update(dt);
  danbi.update(dt, t);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let down = null;

function getInteractive(object) {
  let node = object;
  while (node) {
    if (node.userData?.interactive) return node;
    node = node.parent;
  }
  return null;
}

function pick(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, world.camera);
  const hits = raycaster.intersectObjects(interactives, true);
  const selected = hits.length ? getInteractive(hits[0].object) : null;
  if (selected) {
    ui.showContext(selected.userData);
    canvas.style.cursor = 'pointer';
  } else {
    ui.hideContext();
  }
}

canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', (e) => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  if (moved < 6) pick(e);
  down = null;
});
canvas.addEventListener('pointermove', (e) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, world.camera);
  canvas.style.cursor = raycaster.intersectObjects(interactives, true).length ? 'pointer' : 'grab';
});

world.start();
