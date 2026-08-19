import { Enemy } from './enemies.js';
export class WaveManager {
  constructor(scene){this.scene=scene;this.enemies=[];this.active=false;this.wave=1;this.toSpawn=0;this.spawnTimer=0;this.breaches=0;}
  start(){if(this.active)return false;this.active=true;this.toSpawn=5+this.wave*2;this.spawnTimer=0;this.breaches=0;return true;}
  update(dt){
    if(!this.active)return;
    this.spawnTimer-=dt;
    if(this.toSpawn>0&&this.spawnTimer<=0){this.enemies.push(new Enemy(this.scene,this.wave));this.toSpawn--;this.spawnTimer=.72;}
    for(const e of this.enemies)e.update(dt);
    this.enemies=this.enemies.filter(e=>{if(!e.alive&&e.reachedBase)this.breaches++;return e.alive;});
  }
  consumeBreaches(){const count=this.breaches;this.breaches=0;return count;}
  get completed(){return this.active&&this.toSpawn===0&&this.enemies.length===0;}
  finish(){this.active=false;this.wave++;}
}
