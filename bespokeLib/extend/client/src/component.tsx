import * as React from "react";
import { InputNumber, Spin, Table } from "antd";
import { Label, Lang } from "@elf/component";
import { DndProvider, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import cloneDeep = require("lodash/cloneDeep");
import shuffle = require("lodash/shuffle");

type TNumberMatrix = number[][];

export function PrivateValueMatrix({
  groupSize,
  goodAmount: pGoodAmount,
  matrix,
  setMatrix: pSetMatrix
}: {
  groupSize: number;
  matrix: TNumberMatrix;
  setMatrix: (matrix: TNumberMatrix) => void;
  goodAmount?: number;
}) {
  const LIMIT = {
    maxGroupSize: 12,
    maxGoodAmount: 12,
    minBase: 50,
    maxBase: 150,
    minStep: 0,
    maxStep: 10,
    minRange: 0,
    maxRange: 50,
    minPrice: 0,
    maxPrice: 1e3
  };
  const lang = Lang.extractLang({
    goodAmount: ["物品数量(M)", "GoodAmount(M)"],
    minPrivateValue: ["基准心理价值", "BasePrivateValue"],
    range: ["随机范围", "RandomRange"],
    step: ["步长", "MinStep"],
    generate: ["随机生成", "Generate"],
    player: ["玩家", "Player"],
    good: ["物品", "Good"]
  });
  const [sGoodAmount, setSGoodAmount] = React.useState(
      LIMIT.maxGoodAmount >> 1
    ),
    goodAmount = pGoodAmount || sGoodAmount,
    [base, setBase] = React.useState(~~((LIMIT.minBase + LIMIT.maxBase) >> 1)),
    [step, setStep] = React.useState(~~((LIMIT.minStep + LIMIT.maxStep) >> 1)),
    [range, setRange] = React.useState(
      ~~((LIMIT.minRange + LIMIT.maxRange) >> 1)
    ),
    geneMatrix = (): TNumberMatrix =>
      Array(LIMIT.maxGroupSize)
        .fill(null)
        .map(() => {
          const arr = [];
          for (
            let n = base - range + ~~(Math.random() * 2);
            n <= base + range;
            n += ~~(Math.random() * 2) + step
          ) {
            arr.push(n);
          }
          return shuffle(arr).slice(0, LIMIT.maxGoodAmount);
          return Array(LIMIT.maxGoodAmount)
            .fill(null)
            .map(
              (_, i) =>
                base + step * i + Math.round((2 * Math.random() - 1) * range)
            );
        }),
    setMatrix = (matrix: TNumberMatrix) =>
      pSetMatrix(
        matrix.slice(0, groupSize).map(row => row.slice(0, goodAmount))
      );
  React.useEffect(() => {
    if (
      matrix &&
      matrix.length >= groupSize &&
      matrix[0].length >= goodAmount
    ) {
      return;
    }
    setMatrix(geneMatrix());
  }, [groupSize, goodAmount]);
  const inputStyle: React.CSSProperties = { width: "4.5rem" };
  const tableScroll = goodAmount > LIMIT.maxGoodAmount / 2;
  return matrix ? (
    <section style={{ margin: "1rem 0" }}>
      {pGoodAmount ? null : (
        <>
          <Label label={lang.goodAmount} />
          <InputNumber
            value={goodAmount}
            onChange={v => setSGoodAmount(v)}
            min={1}
            max={LIMIT.maxGoodAmount}
            style={inputStyle}
          />
          <br />
        </>
      )}
      <Label label={lang.minPrivateValue} />
      <InputNumber
        value={base}
        onChange={v => setBase(v)}
        min={LIMIT.minBase}
        max={LIMIT.maxBase}
        style={inputStyle}
      />
      &nbsp;&nbsp;&nbsp;
      <Label label={lang.range} />
      <InputNumber
        value={range}
        onChange={v => setRange(v)}
        min={LIMIT.minRange}
        max={LIMIT.maxRange}
        style={inputStyle}
      />
      &nbsp;&nbsp;&nbsp;
      {goodAmount === 1 ? null : (
        <>
          <Label label={lang.step} />
          <InputNumber
            value={step}
            onChange={v => setStep(v)}
            min={LIMIT.minStep}
            max={LIMIT.maxStep}
            style={inputStyle}
          />
        </>
      )}
      <br />
      <a
        style={{ display: "inline-block", margin: ".5rem" }}
        onClick={() => setMatrix(geneMatrix())}
      >
        {lang.generate}
      </a>
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
              title: `${lang.good}${String.fromCharCode(65 + c)}`,
              render: (_, row, r) => (
                <InputNumber
                  size={"small"}
                  style={{ width: "3.5rem" }}
                  min={LIMIT.minPrice}
                  max={LIMIT.maxPrice}
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
  ) : (
    <Spin />
  );
}

const DndBackend = "ontouchstart" in document ? TouchBackend : HTML5Backend;

interface IRowProps {
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}

export function DragTable({ data, setData, ...props }) {
  let dragingIndex = -1;

  function moveRow(dragIndex, hoverIndex) {
    const newData = [];
    data.forEach((d, i) => {
      if (i === dragIndex) {
        return;
      }
      if (dragIndex < hoverIndex) {
        newData.push(data[i]);
      }
      if (i === hoverIndex) {
        newData.push(data[dragIndex]);
      }
      if (dragIndex > hoverIndex) {
        newData.push(data[i]);
      }
    });
    setData(newData);
  }

  function BodyRow({
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    ...restProps
  }) {
    const style = { ...restProps.style, cursor: "move" };
    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += " drop-over-downward";
      }
      if (restProps.index < dragingIndex) {
        className += " drop-over-upward";
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />
      )
    );
  }

  return (
    <DndProvider backend={DndBackend}>
      <Table
        size="middle"
        pagination={false}
        dataSource={data}
        components={{
          body: {
            row: DropTarget<IRowProps>(
              "row",
              {
                drop(props, monitor) {
                  const dragIndex = monitor.getItem().index;
                  const hoverIndex = props.index;
                  if (dragIndex === hoverIndex) {
                    return;
                  }
                  props.moveRow(dragIndex, hoverIndex);
                  monitor.getItem().index = hoverIndex;
                }
              },
              (connect, monitor) => ({
                connectDropTarget: connect.dropTarget(),
                isOver: monitor.isOver()
              })
            )(
              DragSource<IRowProps>(
                "row",
                {
                  beginDrag(props) {
                    dragingIndex = props.index;
                    return {
                      index: props.index
                    };
                  }
                },
                connect => ({
                  connectDragSource: connect.dragSource()
                })
              )(BodyRow)
            )
          }
        }}
        onRow={(record, index) =>
          ({
            index,
            moveRow
          } as IRowProps)
        }
        {...props}
      />
    </DndProvider>
  );
}
