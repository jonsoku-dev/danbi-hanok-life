import * as THREE from 'three';
import type { ActionId } from '../../behaviors/types';
import { enableShadows, standardMaterial } from '../../shared/three';
import type { InteractiveMetadata } from '../types';

export type Vec3 = readonly [number, number, number];

export function material(
  color: THREE.ColorRepresentation,
  parameters: Omit<THREE.MeshStandardMaterialParameters, 'color'> = {},
): THREE.MeshStandardMaterial {
  return standardMaterial(color, { roughness: 0.82, ...parameters });
}

export function addMesh(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  meshMaterial: THREE.Material,
  position: Vec3,
  scale?: Vec3,
  rotation?: Vec3,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, meshMaterial);
  mesh.position.set(...position);
  if (scale) mesh.scale.set(...scale);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

export function makeInteractive(
  group: THREE.Group,
  metadata: Omit<InteractiveMetadata, 'interactive'> & { action: ActionId },
): THREE.Group {
  group.userData = {
    ...group.userData,
    ...metadata,
    interactive: true,
  } satisfies InteractiveMetadata;
  enableShadows(group);
  return group;
}
