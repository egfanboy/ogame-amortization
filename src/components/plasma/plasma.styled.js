import styled from 'styled-components';

export const Main = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    align-items: center;
`;
export const Amortization = styled.p`
    color: inherit;
`;

export const Info = styled.div``;

export const AmortizationContainer = styled.div`
    display: flex;
    flex-direction: column;
    color: ${({ isNext }) => (isNext ? 'red' : '')};
`;
