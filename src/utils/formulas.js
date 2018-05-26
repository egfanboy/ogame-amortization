const HOUR_DAY_CONVERSION = 24;

function pow(b, e) {
    return Math.pow(b, e);
}

export function metalMineProd(level) {
    return 30 * level * pow(1.1, level);
}

export function crysMineProd(level) {
    return 20 * level * pow(1.1, level);
}

export function deutMineProd(level, avgT) {
    return 10 * level * pow(1.1, level) * (-0.004 * avgT + 1.36);
}

export function newMetalProd(level) {
    console.log(level);

    console.log(7 * Math.ceil(metalMineProd(level + 1) - metalMineProd(level)));
    return metalMineProd(level + 1) - metalMineProd(level);
}

export function newCrysProd(level) {
    return crysMineProd(level + 1) - crysMineProd(level);
}

export function newDeutProd(level) {
    return deutMineProd(level + 1) - deutMineProd(level);
}

export function costMetalMine(level) {
    const costFactor = pow(1.5, level - 1);

    const metalCost = 60 * costFactor;
    const crysCost = 15 * costFactor;
    // const normalizedCost

    return { metalCost, crysCost };
}

export function costCrysMine(level) {
    const costFactor = pow(1.6, level - 1);

    const metalCost = 48 * costFactor;
    const crysCost = 24 * costFactor;

    return { metalCost, crysCost };
}

export function costDeutMine(level) {
    const costFactor = pow(1.5, level - 1);

    const metalCost = 225 * costFactor;
    const crysCost = 75 * costFactor;

    return { metalCost, crysCost };
}

export function amortization(normalizedCost, normalizedProduction) {
    return normalizedCost / (normalizedProduction * HOUR_DAY_CONVERSION);
}
