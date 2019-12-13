import * as React from "react";
import { InputNumber, Table } from "antd";
import { Label, Lang } from "@elf/component";
import cloneDeep = require("lodash/cloneDeep");

export type TNumberMatrix = number[][];

export function PrivateValueMatrix({
  groupSize,
  callback
}: {
  groupSize: number;
  callback: (matrix: TNumberMatrix) => void;
}) {
  const LIMIT = {
    maxGroupSize: 12,
    maxGoodAmount: 12,
    minMin: 0,
    maxMin: 50,
    minStep: 0,
    maxStep: 10,
    minOffset: 0,
    maxOffset: 10
  };
  const lang = Lang.extractLang({
    goodAmount: ["物品数量(M)", "GoodAmount(M)"],
    minPrivateValue: ["最低心理价值(v1)", "MinPrivateValue(v1)"],
    step: ["心理价值步长", "PrivateValueStep"],
    offset: ["偏移范围", "OffsetRange"],
    generate: ["随机生成", "Generate"],
    player: ["玩家", "Player"],
    good: ["物品", "Good"]
  });
  const [goodAmount, setGoodAmount] = React.useState(LIMIT.maxGoodAmount >> 1),
    [min, setMin] = React.useState(LIMIT.maxMin),
    [step, setStep] = React.useState(LIMIT.maxStep),
    [offset, setOffset] = React.useState(LIMIT.maxOffset),
    geneMatrix = (): TNumberMatrix =>
      Array(LIMIT.maxGroupSize)
        .fill(null)
        .map(() =>
          Array(LIMIT.maxGoodAmount)
            .fill(null)
            .map(
              (_, i) =>
                min + step * i + Math.round((2 * Math.random() - 1) * offset)
            )
        ),
    [matrix, _setMatrix] = React.useState(geneMatrix),
    setMatrix = (matrix: TNumberMatrix) => {
      _setMatrix(matrix);
      callback(matrix.slice(0, groupSize).map(row => row.slice(0, goodAmount)));
    };
  React.useEffect(() => setMatrix(geneMatrix()), []);
  const tableScroll = goodAmount > LIMIT.maxGoodAmount / 2;
  return (
    <section>
      <Label label={lang.goodAmount} />
      <InputNumber
        value={goodAmount}
        onChange={v => setGoodAmount(v)}
        max={LIMIT.maxGoodAmount}
      />
      &nbsp;&nbsp;&nbsp;
      <Label label={lang.minPrivateValue} />
      <InputNumber
        value={min}
        onChange={v => setMin(v)}
        min={LIMIT.minMin}
        max={LIMIT.maxMin}
      />
      <br />
      <Label label={lang.step} />
      <InputNumber
        value={step}
        onChange={v => setStep(v)}
        min={LIMIT.minStep}
        max={LIMIT.maxStep}
      />
      &nbsp;&nbsp;&nbsp;
      <Label label={lang.offset} />
      <InputNumber
        value={offset}
        onChange={v => setOffset(v)}
        min={LIMIT.minOffset}
        max={LIMIT.maxOffset}
      />
      &nbsp;&nbsp;&nbsp;
      <a onClick={() => setMatrix(geneMatrix())}>{lang.generate}</a>
      <Table
        scroll={tableScroll ? { x: 100 } : {}}
        pagination={false}
        size="small"
        columns={[
          {
            render: (_, __, i) => (
              <div style={{ width: "3.5rem" }}>{`${lang.player}${i + 1}`}</div>
            ),
            fixed: tableScroll ? "left" : null
          },
          ...Array(goodAmount)
            .fill(null)
            .map((_, c) => ({
              title: `${lang.good}${c + 1}`,
              render: (_, row, r) => (
                <InputNumber
                  size={"small"}
                  style={{ width: "3.5rem" }}
                  value={row[c]}
                  onChange={val => {
                    const newMatrix = cloneDeep(matrix);
                    newMatrix[r][c] = val;
                    setMatrix(newMatrix);
                  }}
                />
              )
            }))
        ]}
        dataSource={matrix.slice(0, groupSize)}
      />
    </section>
  );
}
