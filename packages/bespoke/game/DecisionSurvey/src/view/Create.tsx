import * as React from "react";
import * as style from "./style.scss";
import { ICreateParams } from "../config";
import { Button, Core, Label, RangeInput, Input } from "elf-component";
interface ICreateState {
  groupSize: number;
}

export class Create extends Core.Create<ICreateParams, ICreateState> {
  // state: ICreateState = {
  //     groupSize: 20,
  // }

  // componentDidMount(): void {
  //     const {props: {setParams}} = this
  //     setParams({groupSize: 20})
  // }

  render() {
    // const { groupSize } = this.state;
    return (
      <div className={style.create}>
        {/* <ul className={style.configFields}>
                <li>
                    <Label label='每组人数'/>
                    <p>{groupSize}</p>
                </li>
            </ul> */}
      </div>
    );
  }
}
