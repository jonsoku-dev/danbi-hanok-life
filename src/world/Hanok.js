import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const COLORS = {
  wood: '#8a5f3d', woodDark: '#5f402d', woodLight: '#b98254', hanji: '#f4ead7',
  floor: '#d6b483', stone: '#8d8a80', tile: '#4d514c', grass: '#99aa7a', earth: '#b89a72', pottery: '#86523c'
};

const m = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.86, ...extra });
function addMesh(group, geo, material, pos, scale = null, rot = null) {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(...pos);
  if (scale) mesh.scale.set(...scale);
  if (rot) mesh.rotation.set(...rot);
  mesh.castShadow = true; mesh.receiveShadow = true;
  group.add(mesh); return mesh;
}

export function createHanok() {
  const g = new THREE.Group();
  g.name = '미니 한옥';

  addMesh(g, new RoundedBoxGeometry(13, .35, 7.3, 6, .12), m(COLORS.earth), [0.8, -0.24, 0]);
  addMesh(g, new RoundedBoxGeometry(7.3, .22, 5.5, 5, .08), m(COLORS.floor), [-1.3, 0.02, 0]);
  addMesh(g, new RoundedBoxGeometry(2.25, .28, 5.7, 5, .08), m('#a8774e'), [3.45, .08, 0]);
  addMesh(g, new RoundedBoxGeometry(3.1, .18, 5.6, 5, .08), m(COLORS.grass), [6.1, -0.01, 0]);

  addMesh(g, new THREE.BoxGeometry(7.5, 3.4, .16), m('#e8dbc1'), [-1.25, 1.75, -2.75]);
  addMesh(g, new THREE.BoxGeometry(.16, 3.4, 5.5), m('#e8dbc1'), [-5, 1.75, 0]);

  const pillarGeo = new RoundedBoxGeometry(.22, 3.7, .22, 4, .04);
  [-4.85, -2.35, .1, 2.45].forEach((x) => addMesh(g, pillarGeo, m(COLORS.wood), [x,1.85,-2.62]));
  [-2.55,0,2.55].forEach((z) => addMesh(g, pillarGeo, m(COLORS.wood), [-4.86,1.85,z]));
  addMesh(g, new RoundedBoxGeometry(7.6,.23,.23,4,.04), m(COLORS.woodDark), [-1.25,3.45,-2.62]);
  addMesh(g, new RoundedBoxGeometry(.23,.23,5.55,4,.04), m(COLORS.woodDark), [-4.86,3.45,0]);

  for (let x = -4.8; x <= 3; x += .72) {
    addMesh(g, new THREE.BoxGeometry(.09,.11,6.2), m(COLORS.woodDark), [x,3.7,-.05]);
  }
  addMesh(g, new THREE.BoxGeometry(8.8,.22,3.5), m(COLORS.tile), [-1,4.05,-1.65], null, [0.18,0,0]);
  addMesh(g, new THREE.BoxGeometry(8.8,.22,3.5), m(COLORS.tile), [-1,4.05,1.65], null, [-0.18,0,0]);
  addMesh(g, new THREE.CylinderGeometry(.15,.15,8.9,8), m(COLORS.tile), [-1,4.38,0], null, [0,0,Math.PI/2]);

  for (let i = 0; i < 3; i++) {
    const x = -3.55 + i * 1.4;
    const frame = new THREE.Group();
    const panelMat = m(COLORS.hanji, { transparent: true, opacity: .82, side: THREE.DoubleSide });
    addMesh(frame, new THREE.PlaneGeometry(1.18,1.85), panelMat, [0,0,0]);
    [-.57,.57].forEach((px) => addMesh(frame,new THREE.BoxGeometry(.055,1.95,.055),m(COLORS.wood),[px,0,.03]));
    [-.9,0,.9].forEach((py) => addMesh(frame,new THREE.BoxGeometry(1.2,.045,.055),m(COLORS.woodLight),[0,py,.035]));
    frame.position.set(x,1.65,-2.64);
    g.add(frame);
  }

  const stoneMat = m(COLORS.stone);
  const stoneGeo = new RoundedBoxGeometry(.7,.45,.55,4,.08);
  for (let x=4.8; x<7.8; x+=.65) addMesh(g, stoneGeo, stoneMat, [x,.23,-3.1]);
  for (let x=4.8; x<7.8; x+=.65) addMesh(g, stoneGeo, stoneMat, [x,.23,3.1]);
  for (let z=-2.5; z<3; z+=.6) addMesh(g, stoneGeo, stoneMat, [8.0,.23,z], null, [0,Math.PI/2,0]);

  for (let i=0;i<5;i++) {
    const stone = addMesh(g,new THREE.CylinderGeometry(.42+.05*(i%2),.5,.12,9),stoneMat,[4.7+i*.63,.11,1.35-Math.sin(i)*.35]);
    stone.rotation.y = i*.55;
  }

  [5.3,6.1,6.9].forEach((x) => {
    addMesh(g,new THREE.CylinderGeometry(.32,.42,.7,16),m(COLORS.pottery),[x,.4,-1.95]);
    addMesh(g,new THREE.CylinderGeometry(.35,.35,.08,16),m('#4d3327'),[x,.79,-1.95]);
  });

  addMesh(g,new RoundedBoxGeometry(2.1,.2,1.2,4,.07),m(COLORS.woodLight),[6.5,.36,.2]);
  [[5.7,-.3],[7.3,-.3],[5.7,.7],[7.3,.7]].forEach(([x,z]) => addMesh(g,new THREE.BoxGeometry(.13,.48,.13),m(COLORS.woodDark),[x,.18,z]));

  [[5.1,2.1,'#d78f89'],[6.2,2.4,'#e0b95e'],[7.2,1.9,'#d98aaa']].forEach(([x,z,c]) => {
    addMesh(g,new THREE.CylinderGeometry(.05,.06,.65,7),m('#5f7f54'),[x,.42,z]);
    addMesh(g,new THREE.SphereGeometry(.22,12,8),m(c),[x,.78,z]);
  });

  return g;
}
