import * as THREE from 'three';

export class Enemy {
  constructor(scene, number) {
    this.scene=scene; this.maxHp=65 + number*9; this.hp=this.maxHp; this.speed=1.0 + Math.min(number*.02,.45); this.alive=true; this.reachedBase=false; this.slowTime=0;
    this.group=new THREE.Group(); this.group.position.set(10 + Math.random()*3,.65,(Math.random()-.5)*4.8);
    const body=new THREE.Mesh(new THREE.BoxGeometry(.8,.85,.8),new THREE.MeshStandardMaterial({color:0xd44d65,metalness:.35,roughness:.35}));
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),new THREE.MeshBasicMaterial({color:0xffec75})); eye.position.set(-.42,.12,0); this.group.add(body,eye);
    this.hpFill=new THREE.Mesh(new THREE.PlaneGeometry(.9,.1),new THREE.MeshBasicMaterial({color:0x67ee93})); this.hpFill.position.set(0,1.05,0); this.group.add(this.hpFill); scene.add(this.group);
  }
  hit(damage, slow=false) { if (!this.alive) return; this.hp-=damage; if(slow) this.slowTime=1.4; this.hpFill.scale.x=Math.max(0,this.hp/this.maxHp); this.hpFill.position.x=-(1-this.hpFill.scale.x)*.45; if(this.hp<=0){this.alive=false; this.scene.remove(this.group);} }
  update(dt) { if(!this.alive)return; const speed=this.speed*(this.slowTime>0?.38:1); this.slowTime-=dt; this.group.position.x-=speed*dt; this.group.rotation.y+=dt*3; if(this.group.position.x < -7.2){this.alive=false;this.reachedBase=true;this.scene.remove(this.group);} }
}
