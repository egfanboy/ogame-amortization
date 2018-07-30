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
    width: 100%;
`;
export const TableBody = styled.tbody`
    text-align: center;
`;
export const TableHeading = styled.th`
  height: 30px;
  width:80px;
  font-size:10px;
  user-select:none;
  text-align: center;
  color: rgba(0,0,0,.85);
 background-color:#fafafa;


  }
`;
export const RowData = styled.td`
    text-align: center;

    user-select: none;
    height: 30px;
    font-size: 12px;
`;

export const HeaderRow = styled.tr``;
export const TableRow = styled.tr`
    transition: all 0.3s;
    ${RowData} {
        color: ${({ isNext }) => (isNext ? 'red' : 'black')};
    }
    &:hover {
        cursor: pointer;
        ${RowData} {
            color: ${({ isNext }) => (isNext ? 'red' : 'black')};
        }
        background-color: #e6f7ff;
    }
`;
