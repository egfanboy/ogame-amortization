import React, { Component, Fragment } from 'react';
import { StyledInput, Label } from './input.styled';

export default class Input extends Component {
    render() {
        const { onChange, label, value, type = 'text' } = this.props;

        return (
            <Fragment>
                <Label>{label}</Label>
                <StyledInput value={value} onChange={onChange} type={type} />
            </Fragment>
        );
    }
}
