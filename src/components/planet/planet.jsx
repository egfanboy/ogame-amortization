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

import Building from '../building';
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
            building: 'metal',
            value: metalAmortization,
        };
        const crystal = {
            building: 'crystal',
            value: crysAmortization,
        };
        const deut = {
            building: 'deut',
            value: deutAmortization,
        };

        const lowestAmortization = Math.min(
            metal.value,
            crystal.value,
            deut.value
        );

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
                        mine="metal"
                        level={metalMine}
                        newProd={speed * Math.ceil(newMetalProd(metalMine))}
                        cost={costMetalMine(metalMine)}
                        amortization={metalAmortization}
                        onChange={this.onChangeHandler}
                        isNext={
                            hasNextBuilding && 'metal' === nextEmpireBuilding
                        }
                    />
                    <Building
                        mine="crystal"
                        level={crystalMine}
                        newProd={speed * Math.ceil(newCrysProd(crystalMine))}
                        cost={costCrysMine(crystalMine)}
                        amortization={crysAmortization}
                        onChange={this.onChangeHandler}
                        isNext={
                            hasNextBuilding && 'crystal' === nextEmpireBuilding
                        }
                    />
                    <Building
                        mine="deut"
                        level={deutMine}
                        newProd={
                            speed *
                            Math.ceil(newDeutProd(deutMine, this.getAvgT()))
                        }
                        cost={costDeutMine(deutMine)}
                        amortization={deutAmortization}
                        onChange={this.onChangeHandler}
                        isNext={
                            hasNextBuilding && 'deut' === nextEmpireBuilding
                        }
                    />
                </BuildingContainer>
            </Main>
        );
    }
}
