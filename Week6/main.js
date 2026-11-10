
import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/Addons.js'

// SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

// CAMERAS
const aspect = window.innerWidth / window.innerHeight

const perspective = new THREE.PerspectiveCamera(
    75,
    aspect,
    0.1,
    100
)

perspective.position.set(2, 2, 10)
perspective.lookAt(0, 0, 0)

const size = 8

const ortographic = new THREE.OrthographicCamera(
    -size * aspect,
    size * aspect,
    size,
    -size,
    0.1,
    100
)

ortographic.position.set(0, 0, 10)
ortographic.lookAt(0, 0, 0)

// CAMERA SWITCHING
const cameras = [perspective, ortographic]
let current = 0

console.log('Active: Perspective')

// RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// LIGHTING
const ambient = new THREE.AmbientLight(0xffffff, 0.4)

const directional = new THREE.DirectionalLight(0xffffff, 3.5)
directional.position.set(5, 8, 4)

scene.add(ambient, directional)

// MODEL SETTINGS
const depths = [0, -3, -8]
const colors = [0xA65C4C, 0xed9494, 0x404F82]

// Store all models
const meshes = []

// LOAD PLY MODEL
new PLYLoader().load(
    'models/3dModel.ply',

    (geo) => {
        geo.computeVertexNormals()
        geo.center()

        for (let i = 0; i < depths.length; i++) {

            const material = new THREE.MeshStandardMaterial({
                color: colors[i],
                roughness: 0.4
            })

            const mesh = new THREE.Mesh(geo, material)

            mesh.scale.setScalar(0.02)

            mesh.rotation.x = Math.PI

            mesh.position.x = (i - 1) * 2
            mesh.position.z = depths[i]

            scene.add(mesh)

            meshes.push(mesh)
        }
    },

    (xhr) => {
        console.log(
            'Loading: ' +
            (xhr.loaded / xhr.total * 100).toFixed(2) +
            '%'
        )
    },

    (error) => {
        console.error('Error loading PLY model:', error)
    }
)

// SWITCH CAMERA WITH SPACE
window.addEventListener('keydown', (event) => {

    if (event.code === 'Space' && !event.repeat) {

        event.preventDefault()

        current = (current + 1) % cameras.length

        if (current === 0) {
            console.log('Active: Perspective Camera')
        } else {
            console.log('Active: Orthographic Camera')
        }
    }
})

// ANIMATION
function animate() {

    requestAnimationFrame(animate)

    // Rotate all three models continuously
    meshes.forEach((mesh) => {

        mesh.rotation.y += 0.01
        mesh.rotation.x += 0.005

    })

    // Render using the active camera
    renderer.render(scene, cameras[current])
}

animate()

// WINDOW RESIZE
window.addEventListener('resize', () => {

    const aspect = window.innerWidth / window.innerHeight

    // Update perspective camera
    perspective.aspect = aspect
    perspective.updateProjectionMatrix()

    // Update orthographic camera
    ortographic.left = -size * aspect
    ortographic.right = size * aspect
    ortographic.top = size
    ortographic.bottom = -size

    ortographic.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
})
