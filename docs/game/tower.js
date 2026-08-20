import * as THREE from 'three';
import { WEAPONS, getTier } from './weapons.js';
import { createFloorArchitecture, floorHeight } from './tower_architecture.js';

// Tower utama: lima modul lantai tersambung, bukan lima rumah terpisah.
export class Tower {
  constructor(scene) {
    this.scene=scene; this.floors=[]; this.group=new THREE.Group(); this.group.position.set(-5.25,0,0); scene.add(this.group);
    const baseMat=new THREE.MeshStandardMaterial({color:0x334057,roughness:.72,metalness:.14});
    const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(2.24,2.78,.55,10),baseMat);pedestal.position.y=.27;pedestal.castShadow=pedestal.receiveShadow=true;this.group.add(pedestal);
    const stairs=new THREE.Mesh(new THREE.BoxGeometry(1.35,.36,1.0),baseMat);stairs.position.set(0,.18,-1.75);stairs.castShadow=true;this.group.add(stairs);
  }
  addFloor(key){if(this.floors.length>=5)return false;this.floors.push({key,weapon:WEAPONS[key],level:1,cooldown:0,visual:null});this.rebuildTower();return true;}
  upgradeFloor(index){const floor=this.floors[index];if(!floor||floor.level>=5)return false;floor.level++;this.rebuildTower();return true;}
  rebuildTower(){
    // Posisi setiap lantai dihitung ulang agar upgrade tinggi tidak saling menembus.
    let y=.56;
    this.floors.forEach((floor,index)=>{
      if(floor.visual)this.group.remove(floor.visual);
      const visual=createFloorArchitecture({key:floor.key,level:floor.level,index,isTop:index===this.floors.length-1,color:floor.weapon.color});
      visual.position.y=y; floor.visual=visual; this.group.add(visual);
      y+=floorHeight(floor.level)+.07;
    });
  }
  get fusionReady(){return this.floors.length===5&&new Set(this.floors.map(f=>f.key)).size===5;}
  update(dt,enemies,effects){
    for(const floor of this.floors){
      floor.cooldown-=dt;const tier=getTier(floor.key,floor.level);
      const target=enemies.find(e=>e.alive&&e.group.position.distanceTo(this.group.position)<16);
      if(target&&floor.cooldown<=0){
        effects.fire(floor,target,this.group.position.clone().add(new THREE.Vector3(0,floor.visual.position.y+1.0,0)),tier);
        floor.cooldown=tier.cooldown;
      }
    }
  }
}
