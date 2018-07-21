import React, { Component } from 'react';
import { Input } from '../input';

import { PlanetName, Main, TempContainer } from './planet-info.styled';

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
        const { name, maxT, minT } = this.props;

        return (
            <Main>
                <PlanetName>{name}</PlanetName>
                <TempContainer>
                    <Input
                        width="30"
                        label="Max Temp"
                        value={maxT}
                        onChange={({ target: { value } }) =>
                            this.validateInput('maxT', value)
                        }
                    />
                    <Input
                        width="30"
                        label="Min Temp"
                        value={minT}
                        onChange={({ target: { value } }) =>
                            this.validateInput('minT', value)
                        }
                    />
                </TempContainer>
            </Main>
        );
    }
}
