import React, { Component, Fragment } from 'react';

import styled from 'styled-components';

export default class Building extends Component {
    render() {
        return (
            <Container>
                <P>{this.props.mine}</P>
                <P>{this.props.level}</P>
                <P>{this.props.newProd}</P>
                <P>{'amortizaion'}</P>
            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
`;

const P = styled.p`
    padding: 10px;
`;
