import * as React from "react";
import * as style from "./style.scss";

const TableInfo: React.SFC<PropType> = ({ dataList, style: propStyle }) => {
  return (
    <table className={style.tableInfo} style={propStyle}>
      <tbody>
        <tr>
          {dataList.map(({ label }) => {
            return <td key={label}>{label}</td>;
          })}
        </tr>
        <tr>
          {dataList.map(({ label, value }) => {
            return <td key={label}>{value}</td>;
          })}
        </tr>
      </tbody>
    </table>
  );
};

interface PropType {
  dataList: Array<{ label: string; value: React.ReactNode }>;
  style?: object;
}

export default TableInfo;
