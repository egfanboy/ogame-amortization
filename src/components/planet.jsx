import React, { Fragment } from 'react';
import Building from './building';
import { newMetalProd, amortization } from '../utils/formulas';
import { UserContext } from '../pages/amortization';

export default class Planet extends React.Component {
    calculateMetalAmor = () => {};
    calculateCrysAmor = () => {};
    calculateDeutAmor = () => {};

    calculateNormalizedProduction = speed => {
        const { metalMine, crysMine, deutMine } = this.state;
        const metalProd = 1;
        const crysProd = 2;
        const deutProd = 3;

        return 4;
    };

    render() {
        const { name, metalMine } = this.props;
        return (
            <Fragment>
                <UserContext.Consumer>
                    {({ speed }) => {
                        return (
                            <Building
                                mine={'metal'}
                                level={metalMine}
                                newProd={
                                    speed * Math.ceil(newMetalProd(metalMine))
                                }
                            />
                        );
                    }}
                </UserContext.Consumer>
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
