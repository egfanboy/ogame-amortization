import React from 'react';

import { Input } from 'antd';

import {
    Table,
    TableBody,
    TableHeading,
    TableRow,
    RowData,
    TableContainer,
    HeaderRow,
} from './building.styled';

export default class Building extends React.Component {
    static defaultProps = {
        headings: [],
        rows: [],
    };
    onChangeHandler = building => e => {
        const getKey = b => {
            if (b === 'Metal') return 'metalMine';
            if (b === 'Crystal') return 'crystalMine';
            return 'deutMine';
        };

        const { onChange } = this.props;

        onChange(getKey(building), parseInt(e.target.value, 10) || 0);
    };

    buildHeading = heading => (
        <TableHeading key={heading}>{heading}</TableHeading>
    );

    buildRows = ({ ...row }, index) => {
        const { hasNextBuilding, nextBuilding } = this.props;
        const mine = row.building;

        return (
            <TableRow
                key={index}
                isNext={hasNextBuilding && mine === nextBuilding}
            >
                {Object.values(row).map(this.buildRowData(index))}
            </TableRow>
        );
    };

    buildRowData = index => data => {
        const { rows } = this.props;
        const buildingName = rows[index].building;
        if (data && typeof data === 'object' && data.hasOwnProperty('type'))
            return (
                <RowData key={`${typeof data}-${index}`}>
                    <Input
                        value={data.level}
                        onChange={this.onChangeHandler(buildingName)}
                        size="small"
                    />
                </RowData>
            );
        return (
            <RowData key={`${data}-${index}-${typeof data}`}>{data}</RowData>
        );
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
