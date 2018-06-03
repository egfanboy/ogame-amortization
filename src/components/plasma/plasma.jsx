import React, { Component } from 'react';

import { plasmaCost } from '../../utils/formulas';
import { formatProduction, formatCost } from '../../utils/format';

import {
    Main,
    Amortization,
    Info,
    AmortizationContainer,
} from './plasma.styled';
import { Input } from '../input';
import { Building } from '../building';

export default class Plasma extends Component {
    onChangeHandler = ({ target: { value } }) => {
        const { onChange } = this.props;

        onChange(value);
    };

    buildRows = () => {
        const {
            level,
            metalProductionIncrease,
            crystalProductionIncrease,
            deutProductionIncrease,
        } = this.props;

        const { metalCost, crystalCost, deutCost } = plasmaCost(level);

        return [
            {
                res: 'Metal',
                cost: formatCost(metalCost),
                increase: formatProduction(
                    Math.ceil(metalProductionIncrease.toFixed(2))
                ),
            },
            {
                res: 'Crystal',
                cost: formatCost(crystalCost),
                increase: formatProduction(
                    Math.ceil(crystalProductionIncrease.toFixed(2))
                ),
            },
            {
                res: 'Deut',
                cost: formatCost(deutCost),
                increase: formatProduction(
                    Math.ceil(deutProductionIncrease.toFixed(2))
                ),
            },
        ];
    };

    render() {
        const { level, amortization, isNext } = this.props;

        return (
            <Main>
                <Info>
                    <h1>Plasma</h1>
                    <Input
                        value={level}
                        label="Level"
                        onChange={this.onChangeHandler}
                    />
                </Info>

                <Building
                    headings={['Ressource', 'Cost', 'Production Increase']}
                    rows={this.buildRows()}
                />
                <AmortizationContainer isNext={isNext}>
                    <h4>Amortization</h4>
                    <Amortization>{amortization}</Amortization>
                </AmortizationContainer>
            </Main>
        );
    }
}
