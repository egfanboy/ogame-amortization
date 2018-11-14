const HOUR_DAY_CONVERSION = 24;

function pow(b, e) {
    return Math.pow(b, e);
}

export function metalMineProd(level) {
    return Math.max(30, 30 * level * pow(1.1, level));
}

export function crysMineProd(level) {
    return Math.max(20, 20 * level * pow(1.1, level));
}

export function deutMineProd(level, avgT = 30) {
    return Math.max(0, 10 * level * pow(1.1, level) * (-0.004 * avgT + 1.36));
}

export function newMetalProd(level) {
    return metalMineProd(level + 1) - metalMineProd(level);
}

export function newCrysProd(level) {
    return crysMineProd(level + 1) - crysMineProd(level);
}

export function newDeutProd(level, avgT = 30) {
    return deutMineProd(level + 1, avgT) - deutMineProd(level, avgT);
}

/* cost factors are calculated with an exponent of level-1 but since
 this is the cost for the next level it is simple level*/

export function costMetalMine(level) {
    const costFactor = pow(1.5, level);

    const metalCost = 60 * costFactor;
    const crysCost = 15 * costFactor;
    // const normalizedCost

    return { metalCost, crysCost };
}

export function costCrysMine(level) {
    const costFactor = pow(1.6, level);

    const metalCost = 48 * costFactor;
    const crysCost = 24 * costFactor;

    return { metalCost, crysCost };
}

export function costDeutMine(level) {
    const costFactor = pow(1.5, level);

    const metalCost = 225 * costFactor;
    const crysCost = 75 * costFactor;

    return { metalCost, crysCost };
}

export function metalPlasmaIncrease(metalProduction, level) {
    return metalProduction * (0.01 * (level + 1));
}

export function crystalPlasmaIncrease(crystalProduction, level) {
    return crystalProduction * (0.0066 * (level + 1));
}

export function deutPlasmaIncrease(deutProduction, level) {
    return deutProduction * (0.0033 * (level + 1));
}

//Formula=base cost *2 exp(level)

export function plasmaCost(level) {
    const multiplier = pow(2, level || 0);

    const metalCost = 2000 * multiplier;
    const crystalCost = 4000 * multiplier;
    const deutCost = 1000 * multiplier;

    return { metalCost, crystalCost, deutCost };
}

export function amortization(normalizedCost, normalizedProduction) {
    const amortization =
        normalizedCost / (normalizedProduction * HOUR_DAY_CONVERSION);

    //.toFixed() returns a string so we are parsing it to make it a number again
    if (amortization < 1) {
        return parseFloat(amortization.toFixed(2));
    }

    return Math.ceil(amortization);
}
