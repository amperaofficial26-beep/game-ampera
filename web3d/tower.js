import * as THREE from 'three';
import { WEAPONS } from './weapons.js';

export class Tower {
  constructor(scene) {
    this.scene = scene; this.floors = []; this.group = new THREE.Group();
    this.group.position.set(-5.2, 0, 0); scene.add(this.group);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.5, .45, 8), new THREE.MeshStandardMaterial({ color: 0x293a70, metalness:.55, roughness:.32 }));
    base.position.y = .22; this.group.add(base);
  }
  addFloor(key) {
    if (this.floors.length >= 5) return false;
    const weapon = WEAPONS[key]; const y = .7 + this.floors.length * .85;
    const group = new THREE.Group(); group.position.y = y;
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.35,.72,2.35), new THREE.MeshStandardMaterial({color:weapon.color, emissive:weapon.color, emissiveIntensity:.18, metalness:.55, roughness:.3}));
    const core = new THREE.Mesh(new THREE.SphereGeometry(.26,12,8), new THREE.MeshBasicMaterial({color:weapon.color})); core.position.y=.48;
    group.add(body,core); this.group.add(group);
    this.floors.push({ key, weapon, group, cooldown: Math.random()*.4 }); return true;
  }
  get fusionReady() { return this.floors.length === 5 && new Set(this.floors.map(f=>f.key)).size === 5; }
  update(dt, enemies, effects) {
    for (const floor of this.floors) {
      floor.cooldown -= dt; const target = enemies.find(e => e.alive && e.group.position.distanceTo(this.group.position) < 15);
      if (target && floor.cooldown <= 0) { effects.fire(floor, target, this.group.position.clone().add(new THREE.Vector3(0,floor.group.position.y+.35,0))); floor.cooldown = floor.weapon.cooldown; }
    }
  }
}
