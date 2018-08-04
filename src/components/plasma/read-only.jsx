import React from 'react';

import { Text } from './plasma.styled';

export default ({ plasmaLevel, amortization }) => (
    <React.Fragment>
        <Text>{`Level: ${plasmaLevel}`}</Text>
        <Text>{`Amortization: ${amortization}`}</Text>
    </React.Fragment>
);
