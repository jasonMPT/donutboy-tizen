import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Canvas
// const canvas = document.getElementById('#webgl') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x412234 );

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
camera.position.z = 20;
camera.position.y = 20;
camera.position.x = 20;
scene.add( camera );

// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

// Objects
const torusGeometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const boxGeometry = new THREE.BoxGeometry( .5, .5, .5 );
const material = new THREE.MeshNormalMaterial();

const fontLoader = new FontLoader()

let text: THREE.Mesh;
fontLoader.load(
    '/RBpart-heading_Regular.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 3,
                height: 1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.5,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const text2Geometry = new TextGeometry(
            'by Jason-Kyle De Lara',
            {
                font: font,
                size: 0.5,
                height: 0.005,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.5,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        text = new THREE.Mesh(textGeometry, material)
        const text2 = new THREE.Mesh(text2Geometry, material)
        text.lookAt(camera.position)
        text.position.x = - 15
        text.position.y = + 2
        scene.add(text)
        scene.add(text2)
    }
)
// const textGeometry = new TextGeometry( 'Hello three.js!', {
//     font: new Font( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json' ),
//     size: 80,
//     height: 5,
//     curveSegments: 12,
//     bevelEnabled: true,
//     bevelThickness: 10,
//     bevelSize: 8,
//     bevelOffset: 0,
//     bevelSegments: 5
// } );
// scene.add( textGeometry );
let torusArray:any[] = [];
Array(200).fill(null).map((_,i) => {
    torusArray[i] = new THREE.Mesh( torusGeometry, material );
    scene.add( torusArray[i] );
    torusArray[i] .position.x = (Math.random() - 0.5) * 100;
    torusArray[i] .position.y = (Math.random() - 0.5) * 100;
    torusArray[i] .position.z = (Math.random() - 0.5) * 100;
    torusArray[i] .rotation.x = Math.random() * Math.PI;
    torusArray[i] .rotation.y = Math.random() * Math.PI;
    torusArray[i] .rotation.z = Math.random() * Math.PI;
})

let boxArray:any[] = [];
Array(200).fill(null).map((_,i) => {
    boxArray[i] = new THREE.Mesh( boxGeometry, material );
    scene.add( boxArray[i] );
    boxArray[i] .position.x = (Math.random() - 0.5) * 100;
    boxArray[i] .position.y = (Math.random() - 0.5) * 100;
    boxArray[i] .position.z = (Math.random() - 0.5) * 100;
    boxArray[i] .rotation.x = Math.random() * Math.PI;
    boxArray[i] .rotation.y = Math.random() * Math.PI;
    boxArray[i] .rotation.z = Math.random() * Math.PI;
})



const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.querySelector("#app")!.appendChild(renderer.domElement)

// Controls
// const controls = new OrbitControls( camera, renderer.domElement );
// controls.enableDamping = true;

const cursor = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', (event) => {
    // console.log(cursor)
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
},)


window.addEventListener('resize', ()=>{
    camera.aspect = sizes.width/ sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    render()
}, false)

function animate() {
    requestAnimationFrame(animate)
    // controls.update()

    // Update objects rotation
    torusArray.forEach((torus) => {
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.005;
        torus.rotation.z += 0.01;
        
    })
    boxArray.forEach((box) => {
        box.rotation.x += 0.01;
        box.rotation.y += 0.005;
        box.rotation.z += 0.01;
        
    })

    camera.position.x = cursor.x * 30
    camera.position.y = - cursor.y * 35
    camera.position.z = 30*Math.abs(cursor.x-cursor.y)+10
    camera.lookAt(scene.position)

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()