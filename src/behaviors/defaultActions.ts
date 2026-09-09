import { Vector3 } from 'three';
import type { ActionDefinition } from './types';

export const DEFAULT_ACTIONS = [
  { id: 'eat', label: '밥 먹기', animation: 'eat', duration: 5.4 },
  { id: 'drink', label: '물 마시기', animation: 'drink', duration: 4.6 },
  { id: 'play', label: '공놀이', animation: 'play', duration: 6.2 },
  { id: 'read', label: '책 구경하기', animation: 'read', duration: 5.6 },
  { id: 'nap', label: '낮잠 자기', animation: 'nap', duration: 8.5 },
  {
    id: 'run',
    label: '마당 뛰어다니기',
    animation: 'run',
    duration: 7.2,
    movement: {
      kind: 'waypoints',
      speed: 2.8,
      waypoints: [
        new Vector3(4.3, 0, -1.1),
        new Vector3(6.5, 0, -1.3),
        new Vector3(7.1, 0, 1.55),
        new Vector3(5.2, 0, 2),
        new Vector3(4.2, 0, 0.4),
      ],
    },
  },
  { id: 'tidy', label: '장난감 정리하기', animation: 'tidy', duration: 5.4 },
  { id: 'window', label: '창밖 구경하기', animation: 'window', duration: 6.4 },
  { id: 'shake', label: '몸 털기', animation: 'shake', duration: 2.4 },
  { id: 'sniff', label: '바닥 냄새 맡기', animation: 'sniff', duration: 4.8 },
] as const satisfies readonly ActionDefinition[];
