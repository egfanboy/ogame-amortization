import React, { Fragment } from 'react';
import Building from './building';
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
} from '../utils/formulas';
import { UserContext } from '../pages/amortization';

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
    state = {
        metalMine: this.props.metalMine,
        crystalMine: this.props.crystalMine,
        deutMine: this.props.deutMine,
        rates: this.props.rates,
        speed: this.props.speed,
        normalizedProd: calculateNormalizedProduction(
            {
                metalMine: this.props.metalMine,
                crystalMine: this.props.crystalMine,
                deutMine: this.props.deutMine,
            },
            this.props.speed,
            this.props.rates
        ),
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const {
            metalMine: newMetalMine,
            crystalMine: newCrystalMine,
            deutMine: newDeutMine,
            speed: newSpeed,
            rates: newRates,
        } = nextProps;

        const { metalMine, crystalMine, deutMine, speed, rates } = prevState;

        if (newSpeed !== speed || newRates !== rates)
            return {
                speed: newSpeed,
                rates: newRates,
            };

        if (
            newMetalMine !== metalMine ||
            newCrystalMine !== crystalMine ||
            newDeutMine !== deutMine
        )
            return {
                metalMine: newMetalMine,
                crystalMine: newCrystalMine,
                deutMine: newDeutMine,
            };

        return null;
    }

    calculateMetalAmor = () => {
        const {
            metalMine,
            normalizedProd,
            rates: { m, c, d },
            speed,
        } = this.state;

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
        } = this.state;

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
        } = this.state;

        const metalDeutRatio = d / m;
        const crysDeutRatio = d / c;
        const { metalCost, crysCost } = costDeutMine(deutMine);

        const normalizedCost =
            metalCost * metalDeutRatio + crysCost * crysDeutRatio;

        const normalizedNewProd = speed * newDeutProd(deutMine);

        return amortization(normalizedCost, normalizedNewProd);
    };

    render() {
        const { name, metalMine, crystalMine, deutMine, speed } = this.props;
        return (
            <Fragment>
                <Fragment>
                    <Building
                        mine={'metal'}
                        level={metalMine}
                        newProd={speed * Math.ceil(newMetalProd(metalMine))}
                        cost={costMetalMine(metalMine)}
                        amortization={this.calculateMetalAmor()}
                    />
                    <Building
                        mine="crystal"
                        level={crystalMine}
                        newProd={speed * Math.ceil(newCrysProd(crystalMine))}
                        cost={costCrysMine(crystalMine)}
                        amortization={this.calculateCrysAmor()}
                    />
                    <Building
                        mine="deut"
                        level={deutMine}
                        newProd={speed * Math.ceil(newDeutProd(deutMine))}
                        cost={costDeutMine(deutMine)}
                        amortization={this.calculateDeutAmor()}
                    />
                </Fragment>
            </Fragment>
        );
    }
}

//Base of metal? minecost=m+(crys*metalRatio)+(deut*metalRatio);
//prod=m+crystal*mRation+d*mRatio

/*structure
Planet {
    name
    maxTemp
    minTemp
    metalMine
    crystalMine
    deutMine
    //Calculated
    AvgTemp
    ?? metalProd
    ?? crysProd
    ?? deutProd
    normalizedProd
    metalAmor
    crysAmor
    deutAmor
}
*/
