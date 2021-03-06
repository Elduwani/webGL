import { OrbitControls } from "./OrbitControls.js"
import { planetaryData, range } from "./planetary_data.js"

/**
 * Scene, Camera, Controls
*/
const scene = new THREE.Scene()
scene.background = new THREE.Color("#000")
const domNode = document.querySelector(".render-container")

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
domNode.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 10, 25)
camera.rotation.x = degToRad(50)
controls.update()

/**
 * Generators | Generators | Generators | 
*/
const generateSphere = (radius, detail = 1) => new THREE.IcosahedronBufferGeometry(radius, detail)
const generateTorus = (radius = 1.4, tube = 0.01, rSegments = 4, tSegments = 80, arc = Math.PI * 2) => new THREE.TorusBufferGeometry(
    radius, tube, rSegments, tSegments, arc
)

/**
 * Materials | Materials | Materials | 
*/
const colors = ["#3532a7", "#646ecb", "#b793e6", "#eae7ed", "#36d1c4", "#a0eecc", "#f6318c", "#a6cb12", "#47d6b6"]
const floorMat = new THREE.MeshStandardMaterial({ color: `rgb(202,63,63)` })
const sunMat = new THREE.MeshStandardMaterial({ color: "white", emissive: 0xff0000 })

/**
 * Meshes | Meshes | Meshes | 
*/
let pivots = [],
    sunRadius = 1,
    sunRotation = 0.0008;

const sGeo = generateSphere(sunRadius)
const sun = new THREE.Mesh(sGeo, sunMat)
const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20), floorMat)
enableWireframe(sGeo, sun)

/**
 * Set Attributes | Set Attributes | Set Attributes | 
 * Generate planets
*/
floor.rotation.x = degToRad(-90)
floor.position.set(0, -2, 0)
sun.castShadow = true
floor.receiveShadow = true

scene.add(sun);

// initHelpers()
generatePlanets(sunRadius)
initLights()
animate()

/**
 * Functions | Functions | Functions |
*/

function generatePlanets(sunRadius) {
    const randomNumber = (max, min = 1) => Math.floor(Math.random() * (max - min)) + min
    const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

    const { min: minRadius, max: maxRadius } = planetaryData.reduce((acc, curr) => {
        if (curr.radius > acc.max) acc.max = curr.radius
        if (curr.radius < acc.min) acc.min = curr.radius
        return acc
    }, { min: planetaryData[0].radius, max: 0 })

    let prevColor

    for (let i = 0; i < planetaryData.length; i++) {
        const color = randomColor()
        if (color === prevColor) {
            i = i - 1
            //Avoid same neighbor color
            continue
        }
        prevColor = color

        const mat = new THREE.MeshStandardMaterial({ color: color, emissive: color })
        const ringMat = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide })

        const { name, orbit, radius, tilt, distance, rotationSpeed, hasRing } = planetaryData[i]
        const newDistance = distance + (sunRadius * 2)

        const r = range([minRadius, maxRadius], [0.08, 0.3], radius)
        const geo = generateSphere(r)
        const planet = new THREE.Mesh(geo, mat)
        enableWireframe(geo, planet, true)
        planet.position.set(-newDistance, 0, 0)
        planet.rotationValue = rotationSpeed / 1000
        planet.rotation.x = degToRad(tilt)

        const path = new THREE.Mesh(generateTorus(newDistance), ringMat)
        path.rotation.x = degToRad(randomNumber(-95, -85))
        path.castShadow = true

        //TODO: Add rings of Saturn
        if (hasRing) {
            const ringGeo = new THREE.RingBufferGeometry(r * 1.2, r * 1.8, 16)
            const ring = new THREE.Mesh(ringGeo, ringMat)
            ring.rotation.x = degToRad(90)
            enableWireframe(ringGeo, ring, true)
            planet.add(ring)
        }

        const pivot = new THREE.Group();
        const orbitValue = (sunRotation * 2) / (i + 1)
        pivot.position.set(0, 0.0, 0);
        pivot.rotation.y = degToRad(randomNumber(320)) //randomized planet's position on the path
        pivot.orbitValue = orbitValue * 1.5

        pivot.add(path, planet)
        scene.add(pivot);
        pivots.push(pivot)
    }
}

function initLights() {
    const ambientLight = new THREE.AmbientLight(`rgb(206,255,92)`, 0.3)
    // const spotLight = new THREE.SpotLight(`rgb(196,239,253)`, 0.4, 0, 0.3)
    const light = new THREE.DirectionalLight(`rgb(196,239,253)`, 0.4, 3000)
    const helper = new THREE.DirectionalLightHelper(light, 2)
    // const shadowHelper = new THREE.CameraHelper(light.shadow.camera)

    light.position.set(2, 5, 0)
    light.target = sun
    // light.castShadow = true
    light.shadow.radius = 5
    light.shadow.mapSize.width = 512 * 2;  // default
    light.shadow.mapSize.height = 512 * 2; // default

    // spotLight.position.set(5, 5, 5)
    // spotLight.castShadow = true
    // spotLight.shadow.radius = 9

    scene.add(light, ambientLight)
}

function animate() {
    requestAnimationFrame(animate)
    sun.rotation.y += sunRotation

    pivots.forEach(pivot => {
        pivot.rotation.y += pivot.orbitValue
        pivot.children[1].rotation.y += pivot.children[1].rotationValue
    })

    renderer.render(scene, camera)
}

function initHelpers() {
    const size = 10
    const divisions = 10
    const gridHelper = new THREE.GridHelper(size, divisions)
    scene.add(new THREE.AxesHelper(5))
}

function enableWireframe(geometry, parent, darkLines) {
    const wireframe = new THREE.WireframeGeometry(geometry)
    const line = new THREE.LineSegments(wireframe)

    line.material.opacity = 0.2
    // line.material.depthTest = true
    line.material.transparent = true
    darkLines && line.material.color.setHex(0x000000)
    parent.add(line)
}

function degToRad(degrees) {
    const pi = Math.PI;
    return degrees * (pi / 180);
}
