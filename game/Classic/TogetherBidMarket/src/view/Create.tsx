import * as React from "react";
import * as style from "./style.scss";
import { ICreateParams } from "../config";
import { Core } from "@bespoke/client";
import { Button, Label, RangeInput, Input } from "@elf/component";

interface ICreateState {
  rounds: number;
  groupSize: number;
  buyerCapitalMin: number;
  buyerCapitalMax: number;
  buyerPrivateMin: number;
  buyerPrivateMax: number;
  sellerQuotaMin: number;
  sellerQuotaMax: number;
  sellerPrivateMin: number;
  sellerPrivateMax: number;
  positions: ICreateParams["positions"];
}

export class Create extends Core.Create<ICreateParams, ICreateState> {
  state: ICreateState = {
    rounds: 3,
    groupSize: 2,
    buyerCapitalMin: 50000,
    buyerCapitalMax: 100000,
    buyerPrivateMin: 65,
    buyerPrivateMax: 80,
    sellerQuotaMin: 1000,
    sellerQuotaMax: 2000,
    sellerPrivateMin: 30,
    sellerPrivateMax: 45,
    positions: []
  };

  componentDidMount(): void {
    const {
      props: { setSubmitable }
    } = this;
    setSubmitable(false);
  }

  genPositions = () => {
    const { groupSize, rounds } = this.state;
    const positions = Array(groupSize)
      .fill(null)
      .map((_, i) => {
        return {
          role: i % 2,
          privateValues: Array(rounds)
            .fill(null)
            .map(() => this.genPrivateValue(i % 2)),
          startingPrices: Array(rounds)
            .fill(null)
            .map(() => this.genStartingPrice(i % 2)),
          startingQuotas: Array(rounds)
            .fill(null)
            .map(() => this.genStartingQuota(i % 2))
        };
      });
    this.setState({ positions });
  };

  genPrivateValue = (role: number): number => {
    const {
      buyerPrivateMin,
      buyerPrivateMax,
      sellerPrivateMin,
      sellerPrivateMax
    } = this.state;
    let min: number, max: number;
    if (role === 0) {
      min = Math.floor(buyerPrivateMin);
      max = Math.floor(buyerPrivateMax);
    } else {
      min = Math.floor(sellerPrivateMin);
      max = Math.floor(sellerPrivateMax);
    }
    return genRandomInt(min * 100, max * 100) / 100;
  };

  genStartingPrice(role: number): number {
    if (role === 1) {
      return 0;
    }
    const { buyerCapitalMin, buyerCapitalMax } = this.state;
    return (
      genRandomInt(
        Math.floor(buyerCapitalMin) / 100,
        Math.floor(buyerCapitalMax) / 100
      ) * 100
    );
  }

  genStartingQuota(role: number): number {
    if (role === 0) {
      return 0;
    }
    const { sellerQuotaMin, sellerQuotaMax } = this.state;
    return (
      genRandomInt(
        Math.floor(sellerQuotaMin) / 100,
        Math.floor(sellerQuotaMax) / 100
      ) * 100
    );
  }

  setRole = i => {
    const { positions } = this.state;
    positions[i].role = positions[i].role === 0 ? 1 : 0;
    this.setState({ positions });
  };

  setPositions = (
    value: number,
    prop: string,
    positionIndex: number,
    roundIndex: number
  ) => {
    const { positions } = this.state;
    positions[positionIndex][prop][roundIndex] = value;
    this.setState({ positions });
  };

  edit = () => {
    const {
      props: { setSubmitable }
    } = this;
    setSubmitable(false);
  };

  done = () => {
    const { setParams, setSubmitable } = this.props;
    const { rounds, groupSize, positions } = this.state;
    setParams({ rounds, groupSize, positions });
    setSubmitable(true);
  };

  render() {
    const { submitable } = this.props;
    const {
      rounds,
      positions,
      groupSize,
      buyerCapitalMin,
      buyerCapitalMax,
      buyerPrivateMin,
      buyerPrivateMax,
      sellerQuotaMin,
      sellerQuotaMax,
      sellerPrivateMin,
      sellerPrivateMax
    } = this.state;
    return (
      <div className={style.create}>
        <ul className={style.configFields}>
          <li>
            <Label label="轮次" />
            <RangeInput
              value={rounds}
              min={1}
              max={10}
              onChange={e =>
                this.setState({ rounds: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="每组人数" />
            <RangeInput
              value={groupSize}
              min={2}
              max={12}
              onChange={e =>
                this.setState({ groupSize: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="买家初始资金下限" />
            <Input
              value={buyerCapitalMin}
              onChange={e =>
                this.setState({ buyerCapitalMin: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="买家初始资金上限" />
            <Input
              value={buyerCapitalMax}
              onChange={e =>
                this.setState({ buyerCapitalMax: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="买家心理价值下限" />
            <Input
              value={buyerPrivateMin}
              onChange={e =>
                this.setState({ buyerPrivateMin: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="买家心理价值上限" />
            <Input
              value={buyerPrivateMax}
              onChange={e =>
                this.setState({ buyerPrivateMax: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="卖家股票配额下限" />
            <Input
              value={sellerQuotaMin}
              onChange={e =>
                this.setState({ sellerQuotaMin: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="卖家股票配额上限" />
            <Input
              value={sellerQuotaMax}
              onChange={e =>
                this.setState({ sellerQuotaMax: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="卖家心理价值下限" />
            <Input
              value={sellerPrivateMin}
              onChange={e =>
                this.setState({ sellerPrivateMin: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Label label="卖家心理价值上限" />
            <Input
              value={sellerPrivateMax}
              onChange={e =>
                this.setState({ sellerPrivateMax: parseInt(e.target.value) })
              }
            />
          </li>
          <li>
            <Button label="生成参数" onClick={() => this.genPositions()} />
          </li>
        </ul>

        <table className={style.privatePriceTable}>
          <thead>
            <tr>
              <td>玩家</td>
              <td>角色</td>
              <td>心理价值</td>
              <td>初始资金</td>
              <td>股票配额</td>
            </tr>
          </thead>
          {positions.map((position, i) => (
            <tbody key={`tb${i}`}>
              <tr>
                <td>{`Player ${i + 1}`}</td>
                <td>
                  <a
                    style={{ color: position.role === 0 ? "blue" : "#333" }}
                    onClick={this.setRole.bind(this, i)}
                  >
                    Buyer
                  </a>
                  <a
                    style={{ color: position.role === 1 ? "blue" : "#333" }}
                    onClick={this.setRole.bind(this, i)}
                  >
                    Seller
                  </a>
                </td>
                <td>
                  {position.privateValues.map((privateValue, j) => (
                    <li key={j}>
                      <Label label={`第 ${j + 1} 轮`} />
                      <Input
                        type="number"
                        value={privateValue}
                        onChange={e =>
                          this.setPositions(
                            +e.target.value,
                            "privateValues",
                            i,
                            j
                          )
                        }
                      />
                    </li>
                  ))}
                </td>
                <td>
                  {position.startingPrices.map((startingPrice, j) => (
                    <li key={j}>
                      <Label label={`第 ${j + 1} 轮`} />
                      <Input
                        type="number"
                        value={startingPrice}
                        onChange={e =>
                          this.setPositions(
                            +e.target.value,
                            "startingPrices",
                            i,
                            j
                          )
                        }
                      />
                    </li>
                  ))}
                </td>
                <td>
                  {position.startingQuotas.map((startingQuota, j) => (
                    <li key={j}>
                      <Label label={`第 ${j + 1} 轮`} />
                      <Input
                        type="number"
                        value={startingQuota}
                        onChange={e =>
                          this.setPositions(
                            +e.target.value,
                            "startingQuotas",
                            i,
                            j
                          )
                        }
                      />
                    </li>
                  ))}
                </td>
              </tr>
            </tbody>
          ))}
        </table>

        <div className={style.btnSwitch}>
          {submitable ? (
            <a onClick={() => this.edit()}>重新编辑</a>
          ) : (
            <a onClick={() => this.done()}>确认参数</a>
          )}
        </div>
      </div>
    );
  }
}

function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
