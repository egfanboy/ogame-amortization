import styled from 'styled-components';

export const StyledInput = styled.input`
    width: ${({ width }) => width && `${width}px`};
    height: ${({ height }) => height && `${height}px`};
`;
export const Label = styled.label`
    padding-right: 10px;
`;
