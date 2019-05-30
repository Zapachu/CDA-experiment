import * as React from "react";
import TableInfo from "./TableInfo";
import { STOCKS } from "./constants";

const StockInfo: React.SFC<PropType> = ({ style: propStyle, stockIndex }) => {
  const stock = STOCKS[stockIndex];
  return (
    <TableInfo
      style={propStyle}
      dataList={[
        { label: "证券代码", value: stock.code },
        { label: "证券简称", value: stock.code },
        { label: "主承销商", value: stock.contractor },
        { label: "初步询价起始日期", value: stock.startDate },
        { label: "初步询价截止日期", value: stock.endDate }
      ]}
    />
  );
};

interface PropType {
  stockIndex: number;
  style?: object;
}

export default StockInfo;
