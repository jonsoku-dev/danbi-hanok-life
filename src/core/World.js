import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#efe6d7');
    this.scene.fog = new THREE.Fog('#efe6d7', 18, 32);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.defaultCameraPosition = new THREE.Vector3(12, 8.8, 14);
    this.defaultTarget = new THREE.Vector3(0.5, 1.1, 0);
    this.camera.position.copy(this.defaultCameraPosition);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 7;
    this.controls.maxDistance = 24;
    this.controls.minPolarAngle = Math.PI * 0.18;
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.target.copy(this.defaultTarget);

    this.clock = new THREE.Clock();
    this.mixers = [];
    this.updaters = [];

    this.addLights();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  addLights() {
    const hemi = new THREE.HemisphereLight('#fff3d8', '#7b6857', 2.35);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight('#ffdba2', 4.4);
    sun.position.set(8, 12, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    sun.shadow.bias = -0.00015;
    this.scene.add(sun);

    const indoor = new THREE.PointLight('#ffd79d', 16, 9, 2);
    indoor.position.set(-1.4, 3.2, -0.8);
    indoor.castShadow = true;
    indoor.shadow.mapSize.set(1024, 1024);
    this.scene.add(indoor);
  }

  add(object) { this.scene.add(object); }
  addUpdater(fn) { this.updaters.push(fn); }

  resetCamera() {
    this.camera.position.copy(this.defaultCameraPosition);
    this.controls.target.copy(this.defaultTarget);
    this.controls.update();
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const dt = Math.min(this.clock.getDelta(), 0.05);
      const t = this.clock.elapsedTime;
      this.controls.update();
      this.updaters.forEach((fn) => fn(dt, t));
      this.renderer.render(this.scene, this.camera);
    });
  }
}
