import styled from 'styled-components';

import { Icon as AntIcon } from 'antd';
export const Icon = styled(AntIcon)`
    transition: all 0.3s;
    &:hover {
        cursor: pointer;
        color: ${({ hovercolor }) => hovercolor || 'blue'};
    }
`;

export const Temperature = styled.p`
    margin-bottom: 0px;
`;
export const PlanetName = styled.h4`
    margin-bottom: 0px;
    font-weight: bold;
`;

export const TempContainer = styled.div``;
export const Main = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;
