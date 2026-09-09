import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type WorldUpdater = (deltaSeconds: number, elapsedSeconds: number) => void;

export class World {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);

  private readonly renderer: THREE.WebGLRenderer;
  private readonly controls: OrbitControls;
  private readonly clock = new THREE.Clock();
  private readonly updaters = new Set<WorldUpdater>();
  private readonly defaultCameraPosition = new THREE.Vector3(11.6, 6.65, 13.4);
  private readonly defaultTarget = new THREE.Vector3(0.65, 1.05, -0.15);

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.scene.background = this.createBackgroundTexture();
    this.scene.fog = new THREE.Fog('#e9e1d4', 20, 35);
    this.camera.position.copy(this.defaultCameraPosition);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.AgXToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.minDistance = 7.5;
    this.controls.maxDistance = 23;
    this.controls.minPolarAngle = Math.PI * 0.19;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.controls.target.copy(this.defaultTarget);

    this.addLights();
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  add(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  addUpdater(updater: WorldUpdater): () => void {
    this.updaters.add(updater);
    return () => this.updaters.delete(updater);
  }

  resetCamera(): void {
    this.camera.position.copy(this.defaultCameraPosition);
    this.controls.target.copy(this.defaultTarget);
    this.controls.update();
  }

  start(): void {
    this.renderer.setAnimationLoop(() => {
      const deltaSeconds = Math.min(this.clock.getDelta(), 0.05);
      const elapsedSeconds = this.clock.elapsedTime;
      this.controls.update();
      for (const updater of this.updaters) updater(deltaSeconds, elapsedSeconds);
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop(): void {
    this.renderer.setAnimationLoop(null);
  }

  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.resize);
    this.controls.dispose();
    this.renderer.dispose();
  }

  private addLights(): void {
    const hemisphere = new THREE.HemisphereLight('#eaf6ff', '#80684f', 1.55);
    this.scene.add(hemisphere);

    const sun = new THREE.DirectionalLight('#ffe2b8', 3.35);
    sun.position.set(7.5, 11.5, 8.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -11;
    sun.shadow.camera.right = 11;
    sun.shadow.camera.top = 11;
    sun.shadow.camera.bottom = -11;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 30;
    sun.shadow.bias = -0.00015;
    sun.shadow.normalBias = 0.025;
    sun.shadow.radius = 2;
    this.scene.add(sun);

    const skyFill = new THREE.DirectionalLight('#c7e3f2', 0.9);
    skyFill.position.set(-7, 6, -5);
    this.scene.add(skyFill);

    const indoor = new THREE.PointLight('#ffd69b', 6.5, 8, 2);
    indoor.position.set(-1.5, 2.8, -1.55);
    this.scene.add(indoor);

    const porchBounce = new THREE.PointLight('#f7c985', 2.2, 7, 2);
    porchBounce.position.set(3.4, 1.2, 1.1);
    this.scene.add(porchBounce);
  }

  private createBackgroundTexture(): THREE.CanvasTexture {
    const background = document.createElement('canvas');
    background.width = 32;
    background.height = 256;
    const context = background.getContext('2d');
    if (!context) throw new Error('2D canvas context is unavailable.');

    const gradient = context.createLinearGradient(0, 0, 0, background.height);
    gradient.addColorStop(0, '#dce9ec');
    gradient.addColorStop(0.52, '#eee7dc');
    gradient.addColorStop(1, '#f2e6d3');
    context.fillStyle = gradient;
    context.fillRect(0, 0, background.width, background.height);

    const texture = new THREE.CanvasTexture(background);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  private readonly resize = (): void => {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };
}
