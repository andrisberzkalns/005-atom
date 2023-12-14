export const electronCalculation = (atomicNumber: number) => {
  if (atomicNumber <= 0)
    throw new Error("Atomic number must be greater than 0");

  let electrons = [];
  let n = 1;

  while (atomicNumber > 0) {
    let maxElectrons = 2 * Math.pow(n, 2);

    if (atomicNumber >= maxElectrons) {
      electrons.push(maxElectrons);
      atomicNumber -= maxElectrons;
    } else {
      electrons.push(atomicNumber);
      atomicNumber = 0;
    }

    n++;
  }

  return electrons;
};

export default electronCalculation;
