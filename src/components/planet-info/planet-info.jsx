import React, { Component } from 'react';
import { Input } from '../input';

import { PlanetName, Main, AverageTemp } from './planet-info.styled';
import { isInt } from 'validator';

export default class PlanetInfo extends Component {
    validateInput = (context, i) => {
        const { onChange } = this.props;
        if (i.length > 3) return onChange(context, this.props[context]);
        if (i === '') return onChange(context, '');
        if (!isInt(i)) return onChange(context, this.props[context]);

        return onChange(context, parseInt(i));
    };

    render() {
        const { name, maxT, minT, onChange } = this.props;

        return (
            <Main>
                <PlanetName>{name}</PlanetName>
                <Input
                    label="Max Temp"
                    value={maxT}
                    onChange={({ target: { value } }) =>
                        this.validateInput('maxT', value)
                    }
                />
                <Input
                    label="Min Temp"
                    value={minT}
                    onChange={({ target: { value } }) =>
                        this.validateInput('minT', value)
                    }
                />
                <AverageTemp>{`Average temp: ${(minT + maxT) /
                    2}`}</AverageTemp>
            </Main>
        );
    }
}
