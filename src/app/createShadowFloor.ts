import * as THREE from 'three';

export function createShadowFloor(): THREE.Mesh {
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(9.5, 64),
    new THREE.ShadowMaterial({ color: '#6d5a49', opacity: 0.14 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.42;
  floor.receiveShadow = true;
  return floor;
}
