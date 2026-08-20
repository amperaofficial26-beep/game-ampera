import * as THREE from 'three';
import { WEAPONS } from './weapons.js';

export class Tower {
  constructor(scene) {
    this.scene = scene; this.floors = []; this.group = new THREE.Group();
    this.group.position.set(-5.25, 0, 0); scene.add(this.group);
    this.stone = new THREE.MeshStandardMaterial({ color: 0x52617a, roughness: .68, metalness: .16 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.22, 2.72, .55, 10), this.stone); pedestal.position.y=.27; pedestal.castShadow=pedestal.receiveShadow=true;this.group.add(pedestal);
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.88,2.05,.25,10),new THREE.MeshStandardMaterial({color:0x657491,roughness:.55}));platform.position.y=.63;platform.castShadow=true;this.group.add(platform);
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(.38,1),new THREE.MeshBasicMaterial({color:0x8a70ff}));crystal.position.y=.94;this.group.add(crystal);
    const glow=new THREE.PointLight(0x7c71ff,1.3,5);glow.position.y=1.1;this.group.add(glow);
  }
  addFloor(key) {
    if (this.floors.length >= 5) return false;
    const weapon=WEAPONS[key], level=this.floors.length, y=1.0+level*.92;
    const group=new THREE.Group();group.position.y=y;
    const stone=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.66,.65,8),this.stone);stone.castShadow=stone.receiveShadow=true;group.add(stone);
    const trim=new THREE.Mesh(new THREE.TorusGeometry(1.43,.075,8,16),new THREE.MeshBasicMaterial({color:weapon.color}));trim.rotation.x=Math.PI/2;trim.position.y=.12;group.add(trim);
    const weaponModel=this.createWeaponModel(key,weapon.color);weaponModel.position.y=.48;group.add(weaponModel);
    this.group.add(group);this.floors.push({key,weapon,group,cooldown:Math.random()*.4});return true;
  }
  createWeaponModel(key,color) {
    const group=new THREE.Group(), glow=new THREE.MeshBasicMaterial({color});
    if(key==='cannon'){const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.18,.27,.9,10),new THREE.MeshStandardMaterial({color:0x373342,metalness:.65,roughness:.28}));barrel.rotation.z=Math.PI/2;barrel.position.x=.32;group.add(barrel);group.add(new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),glow));}
    else if(key==='tesla'){for(let i=0;i<3;i++){const spike=new THREE.Mesh(new THREE.ConeGeometry(.1,.75,5),glow);spike.position.set(Math.cos(i*2.1)*.35,.25,Math.sin(i*2.1)*.35);group.add(spike);}group.add(new THREE.Mesh(new THREE.OctahedronGeometry(.25),glow));}
    else if(key==='freeze'){const crystal=new THREE.Mesh(new THREE.ConeGeometry(.36,.9,6),glow);crystal.position.y=.35;group.add(crystal);}
    else if(key==='rocket'){const launcher=new THREE.Mesh(new THREE.BoxGeometry(.48,.25,.9),new THREE.MeshStandardMaterial({color:0x483e47,metalness:.45}));launcher.rotation.z=-.2;group.add(launcher);const tip=new THREE.Mesh(new THREE.ConeGeometry(.17,.42,8),glow);tip.rotation.z=-Math.PI/2;tip.position.x=.5;group.add(tip);}
    else {const staff=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,.8,8),new THREE.MeshStandardMaterial({color:0x312d4a,metalness:.5}));staff.position.y=.25;group.add(staff);const orb=new THREE.Mesh(new THREE.SphereGeometry(.24,12,10),glow);orb.position.y=.75;group.add(orb);}
    const light=new THREE.PointLight(color,.55,3);light.position.y=.45;group.add(light);return group;
  }
  get fusionReady(){return this.floors.length===5&&new Set(this.floors.map(f=>f.key)).size===5;}
  update(dt,enemies,effects){for(const floor of this.floors){floor.cooldown-=dt;floor.group.rotation.y+=dt*.22;const target=enemies.find(e=>e.alive&&e.group.position.distanceTo(this.group.position)<16);if(target&&floor.cooldown<=0){effects.fire(floor,target,this.group.position.clone().add(new THREE.Vector3(0,floor.group.position.y+.48,0)));floor.cooldown=floor.weapon.cooldown;}}}
}
