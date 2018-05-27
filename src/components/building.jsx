import React, { Component, Fragment } from 'react';

import styled from 'styled-components';

export default class Building extends Component {
    formatCost = cost => {
        const MILLION_UNITS = Math.pow(10, 6);
        const THOUSAND_UNITS = Math.pow(10, 3);

        if (cost / MILLION_UNITS > 1)
            return `${(cost / MILLION_UNITS).toPrecision(4)}kk`;

        if (cost / THOUSAND_UNITS > 1)
            return `${(cost / THOUSAND_UNITS).toPrecision(4)}k`;

        return cost.toFixed(2);
    };

    formatProduction = production => {
        const reverseString = s =>
            s
                .split('')
                .reverse()
                .join('');

        const productionString = reverseString(production.toString());

        const CHUNK = 3;
        let chunks = [];
        for (let i = 0; i < productionString.length; i = i + CHUNK) {
            chunks = [productionString.substr(i, i + CHUNK), ...chunks];
        }

        return chunks.map(reverseString).join(',');
    };

    render() {
        const {
            mine,
            level,
            newProd,
            cost: { metalCost, crysCost },
            amortization,
        } = this.props;

        return (
            <Container>
                <P>{mine}</P>
                <P>{level}</P>
                <P>{this.formatProduction(newProd)}</P>
                <P>{this.formatCost(metalCost)}</P>
                <P>{this.formatCost(crysCost)}</P>
                <P>{amortization && amortization}</P>
            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
`;

const P = styled.p`
    padding: 5px;
`;
