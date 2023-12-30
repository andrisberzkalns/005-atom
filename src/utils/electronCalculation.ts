// export const electronCalculation = (atomicNumber: number) => {
//   if (atomicNumber <= 0)
//     throw new Error("Atomic number must be greater than 0");

//   let electrons = [];
//   let n = 1;

//   while (atomicNumber > 0) {
//     let maxElectrons = 2 * Math.pow(n, 2);

//     if (atomicNumber >= maxElectrons) {
//       electrons.push(maxElectrons);
//       atomicNumber -= maxElectrons;
//     } else {
//       electrons.push(atomicNumber);
//       atomicNumber = 0;
//     }

//     n++;
//   }

//   return electrons;
// };

import { electrons } from "~/data";

function electronCalculation(atomicNumber: number): number[] {
  const output: number[] = [];

  const electronConfiguration = electrons.find(
    (element) => element.atomicNumber === atomicNumber,
  );
  if (!electronConfiguration) return [];

  for (const [key, value] of Object.entries(electronConfiguration)) {
    if (key === "atomicNumber") continue;
    if (!output[Number(key[0]) - 1]) {
      output[Number(key[0]) - 1] = 0;
    }

    output[Number(key[0]) - 1] += value;
  }

  return output;
}

export default electronCalculation;
