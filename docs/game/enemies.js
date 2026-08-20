import * as THREE from 'three';

export class Enemy {
  constructor(scene, number) {
    this.scene=scene;this.maxHp=65+number*10;this.hp=this.maxHp;this.speed=1+Math.min(number*.025,.48);this.alive=true;this.reachedBase=false;this.slowTime=0;
    this.group=new THREE.Group();this.group.position.set(10+Math.random()*3,.46,(Math.random()-.5)*4.45);
    const skin=new THREE.MeshStandardMaterial({color:0x5a975c,roughness:.72});const armor=new THREE.MeshStandardMaterial({color:0x3d4051,metalness:.38,roughness:.48});
    const legs=new THREE.Mesh(new THREE.CylinderGeometry(.2,.25,.55,6),armor);legs.position.y=.28;this.group.add(legs);
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.46,4,8),armor);body.position.y=.85;body.castShadow=true;this.group.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.36,10,8),skin);head.position.y=1.45;head.castShadow=true;this.group.add(head);
    const hornMat=new THREE.MeshStandardMaterial({color:0xd7c598,roughness:.9});for(const z of [-.22,.22]){const horn=new THREE.Mesh(new THREE.ConeGeometry(.09,.38,5),hornMat);horn.position.set(-.2,1.77,z);horn.rotation.z=-.5;this.group.add(horn);}
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.07,7,6),new THREE.MeshBasicMaterial({color:0xffd86f}));eye.position.set(-.325,1.47,0);this.group.add(eye);
    const hpBack=new THREE.Mesh(new THREE.PlaneGeometry(.92,.11),new THREE.MeshBasicMaterial({color:0x351e2b}));hpBack.position.set(0,2.0,0);this.group.add(hpBack);
    this.hpFill=new THREE.Mesh(new THREE.PlaneGeometry(.88,.065),new THREE.MeshBasicMaterial({color:0x6cf09b}));this.hpFill.position.set(0,2.0,-.01);this.group.add(this.hpFill);
    scene.add(this.group);
  }
  hit(damage,slow=false){if(!this.alive)return;this.hp-=damage;if(slow)this.slowTime=1.4;const ratio=Math.max(0,this.hp/this.maxHp);this.hpFill.scale.x=ratio;this.hpFill.position.x=-(1-ratio)*.44;if(this.hp<=0){this.alive=false;this.scene.remove(this.group);}}
  update(dt){if(!this.alive)return;const speed=this.speed*(this.slowTime>0?.38:1);this.slowTime-=dt;this.group.position.x-=speed*dt;this.group.rotation.y=Math.sin(performance.now()*.006+this.group.position.z)*.16;if(this.group.position.x<-7.3){this.alive=false;this.reachedBase=true;this.scene.remove(this.group);}}
}
