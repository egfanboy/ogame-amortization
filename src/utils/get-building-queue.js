export default function(
    planets,
    getAmortization,
    getLowestAmortization,
    plasmaLevel
) {
    let x = [];
    let p = [...planets];
    let plasma = plasmaLevel;

    for (let i = 0; i < 10; i++) {
        const amortizations = getAmortization(p);
        const y = getLowestAmortization(amortizations, plasma);
        x = [...x, y];

        const index = p.findIndex(planet => {
            console.log(y.planet, planet.name);
            return planet.name === y.planet;
        });

        if (y.type === 'Plasma') {
            plasma++;
        }

        if (y.type !== 'Plasma')
            p[index] = Object.assign({}, p[index], {
                [`${y.type.toLowerCase()}Mine`]:
                    p[index][`${y.type.toLowerCase()}Mine`] + 1,
            });
    }

    console.log(x);
}
