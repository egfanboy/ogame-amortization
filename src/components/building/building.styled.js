import styled from 'styled-components';

export const TableContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;
export const Table = styled.table`
    border-collapse: collapse;
    overflow: ellipsis;
    background-color: white;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    & th:first-child {
        border-top-left-radius: 4px;
    }
    & th:last-child {
        border-top-right-radius: 4px;
    }
    width: 75%;
`;
export const TableBody = styled.tbody``;
export const TableHeading = styled.th`
  height: 30px;
  width:30px;
  font-size:10px;
  user-select:none;
  text-align: center;
  color: black;
 background-color:blue;


  }
`;
export const RowData = styled.td`
    text-align: left;

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
