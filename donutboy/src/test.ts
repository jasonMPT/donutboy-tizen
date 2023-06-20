import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//Canvas
const canvas = document.querySelector("#game") as HTMLCanvasElement;
//Scene
const scene = new THREE.Scene();

//TextureLoader
const textureLoader = new THREE.TextureLoader();
const donutTexture = textureLoader.load("/donut.jpg");
donutTexture.wrapS = THREE.RepeatWrapping;
donutTexture.wrapT = THREE.RepeatWrapping;

//Create a WebGLRenderer and turn on shadows in the renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//Create a DirectionalLight and turn on shadows for the light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0); //default; light shining from top
light.castShadow = true; // default false
scene.add(light);

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

//Create a sphere that cast shadows (but does not receive them)
const sphereGeometry = new THREE.TorusGeometry(10, 3, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ map: donutTexture });
// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true; //default is false
sphere.receiveShadow = false; //default
scene.add(sphere);

//Create a plane that receives shadows (but does not cast them)
const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
// scene.add(plane);

//Create a helper for the shadow camera (optional)
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

//Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
scene.add(camera);
camera.position.z = 20;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// renderer.render(scene, camera);

const animate = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(animate);
};
animate();
