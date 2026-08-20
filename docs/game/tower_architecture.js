import * as THREE from 'three';

// Modul visual: menyusun satu tower vertikal dari lima lantai arsitektur yang saling tersambung.
const mats = {
  mortar: new THREE.MeshStandardMaterial({ color: 0x445065, roughness: .82 }),
  darkStone: new THREE.MeshStandardMaterial({ color: 0x28303d, roughness: .76 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x593d2c, roughness: .88 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x583f4d, roughness: .72 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x343943, metalness: .72, roughness: .28 }),
};
const wallColors = { cannon:0x726255, tesla:0x526279, freeze:0x6d91a2, rocket:0x78584b, laser:0x665778 };

export function floorHeight(level) { return .88 + level * .075; }

export function createFloorArchitecture({ key, level, index, isTop, color }) {
  const group = new THREE.Group();
  const width = 2.62 - index * .14;
  const height = floorHeight(level);
  const depth = 2.32 - index * .08;
  const wall = new THREE.MeshStandardMaterial({ color: wallColors[key], roughness:.78, metalness:.06 });
  const glow = new THREE.MeshBasicMaterial({ color });

  // Batu fondasi berlapis yang membuat tiap modul menyatu dengan tower utama.
  const base = mesh(new THREE.BoxGeometry(width + .22, .14, depth + .22), mats.darkStone, 0, .07, 0);
  const body = mesh(new THREE.BoxGeometry(width, height, depth), wall, 0, height / 2 + .12, 0);
  const cornice = mesh(new THREE.BoxGeometry(width + .18, .13, depth + .18), mats.mortar, 0, height + .16, 0);
  group.add(base, body, cornice);

  // Pilar sudut dan batu blok pada sisi depan untuk detail arsitektur.
  for (const [x,z] of [[-width/2+.11,-depth/2+.1],[width/2-.11,-depth/2+.1],[-width/2+.11,depth/2-.1],[width/2-.11,depth/2-.1]]) {
    const pillar=mesh(new THREE.BoxGeometry(.18,height+.16,.18),mats.mortar,x,(height+.16)/2+.1,z); group.add(pillar);
  }
  for (let x=-width/2+.32; x<width/2-.1; x+=.42) {
    const block=mesh(new THREE.BoxGeometry(.34,.12,.045),mats.darkStone,x,height*.46,-depth/2-.018); group.add(block);
  }

  // Jendela lengkung dengan bingkai batu dan cahaya magic dari dalam.
  const windowY = height*.58+.12;
  const window = mesh(new THREE.PlaneGeometry(.29,.38), glow, 0, windowY, -depth/2-.026);
  const frame = mesh(new THREE.BoxGeometry(.39,.48,.06), mats.darkStone, 0, windowY, -depth/2-.04);
  group.add(frame, window);
  if (level >= 2) {
    for (const x of [-width*.28, width*.28]) {
      const slit=mesh(new THREE.PlaneGeometry(.12,.3),glow,x,windowY,-depth/2-.05); group.add(slit);
    }
  }

  // Balkon depan menjadi tempat senjata; semakin tinggi level, semakin lebar dan lengkap.
  const balconyWidth = .82 + level*.12;
  const balcony = mesh(new THREE.BoxGeometry(balconyWidth,.1,.5), mats.wood, 0, height*.45+.06, -depth/2-.32);
  group.add(balcony);
  for (const x of [-balconyWidth/2+.09,balconyWidth/2-.09]) {
    const rail=mesh(new THREE.BoxGeometry(.06,.36,.06),mats.wood,x,height*.45+.25,-depth/2-.52); group.add(rail);
  }
  const railing=mesh(new THREE.BoxGeometry(balconyWidth,.05,.05),mats.wood,0,height*.45+.42,-depth/2-.52); group.add(railing);

  if (level >= 2) addWoodBeams(group,width,height,depth);
  if (level >= 3) addBannerAndCrystals(group,width,height,depth,glow,color);
  if (level >= 4) addCrenellations(group,width,height,depth);
  if (level >= 5) addLevelFiveDetails(group,width,height,depth,glow);
  if (isTop) addRoofAndFlag(group,width,height,depth,color);

  addWeaponMount(group,key,level,color,height,depth);
  return group;
}

function mesh(geometry, material, x,y,z){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m;}
function addWoodBeams(group,w,h,d){
  for(const x of[-w*.34,w*.34]) group.add(mesh(new THREE.BoxGeometry(.1,h*.7,.1),mats.wood,x,h*.42+.1,-d/2-.07));
  group.add(mesh(new THREE.BoxGeometry(w*.78,.1,.1),mats.wood,0,h*.23,-d/2-.08));
}
function addBannerAndCrystals(group,w,h,d,glow,color){
  for(const x of[-w*.42,w*.42]){const banner=mesh(new THREE.PlaneGeometry(.19,.42),glow,x,h+.18,-d/2-.1);group.add(banner);}
  for(const x of[-w*.46,w*.46]){const crystal=mesh(new THREE.OctahedronGeometry(.14),glow,x,.27,d/2+.03);group.add(crystal);}
}
function addCrenellations(group,w,h,d){
  for(const x of[-w/2+.16,-w*.17,w*.17,w/2-.16]){group.add(mesh(new THREE.BoxGeometry(.23,.22,.25),mats.darkStone,x,h+.29,-d/2+.06));group.add(mesh(new THREE.BoxGeometry(.23,.22,.25),mats.darkStone,x,h+.29,d/2-.06));}
}
function addLevelFiveDetails(group,w,h,d,glow){
  const arch=new THREE.Mesh(new THREE.TorusGeometry(.38,.06,6,14,Math.PI),glow);arch.position.set(0,h*.6,-d/2-.12);arch.rotation.z=Math.PI;group.add(arch);
  for(const x of[-w*.46,w*.46]){const spire=mesh(new THREE.ConeGeometry(.15,.55,6),mats.darkStone,x,h+.48,0);group.add(spire);}
}
function addRoofAndFlag(group,w,h,d,color){
  const roof=mesh(new THREE.ConeGeometry(w*.47,.62,4),mats.roof,0,h+.55,0);roof.rotation.y=Math.PI/4;group.add(roof);
  const pole=mesh(new THREE.CylinderGeometry(.025,.025,.72,6),mats.metal,0,h+1.08,0);group.add(pole);
  const flag=mesh(new THREE.PlaneGeometry(.38,.22),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}),.2,h+1.22,0);group.add(flag);
}

function addWeaponMount(group,key,level,color,h,d){
  const glow=new THREE.MeshBasicMaterial({color});const y=h*.45+.48;const front=-d/2-.52;
  if(key==='cannon'){
    const count=level>=4?2:1;for(let i=0;i<count;i++){const barrel=mesh(new THREE.CylinderGeometry(.14,.23,.85+level*.09,10),mats.metal,.0,y,(i-(count-1)/2)*.27+front);barrel.rotation.x=Math.PI/2;group.add(barrel);}if(level===5){const flame=mesh(new THREE.ConeGeometry(.2,.45,7),glow,0,y,front-.5);flame.rotation.x=-Math.PI/2;group.add(flame);}
  } else if(key==='tesla'){
    for(let i=0;i<2+Math.min(level,3);i++){const a=i/(2+Math.min(level,3))*Math.PI*2;const coil=mesh(new THREE.ConeGeometry(.08,.42+level*.1,5),glow,Math.cos(a)*.25,y,front+Math.sin(a)*.25);group.add(coil);}group.add(mesh(new THREE.OctahedronGeometry(.15+level*.04),glow,0,y+.2,front));
  } else if(key==='freeze'){
    const crystal=mesh(new THREE.ConeGeometry(.2+level*.035,.5+level*.13,6),glow,0,y+.18,front);group.add(crystal);if(level>=4)for(const x of[-.28,.28])group.add(mesh(new THREE.ConeGeometry(.11,.5,5),glow,x,y,front));
  } else if(key==='rocket'){
    const count=level>=3?2:1;for(let i=0;i<count;i++){const tube=mesh(new THREE.CylinderGeometry(.12,.14,.78,8),mats.metal,(i-(count-1)/2)*.28,y,front);tube.rotation.x=Math.PI/2;group.add(tube);}if(level===5)group.add(mesh(new THREE.ConeGeometry(.2,.5,7),glow,0,y,front-.45));
  } else {
    const staff=mesh(new THREE.CylinderGeometry(.06,.09,.65+level*.1,8),mats.metal,0,y,front);group.add(staff);group.add(mesh(new THREE.SphereGeometry(.14+level*.045,12,10),glow,0,y+.42,front));if(level>=4){const ring=new THREE.Mesh(new THREE.TorusGeometry(.3,.035,6,16),glow);ring.position.set(0,y+.35,front);ring.rotation.x=Math.PI/2;group.add(ring);}
  }
}
