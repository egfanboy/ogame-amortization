export const formatCost = cost => {
    const MILLION_UNITS = Math.pow(10, 6);
    const THOUSAND_UNITS = Math.pow(10, 3);

    if (cost / MILLION_UNITS >= 1)
        return `${(cost / MILLION_UNITS).toPrecision(4)}kk`;

    if (cost / THOUSAND_UNITS >= 1)
        return `${(cost / THOUSAND_UNITS).toPrecision(4)}k`;

    return Math.ceil(cost);
};

export const formatProduction = production => {
    const reverseString = s =>
        s
            .split('')
            .reverse()
            .join('');

    const productionString = reverseString(production.toString());

    const CHUNK = 3;
    let chunks = [];
    for (let i = 0; i < productionString.length; i = i + CHUNK) {
        chunks = [productionString.substr(i, i + CHUNK), ...chunks];
    }

    return chunks.map(reverseString).join(',');
};
