import React from 'react';

import { Main } from './next-level.styled';

export default class NextLevel extends React.Component {
    static defaultProps = { queue: [] };
    render() {
        const { queue } = this.props;

        return (
            <Main>
                {queue.map((building, i) => (
                    <p key={`${building.type}-${i}`}>
                        {`Planet:${building.planet} Mine:${building.type} ${
                            building.level
                        }`}
                    </p>
                ))}
            </Main>
        );
    }
}
