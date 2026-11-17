
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

const camera = new THREE.PerspectiveCamera(
    60,
    innerWidth / innerHeight,
    0.1,
    100
)
camera.position.set(0, 5, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.5))

const dir = new THREE.DirectionalLight(0xffffff, 2.5)
dir.position.set(4, 6, 5)
scene.add(dir)

scene.add(new THREE.GridHelper(20, 20))

const pickables = []

const colors = [
    0xFF5733,
    0x2ECC71,
    0x3498DB,
    0x9B59B6
]

for (let i = 0; i < 4; i++) {

    let geometry

    if (i === 0) {
        geometry = new THREE.BoxGeometry(1, 1, 1)
    } else if (i === 1) {
        geometry = new THREE.ConeGeometry(0.6, 1.2, 32)
    } else if (i === 2) {
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32)
    } else {
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 50)
    }

    const material = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: 0x000000
    })

    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(-4 + i * 3, 0.6, 0)

    scene.add(mesh)
    pickables.push(mesh)
}

const initialPositions = pickables.map(obj =>
    obj.position.clone()
)

const initialScales = pickables.map(obj =>
    obj.scale.clone()
)

const pointer = new THREE.Vector2()

function updatePointer(event) {

    const rect = renderer.domElement.getBoundingClientRect()

    const px = event.clientX - rect.left
    const py = event.clientY - rect.top

    const W = rect.width
    const H = rect.height

    pointer.x = (2 * px) / W - 1
    pointer.y = 1 - (2 * py) / H
}

const rayCaster = new THREE.Raycaster()

let selected = null
let dragging = false

renderer.domElement.addEventListener('pointerdown', (event) => {

    updatePointer(event)

    rayCaster.setFromCamera(pointer, camera)

    const hits = rayCaster.intersectObjects(pickables)

    if (selected) {
        selected.material.emissive.setHex(0x000000)
    }

    selected = hits.length > 0 ? hits[0].object : null

    if (selected) {

        selected.material.emissive.setHex(0x882200)

        dragging = true
        control.enabled = false
    }
})

const plane = new THREE.Plane(
    new THREE.Vector3(0, 1, 0),
    0
)

const intersect = new THREE.Vector3()

renderer.domElement.addEventListener('pointermove', (event) => {

    if (!dragging || !selected) {
        return
    }

    updatePointer(event)

    rayCaster.setFromCamera(pointer, camera)

    if (rayCaster.ray.intersectPlane(plane, intersect)) {

        const gridLimit = 10

        selected.position.x = THREE.MathUtils.clamp(
            intersect.x,
            -gridLimit,
            gridLimit
        )

        selected.position.z = THREE.MathUtils.clamp(
            intersect.z,
            -gridLimit,
            gridLimit
        )
    }
})

renderer.domElement.addEventListener('pointerup', () => {

    dragging = false
    control.enabled = true
})

const gui = new GUI()

gui.add({
    reset() {

        for (let i = 0; i < pickables.length; i++) {

            pickables[i].position.copy(initialPositions[i])

            pickables[i].scale.copy(initialScales[i])
        }
    }
}, 'reset').name('Reset Positions & Scales')

function animate() {

    requestAnimationFrame(animate)

    control.update()

    renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {

    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(innerWidth, innerHeight)
})
