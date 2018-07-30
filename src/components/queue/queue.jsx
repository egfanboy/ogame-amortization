import React from 'react';

import { NextBuildings, PlanetName, Main, InfoMessage } from './queue.styled';

export default class NextLevel extends React.Component {
    static defaultProps = { queue: [] };
    render() {
        const { queue } = this.props;

        return (
            <Main>
                <NextBuildings>
                    {queue.map((building, i) => (
                        <React.Fragment
                            key={`${building.type}-${building.planet}-${
                                building.level
                            }`}
                        >
                            <PlanetName>Planet:{building.planet}</PlanetName>
                            <p>
                                Mine:{building.type} {building.level}
                            </p>
                        </React.Fragment>
                    ))}
                </NextBuildings>
            </Main>
        );
    }
}
