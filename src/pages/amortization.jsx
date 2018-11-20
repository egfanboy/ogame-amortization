import React, { Component } from 'react';

import {
    Row,
    Col,
    Anchor,
    Button,
    Icon,
    Modal,
    Tooltip,
    Dropdown,
    Menu,
} from 'antd';

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

import fastForward from '../utils/fast-forward';

import getBuildingQueue from '../utils/get-building-queue';
import styled from 'styled-components';
import { Planet } from '../components/planet';
import { Queue, QueueTitle } from '../components/queue';
import { Plasma } from '../components/plasma';
import getAmortizations from '../utils/get-amortizations';

import {
    AddPlanetDialog,
    SettingsDialog,
    RenamePresetDialog,
} from '../components/dialogs';

const BUILDING_TYPES = {
    m: 'Metal',
    c: 'Crystal',
    d: 'Deut',
};

const LOCAL_STORAGE_KEYS = {
    planets: 'ogam-planets',
    plasma: 'ogam-plasma',
    settings: 'ogam-settings',
    presets: 'ogam-presets',
};

export default class Amortization extends Component {
    state = {
        planets: [],
        speed: 1,
        rates: { m: 2, c: 1, d: 1 },
        geo: 0,
        nextBuilding: { planet: '', type: '' },
        plasmaLevel: 0,
        metalProductionIncrease: 0,
        crystalProductionIncrease: 0,
        deutProductionIncrease: 0,
        showAddPlanetDialog: false,
        showSettingsDialog: false,
        showRenamePresetDialog: false,
        presets: [],
        presetIndex: null,
    };

    getPresetMenu = () => (
        <Menu
            onClick={({ key }) => {
                this.handlePresetChange(+key.split('_').pop());
            }}
        >
            {this.state.presets.map((preset, index) => (
                <Menu.Item key={`preset_${index}`}>{preset.name}</Menu.Item>
            ))}
        </Menu>
    );

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

    getLowestAmortization = (amortizations = [], plasmaLevel) => {
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
        const {
            planets,
            rates,
            geo,
            speed,
            presetIndex,
            presets,
            plasmaLevel,
        } = this.state;
        const queue = getBuildingQueue(
            this.state.planets,
            this.calculateAmortizations,
            this.getLowestAmortization,
            this.state.plasmaLevel
        );
        const amortizations = this.calculateAmortizations(planets);
        const lowestAmortization = this.getLowestAmortization(amortizations);

        if (presetIndex !== null) {
            const updatedPresets = presets.map((preset, index) => {
                if (index === presetIndex)
                    return {
                        planets,
                        geo,
                        speed,
                        rates,
                        plasmaLevel,
                        name: preset.name,
                    };
                return preset;
            });

            localStorage.setItem(
                LOCAL_STORAGE_KEYS.presets,
                JSON.stringify({ presets: updatedPresets, presetIndex })
            );
        } else {
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.settings,
                JSON.stringify({ rates, geo, speed })
            );
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.planets,
                JSON.stringify(planets)
            );
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.plasma,
                JSON.stringify(plasmaLevel)
            );
        }

        this.setState({ nextBuilding: lowestAmortization, queue });
    };

    componentDidMount() {
        const { presets, presetIndex } = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEYS.presets)
        ) || { presets: [], presetIndex: null };

        const planets =
            presetIndex !== null
                ? presets[presetIndex].planets
                : JSON.parse(
                      localStorage.getItem(LOCAL_STORAGE_KEYS.planets)
                  ) || [];

        const plasmaLevel =
            presetIndex !== null
                ? presets[presetIndex].plasmaLevel
                : JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.plasma)) ||
                  0;

        const { rates, geo, speed } =
            presetIndex != null
                ? presets[presetIndex]
                : JSON.parse(
                      localStorage.getItem(LOCAL_STORAGE_KEYS.settings)
                  ) || this.state;

        this.setState(
            { planets, rates, geo, speed, presets, presetIndex, plasmaLevel },
            () => this.onUpdate()
        );
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

        if (!planets.length)
            return `Seems like you don't have any planets.
            You can create one using the 'Add Planet' button above.`;

        if (!nextBuilding.planet) return 'Calculating...';

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

    cleanLocalStorage = (keysToIgnore = []) => {
        const ignoredKeys = Array.isArray(keysToIgnore)
            ? keysToIgnore
            : Array(keysToIgnore);

        Object.keys(LOCAL_STORAGE_KEYS).forEach(key => {
            if (!ignoredKeys.includes(key)) localStorage.removeItem(key);
        });
    };

    addPreset = () => {
        if (this.state.presetIndex === null)
            this.setState(
                ({ presets, planets, speed, rates, geo, plasmaLevel }) => {
                    const newPresets = [
                        ...presets,
                        {
                            planets,
                            speed,
                            rates,
                            geo,
                            plasmaLevel,
                            name: `Preset ${presets.length + 1}`,
                        },
                    ];

                    return {
                        presets: newPresets,
                        presetIndex: newPresets.length - 1,
                    };
                },
                () => {
                    this.onUpdate();
                    this.cleanLocalStorage('presets');
                }
            );
    };

    newPreset = () => {
        this.setState(
            {
                planets: [],
                speed: 1,
                rates: { m: 2, c: 1, d: 1 },
                geo: 0,
                plasmaLevel: 0,
                presetIndex: null,
            },
            this.onUpdate
        );
    };

    handlePresetChange = presetIndex => {
        this.setState(({ presets }) => {
            const { plasmaLevel, planets, geo, rates, speed } = presets[
                presetIndex
            ];

            return {
                plasmaLevel,
                planets,
                geo,
                rates,
                speed,
                presetIndex,
            };
        }, this.onUpdate);
    };

    deletePreset = () => {
        this.setState(({ presets, presetIndex }) => {
            presets.splice(presetIndex, 1);

            if (presets.length) {
                const newIndex = presets.length - 1;
                const { plasmaLevel, planets, geo, rates, speed } = presets[
                    newIndex
                ];

                return {
                    plasmaLevel,
                    presets,
                    planets,
                    geo,
                    rates,
                    speed,
                    presetIndex: newIndex,
                };
            } else {
                return {
                    presets,
                    presetIndex: null,
                    plasmaLevel: 0,
                    planets: [],
                    geo: 1,
                    rates: { m: 2, c: 1, d: 1 },
                    speed: 1,
                };
            }
        }, this.onUpdate);
    };

    renamePreset = name => {
        this.setState(({ presets, presetIndex }) => {
            presets[presetIndex].name = name;
            return { presets };
        }, this.onUpdate);
    };

    toggleRenamePreset = () =>
        this.setState({
            showRenamePresetDialog: !this.state.showRenamePresetDialog,
        });

    fastForward = () => {
        const { planets, plasmaLevel } = fastForward(this.state);

        this.setState(
            {
                planets,
                plasmaLevel: plasmaLevel ? plasmaLevel : this.state.plasmaLevel,
            },
            this.onUpdate
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
            planets,
            queue,
            rates,
            speed,
            geo,
            presetIndex,
            presets,
        } = this.state;

        const isAPreset = presetIndex !== null;
        return (
            <React.Fragment>
                <RenamePresetDialog
                    preset={presets[presetIndex] || {}}
                    renamePreset={this.renamePreset}
                    visible={this.state.showRenamePresetDialog}
                    toggleDialog={this.toggleRenamePreset}
                />
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
                        {presets.length > 0 && (
                            <Dropdown overlay={this.getPresetMenu()}>
                                <Button icon="swap">Change Preset</Button>
                            </Dropdown>
                        )}
                        {isAPreset && (
                            <Button
                                icon="edit"
                                onClick={this.toggleRenamePreset}
                            >
                                Rename Preset
                            </Button>
                        )}
                        {isAPreset && (
                            <Button icon="delete" onClick={this.deletePreset}>
                                Delete Preset
                            </Button>
                        )}
                        {!isAPreset && (
                            <Button icon="heart" onClick={this.addPreset}>
                                Save as preset
                            </Button>
                        )}
                        {isAPreset && (
                            <Button icon="plus" onClick={this.newPreset}>
                                New Preset
                            </Button>
                        )}
                        <Button
                            icon="global"
                            onClick={this.toggleAddPlanetDialog}
                        >
                            Add planet
                        </Button>
                        {queue &&
                            queue.length > 0 && (
                                <Tooltip title="This Will Apply all the building upgrades from the `Generate Next Buildings List`">
                                    <Button
                                        icon="forward"
                                        onClick={this.fastForward}
                                    >
                                        Fast Forward
                                    </Button>
                                </Tooltip>
                            )}
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
                    {planets.length !== 0 && (
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
                                    deutProductionIncrease={
                                        deutProductionIncrease
                                    }
                                    level={plasmaLevel}
                                    onChange={this.onPlasmaLevelChange}
                                    amortization={plasmaAmortization}
                                    isNext={nextBuilding.type === 'Plasma'}
                                />
                            </Col>
                        </Row>
                    )}
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
