import React, { Component } from 'react';

import {
    metalMineProd,
    crysMineProd,
    deutMineProd,
    newMetalProd,
    newCrysProd,
    newDeutProd,
    costDeutMine,
    costCrysMine,
    costMetalMine,
    plasmaCost,
    metalPlasmaIncrease,
    crystalPlasmaIncrease,
    deutPlasmaIncrease,
    amortization,
} from '../utils/formulas';

import getBuildingQueue from '../utils/get-building-queue';
import styled from 'styled-components';
import { Planet } from '../components/planet';
import { NextLevel } from '../components/next-levels';
import { Plasma } from '../components/plasma';
import getAmortizations from '../utils/get-amortizations';

const BUILDING_TYPES = {
    m: 'Metal',
    c: 'Crystal',
    d: 'Deut',
};

const planets = [
    {
        name: 'One',
        maxT: 50,
        minT: 10,
        metalMine: 25,
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
        nextBuilding: {},
        plasmaLevel: 0,
        metalProductionIncrease: 0,
        crystalProductionIncrease: 0,
        deutProductionIncrease: 0,
    };

    calculateAmortizations = planets => {
        const {
            speed,
            rates: { m, c, d },
        } = this.state;

        const metalDeutRatio = d / m;
        const crysDeutRatio = d / c;

        const calculateMetalAmortization = ({ metalMine }) => {
            const { metalCost, crysCost } = costMetalMine(metalMine);

            const normalizedCost =
                metalCost * metalDeutRatio + crysCost * crysDeutRatio;

            const normalizedNewProd =
                speed * newMetalProd(metalMine) * metalDeutRatio;

            return amortization(normalizedCost, normalizedNewProd);
        };

        const calculateCrystalAmortization = ({ crystalMine }) => {
            const { metalCost, crysCost } = costCrysMine(crystalMine);

            const normalizedCost =
                metalCost * metalDeutRatio + crysCost * crysDeutRatio;

            const normalizedNewProd =
                speed * newCrysProd(crystalMine) * crysDeutRatio;

            return amortization(normalizedCost, normalizedNewProd);
        };

        const calculateDeutAmortization = ({ deutMine, maxT, minT }) => {
            const { metalCost, crysCost } = costDeutMine(deutMine);

            const normalizedCost =
                metalCost * metalDeutRatio + crysCost * crysDeutRatio;

            const normalizedNewProd =
                speed * newDeutProd(deutMine, (minT + maxT) / 2);

            return amortization(normalizedCost, normalizedNewProd);
        };

        const planetArray = Array.isArray(planets) ? planets : Array(planets);

        const amortizations = planetArray.map(planet => {
            return {
                [planet.name]: {
                    m: calculateMetalAmortization(planet),
                    c: calculateCrystalAmortization(planet),
                    d: calculateDeutAmortization(planet),
                },
            };
        });

        return amortizations.length > 1 ? amortizations : amortizations[0];
    };

    getLowestAmortization = (amortizations, plasmaLevel) => {
        const nextBuilding = amortizations.reduce((acc, planetAmor) => {
            const planetName = Object.keys(planetAmor)[0];

            const { m, c, d } = getAmortizations(planetAmor);

            const lowestAmortization = Math.min(m, c, d);

            const type = Object.entries(planetAmor[planetName]).reduce(
                (acc, element) => {
                    if (element.pop() === lowestAmortization) return element[0];

                    return acc;
                },
                ''
            );

            if (isNaN(acc.value) || acc.value > lowestAmortization)
                return (acc = {
                    planet: planetName,
                    type: BUILDING_TYPES[type],
                    value: lowestAmortization,
                });

            return acc;
        }, {});

        const plasmaAmortization = this.calculatePlasmaAmor(plasmaLevel);

        if (plasmaAmortization < nextBuilding.value)
            return {
                planet: 'Overall',
                type: 'Plasma',
                value: plasmaAmortization,
            };

        return nextBuilding;
    };

    onUpdate = () => {
        const queue = getBuildingQueue(
            this.state.planets,
            this.calculateAmortizations,
            this.getLowestAmortization,
            this.state.plasmaLevel
        );
        const amortizations = this.calculateAmortizations(this.state.planets);
        const lowestAmortization = this.getLowestAmortization(amortizations);
        this.setState({ nextBuilding: lowestAmortization, queue });
    };

    componentDidMount() {
        this.onUpdate();
    }

    calculateNextBuildings = times => {};

    calculatePlasmaAmor = (plasmaLevel = this.state.plasmaLevel) => {
        const {
            speed,
            planets,
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

        this.setState({
            metalProductionIncrease,
            crystalProductionIncrease,
            deutProductionIncrease,
        });

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
        return plasmaAmortization;
    };

    onPlasmaLevelChange = level => {
        const plasmaLevel = level === '' ? '' : parseInt(level);
        this.setState({ plasmaLevel }, () => this.onUpdate());
    };

    onPlanetChange = planetNumb => (key, value) => {
        this.setState(
            state => {
                return (state.planets[planetNumb] = Object.assign(
                    state.planets[planetNumb],
                    { [key]: value }
                ));
            },
            () => this.onUpdate()
        );
    };

    buildPlanets = (planet, i) => {
        const { nextBuilding } = this.state;
        const hasNextBuilding = nextBuilding.planet === planet.name;

        const { m, c, d } = getAmortizations(
            this.calculateAmortizations(planet)
        );

        return (
            <Planet
                key={`${planet}-${i}`}
                {...planet}
                metalAmortization={m}
                crystalAmortization={c}
                deutAmortization={d}
                hasNextBuilding={hasNextBuilding}
                setPlanetNextBuilding={this.setPlanetNextBuilding}
                nextEmpireBuilding={nextBuilding.type}
                speed={this.state.speed}
                rates={this.state.rates}
                onPlanetChange={this.onPlanetChange(i)}
            />
        );
    };

    render() {
        const {
            metalProductionIncrease,
            crystalProductionIncrease,
            deutProductionIncrease,
            plasmaLevel,
            plasmaAmortization,
            nextBuilding,
            queue,
        } = this.state;

        return (
            <Main>
                <PlanetContainer>
                    {this.state.planets.map(this.buildPlanets)}
                    <Plasma
                        metalProductionIncrease={metalProductionIncrease}
                        crystalProductionIncrease={crystalProductionIncrease}
                        deutProductionIncrease={deutProductionIncrease}
                        level={plasmaLevel}
                        onChange={this.onPlasmaLevelChange}
                        amortization={plasmaAmortization}
                        isNext={nextBuilding.type === 'Plasma'}
                    />
                </PlanetContainer>
                <NextLevel next={nextBuilding} queue={queue} />
            </Main>
        );
    }
}

const PlanetContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 450px;
`;

const Main = styled.div`
    display: flex;
    justify-content: space-around;
`;
