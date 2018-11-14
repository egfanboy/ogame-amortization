const fastForward = ({ queue, planets }) => {
    const newPlanetValues = queue.reduce((acc, upgrade) => {
        const planetName = upgrade.planet.toLowerCase();

        const upgradeName =
            upgrade.type === 'Plasma'
                ? upgrade.type.toLowerCase()
                : `${upgrade.type.toLowerCase()}Mine`;

        acc[planetName] = {
            ...acc[planetName],
            [upgradeName]: upgrade.level,
        };

        return acc;
    }, {});

    const planetsToUpdate = Object.keys(newPlanetValues);

    return {
        planets: planets.map(planet => {
            const planetName = planet.name.toLowerCase();
            if (planetsToUpdate.includes(planetName)) {
                return { ...planet, ...newPlanetValues[planetName] };
            }
            return planet;
        }),
        plasmaLevel:
            newPlanetValues['overall'] && newPlanetValues['overall'].plasma,
    };
};

export default fastForward;
