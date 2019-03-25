import * as React from 'react'
import * as style from './style.scss'
import { GameType, Choice, Version} from '../../config'
import {Radio} from 'bespoke-client-util'

interface PropsType {
  c1: number,
  c2: Array<number>,
  onChoose: (c2: Array<number>) => void,
  gameType: GameType,
  version: Version,
  d?: number
}

const Choice2: React.FunctionComponent<PropsType> = ({c1, c2, onChoose, gameType, version, d=0}) => {
  if(!c1 || gameType===GameType.T1) {
    return null;
  }
  const options = [{label: d>0 ? `选1(修改费${d}元)` : '选1', value: Choice.One}, {label: '选2', value: Choice.Two}];
  return <div className={style.choice}>
    <p>第二阶段:</p>
    {c1===Choice.Wait
      ? <>
        <p>{version===Version.V3 ? '如果第一阶段有人选1, 且抽中表A' : '如果第一阶段有人选1'} 你的选择:</p>
        <Radio  value={c2[0]} 
                options={options} 
                onChange={val => onChoose([val as number, c2[1]])} 
        />
        <p>{version===Version.V3 ? '如果不是“第一阶段有人选1, 且抽中表A”' : '如果第一阶段没有人选1'} 你的选择:</p>
        <Radio  value={c2[1]} 
                options={options} 
                onChange={val => onChoose([c2[0], val as number])} 
        />
      </>
      : <p style={{margin:'10px'}}>你不需要选择</p>
    }
  </div>
}

export default Choice2;