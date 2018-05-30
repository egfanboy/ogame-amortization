import React, { Component, Fragment } from 'react';
import { StyledInput, Label } from './input.styled';

export default class Input extends Component {
    render() {
        const {
            onChange,
            label,
            value,
            type = 'text',
            width,
            height,
        } = this.props;

        return (
            <Fragment>
                {label && <Label>{label}</Label>}
                <StyledInput
                    width={width}
                    height={height}
                    value={value}
                    onChange={onChange}
                    type={type}
                />
            </Fragment>
        );
    }
}
