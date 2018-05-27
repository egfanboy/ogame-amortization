import React, { Component, Fragment, createContext } from 'react';
import Planet from '../components/planet';

const planets = [
    {
        name: 'One',
        maxTemp: '300',
        minTemp: '10',
        metalMine: 31,
        crystalMine: 22,
        deutMine: 20,
    },
];

export const UserContext = createContext('settings');

export default class Amortization extends Component {
    state = { planets: [], speed: 7, rates: { m: 2, c: 1, d: 1 } };

    buildPlanets = (planet, i) => (
        <Planet
            key={`${planet}-${i}`}
            {...planet}
            speed={this.state.speed}
            rates={this.state.rates}
        />
    );

    render() {
        return (
            <Fragment>
                <UserContext.Provider
                    value={{
                        speed: 7,
                        ratios: {
                            m: 2,
                            c: 1,
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
