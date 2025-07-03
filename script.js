const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(0, 0, 0);
scene.add(light);

// Sun
const sunGeo = new THREE.SphereGeometry(2, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// All 8 planets
const planetsData = [
  { name: "Mercury", size: 0.3, distance: 4, speed: 0.04, color: 0xaaaaaa },
  { name: "Venus", size: 0.5, distance: 6, speed: 0.03, color: 0xffcc66 },
  { name: "Earth", size: 0.6, distance: 8, speed: 0.02, color: 0x3366ff },
  { name: "Mars", size: 0.4, distance: 10, speed: 0.018, color: 0xff3300 },
  { name: "Jupiter", size: 1.1, distance: 13, speed: 0.014, color: 0xff9966 },
  { name: "Saturn", size: 0.9, distance: 16, speed: 0.012, color: 0xffcc99 },
  { name: "Uranus", size: 0.7, distance: 19, speed: 0.01, color: 0x66ffff },
  { name: "Neptune", size: 0.7, distance: 22, speed: 0.009, color: 0x3366cc }
];

const planets = [];
const controlsDiv = document.getElementById("controls");

planetsData.forEach(data => {
  const geo = new THREE.SphereGeometry(data.size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  mesh.userData = { angle: 0, speed: data.speed, distance: data.distance };
  planets.push(mesh);

  // Speed control sliders
  const container = document.createElement("div");
  container.className = "slider-container";
  container.innerHTML = `
    <label for="${data.name}">${data.name}</label><br/>
    <input type="range" min="0.001" max="0.1" value="${data.speed}" step="0.001" id="${data.name}">
  `;
  controlsDiv.appendChild(container);

  document.getElementById(data.name).addEventListener("input", e => {
    mesh.userData.speed = parseFloat(e.target.value);
  });
});

camera.position.z = 30;

function animate() {
  requestAnimationFrame(animate);

  planets.forEach(p => {
    p.userData.angle += p.userData.speed;
    p.position.x = Math.cos(p.userData.angle) * p.userData.distance;
    p.position.z = Math.sin(p.userData.angle) * p.userData.distance;
  });

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
