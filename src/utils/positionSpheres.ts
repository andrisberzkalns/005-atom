import * as THREE from "three";

export interface Position {
  x: number;
  y: number;
  z: number;
}

// function getRandomPointOnSphere(radius: number): Position {
//   // Generate two random angles
//   let theta = 2 * Math.PI * Math.random(); // Range: [0, 2π]
//   let phi = Math.acos(2 * Math.random() - 1); // Range: [0, π]

//   // Convert spherical coordinates to Cartesian coordinates
//   let x = radius * Math.sin(phi) * Math.cos(theta);
//   let y = radius * Math.sin(phi) * Math.sin(theta);
//   let z = radius * Math.cos(phi);

//   return { x, y, z };
// }

// function isPointCloseToOthers(
//   point: Position,
//   points: Position[],
//   threshold: number,
// ): boolean {
//   for (let i = 0; i < points.length; i++) {
//     let dx = points[i]!.x - point.x;
//     let dy = points[i]!.y - point.y;
//     let dz = points[i]!.z - point.z;

//     let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

//     if (distance < threshold * 2) {
//       return true;
//     }
//   }

//   return false;
// }

// export function calculatePositions(
//   numSpheres: number,
//   sphereRadius: number,
//   containerRadius: number,
// ) {
//   let positions: Position[] = [];
//   let it = 0;

//   while (positions.length < numSpheres) {
//     let newPoint = getRandomPointOnSphere(containerRadius);
//     if (!isPointCloseToOthers(newPoint, positions, sphereRadius)) {
//       positions.push(newPoint);
//     }
//     if (it > positions.length + 100) {
//       console.log("Could not find enough positions");
//       break;
//     }
//   }

//   return positions;
// }

export function calculatePositions(
  numSpheres: number,
  sphereRadius: number
): Position[] {
  const positions: Position[] = [];

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
