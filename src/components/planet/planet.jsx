import React, { Fragment } from 'react';

import { Card } from 'antd';

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

export default class Planet extends React.Component {
    onChangeHandler = (key, value) => {
        const { onPlanetChange } = this.props;

        onPlanetChange(key, value);
    };

    getAvgT = () => {
        const { minT, maxT } = this.props;

        return (minT + maxT) / 2;
    };

    BuildBuildingRows = () => {
        const {
            metalMine,
            crystalMine,
            deutMine,
            speed,
            metalAmortization,
            crystalAmortization,
            deutAmortization,
        } = this.props;

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
                amortization: crystalAmortization,
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
            minT,
            maxT,
            hasNextBuilding,
            nextEmpireBuilding,
        } = this.props;

        return (
            <Card
                style={{ margin: '5px', minWidth: '400px' }}
                title={
                    <PlanetInfo
                        name={name}
                        minT={minT}
                        maxT={maxT}
                        onChange={this.onChangeHandler}
                    />
                }
            >
                <Building
                    hasNextBuilding={hasNextBuilding}
                    nextBuilding={hasNextBuilding ? nextEmpireBuilding : null}
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
            </Card>
        );

        return (
            <Main>
                <PlanetInfo
                    name={name}
                    minT={minT}
                    maxT={maxT}
                    onChange={this.onChangeHandler}
                />
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
