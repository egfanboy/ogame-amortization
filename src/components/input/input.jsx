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
            className,
        } = this.props;

        return (
            <Fragment>
                {label && <Label className={className}>{label}</Label>}
                <StyledInput
                    className={className}
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
