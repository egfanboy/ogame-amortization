import React, { Component } from 'react';

import { Row, Col, Anchor, Button, Icon, Modal, Tooltip } from 'antd';

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

import DownloadCsv from '../utils/download-csv';

import getBuildingQueue from '../utils/get-building-queue';
import styled from 'styled-components';
import { Planet } from '../components/planet';
import { Queue, QueueTitle } from '../components/queue';
import { Plasma } from '../components/plasma';
import getAmortizations from '../utils/get-amortizations';

import { AddPlanetDialog, SettingsDialog } from '../components/dialogs';

const BUILDING_TYPES = {
    m: 'Metal',
    c: 'Crystal',
    d: 'Deut',
};

export default class Amortization extends Component {
    state = {
        planets: [],
        speed: 1,
        rates: { m: 2, c: 1, d: 1 },
        geo: 0,
        nextBuilding: { planet: '', type: '' },
        plasmaLevel: 10,
        metalProductionIncrease: 0,
        crystalProductionIncrease: 0,
        deutProductionIncrease: 0,
        showAddPlanetDialog: false,
        showSettingsDialog: false,
    };

    toggleAddPlanetDialog = () =>
        this.setState({ showAddPlanetDialog: !this.state.showAddPlanetDialog });

    toggleSettingsDialog = () =>
        this.setState({ showSettingsDialog: !this.state.showSettingsDialog });

    calculateAmortizations = planets => {
        const {
            speed,
            rates: { m, c, d },
            geo,
        } = this.state;

        const geoFactor = 1 + geo;

        const metalDeutRatio = d / m;
        const crysDeutRatio = d / c;

        const calculateMetalAmortization = ({ metalMine }) => {
            const { metalCost, crysCost } = costMetalMine(metalMine);

            const normalizedCost =
                metalCost * metalDeutRatio + crysCost * crysDeutRatio;

            const normalizedNewProd =
                geoFactor * speed * newMetalProd(metalMine) * metalDeutRatio;

            return amortization(normalizedCost, normalizedNewProd);
        };

        const calculateCrystalAmortization = ({ crystalMine }) => {
            const { metalCost, crysCost } = costCrysMine(crystalMine);

            const normalizedCost =
                metalCost * metalDeutRatio + crysCost * crysDeutRatio;

            const normalizedNewProd =
                geoFactor * speed * newCrysProd(crystalMine) * crysDeutRatio;

            return amortization(normalizedCost, normalizedNewProd);
        };

        const calculateDeutAmortization = ({ deutMine, maxT, minT }) => {
            const { metalCost, crysCost } = costDeutMine(deutMine);

            const normalizedCost =
                metalCost * metalDeutRatio + crysCost * crysDeutRatio;

            const normalizedNewProd =
                geoFactor * speed * newDeutProd(deutMine, (minT + maxT) / 2);

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
        const amortizationsArray = Array.isArray(amortizations)
            ? amortizations
            : Array(amortizations);
        const nextBuilding = amortizationsArray.reduce((acc, planetAmor) => {
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
        const { planets, rates, geo, speed } = this.state;
        const queue = getBuildingQueue(
            this.state.planets,
            this.calculateAmortizations,
            this.getLowestAmortization,
            this.state.plasmaLevel
        );
        const amortizations = this.calculateAmortizations(planets);
        const lowestAmortization = this.getLowestAmortization(amortizations);
        localStorage.setItem('settings', JSON.stringify({ rates, geo, speed }));
        localStorage.setItem('planets', JSON.stringify(planets));
        this.setState({ nextBuilding: lowestAmortization, queue });
    };

    componentDidMount() {
        const planets = JSON.parse(localStorage.getItem('planets')) || [];
        const { rates, geo, speed } =
            JSON.parse(localStorage.getItem('settings')) || this.state;

        this.setState({ planets, rates, geo, speed }, () => this.onUpdate());
    }

    calculatePlasmaAmor = (plasmaLevel = this.state.plasmaLevel) => {
        const {
            speed,
            planets,
            rates: { m, c, d },
            geo,
        } = this.state;

        const geoFactor = 1 + geo;

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
            return (acc = Object.assign(acc, {
                [key]: geoFactor * speed * value,
            }));
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
        const plasmaLevel = level === '' ? '' : parseInt(level, 10);
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

    addPlanet = planet => {
        this.setState({ planets: [...this.state.planets, planet] }, () =>
            this.onUpdate()
        );
    };

    removePlanet = index => () => {
        const { planets } = this.state;

        planets.splice(index, 1);

        this.setState({ planets }, () => this.onUpdate());
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
                removePlanet={this.removePlanet(i)}
            />
        );
    };

    getNextBuildingMessage = () => {
        const { nextBuilding, planets, plasmaLevel } = this.state;

        const planet = planets.filter(
            ({ name }) =>
                name.toLowerCase() === nextBuilding.planet.toLowerCase()
        );

        if (!planet.length)
            return `The next upgrade should be ${
                nextBuilding.type
            } level ${plasmaLevel + 1}`;
        const building = nextBuilding.type;

        return `The next upgrade should be ${building} mine level ${planet[0][
            `${building.toLowerCase()}Mine`
        ] + 1} on ${planet[0].name}`;
    };

    updateSettings = settings => this.setState(settings, () => this.onUpdate());

    render() {
        const {
            metalProductionIncrease,
            crystalProductionIncrease,
            deutProductionIncrease,
            plasmaLevel,
            plasmaAmortization,
            nextBuilding,
            queue,
            rates,
            speed,
            geo,
        } = this.state;

        return (
            <React.Fragment>
                <AddPlanetDialog
                    addPlanet={this.addPlanet}
                    visible={this.state.showAddPlanetDialog}
                    toggleDialog={this.toggleAddPlanetDialog}
                />
                <SettingsDialog
                    updateSettings={this.updateSettings}
                    rates={rates}
                    speed={speed}
                    geo={geo}
                    visible={this.state.showSettingsDialog}
                    toggleDialog={this.toggleSettingsDialog}
                />
                <StyledAnchor>
                    <Button.Group style={{ overflow: 'hidden' }}>
                        <Button
                            icon="setting"
                            onClick={this.toggleSettingsDialog}
                        >
                            Settings
                        </Button>
                        <Button
                            icon="global"
                            onClick={this.toggleAddPlanetDialog}
                        >
                            Add planet
                        </Button>
                        <Button
                            icon="table"
                            onClick={() =>
                                Modal.confirm({
                                    title: <QueueTitle />,
                                    iconType: 'file-excel',
                                    okText: 'Download',
                                    onOk: () => DownloadCsv(queue),
                                    content: <Queue queue={queue} />,
                                })
                            }
                        >
                            Generate Next Buildings List
                        </Button>
                    </Button.Group>
                </StyledAnchor>
                <Main>
                    <NextBuilding>
                        <Tooltip
                            title={`These values are calculated with uni speed: ${speed}, rates: ${
                                rates.m
                            }:${rates.c}:${rates.d} and geologist ${geo}%.\n\n\n
                            These values can be changed in the settings.`}
                        >
                            <Icon
                                style={{ fontSize: '20px', color: 'blue' }}
                                type="info-circle"
                            />
                        </Tooltip>
                        <Message>{this.getNextBuildingMessage()}</Message>
                    </NextBuilding>

                    <Row gutter={16} type="flex" justify="space-between">
                        <Col>
                            {this.state.planets.map(this.buildPlanets)}
                            <Plasma
                                metalProductionIncrease={
                                    metalProductionIncrease
                                }
                                crystalProductionIncrease={
                                    crystalProductionIncrease
                                }
                                deutProductionIncrease={deutProductionIncrease}
                                level={plasmaLevel}
                                onChange={this.onPlasmaLevelChange}
                                amortization={plasmaAmortization}
                                isNext={nextBuilding.type === 'Plasma'}
                            />
                        </Col>
                    </Row>
                </Main>
            </React.Fragment>
        );
    }
}

const StyledAnchor = styled(Anchor)`
    position: absolute;
    right: 10px;
    z-index: 1;

    .ant-anchor-ink:before {
        background: none;
    }
`;
const Message = styled.p`
    margin: 0px 0px 0px 10px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.75);
`;
const NextBuilding = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e8e8e8;
    width: 100%;
    max-width: 615px;
    padding: 10px;
`;

const Main = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 4.5rem;
    flex-direction: column;
`;
