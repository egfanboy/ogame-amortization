import React, { Component, Fragment } from 'react';

import styled from 'styled-components';

import { Input } from './input';

import {
    Table,
    TableBody,
    TableHeading,
    TableRow,
    RowData,
    TableContainer,
    HeaderRow,
} from './building.styled';

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
            isNext,
        } = this.props;
        return <p>lol</p>;
        // return (
        //     <Container>
        //         <P isNext={isNext}>{mine}</P>
        //         <Input value={level} width="20" height="15" />
        //         <P>{this.formatProduction(newProd)}</P>
        //         <P>{this.formatCost(metalCost)}</P>
        //         <P>{this.formatCost(crysCost)}</P>
        //         <P>{amortization && amortization}</P>
        //     </Container>
        // );
    }
}

const Wrapper = ({ label, children }) => {
    return (
        <WrapperContainer>
            <P>{label}</P>
            {children}
        </WrapperContainer>
    );
};

const WrapperContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-left: 15px;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-around;
`;

const P = styled.p`
    padding: 2px;
    color: ${({ isNext }) => (isNext ? 'red' : 'black')};
`;

/** import {
  Table,
  TableBody,
  TableHeading,
  TableRow,
  RowData,
  TableContainer,
  HeaderRow,
} from './listing.styled';

export class Listing extends React.Component {
  buildHeading = heading => (
    <TableHeading key={heading}>{heading}</TableHeading>
  );

  buildRows = ({ id, ...row }, index) => (
    <TableRow
      key={id}
      onClick={() => this.props.history.push(`/posting/${id}`)}
      isGrey={index % 2 === 0 ? 1 : 0}
    >
      {Object.values(row).map(this.buildRowData)}
    </TableRow>
  );

  buildRowData = data => <RowData key={data}>{data}</RowData>;

  static defaultProps = {
    headings: [],
    rows: [],
  };

  render() {
    const { headings, rows, className } = this.props;

    return (
      <TableContainer className={className}>
        <Table>
          <TableBody>
            <HeaderRow>{headings.map(this.buildHeading)}</HeaderRow>
            {rows.map(this.buildRows)}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
*/
