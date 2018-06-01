import React, { Fragment } from 'react';

import {
    newMetalProd,
    amortization,
    newCrysProd,
    newDeutProd,
    costDeutMine,
    costMetalMine,
    costCrysMine,
    metalMineProd,
    crysMineProd,
    deutMineProd,
} from '../../utils/formulas';

import { formatCost, formatProduction } from '../../utils/format';

import { Building } from '../building';
import { PlanetInfo } from '../planet-info';
import { Main, BuildingContainer, InfoContainer } from './planet.styled';

const calculateNormalizedProduction = (
    { metalMine, crystalMine, deutMine },
    speed,
    { m, c, d }
) => {
    const metalDeutRatio = d / m;
    const crysDeutRatio = d / c;
    const metalProd = metalMineProd(metalMine);
    const crysProd = crysMineProd(crystalMine);
    const deutProd = deutMineProd(deutMine);

    return metalProd * metalDeutRatio + crysProd * crysDeutRatio + deutProd;
};

export default class Planet extends React.Component {
    onChangeHandler = (key, value) => {
        const { onPlanetChange } = this.props;

        onPlanetChange(key, value);
    };

    state = {
        crystalAmortization: null,
        metalAmortization: null,
        deutAmortization: null,
        nextBuilding: null,
    };

    componentDidMount() {
        this.calculateMetalAmor();
        this.calculateCrysAmor();
        this.calculateDeutAmor();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.metalAmortization !== this.state.metalAmortization ||
            prevState.crystalAmortization !== this.state.crystalAmortization ||
            prevState.deutAmortization !== this.state.deutAmortization
        )
            this.getLowestAmortization();

        if (
            prevProps.metalMine !== this.props.metalMine ||
            prevProps.crystalMine !== this.props.crystalMine ||
            prevProps.deutMine !== this.props.deutMine ||
            prevProps.minT !== this.props.minT ||
            prevProps.maxT !== this.props.maxT
        ) {
            this.calculateMetalAmor();
            this.calculateCrysAmor();
            this.calculateDeutAmor();
        }
    }

    getLowestAmortization = () => {
        const { setPlanetNextBuilding, name } = this.props;
        const {
            metalAmortization,
            crysAmortization,
            deutAmortization,
        } = this.state;

        const metal = {
            building: 'Metal',
            value: metalAmortization,
        };
        const crystal = {
            building: 'Crystal',
            value: crysAmortization,
        };
        const deut = {
            building: 'Deut',
            value: deutAmortization,
        };

        const amortizationValues = [
            metal.value,
            crystal.value,
            deut.value,
        ].filter(v => !!v);

        const lowestAmortization = Math.min(...amortizationValues);

        const { building: nextBuilding } = [metal, crystal, deut].find(
            e => e.value === lowestAmortization
        );

        setPlanetNextBuilding({
            name,
            nextBuilding,
            value: lowestAmortization,
        });
    };

    getAvgT = () => {
        const { minT, maxT } = this.props;

        return (minT + maxT) / 2;
    };

    calculateMetalAmor = () => {
        const {
            metalMine,
            normalizedProd,
            rates: { m, c, d },
            speed,
        } = this.props;

        const metalDeutRatio = d / m;
        const crysDeutRatio = d / c;
        const { metalCost, crysCost } = costMetalMine(metalMine);

        const normalizedCost =
            metalCost * metalDeutRatio + crysCost * crysDeutRatio;

        const normalizedNewProd =
            speed * newMetalProd(metalMine) * metalDeutRatio;

        const metalAmortization = amortization(
            normalizedCost,
            normalizedNewProd
        );

        this.setState({ metalAmortization });
    };

    calculateCrysAmor = () => {
        const {
            crystalMine,
            normalizedProd,
            rates: { m, c, d },
            speed,
        } = this.props;

        const metalDeutRatio = d / m;
        const crysDeutRatio = d / c;
        const { metalCost, crysCost } = costCrysMine(crystalMine);

        const normalizedCost =
            metalCost * metalDeutRatio + crysCost * crysDeutRatio;

        const normalizedNewProd =
            speed * newCrysProd(crystalMine) * crysDeutRatio;

        const crysAmortization = amortization(
            normalizedCost,
            normalizedNewProd
        );

        this.setState({ crysAmortization });
    };

    calculateDeutAmor = () => {
        const {
            deutMine,
            normalizedProd,
            rates: { m, c, d },
            speed,
            maxT,
            minT,
        } = this.props;

        const metalDeutRatio = d / m;
        const crysDeutRatio = d / c;
        const { metalCost, crysCost } = costDeutMine(deutMine);

        const normalizedCost =
            metalCost * metalDeutRatio + crysCost * crysDeutRatio;

        const normalizedNewProd = speed * newDeutProd(deutMine, this.getAvgT());

        const deutAmortization = amortization(
            normalizedCost,
            normalizedNewProd
        );

        this.setState({ deutAmortization });
    };

    BuildBuildingRows = () => {
        const {
            metalMine,
            crystalMine,
            deutMine,
            speed,
            hasNextBuilding,
            nextEmpireBuilding,
        } = this.props;

        const {
            metalAmortization,
            crysAmortization,
            deutAmortization,
        } = this.state;

        const mines = ['Metal', 'Crystal', 'Deut'];

        const MINE_INFO = {
            Metal: {
                calcProd: newMetalProd,
                level: metalMine,
                cost: costMetalMine,
                amortization: metalAmortization,
            },

            Crystal: {
                calcProd: newCrysProd,
                level: crystalMine,
                cost: costCrysMine,
                amortization: crysAmortization,
            },
            Deut: {
                calcProd: newDeutProd,
                level: deutMine,
                cost: costDeutMine,
                amortization: deutAmortization,
            },
        };

        return mines.reduce((acc, mine) => {
            const { level, calcProd, cost, amortization } = MINE_INFO[mine];

            if (!level) {
                const { metalCost, crysCost } = cost(0);
                return (acc = [
                    ...acc,
                    {
                        building: mine,
                        mineLevel: { type: 'input', level: '' },
                        newProd: formatProduction(
                            speed *
                                Math.ceil(
                                    mine === 'Deut'
                                        ? calcProd(0, this.getAvgT())
                                        : calcProd(0)
                                )
                        ),
                        metalCost: formatCost(metalCost),
                        crystalCost: formatCost(crysCost),
                        amortization: amortization,
                    },
                ]);
            }

            const newProd = formatProduction(
                speed *
                    Math.ceil(
                        mine === 'Deut'
                            ? calcProd(level, this.getAvgT())
                            : calcProd(level)
                    )
            );

            const { metalCost, crysCost } = cost(level);

            const building = {
                building: mine,
                mineLevel: { type: 'input', level },
                newProd,
                metalCost: formatCost(metalCost),
                crystalCost: formatCost(crysCost),
                amortization: amortization,
            };

            return (acc = [...acc, building]);
        }, []);
    };

    render() {
        const {
            name,
            metalMine,
            crystalMine,
            deutMine,
            speed,
            minT,
            maxT,
            hasNextBuilding,
            nextEmpireBuilding,
        } = this.props;

        const {
            metalAmortization,
            crysAmortization,
            deutAmortization,
        } = this.state;

        return (
            <Main>
                <InfoContainer>
                    <PlanetInfo
                        name={name}
                        minT={minT}
                        maxT={maxT}
                        onChange={this.onChangeHandler}
                    />
                </InfoContainer>
                <BuildingContainer>
                    <Building
                        hasNextBuilding={hasNextBuilding}
                        nextBuilding={
                            hasNextBuilding ? nextEmpireBuilding : null
                        }
                        onChange={this.onChangeHandler}
                        rows={this.BuildBuildingRows()}
                        headings={[
                            'Building',
                            'Level',
                            'Production Increase',
                            'Cost Metal',
                            'Cost Crystal',
                            'Amortization',
                        ]}
                    />
                </BuildingContainer>
            </Main>
        );
    }
}
