import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .82, ...extra });
const attachAction = (object, action, title, description) => {
  object.userData.interactive = true;
  object.userData.action = action;
  object.userData.title = title;
  object.userData.description = description;
  object.traverse((o) => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });
  return object;
};
const add = (g, geo, material, p, s = null, r = null) => {
  const x = new THREE.Mesh(geo, material); x.position.set(...p);
  if (s) x.scale.set(...s); if (r) x.rotation.set(...r);
  x.castShadow = true; x.receiveShadow = true; g.add(x); return x;
};

export function createProps() {
  const root = new THREE.Group();
  const interactives = [];
  const targets = {};

  const table = new THREE.Group();
  add(table,new RoundedBoxGeometry(1.7,.12,1.0,4,.06),mat('#a8754d'),[-2.2,.65,.7]);
  [[-2.85,.45,.32],[-1.55,.45,.32],[-2.85,.45,1.08],[-1.55,.45,1.08]].forEach(p=>add(table,new THREE.BoxGeometry(.1,.42,.1),mat('#6b4934'),p));
  root.add(table);

  const food = new THREE.Group();
  add(food,new THREE.CylinderGeometry(.33,.26,.18,24),mat('#e9e0d4'),[-2.55,.82,.72]);
  add(food,new THREE.CylinderGeometry(.25,.25,.03,24),mat('#9a684e'),[-2.55,.925,.72]);
  attachAction(food,'eat','도자기 밥그릇','단비가 낮은 밥상 앞에 앉아 냠냠 밥을 먹어요.');
  root.add(food); interactives.push(food); targets.eat = new THREE.Vector3(-2.55,0,1.35);

  const water = new THREE.Group();
  add(water,new THREE.CylinderGeometry(.32,.26,.18,24),mat('#d9e8ed'),[-1.85,.82,.72]);
  add(water,new THREE.CylinderGeometry(.24,.24,.025,24),mat('#83b8cb',{metalness:.05}),[-1.85,.925,.72]);
  attachAction(water,'drink','물그릇','혀를 살짝 내밀고 물을 마시는 단비를 볼 수 있어요.');
  root.add(water); interactives.push(water); targets.drink = new THREE.Vector3(-1.85,0,1.35);

  const bed = new THREE.Group();
  add(bed,new RoundedBoxGeometry(1.65,.16,1.15,7,.18),mat('#e6be8a'),[.8,.18,-.5]);
  add(bed,new RoundedBoxGeometry(1.15,.24,.82,7,.2),mat('#e8d3b8'),[.8,.37,-.5]);
  attachAction(bed,'nap','강아지 방석','포근한 방석에 몸을 말고 졸다가 스르르 잠들어요.');
  root.add(bed); interactives.push(bed); targets.nap = new THREE.Vector3(.75,0,-.25);

  const shelf = new THREE.Group();
  add(shelf,new RoundedBoxGeometry(1.25,1.75,.4,4,.05),mat('#875c3e'),[-4.1,.9,-1.75]);
  [0.25,.85,1.45].forEach(y=>add(shelf,new THREE.BoxGeometry(1.08,.07,.45),mat('#6f4b35'),[-4.1,y,-1.75]));
  ['#b66b5f','#7893a5','#d2a455','#7f9b77'].forEach((c,i)=>add(shelf,new THREE.BoxGeometry(.16,.5,.27),mat(c),[-4.48+i*.25,.55,-1.5]));
  attachAction(shelf,'read','작은 책장','그림책 표지를 하나씩 구경하며 고개를 갸웃해요.');
  root.add(shelf); interactives.push(shelf); targets.read = new THREE.Vector3(-3.6,0,-1.25);

  const chest = new THREE.Group();
  add(chest,new RoundedBoxGeometry(1.35,.72,.8,5,.08),mat('#9f734c'),[1.9,.4,-1.65]);
  add(chest,new RoundedBoxGeometry(1.38,.11,.82,4,.06),mat('#704c35'),[1.9,.82,-1.65]);
  attachAction(chest,'tidy','나무 장난감 상자','앞발로 장난감을 톡톡 밀어 상자에 정리해요.');
  root.add(chest); interactives.push(chest); targets.tidy = new THREE.Vector3(1.35,0,-1.1);

  const ball = new THREE.Group();
  add(ball,new THREE.SphereGeometry(.3,24,16),mat('#e79674'),[4.55,.3,1.8]);
  add(ball,new THREE.TorusGeometry(.21,.035,8,20),mat('#f0d47b'),[4.55,.3,1.8],[1,1,1],[Math.PI/2,0,0]);
  attachAction(ball,'play','공 장난감','단비가 공을 앞발로 툭 치고 신나게 따라가요.');
  root.add(ball); interactives.push(ball); targets.play = new THREE.Vector3(4.1,0,1.4);

  const plant = new THREE.Group();
  add(plant,new THREE.CylinderGeometry(.28,.23,.33,14),mat('#8f6a50'),[1.85,.22,-2.25]);
  for (let i=0;i<6;i++) {
    const leaf=add(plant,new THREE.SphereGeometry(.16,12,8),mat('#78966e'),[1.85+Math.cos(i)*.22,.55+Math.sin(i*.8)*.08,-2.25+Math.sin(i)*.12]);
    leaf.scale.set(.65,1.5,.55);
  }
  attachAction(plant,'window','창가 화분','화분 옆 창가에 서서 마당을 한참 바라봐요.');
  root.add(plant); interactives.push(plant); targets.window = new THREE.Vector3(1.25,0,-1.75);

  const radio = new THREE.Group();
  add(radio,new RoundedBoxGeometry(.78,.5,.35,4,.07),mat('#748b92'),[-.5,.47,-2.1]);
  add(radio,new THREE.CylinderGeometry(.14,.14,.03,20),mat('#39484d'),[-.7,.48,-1.91],null,[Math.PI/2,0,0]);
  add(radio,new THREE.BoxGeometry(.22,.05,.04),mat('#e8c96b'),[-.28,.58,-1.91]);
  root.add(radio);

  const broom = new THREE.Group();
  add(broom,new THREE.CylinderGeometry(.035,.035,1.35,8),mat('#8b6042'),[2.7,.82,-2.35],null,[0,0,.22]);
  add(broom,new THREE.ConeGeometry(.26,.55,10),mat('#c5a56d'),[2.84,.2,-2.35],null,[0,0,.04]);
  root.add(broom);

  const basket = new THREE.Group();
  add(basket,new THREE.CylinderGeometry(.45,.38,.38,12,1,true),mat('#b68a5b',{side:THREE.DoubleSide}),[-3.7,.22,1.75]);
  for(let i=0;i<4;i++) add(basket,new THREE.CapsuleGeometry(.06,.42,3,7),mat('#e7cf9b'),[-3.85+i*.12,.45,1.75],null,[0,0,.7-i*.25]);
  root.add(basket);

  targets.sniff = new THREE.Vector3(-.8,0,1.45);
  targets.shake = new THREE.Vector3(2.8,0,.6);
  targets.run = new THREE.Vector3(5.4,0,.8);

  return { root, interactives, targets };
}
