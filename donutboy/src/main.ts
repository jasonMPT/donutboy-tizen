import "./style.css";
import * as THREE from "three";
// import * as dat from "lil-gui";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

/**
 * Score
 */
const scoreElement = document.querySelector("#score") as HTMLHeadingElement;
let score = 0;

/**
 * Elements
 */
const instructionsDiv = document.getElementById("instructions")!;
const gameoverDiv = document.getElementById("gameover")!;
/**
 * Debugger GUI
 */
// const gui = new dat.GUI();

/**
 * Canvas
 */
const canvas = document.querySelector("#game") as HTMLCanvasElement;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Objects
 */

//Background
const backgroundGeometry = new THREE.PlaneGeometry(640, 640, 1, 1);
const backgroundMaterial = new THREE.MeshStandardMaterial({ color: 0xd2d2d2 });
const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
background.position.z = -5;

// Donut
const donutGeometry = new THREE.TorusGeometry(8, 3, 16, 100);
const donutMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const donut = new THREE.Mesh(donutGeometry, donutMaterial);
donut.position.y = 125;

// Box
const boxGeometry = new THREE.BoxGeometry(30, 10, 30);
const boxMaterial = new THREE.MeshStandardMaterial({
	color: "pink",
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// const boxHelper = new THREE.BoxHelper(box, 0xffff00);
// scene.add(boxHelper);

box.rotation.x = 0.5;
box.position.z = 0;
box.position.y = -100;
scene.add(background, donut, box);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.75);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
directionalLight.position.set(-50, -75, 125);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2024;
directionalLight.shadow.mapSize.height = 2024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 400;
directionalLight.shadow.camera.left = -256;
directionalLight.shadow.camera.right = 256;
directionalLight.shadow.camera.top = 256;
directionalLight.shadow.camera.bottom = -256;
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.75);
directionalLight2.position.set(50, 75, 125);
directionalLight2.castShadow = true;
directionalLight2.shadow.mapSize.width = 2024;
directionalLight2.shadow.mapSize.height = 2024;
directionalLight2.shadow.camera.near = 0.5;
directionalLight2.shadow.camera.far = 400;
directionalLight2.shadow.camera.left = -256;
directionalLight2.shadow.camera.right = 256;
directionalLight2.shadow.camera.top = 256;
directionalLight2.shadow.camera.bottom = -256;
scene.add(directionalLight2);

/**
 * Resize
 */

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
	100,
	sizes.width / sizes.height,
	0.1,
	1000
);
camera.position.z = 100;
// gui.add(camera.position, "z", -100, 250, 0.01).name("camera z");

/**
 * Controls
 */
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Cursor
 */
const cursor = {
	x: 0,
	y: 0,
};
window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true,
	alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
background.receiveShadow = true;
box.receiveShadow = true;
donut.castShadow = true;

/**
 * Animate
 */
let isPlaying = false;
let rate = 1;
let gameOver = false;
let totalDonuts = 0;

const clock = new THREE.Clock();
let previousTime = 0;

window.addEventListener("keydown", (e) => {
	if (e.code === "Space" && !isPlaying) {
		isPlaying = true;
		instructionsDiv.classList.add("hidden");
		animate();
	}
});
const animate = () => {
	console.log(rate);
	if (gameOver) {
		console.log("game over", totalDonuts, score);
		gameoverDiv.classList.remove("hidden");
		return;
	}

	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	if (rate < 3.5) rate += (elapsedTime * deltaTime) / 100;

	// Update controls
	// controls.update();

	// Update objects
	box.position.x = (cursor.x * sizes.width) / 4;
	// console.log(donut.position.y);
	// if (donut.position.y > -100 && donut.position.y < -99)
	// 	console.log(box.position.x, donut.position.x);
	if (donut.position.y < -105) {
		//increase score if donut and box are in same x position
		if (
			box.position.x < donut.position.x + 10 &&
			box.position.x > donut.position.x - 10
		) {
			score += 1;
			// console.log("score", score);
		}

		totalDonuts += 1;
		scoreElement.innerHTML =
			score.toString() + " / " + totalDonuts.toString();
		if (totalDonuts - score > 2) gameOver = true;

		//move donut back top
		donut.position.y = 125;
		donut.position.x = Math.random() * 100 - 50;
	}
	donut.position.y -= rate;
	// Render
	renderer.render(scene, camera);

	// Call animate again on the next frame
	window.requestAnimationFrame(animate);
};
