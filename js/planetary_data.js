export const planetaryData = [
    { name: "Mercury", radius: 0.38, orbit: 88, tilt: 0, distance: 0.387, rotationSpeed: 58 },
    { name: "Venus", radius: 0.949, orbit: 225, tilt: 177.3, distance: 0.723, rotationSpeed: -244 },
    { name: "Earth", radius: 1, orbit: 364, tilt: 23.4, distance: 1, rotationSpeed: 1 },
    { name: "Mars", radius: 0.532, orbit: 687, tilt: 25, distance: 1.52, rotationSpeed: 1.03 },
    { name: "Jupiter", radius: 11.21, orbit: 4331, tilt: 3.1, distance: 5.20, rotationSpeed: 0.415, hasRing: true },
    { name: "Saturn", radius: 9.45, orbit: 10756, tilt: 26.7, distance: 9.58, rotationSpeed: 0.445, hasRing: true },
    { name: "Uranus", radius: 4, orbit: 30687, tilt: 97.8, distance: 19.20, rotationSpeed: -0.720, hasRing: true },
    { name: "Neptune", radius: 3.88, orbit: 60190, tilt: 28.3, distance: 30, rotationSpeed: 0.673, hasRing: true },
]
// { name: "Pluto", radius: 0.186, orbit: 247.9, tilt: 120, distance: 39.48, rotationSpeed: 6.41 }

const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
export const range = (inputRange, outputRange, number) => {
    return lerp(outputRange[0], outputRange[1], invlerp(inputRange[0], inputRange[1], number));
}