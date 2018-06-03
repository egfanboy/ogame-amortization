import React, { Component, Fragment } from 'react';

import {
    metalMineProd,
    crysMineProd,
    deutMineProd,
    plasmaCost,
    metalPlasmaIncrease,
    crystalPlasmaIncrease,
    deutPlasmaIncrease,
    amortization,
} from '../utils/formulas';
import styled from 'styled-components';
import { Planet } from '../components/planet';
import { NextLevel } from '../components/next-levels';

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

export default class Amortization extends Component {
    state = {
        planets: planets,
        speed: 7,
        rates: { m: 2, c: 1, d: 1 },
        amortizations: [],
        nextBuilding: [],
        plasmaLevel: 0,
    };

    componentDidMount() {
        this.calculatePlasmaAmor();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.amortizations !== this.state.amortizations) {
            this.setEmpireNextBuilding();
        }
    }

    calculateNextBuildings = times => {};

    calculatePlasmaAmor = () => {
        const {
            speed,
            plasmaLevel,
            rates: { m, c, d },
        } = this.state;

        const accountProduction = planets.reduce((acc, planet) => {
            const {
                accountMetalProd,
                accountCrystalProd,
                accountDeutProd,
            } = acc;

            const { metalMine, crystalMine, deutMine } = planet;

            const getMetalProd = () => {
                const prod = metalMineProd(metalMine);

                return isNaN(accountMetalProd) ? prod : accountMetalProd + prod;
            };

            const getCrystalProd = () => {
                const prod = crysMineProd(crystalMine);
                console.log(prod);
                return isNaN(accountCrystalProd)
                    ? prod
                    : accountCrystalProd + prod;
            };
            const getDeutProd = () => {
                const prod = deutMineProd(deutMine);

                return isNaN(accountDeutProd) ? prod : accountDeutProd + prod;
            };

            return {
                accountMetalProd: getMetalProd(),
                accountCrystalProd: getCrystalProd(),
                accountDeutProd: getDeutProd(),
            };
        }, {});

        const normalizedAccountProduction = Object.entries(
            accountProduction
        ).reduce((acc, [key, value]) => {
            return (acc = Object.assign(acc, { [key]: speed * value }));
        }, {});

        const {
            accountMetalProd,
            accountCrystalProd,
            accountDeutProd,
        } = normalizedAccountProduction;

        const metalProductionIncrease = metalPlasmaIncrease(
            accountMetalProd,
            plasmaLevel
        );
        const crystalProductionIncrease = crystalPlasmaIncrease(
            accountCrystalProd,
            plasmaLevel
        );
        const deutProductionIncrease = deutPlasmaIncrease(
            accountDeutProd,
            plasmaLevel
        );

        const { metalCost, crystalCost, deutCost } = plasmaCost(plasmaLevel);

        const metalDeutRatio = d / m;
        const crysDeutRatio = d / c;
        const normalizedCost =
            metalCost * metalDeutRatio + crystalCost * crysDeutRatio + deutCost;

        const normalizedProductionIncrease =
            metalProductionIncrease * metalDeutRatio +
            crystalProductionIncrease * crysDeutRatio +
            deutProductionIncrease;

        const plasmaAmortization = amortization(
            normalizedCost,
            normalizedProductionIncrease
        );

        this.setState({ plasmaAmortization });
    };

    setEmpireNextBuilding = () => {
        const { amortizations, plasmaAmortization } = this.state;

        const values = amortizations.reduce(
            (acc, a) => (acc = [a.value, ...acc]),
            []
        );

        const lowestBuilding = Math.min(...values);

        if (plasmaAmortization < lowestBuilding)
            return this.setState({ nextBuilding: 'plasma' });

        const planets = amortizations.filter(e => e.value === lowestBuilding);
        this.setState({ nextBuilding: planets });
    };

    onPlanetChange = planetNumb => (key, value) => {
        this.setState(
            state => {
                return (state.planets[planetNumb] = Object.assign(
                    state.planets[planetNumb],
                    { [key]: value }
                ));
            },
            () => this.calculatePlasmaAmor()
        );
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
        if (nextBuilding === 'plasma') return false;
        return !!nextBuilding.find(e => e.name === name);
    };

    getNextBuilding = name => {
        const { nextBuilding } = this.state;
        if (nextBuilding === 'plasma') return;
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
        return (
            <Main>
                <PlanetContainer>
                    {this.state.planets.map(this.buildPlanets)}
                </PlanetContainer>
                <NextLevel next={this.state.nextBuilding} />
            </Main>
        );
    }
}

const PlanetContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 200px;
`;

const Main = styled.div`
    display: flex;
`;
