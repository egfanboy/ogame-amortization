import styled from 'styled-components';

import { Icon as AntIcon } from 'antd';
export const Icon = styled(AntIcon)`
    transition: all 0.3s;
    &:hover {
        cursor: pointer;
        color: blue;
    }
`;

export const Main = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    align-items: center;
`;
export const Text = styled.p`
    color: inherit;

    margin-bottom: 0px;
`;

export const PlasmaTitle = styled.h4`
    margin-bottom: 0px;
    font-weight: bold;
`;

export const Info = styled.div``;

export const AmortizationContainer = styled.div`
    display: flex;
    flex-direction: column;
    color: ${({ isNext }) => (isNext ? 'red' : '')};
`;
