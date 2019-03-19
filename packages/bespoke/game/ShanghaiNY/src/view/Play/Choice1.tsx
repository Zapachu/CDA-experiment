import * as React from 'react'
import * as style from './style.scss'
import {FetchType, MoveType, PushType, Stage, GameType, Test1, Choice, Version} from '../../config'


interface PropsType {
  c1: number,
  onChoose: (c1: number) => void,
  gameType: GameType,
  version: Version
}

const Choice1: React.FunctionComponent<PropsType> = ({c1, onChoose, gameType, version}) => {
  return <div>
    <p>第一阶段: 你的选择</p>
    <input type="radio" id="c1-1" checked={c1===Choice.One} onChange={() => onChoose(Choice.One)} />
    <label htmlFor={'c1-1'}>选1</label>
    {gameType===GameType.T1
      ? <>
        <input type="radio" id="c1-2" checked={c1===Choice.Two} onChange={() => onChoose(Choice.Two)} />
        <label htmlFor={'c1-2'}>选2</label>
      </>
      : version===Version.V2
          ? <>
            <input type="radio" id="c1-2" checked={c1===Choice.Two} onChange={() => onChoose(Choice.Two)} />
            <label htmlFor={'c1-2'}>选2</label>
          </>
          : null
    }
    {gameType===GameType.T2
      ? <>
        <input type="radio" id="c1-3" checked={c1===Choice.Wait} onChange={() => onChoose(Choice.Wait)} />
        <label htmlFor={'c1-3'}>等待</label>
      </>
      : null
    }
  </div>
}

export default Choice1;