import * as React from 'react'
import { GameType, Choice, Version} from '../../config'


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
  return <div>
    <p>第二阶段:</p>
    {c1===Choice.Wait
      ? <>
        <p>{version===Version.V3 ? '如果第一阶段有人选1, 且抽中表A' : '如果第一阶段有人选1'} 你的选择:</p>
        <input type="radio" id="c20-1" checked={c2[0]===Choice.One} onChange={() => onChoose([Choice.One, c2[1]])} />
        <label htmlFor={'c20-1'}>选1{d>0 ? `(修改费${d}元)` : ''}</label>
        <input type="radio" id="c20-2" checked={c2[0]===Choice.Two} onChange={() => onChoose([Choice.Two, c2[1]])} />
        <label htmlFor={'c20-2'}>选2</label>
        <p>{version===Version.V3 ? '如果不是“第一阶段有人选1, 且抽中表A”' : '如果第一阶段没有人选1'} 你的选择:</p>
        <input type="radio" id="c21-1" checked={c2[1]===Choice.One} onChange={() => onChoose([c2[0], Choice.One])} />
        <label htmlFor={'c21-1'}>选1{d>0 ? `(修改费${d}元)` : ''}</label>
        <input type="radio" id="c21-2" checked={c2[1]===Choice.Two} onChange={() => onChoose([c2[0], Choice.Two])} />
        <label htmlFor={'c21-2'}>选2</label>
      </>
      : <p>你不需要选择</p>
    }
  </div>
}

export default Choice2;