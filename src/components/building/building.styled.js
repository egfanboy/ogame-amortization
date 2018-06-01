import styled from 'styled-components';

export const TableContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;
export const Table = styled.table`
    border-collapse: collapse;
    overflow: ellipsis;
    background-color: rgba(255, 255, 255, 0.85);

    width: 75%;
`;
export const TableBody = styled.tbody``;
export const TableHeading = styled.th`
  height: 30px;
  font-size:12px;
  user-select:none;
  text-align: center;
  color: black;
  }
`;
export const RowData = styled.td`
    text-align: left;
    padding: 5px 40px;
    user-select: none;
    height: 30px;
    font-size: 12px;
`;

export const HeaderRow = styled.tr``;
export const TableRow = styled.tr`
    ${RowData} {
        color: ${({ isNext }) => (isNext ? 'red' : 'black')};
    }
    &:hover {
        cursor: pointer;
        ${RowData} {
            color: ${({ isNext }) => (isNext ? 'red' : 'black')};
        }
        background-color: pink;
    }
`;
