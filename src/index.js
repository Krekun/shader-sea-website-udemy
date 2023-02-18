import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader.vert";
import fragmentShader from "./shaders/fragmentShader.frag";
import skyimage from "./textures/sky.jpg";


const gui = new dat.GUI({ width: 300 });


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load(skyimage);
scene.background = skyTexture;



// Geometry
const geometry = new THREE.PlaneGeometry(8, 8, 128, 128);

const colorObject = {};
colorObject.depthColor = new THREE.Color(0x2d81ae);
colorObject.surfaceColor = new THREE.Color(0x66c1f9);


// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uWaveLength: { value: 0.36 },
    uFrequency: { value: new THREE.Vector2(6.7, 3.5) },
    uTime: { value: 0. },
    uWaveSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
    uColorOffset: { value: 0.03 },
    uColorMultiplier: { value: 9.6 },
    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 3.0 },
    uSmallWaveSpeed: { value: 0.2 },
  }
});

gui.add(material.uniforms.uWaveLength, "value", 0, 1, 0.01).name("Wave Length");
gui.add(material.uniforms.uFrequency.value, "x", 0, 10, 0.01).name("Frequency_x");
gui.add(material.uniforms.uFrequency.value, "y", 0, 10, 0.01).name("Frequency_y");
gui.add(material.uniforms.uWaveSpeed, "value", 0, 4, 0.01).name("WaveSpeed");
gui.add(material.uniforms.uColorOffset, "value", 0, 0.5, 0.03).name("ColorOffset");
gui.add(material.uniforms.uColorMultiplier, "value", 0, 10, 0.5).name("ColorMultiplier");
gui.add(material.uniforms.uSmallWaveElevation, "value", 0, 0.5, 0.05).name("uSmallWaveElevation");
gui.add(material.uniforms.uSmallWaveFrequency, "value", 0, 10, 0.5).name("uSmallWaveFrequency");
gui.add(material.uniforms.uSmallWaveSpeed, "value", 0, 10, 0.5).name("uSmallWaveSpeed");

gui.addColor(colorObject, "depthColor").name("Depth Color").onChange(() => {
  material.uniforms.uDepthColor.value = new THREE.Color(colorObject.depthColor);
});
gui.addColor(colorObject, "surfaceColor").name("Surface Color").onChange(() => {
  material.uniforms.uSurfaceColor.value = new THREE.Color(colorObject.depthColor);
});

gui.show(false);

// const material = new THREE.MeshBasicMaterial()

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0.23, 0.);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;
  const speed = 0.2
  const size = 3.0
  camera.position.x = Math.sin(elapsedTime * speed) * size;
  camera.position.z = Math.cos(elapsedTime * speed) * size;

  // camera.lookAt(Math.cos(elapsedTime * speed) * size, 0, Math.sin(elapsedTime));
  camera.lookAt(Math.cos(elapsedTime), Math.sin(elapsedTime) * 0.5, Math.sin(elapsedTime)
  );



  // controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
