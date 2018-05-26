import React, { Component, Fragment, createContext } from 'react';
import Planet from '../components/planet';

const planets = [
    {
        name: 'One',
        maxTemp: '30',
        metalMine: 31,
        crystalMine: 21,
        deutMine: 20,
    },
];

export const UserContext = createContext('settings');

export default class Amortization extends Component {
    state = { planets: [] };

    buildPlanets = (planet, i) => <Planet key={`${planet}-${i}`} {...planet} />;

    render() {
        return (
            <Fragment>
                <UserContext.Provider
                    value={{
                        speed: 7,
                        ratios: {
                            m: 3,
                            c: 2,
                            d: 1,
                        },
                    }}
                >
                    {planets.map(this.buildPlanets)}
                </UserContext.Provider>
            </Fragment>
        );
    }
}
