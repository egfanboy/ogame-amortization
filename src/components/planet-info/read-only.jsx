import React from 'react';

import { Temperature, PlanetName } from './planet-info.styled';

export default ({ maxT, minT, planetName }) => (
    <React.Fragment>
        <PlanetName>{planetName}</PlanetName>
        <Temperature>{`Min T: ${minT}`}</Temperature>
        <Temperature>{`Max T: ${maxT}`}</Temperature>
    </React.Fragment>
);
