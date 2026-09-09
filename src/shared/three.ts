import * as THREE from 'three';

export function standardMaterial(
  color: THREE.ColorRepresentation,
  parameters: Omit<THREE.MeshStandardMaterialParameters, 'color'> = {},
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.02,
    ...parameters,
  });
}

export function enableShadows(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}
