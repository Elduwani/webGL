import { OrbitControls } from "./OrbitControls.js"

/**
 * Scene, Camera, Controls
*/
const scene = new THREE.Scene()
scene.background = new THREE.Color("#111")

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 10, 15)
camera.rotation.x = degToRad(50)
controls.update()

/**
 * Generators | Generators | Generators | 
*/
const generateSphere = (radius, detail = 16) => new THREE.SphereBufferGeometry(radius, detail, detail)
const generateTorus = (radius = 1.4, tube = 0.01, radialSegments = 4, tabularSegments = 64) => new THREE.TorusBufferGeometry(
    radius, tube, radialSegments, tabularSegments
)

/**
 * Materials | Materials | Materials | 
*/
const colors = ["#3532a7", "#646ecb", "#b793e6", "#eae7ed", "#36d1c4", "#a0eecc", "#f6318c"]

const floorMat = new THREE.MeshStandardMaterial({ color: `rgb(202,63,63)` })
const sunMat = new THREE.MeshStandardMaterial({ color: "white", emissive: 0xff0000 })

/**
 * Meshes | Meshes | Meshes | 
*/
const planets = []
const sGeo = generateSphere(1)
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

const pivot = new THREE.Group();
pivot.position.set(0, 0.0, 0);
pivot.rotation.z = degToRad(12)
scene.add(sun, pivot);

generatePlanet(0.3, 2.4) //Earth
generatePlanet(0.15, 3.2) //N
generatePlanet(0.1, 5) //E

// initHelpers()
initLights()
animate()

/**
 * Functions | Functions | Functions |
*/

function generatePlanet(radius, ringRadius) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const banking = Math.floor(Math.random() * (100 - 80 + 1)) + 80

    const mat = new THREE.MeshStandardMaterial({ color: color, emissive: color })
    const ringMat = new THREE.MeshStandardMaterial({ color: color })

    const geo = generateSphere(radius)
    const planet = new THREE.Mesh(geo, mat)
    const ring = new THREE.Mesh(generateTorus(ringRadius), ringMat)

    planet.position.set(-ringRadius, 0, 0)
    ring.rotation.x = degToRad(banking)
    enableWireframe(geo, planet, true)
    planet.castShadow = true
    ring.castShadow = true
    pivot.add(planet, ring)

    planets.push(planet)
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

    scene.add(light, ambientLight, helper)
}

function animate() {
    requestAnimationFrame(animate)
    sun.rotation.y += 0.002
    pivot.rotation.y += 0.002

    planets.forEach(planet => planet.rotation.y += 0.015)
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
