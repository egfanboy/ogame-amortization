import styled from 'styled-components';

export const TableContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;
export const Table = styled.table`
    border-collapse: collapse;
    overflow: ellipsis;
    background-color: rgba(0, 0, 0, 0.85);

    width: 75%;
`;
export const TableBody = styled.tbody``;
export const TableHeading = styled.th`
  height: 30px;
  font-size:14px;
  user-select:none;
  text-align: center;
  color: white;
  }
`;
export const RowData = styled.td`
    text-align: left;
    padding-left: 80px;
    user-select: none;
    height: 30px;
    color: white;
    font-size: 12px;
`;

export const HeaderRow = styled.tr``;
export const TableRow = styled.tr`
    &:hover {
        cursor: pointer;
        ${RowData} {
            color: #333;
        }
        background-color: #333;
    }
`;
