import React, { Component, Fragment, createContext } from 'react';

import styled from 'styled-components';
import { Planet } from '../components/planet';

const planets = [
    {
        name: 'One',
        maxT: 50,
        minT: 10,
        metalMine: 31,
        crystalMine: 22,
        deutMine: 20,
    },
];

export const UserContext = createContext('settings');

export default class Amortization extends Component {
    state = { planets: planets, speed: 7, rates: { m: 2, c: 1, d: 1 } };

    onPlanetChange = planetNumb => (key, value) => {
        console.log(planetNumb);

        this.setState(state => {
            return (state.planets[planetNumb] = Object.assign(
                state.planets[planetNumb],
                { [key]: value }
            ));
        });
    };

    buildPlanets = (planet, i) => (
        <Planet
            key={`${planet}-${i}`}
            {...planet}
            speed={this.state.speed}
            rates={this.state.rates}
            onPlanetChange={this.onPlanetChange(i)}
        />
    );

    render() {
        console.log(this.state.planets);
        return (
            <PlanetContainer>
                {this.state.planets.map(this.buildPlanets)}
            </PlanetContainer>
        );
    }
}

const PlanetContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
