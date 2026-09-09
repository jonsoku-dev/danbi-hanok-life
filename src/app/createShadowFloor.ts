import * as THREE from 'three';

export function createShadowFloor(): THREE.Mesh {
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(10.8, 96),
    new THREE.MeshStandardMaterial({
      color: '#eadfcf',
      roughness: 1,
      metalness: 0,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0.8, -0.43, 0);
  floor.receiveShadow = true;
  return floor;
}
