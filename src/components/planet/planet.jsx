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

        return amortization(normalizedCost, normalizedNewProd);
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

        return amortization(normalizedCost, normalizedNewProd);
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

        return amortization(normalizedCost, normalizedNewProd);
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
        } = this.props;

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
                        amortization={this.calculateMetalAmor()}
                        onChange={this.onChangeHandler}
                    />
                    <Building
                        mine="crystal"
                        level={crystalMine}
                        newProd={speed * Math.ceil(newCrysProd(crystalMine))}
                        cost={costCrysMine(crystalMine)}
                        amortization={this.calculateCrysAmor()}
                        onChange={this.onChangeHandler}
                    />
                    <Building
                        mine="deut"
                        level={deutMine}
                        newProd={
                            speed *
                            Math.ceil(newDeutProd(deutMine, this.getAvgT()))
                        }
                        cost={costDeutMine(deutMine)}
                        amortization={this.calculateDeutAmor()}
                        onChange={this.onChangeHandler}
                    />
                </BuildingContainer>
            </Main>
        );
    }
}
