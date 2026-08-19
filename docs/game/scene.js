import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createScene(canvas) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x080d1c); scene.fog=new THREE.Fog(0x080d1c,18,38);
  const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,100); camera.position.set(11,13,18);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.7)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const controls=new OrbitControls(camera,canvas); controls.target.set(0,1,0); controls.enableDamping=true; controls.minDistance=11; controls.maxDistance=29; controls.maxPolarAngle=Math.PI*.47;
  scene.add(new THREE.HemisphereLight(0x8ab8ff,0x10152c,1.55)); const sun=new THREE.DirectionalLight(0xa8c4ff,2.2); sun.position.set(-7,14,6); sun.castShadow=true; scene.add(sun);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(36,18),new THREE.MeshStandardMaterial({color:0x172544,metalness:.35,roughness:.7})); ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const laneMat=new THREE.MeshStandardMaterial({color:0x2b3e6b,emissive:0x10234e,emissiveIntensity:.8}); const lane=new THREE.Mesh(new THREE.PlaneGeometry(27,6.8),laneMat);lane.rotation.x=-Math.PI/2;lane.position.y=.012;scene.add(lane);
  for(let x=-9;x<11;x+=2){const line=new THREE.Mesh(new THREE.BoxGeometry(.8,.025,.06),new THREE.MeshBasicMaterial({color:0x68ceff}));line.position.set(x,.04,-3.3);scene.add(line);const opposite=line.clone();opposite.position.z=3.3;scene.add(opposite);}
  const base=new THREE.Mesh(new THREE.BoxGeometry(1.1,2.5,5),new THREE.MeshStandardMaterial({color:0x3150a0,emissive:0x102e91,emissiveIntensity:.55}));base.position.set(-8,1.25,0);scene.add(base);
  addStars(scene); window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
  return {scene,camera,renderer,controls};
}
function addStars(scene){const g=new THREE.BufferGeometry(),points=[];for(let i=0;i<250;i++)points.push((Math.random()-.5)*60,Math.random()*22+2,(Math.random()-.5)*55);g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0x89a8ff,size:.06})));}
