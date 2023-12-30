import * as THREE from "three";

export function calculatePositions(
  numSpheres: number,
  sphereRadius: number
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];

  //   while (positions.length < numSpheres) {
  // let newPoint = getRandomPointOnSphere(containerRadius);

  const numSpheresInRow = Math.ceil(Math.sqrt(numSpheres) / 2) + 3;
  //   const numSpheresInRow = Math.ceil(Math.sqrt(numSpheres));

  let newX = 0;
  let offsetY = 0;
  let offsetX = 0;

  const centerOffset = numSpheresInRow * sphereRadius - sphereRadius;

  for (let i = 0; i < numSpheresInRow; i++) {
    for (let j = 0; j < numSpheresInRow; j++) {
      if (i % 2 == 0) {
        offsetY = sphereRadius;
      } else {
        offsetY = 0;
      }
      for (let k = 0; k < numSpheresInRow; k++) {
        if (j % 2 == 0) {
          offsetX = sphereRadius;
        } else {
          offsetX = 0;
        }
        const newPoint = new THREE.Vector3(newX - centerOffset, j * sphereRadius * 2 + offsetY - centerOffset, k * sphereRadius * 2 + offsetX - centerOffset);
        positions.push(newPoint);
      }
    }
    newX = newX + sphereRadius * 2;
  }

  // Order by distance from center
  positions.sort((a, b) => {
    const aDistance = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    const bDistance = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);

    return Math.abs(aDistance) - Math.abs(bDistance);
  });

  // Remove extra positions that are furthest from the center
  while (positions.length > numSpheres) {
    positions.pop();
  }

  // Randomize order
  //   positions.sort(() => Math.random() - 0.5);

  return positions;
}

export default calculatePositions;
