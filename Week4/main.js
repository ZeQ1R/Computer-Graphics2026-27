import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(8, 6, 12)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
)
ground.rotation.x = -Math.PI / 2;
const grid = new THREE.GridHelper(20, 20)
scene.add(ground, grid)

const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5)
const directional = new THREE.DirectionalLight(0xFFFFFF, 2)
scene.add(ambient, directional)

const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32)
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 })
const base = new THREE.Mesh(baseGeometry, baseMaterial)
scene.add(base)

const shoulder = new THREE.Group();
shoulder.position.y = 0.5
base.add(shoulder)

const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), baseMaterial)
shoulder.add(shoulderJoint)

const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff })
const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial)
upperArm.position.y = 1.2
shoulder.add(upperArm)

const elbow = new THREE.Group()
elbow.position.y = 2.6
shoulder.add(elbow)

const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), baseMaterial)
elbow.add(elbowJoint)

const foreArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3, 0.6), armMaterial)
foreArm.position.y = 1.25
elbow.add(foreArm)

const wrist = new THREE.Group()
wrist.position.y = 2.8
elbow.add(wrist)

const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), baseMaterial)
wrist.add(wristJoint)

const palm = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.5, 0.5),
  new THREE.MeshStandardMaterial({ color: 0xffaa55 })
)
palm.position.y = 1
wrist.add(palm)

shoulder.rotation.z = THREE.MathUtils.degToRad(-20)
elbow.rotation.z = THREE.MathUtils.degToRad(40)
wrist.rotation.z = THREE.MathUtils.degToRad(-20)

const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc88 })

// --- THUMB (Positioned on the side) ---
const thumbJoint = new THREE.Group()
// Position at the side (left) and slightly lower on the palm
thumbJoint.position.set(-0.9, -0.2, 0.1) 
// Angle out and forward to oppose fingers
thumbJoint.rotation.z = THREE.MathUtils.degToRad(35)
thumbJoint.rotation.x = THREE.MathUtils.degToRad(20)
palm.add(thumbJoint)

const thumbGeom = new THREE.BoxGeometry(0.24, 0.8, 0.24)
const thumb = new THREE.Mesh(thumbGeom, fingerMaterial)
thumb.position.y = 0.4
thumbJoint.add(thumb)


// --- 4 MAIN FINGERS (Top of the palm) ---
// Config for [Index, Middle, Ring, Pinky] heights and widths
const fingerConfigs = [
  { height: 0.95, width: 0.22, xPos: -0.6 }, // Index
  { height: 1.10, width: 0.22, xPos: -0.2 }, // Middle
  { height: 0.95, width: 0.22, xPos: 0.2 },  // Ring
  { height: 0.80, width: 0.20, xPos: 0.6 }   // Pinky
]

fingerConfigs.forEach(cfg => {
  const fingerJoint = new THREE.Group()
  fingerJoint.position.set(cfg.xPos, 0.75, 0)
  palm.add(fingerJoint)

  const geom = new THREE.BoxGeometry(cfg.width, cfg.height, 0.22)
  const finger = new THREE.Mesh(geom, fingerMaterial)
  finger.position.y = cfg.height / 2
  fingerJoint.add(finger)
})

// Controls & Rendering Loop
const rotationSteps = THREE.MathUtils.degToRad(5)
window.addEventListener('keydown', function (event) {
  const key = event.key.toLowerCase()
  if (key === 'q') shoulder.rotation.z += rotationSteps
  if (key === 'a') shoulder.rotation.z -= rotationSteps
  if (key === 'w') elbow.rotation.z += rotationSteps
  if (key === 's') elbow.rotation.z -= rotationSteps
  if (key === 'e') wrist.rotation.z += rotationSteps
  if (key === 'd') wrist.rotation.z -= rotationSteps
})

const orbitControl = new OrbitControls(camera, renderer.domElement)
orbitControl.enableDamping = true

function animate() {
  requestAnimationFrame(animate)
  orbitControl.update()
  renderer.render(scene, camera)
}
animate()