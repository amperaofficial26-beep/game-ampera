import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const terrainVertexShader = `
  varying vec3 vColor;
  attribute vec3 color;
  void main() { vColor = color; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const terrainFragmentShader = `
  varying vec3 vColor;
  void main() { gl_FragColor = vec4(vColor, 1.0); }
`;

export function createScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101426);
  scene.fog = new THREE.FogExp2(0x101426, 0.027);

  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(12.8, 12.2, 18.8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 1.15, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.minDistance = 11;
  controls.maxDistance = 28;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.minPolarAngle = Math.PI * 0.18;

  scene.add(new THREE.HemisphereLight(0x8296e8, 0x172414, 1.55));
  const moon = new THREE.DirectionalLight(0xc2d5ff, 2.25);
  moon.position.set(-9, 16, 7);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.left = -18; moon.shadow.camera.right = 18;
  moon.shadow.camera.top = 18; moon.shadow.camera.bottom = -18;
  scene.add(moon);

  const sunset = new THREE.DirectionalLight(0xff9c63, 1.15);
  sunset.position.set(12, 6, -13);
  scene.add(sunset);

  createTerrain(scene);
  createRoad(scene);
  createCastle(scene);
  createForest(scene);
  createFireflies(scene);

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  return { scene, camera, renderer, controls };
}

function createTerrain(scene) {
  const size = 45, segments = 70;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const positions = geometry.attributes.position;
  const colors = [];
  const grass = new THREE.Color(0x243b2a), moss = new THREE.Color(0x416137), dark = new THREE.Color(0x17251d);
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i);
    const h = Math.sin(x * 0.42) * .22 + Math.cos(y * .29) * .19 + Math.sin((x + y) * .72) * .1;
    positions.setZ(i, h);
    const c = dark.clone().lerp(grass, Math.max(0, h + .45)).lerp(moss, Math.random() * .24);
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const ground = new THREE.Mesh(geometry, new THREE.ShaderMaterial({ vertexShader: terrainVertexShader, fragmentShader: terrainFragmentShader, vertexColors: true }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function createRoad(scene) {
  const road = new THREE.Mesh(new THREE.BoxGeometry(27, .12, 5.4), new THREE.MeshStandardMaterial({ color: 0x4d4541, roughness: .93 }));
  road.position.y = .06; road.receiveShadow = true; scene.add(road);
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x827155, roughness: .78 });
  for (const z of [-2.85, 2.85]) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(27, .16, .18), edgeMat); edge.position.set(0, .12, z); edge.castShadow = edge.receiveShadow = true; scene.add(edge);
  }
  for (let x = -7; x < 12; x += 2.4) {
    const rune = new THREE.Mesh(new THREE.BoxGeometry(.55, .04, .08), new THREE.MeshBasicMaterial({ color: 0x69e8ff })); rune.position.set(x, .18, -2.58); scene.add(rune);
  }
}

function createCastle(scene) {
  const stone = new THREE.MeshStandardMaterial({ color: 0x36405c, roughness: .72, metalness: .08 });
  const gate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.1, 5.6), stone); gate.position.set(-8.2, 1.55, 0); gate.castShadow = gate.receiveShadow = true; scene.add(gate);
  for (const z of [-3.2, 3.2]) {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(.65, .75, 3.6, 8), stone); turret.position.set(-8.1, 1.8, z); turret.castShadow = true; scene.add(turret);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(.92, 1.25, 8), new THREE.MeshStandardMaterial({ color: 0x5b355d, roughness: .75 })); roof.position.set(-8.1, 4.15, z); roof.castShadow = true; scene.add(roof);
  }
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(.8, 1.4), new THREE.MeshBasicMaterial({ color: 0x7c5eff, side: THREE.DoubleSide })); banner.position.set(-7.55, 2.8, 0); banner.rotation.y = Math.PI / 2; scene.add(banner);
}

function createForest(scene) {
  const points = [[-3,7],[2,7],[7,6],[-3,-7],[3,-7],[8,-6],[11,6],[12,-6],[-7,7],[-7,-7]];
  for (const [x,z] of points) createTree(scene, x, z, .8 + Math.random()*.55);
  for (let i=0;i<17;i++) createRock(scene, (Math.random()-.5)*28, (Math.random()>.5?1:-1)*(4+Math.random()*7));
  for (const x of [-5, 1, 7]) addLantern(scene, x, -3.8);
}
function createTree(scene,x,z,s) {
  const group = new THREE.Group(); group.position.set(x,0,z); group.scale.setScalar(s);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18,.28,1.55,7), new THREE.MeshStandardMaterial({color:0x573d2d,roughness:.9})); trunk.position.y=.75; trunk.castShadow=true; group.add(trunk);
  for (const [y,r] of [[1.55,.9],[2.05,.72],[2.48,.48]]) { const leaves=new THREE.Mesh(new THREE.ConeGeometry(r,1.2,7),new THREE.MeshStandardMaterial({color:0x244e3b,roughness:.82}));leaves.position.y=y;leaves.castShadow=true;group.add(leaves); }
  scene.add(group);
}
function createRock(scene,x,z) { const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.25+Math.random()*.45,0),new THREE.MeshStandardMaterial({color:0x4c5361,roughness:.9}));rock.position.set(x,.18,z);rock.rotation.set(Math.random(),Math.random(),0);rock.scale.y=.65;rock.castShadow=true;scene.add(rock); }
function addLantern(scene,x,z) { const pole=new THREE.Mesh(new THREE.CylinderGeometry(.05,.08,1.25,6),new THREE.MeshStandardMaterial({color:0x30292c}));pole.position.set(x,.63,z);scene.add(pole);const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.18),new THREE.MeshBasicMaterial({color:0xffbb65}));gem.position.set(x,1.25,z);scene.add(gem);const light=new THREE.PointLight(0xff9b55,1.6,5,2);light.position.set(x,1.25,z);scene.add(light); }
function createFireflies(scene) { const g=new THREE.BufferGeometry(), p=[];for(let i=0;i<180;i++)p.push((Math.random()-.5)*32,Math.random()*8+.15,(Math.random()-.5)*28);g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0x86dfff,size:.045,transparent:true,opacity:.75}))); }
