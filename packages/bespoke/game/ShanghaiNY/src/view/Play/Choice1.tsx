import * as React from 'react'
import * as style from './style.scss'
import {GameType, Choice, Version} from '../../config'
import {Radio} from 'bespoke-client-util'

interface PropsType {
  c1: number,
  onChoose: (c1: number) => void,
  gameType: GameType,
  version: Version,
  d?: number
}

const Choice1: React.FunctionComponent<PropsType> = ({c1, onChoose, gameType, version, d=0}) => {
  const options = gameType===GameType.T1
    ? [{label: '选1', value: Choice.One}, {label: '选2', value: Choice.Two}]
    : version===Version.V2
      ? [{label: '选1', value: Choice.One}, {label: '选2', value: Choice.Two}, {label: '等待', value: Choice.Wait}]
      : [{label: '选1', value: Choice.One}, {label: '等待', value: Choice.Wait}]
  return <div className={style.choice}>
    <p>第一阶段: 你的选择 {d>0 ? `(若在下一轮改选1，需要付出修改费${d}元)` : ''}</p>
    <Radio  value={c1} 
            options={options} 
            onChange={val => onChoose(val as number)} 
    />
  </div>
}

export default Choice1;