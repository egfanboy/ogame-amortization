import React, { Component } from 'react';

import { Card, Icon as AntIcon } from 'antd';

import { plasmaCost } from '../../utils/formulas';
import { formatProduction, formatCost } from '../../utils/format';

import {
    Main,
    Amortization,
    Icon,
    AmortizationContainer,
    PlasmaTitle,
} from './plasma.styled';
import { Input } from '../input';
import { Building } from '../building';
import ReadOnly from './read-only';
import Editable from './editable';

export default class Plasma extends Component {
    state = { editing: false };

    onChangeHandler = ({ target: { value } }) => {
        const { onChange } = this.props;
        console.log(value, typeof value);

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

    toggleEditing = () => this.setState({ editing: !this.state.editing });

    render() {
        const { level, amortization, isNext } = this.props;

        return (
            <Card
                style={{ margin: '5px', minWidth: '400px' }}
                title={
                    <Main>
                        <AntIcon style={{ color: 'green' }} type="api" />
                        <PlasmaTitle>Plasma</PlasmaTitle>
                        {this.state.editing ? (
                            <Editable
                                plasmaLevel={level}
                                toggleEditing={this.toggleEditing}
                                onChange={this.onChangeHandler}
                            />
                        ) : (
                            <ReadOnly
                                plasmaLevel={level}
                                amortization={amortization}
                            />
                        )}
                        <Icon
                            type={this.state.editing ? 'close' : 'edit'}
                            onClick={this.toggleEditing}
                        />
                    </Main>
                }
            >
                <Building
                    headings={['Resource', 'Cost', 'Production Increase']}
                    rows={this.buildRows()}
                />
            </Card>
        );
    }
}
