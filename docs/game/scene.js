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
  const windUniforms = [];
  // Palet sore hari: langit biru hangat, kabut lembut, dan sinar matahari keemasan.
  scene.background = new THREE.Color(0x89b6d0);
  scene.fog = new THREE.FogExp2(0x9bb9be, 0.018);

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

  scene.add(new THREE.HemisphereLight(0xffdaa8, 0x38502d, 2.15));
  const sun = new THREE.DirectionalLight(0xffad69, 3.15);
  sun.position.set(-12, 15, -7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -18; sun.shadow.camera.right = 18;
  sun.shadow.camera.top = 18; sun.shadow.camera.bottom = -18;
  scene.add(sun);

  // Cahaya dingin yang tipis menjaga bayangan tetap terlihat pada sore hari.
  const skyFill = new THREE.DirectionalLight(0x9dccff, 0.75);
  skyFill.position.set(10, 9, 12);
  scene.add(skyFill);
  createSunDisc(scene);

  createTerrain(scene, windUniforms);
  createRoad(scene);
  createCastle(scene);
  createForest(scene, windUniforms);
  createFireflies(scene);

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  return {
    scene, camera, renderer, controls,
    updateEnvironment(time) { windUniforms.forEach((uniforms) => { uniforms.time.value = time; }); },
  };
}

function terrainHeight(x, z) {
  // Jalan utama dibuat relatif rata, area luar dibuat berbukit dan berlekuk.
  const roadBlend = Math.min(1, Math.abs(z) / 4.4);
  const hills = Math.sin(x * .32) * .34 + Math.cos(z * .26) * .26 + Math.sin((x + z) * .56) * .12;
  const detail = Math.sin(x * 1.25 + z * .7) * .045 + Math.cos(z * 1.4) * .035;
  return (hills + detail) * roadBlend;
}

function createTerrain(scene, windUniforms) {
  const size = 45, segments = 120;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const positions = geometry.attributes.position;
  const colors = [];
  const dark = new THREE.Color(0x263d27), grass = new THREE.Color(0x4e713b), dry = new THREE.Color(0x768348);
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), z = -positions.getY(i);
    const h = terrainHeight(x, z);
    positions.setZ(i, h);
    const noise = Math.sin(x * 2.4 + z) * .08 + Math.random() * .16;
    const color = dark.clone().lerp(grass, .42 + noise).lerp(dry, Math.max(0, h) * .22);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const ground = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .96, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  createGrass(scene, windUniforms);
}

function createGrass(scene, windUniforms) {
  // InstancedMesh membuat ribuan rumput tetap ringan: satu geometry dan satu material dipakai bersama.
  const count = 3200;
  const blade = new THREE.PlaneGeometry(.075, .72, 1, 4);
  blade.translate(0, .36, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0x5e923d, roughness: .92, side: THREE.DoubleSide, vertexColors: true });
  const uniforms = { time: { value: 0 } };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.time = uniforms.time;
    shader.vertexShader = `uniform float time;\n` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       float wind = sin(time * 1.75 + instanceMatrix[3].x * 1.73 + instanceMatrix[3].z * 1.21);
       transformed.x += wind * 0.14 * (transformed.y / 0.72);
       transformed.z += cos(time * 1.32 + instanceMatrix[3].z) * 0.055 * (transformed.y / 0.72);`
    );
  };
  windUniforms.push(uniforms);
  const grass = new THREE.InstancedMesh(blade, material, count);
  const matrix = new THREE.Matrix4(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(), position = new THREE.Vector3();
  const colors = [new THREE.Color(0x476f33), new THREE.Color(0x689e42), new THREE.Color(0x7b9747), new THREE.Color(0x3f6837)];
  for (let i = 0; i < count; i++) {
    let x, z;
    do { x = (Math.random() - .5) * 36; z = (Math.random() - .5) * 17; } while (Math.abs(z) < 3.45 || (x < -3.4 && x > -7.5 && Math.abs(z) < 3.4));
    position.set(x, terrainHeight(x, z) + .02, z);
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI);
    const height = .48 + Math.random() * .55;
    scale.set(.7 + Math.random() * .7, height, 1);
    matrix.compose(position, quaternion, scale);
    grass.setMatrixAt(i, matrix);
    grass.setColorAt(i, colors[Math.floor(Math.random() * colors.length)]);
  }
  grass.instanceMatrix.needsUpdate = true;
  grass.instanceColor.needsUpdate = true;
  scene.add(grass);
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

function createForest(scene, windUniforms) {
  const points = [[-3,7],[2,7],[7,6],[-3,-7],[3,-7],[8,-6],[11,6],[12,-6],[-7,7],[-7,-7],[14,8],[14,-8],[-11,8],[-12,-8]];
  const leafMaterial = createWindLeafMaterial(windUniforms);
  for (const [x,z] of points) createTree(scene, x, z, .8 + Math.random()*.55, leafMaterial);
  for (let i=0;i<54;i++) {
    const x=(Math.random()-.5)*32, z=(Math.random()>.5?1:-1)*(3.9+Math.random()*8);
    createRock(scene,x,z,.18+Math.random()*.62);
  }
  for (const x of [-5, 1, 7]) addLantern(scene, x, -3.8);
}
function createWindLeafMaterial(windUniforms) {
  const material = new THREE.MeshStandardMaterial({color:0x315e3d,roughness:.82,flatShading:true});
  const uniforms={time:{value:0}};
  material.onBeforeCompile=(shader)=>{
    shader.uniforms.time=uniforms.time;
    shader.vertexShader=`uniform float time;\n`+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      float leafWind=sin(time*1.2+position.y*3.0+modelMatrix[3].x)*0.065;
      transformed.x+=leafWind*(position.y+0.6);
      transformed.z+=cos(time*1.0+modelMatrix[3].z)*0.035*(position.y+0.6);`);
  };
  windUniforms.push(uniforms); return material;
}
function createTree(scene,x,z,s,leafMaterial) {
  const group = new THREE.Group(); group.position.set(x,terrainHeight(x,z),z); group.scale.setScalar(s);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18,.28,1.55,7), new THREE.MeshStandardMaterial({color:0x573d2d,roughness:.9})); trunk.position.y=.75; trunk.castShadow=true; group.add(trunk);
  for (const [y,r] of [[1.55,.9],[2.05,.72],[2.48,.48]]) { const leaves=new THREE.Mesh(new THREE.ConeGeometry(r,1.2,7),leafMaterial);leaves.position.y=y;leaves.castShadow=true;group.add(leaves); }
  scene.add(group);
}
function createRock(scene,x,z,size=.4) { const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(size,1),new THREE.MeshStandardMaterial({color:0x596069,roughness:.92,flatShading:true}));rock.position.set(x,terrainHeight(x,z)+size*.28,z);rock.rotation.set(Math.random(),Math.random(),0);rock.scale.set(1.25,.55+Math.random()*.45,.8+Math.random()*.55);rock.castShadow=rock.receiveShadow=true;scene.add(rock); }
function addLantern(scene,x,z) { const pole=new THREE.Mesh(new THREE.CylinderGeometry(.05,.08,1.25,6),new THREE.MeshStandardMaterial({color:0x30292c}));pole.position.set(x,.63,z);scene.add(pole);const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.18),new THREE.MeshBasicMaterial({color:0xffbb65}));gem.position.set(x,1.25,z);scene.add(gem);const light=new THREE.PointLight(0xff9b55,1.6,5,2);light.position.set(x,1.25,z);scene.add(light); }
function createSunDisc(scene) {
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 20, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd78a, fog: false })
  );
  sun.position.set(-18, 11, -22);
  scene.add(sun);
}

// Partikel kuning halus sebagai serbuk sihir/debu yang terkena sinar sore.
function createFireflies(scene) {
  const g = new THREE.BufferGeometry(), p = [];
  for (let i = 0; i < 110; i++) p.push((Math.random() - .5) * 30, Math.random() * 5 + .15, (Math.random() - .5) * 22);
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffdc8d, size: .038, transparent: true, opacity: .52 })));
}
