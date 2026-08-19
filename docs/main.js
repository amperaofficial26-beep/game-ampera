import * as THREE from 'three';
import { createScene } from './game/scene.js';
import { Tower } from './game/tower.js';
import { WaveManager } from './game/wave.js';
import { WEAPONS } from './game/weapons.js';

const canvas=document.querySelector('#game-canvas');
const {scene,camera,renderer,controls}=createScene(canvas);
const tower=new Tower(scene), waves=new WaveManager(scene), clock=new THREE.Clock();
let money=200, baseHp=100, effects=[];
const $=s=>document.querySelector(s); const select=$('#weapon-select'), build=$('#build-button'), waveButton=$('#wave-button');
for(const [key,w] of Object.entries(WEAPONS)){const option=document.createElement('option');option.value=key;option.textContent=`${w.icon} ${w.name} — ${w.cost} kredit`;select.append(option);}
function selectedWeapon(){return WEAPONS[select.value];}
function message(text){$('#message').textContent=text;}
function updateUI(){
  $('#money').textContent=money; $('#wave').textContent=waves.wave; $('#base-hp').textContent=baseHp; $('#floor-count').textContent=`${tower.floors.length}/5`;
  $('#weapon-info').textContent=`Damage ${selectedWeapon().damage} • ${selectedWeapon().description}`;
  build.disabled=tower.floors.length>=5||money<selectedWeapon().cost||baseHp<=0; waveButton.disabled=waves.active||!tower.floors.length||baseHp<=0;
  waveButton.textContent=waves.active?'⚔ Wave berlangsung...':'⚔ Mulai wave';
  $('#enemy-info').textContent=waves.active?`Robot tersisa: ${waves.enemies.length + waves.toSpawn}`:tower.fusionReady?'⚡ FUSION READY — +50% damage!':'Bangun tower lalu mulai wave.';
  $('#floor-list').innerHTML=tower.floors.map((f,i)=>`<div class="floor-row" style="--weapon-color:#${f.weapon.color.toString(16).padStart(6,'0')}">L${i+1} ${f.weapon.icon} ${f.weapon.name}</div>`).join('');
}
select.addEventListener('change',updateUI);
build.addEventListener('click',()=>{const w=selectedWeapon();if(money<w.cost)return; money-=w.cost;tower.addFloor(select.value);message(`${w.icon} ${w.name} dipasang di lantai ${tower.floors.length}.`);updateUI();});
waveButton.addEventListener('click',()=>{if(waves.start()){message(`Wave ${waves.wave} dimulai. Hancurkan semua robot!`);updateUI();}});

function fire(floor,target,origin){
  const w=floor.weapon, damage=Math.round(w.damage*(tower.fusionReady?1.5:1));
  if(w.projectile==='lightning'||w.projectile==='laser'){beam(origin,target.group.position,w.color,w.projectile==='laser'?.12:.18);target.hit(damage,w.projectile==='lightning');return;}
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(w.projectile==='rocket'?.17:.11,8,8),new THREE.MeshBasicMaterial({color:w.color}));mesh.position.copy(origin);scene.add(mesh);effects.push({type:'projectile',mesh,target,damage,slow:w.projectile==='freeze',speed:w.projectile==='rocket'?10:15,life:2,color:w.color,rocket:w.projectile==='rocket'});
}
function beam(start,end,color,life){const geometry=new THREE.BufferGeometry().setFromPoints([start,end]);const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({color,transparent:true,opacity:1}));scene.add(line);effects.push({type:'beam',mesh:line,life,maxLife:life});}
function explosion(pos,color){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.3,12,8),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8}));mesh.position.copy(pos);scene.add(mesh);effects.push({type:'burst',mesh,life:.35,maxLife:.35});}
const weaponEffects={fire};
function updateEffects(dt){for(let i=effects.length-1;i>=0;i--){const e=effects[i];e.life-=dt;if(e.type==='projectile'&&e.target.alive){const direction=e.target.group.position.clone().sub(e.mesh.position);if(direction.length()<.35){e.target.hit(e.damage,e.slow);if(e.rocket){for(const enemy of waves.enemies){if(enemy.alive&&enemy.group.position.distanceTo(e.mesh.position)<2.1)enemy.hit(Math.round(e.damage*.55));}explosion(e.mesh.position,e.color);}e.life=0;}else e.mesh.position.add(direction.normalize().multiplyScalar(e.speed*dt));}else if(e.type==='burst'){e.mesh.scale.multiplyScalar(1+dt*8);e.mesh.material.opacity=Math.max(0,e.life/e.maxLife);}else if(e.type==='beam'){e.mesh.material.opacity=Math.max(0,e.life/e.maxLife);}if(e.life<=0){scene.remove(e.mesh);effects.splice(i,1);}}}
function loop(){const dt=Math.min(clock.getDelta(),.05);waves.update(dt);tower.update(dt,waves.enemies,weaponEffects);updateEffects(dt);
  const breaches=waves.consumeBreaches();
  if(breaches){baseHp=Math.max(0,baseHp-breaches*8);message(`⚠ ${breaches} robot mencapai base!`);}
  if(waves.completed){const reward=35+waves.wave*14;money+=reward;message(`🏆 Wave selesai! Kamu mendapat ${reward} kredit.`);waves.finish();}
  if(baseHp<=0){waves.active=false;message('☠ Base hancur. Refresh halaman untuk bermain lagi.');}
  updateUI();controls.update();renderer.render(scene,camera);requestAnimationFrame(loop);
}
message('Bangun lantai pertama dan mulailah pertahanan.');updateUI();loop();
