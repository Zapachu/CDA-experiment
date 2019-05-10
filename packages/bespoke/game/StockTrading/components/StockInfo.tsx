import * as React from "react";
import * as style from "./style.scss";

const StockInfo: React.SFC<PropType> = ({
  code,
  name,
  contractor,
  startDate,
  endDate,
  style: propStyle
}) => {
  return (
    <table className={style.stockInfo} style={propStyle}>
      <tbody>
        <tr>
          <td>证券代码</td>
          <td>证券简称</td>
          <td>主承销商</td>
          <td>初步询价起始日期</td>
          <td>初步询价截止日期</td>
        </tr>
        <tr>
          <td>{code}</td>
          <td>{name}</td>
          <td>{contractor}</td>
          <td>{startDate}</td>
          <td>{endDate}</td>
        </tr>
      </tbody>
    </table>
  );
};

interface PropType {
  code: string;
  name: string;
  contractor: string;
  startDate: string;
  endDate: string;
  style?: object;
}

export default StockInfo;
