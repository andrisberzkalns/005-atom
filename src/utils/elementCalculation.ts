export const elementCalculation = (atomicNumber: number, mass: number, charge: number = 0) => {
    return {
        protons: atomicNumber,
        neutrons: Math.round(mass) - atomicNumber,
        electrons: atomicNumber - charge
    }
};

export default elementCalculation;