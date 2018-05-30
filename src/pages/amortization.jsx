import React, { Component, Fragment, createContext } from 'react';

import styled from 'styled-components';
import { Planet } from '../components/planet';

const planets = [
    {
        name: 'One',
        maxT: 50,
        minT: 10,
        metalMine: 1,
        crystalMine: 22,
        deutMine: 20,
    },
    {
        name: 'And Justice for All',
        maxT: 70,
        minT: 10,
        metalMine: 20,
        crystalMine: 15,
        deutMine: 20,
    },
    {
        name: 'cool',
        maxT: 50,
        minT: 10,
        metalMine: 20,
        crystalMine: 15,
        deutMine: 7,
    },
];

export const UserContext = createContext('settings');

export default class Amortization extends Component {
    state = {
        planets: planets,
        speed: 7,
        rates: { m: 2, c: 1, d: 1 },
        amortizations: [],
        nextBuilding: [],
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.amortizations !== this.state.amortizations) {
            this.setEmpireNextBuilding();
        }
    }

    setEmpireNextBuilding = () => {
        const { amortizations } = this.state;
        console.count('yikes');

        const values = amortizations.reduce(
            (acc, a) => (acc = [a.value, ...acc]),
            []
        );

        const lowest = Math.min(...values);

        const planets = amortizations.filter(e => e.value === lowest);
        this.setState({ nextBuilding: planets });
    };

    onPlanetChange = planetNumb => (key, value) => {
        this.setState(state => {
            return (state.planets[planetNumb] = Object.assign(
                state.planets[planetNumb],
                { [key]: value }
            ));
        });
    };

    setPlanetNextBuilding = planet => {
        this.setState(
            state => {
                const { name } = planet;
                if (!state.amortizations === 0)
                    return (state.amortizations = [planet]);

                const isAlreadyInState = state.amortizations.find(
                    e => e.name === name
                );

                if (!isAlreadyInState)
                    return (state.amortizations = [
                        ...state.amortizations,
                        planet,
                    ]);

                return (state.amortizations = state.amortizations.map(e => {
                    if (e.name === name) return planet;

                    return e;
                }));
            },
            () => this.setEmpireNextBuilding()
        );
    };

    hasNextBuilding = name => {
        const { nextBuilding } = this.state;

        return !!nextBuilding.find(e => e.name === name);
    };

    getNextBuilding = name => {
        const { nextBuilding } = this.state;

        return nextBuilding.filter(e => e.name === name).pop().nextBuilding;
    };

    buildPlanets = (planet, i) => {
        const hasNextBuilding = this.hasNextBuilding(planet.name);
        return (
            <Planet
                key={`${planet}-${i}`}
                {...planet}
                hasNextBuilding={hasNextBuilding}
                setPlanetNextBuilding={this.setPlanetNextBuilding}
                nextEmpireBuilding={
                    hasNextBuilding ? this.getNextBuilding(planet.name) : null
                }
                speed={this.state.speed}
                rates={this.state.rates}
                onPlanetChange={this.onPlanetChange(i)}
            />
        );
    };

    render() {
        console.log(this.state.amortizations);
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
