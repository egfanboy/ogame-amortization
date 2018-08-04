export default function(
    allPlanets,
    getAmortization,
    getLowestAmortization,
    plasmaLvl,
    projectionAmount = 25
) {
    let queue = [];
    let planets = [...allPlanets];
    let plasmaLevel = plasmaLvl;
    let nextLevel;

    if (!planets.length) return [];

    for (let i = 0; i < projectionAmount; i++) {
        const amortizations = getAmortization(planets);
        const nextBuilding = getLowestAmortization(amortizations, plasmaLevel);

        const index = planets.findIndex(
            planet => planet.name === nextBuilding.planet
        );

        if (nextBuilding.type === 'Plasma') nextLevel = ++plasmaLevel;

        if (nextBuilding.type !== 'Plasma') {
            const currentMine = `${nextBuilding.type.toLowerCase()}Mine`;
            const mineUpgradeLevel = planets[index][currentMine] + 1;
            nextLevel = mineUpgradeLevel;

            planets[index] = Object.assign({}, planets[index], {
                [currentMine]: mineUpgradeLevel,
            });
        }

        queue = [
            ...queue,
            Object.assign({}, nextBuilding, { level: nextLevel }),
        ];
    }
    return queue;
}
