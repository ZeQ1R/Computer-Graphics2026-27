import * as THREE from 'three'
import { OrbitControls, TGALoader } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerHeight / window.innerHeight,
    0.1,
    100
)

camera.position.set(5,6,7)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const n = new THREE.Vector3(0,1,0)
const p = new THREE.Vector3(0,0,0)
const d = n.dot(p)

const geometry = new THREE.PlaneGeometry(12,12)
const material = new THREE.MeshBasicMaterial({ color: 0x815c5c})
const floor = new THREE.Mesh(geometry, material)
floor.rotation.x = -Math.PI/2
floor.updateMatrixWorld(true)
const grid = new THREE.GridHelper(12,12)
scene.add(floor,grid)

//ray
const o = new THREE.Vector3(2, 5, -1)
const dir = new THREE.Vector3(-1,-1,1).normalize()

const t = (d-n.dot(o))/n.dot(dir)
const hit = o.clone().addScaledVector(dir,t)

const ray = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([o,hit]),
    new THREE.MeshBasicMaterial({color: 0xFF0000})
)
scene.add(ray)

const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.18),
    new THREE.MeshBasicMaterial({color: 0xF5F527})
)
dot.position.copy(hit)
scene.add(dot)

const rayCaster = new THREE.Raycaster(o,dir).intersectObject(floor)[0]
console.log('Our formula : ', hit)
console.log('RayCaster : ', rayCaster.point)


const control = new OrbitControls(camera, renderer.domElement)
function animate(){
    requestAnimationFrame(animate)
    control.update()
    renderer.render(scene,camera)

}

animate()
