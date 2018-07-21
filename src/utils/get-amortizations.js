export default function(planetAmortization) {
    if (!planetAmortization || typeof planetAmortization !== 'object')
        return {};

    const planetName = Object.keys(planetAmortization)[0];

    return planetAmortization[planetName];
}
