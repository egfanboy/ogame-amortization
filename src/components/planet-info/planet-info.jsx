import React, { Component } from 'react';
import { Input } from '../input';

import ReadOnly from './read-only';
import Editable from './editable';
import { PlanetName, Main, TempContainer, Icon } from './planet-info.styled';

import { isInt } from 'validator';

export default class PlanetInfo extends Component {
    state = { editing: false };
    validateInput = (context, i) => {
        const { onChange } = this.props;
        if (i.length > 3) return onChange(context, this.props[context]);
        if (i === '') return onChange(context, '');
        if (!isInt(i)) return onChange(context, this.props[context]);

        return onChange(context, parseInt(i));
    };

    toggleEditing = () => this.setState({ editing: !this.state.editing });

    render() {
        const { name, maxT, minT, removePlanet } = this.props;

        return (
            <Main>
                <Icon type="global" />
                <PlanetName>{name}</PlanetName>
                {this.state.editing ? (
                    <Editable
                        maxT={maxT}
                        minT={minT}
                        onChange={this.validateInput}
                        toggleEditing={this.toggleEditing}
                    />
                ) : (
                    <ReadOnly maxT={maxT} minT={minT} />
                )}
                <Icon
                    type={this.state.editing ? 'close' : 'edit'}
                    onClick={this.toggleEditing}
                />
                <Icon type="delete" hovercolor="red" onClick={removePlanet} />
            </Main>
        );
    }
}
