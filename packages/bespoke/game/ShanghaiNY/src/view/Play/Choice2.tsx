import * as React from 'react'
import * as style from './style.scss'
import { GameType, Choice, Version} from '../../config'
import {Lang, Radio} from 'bespoke-client-util'

interface PropsType {
  c1: number,
  c2: Array<number>,
  onChoose: (c2: Array<number>) => void,
  gameType: GameType,
  version: Version,
  d?: number
}

const Choice2: React.FunctionComponent<PropsType> = ({c1, c2, onChoose, gameType, version, d=0}) => {
  const lang = Lang.extractLang({
    choose1: ['选1', 'Choose 1'],
    choose2: ['选2', 'Choose 2'],
    chooseWait: ['等待', 'Wait'],
    secondAction: ['第二阶段', 'Second action'],
    yourChoice: ['你的选择', 'your choice is'],
    feeLeft: ['(修改费', '(extra fee $ '],
    feeRight: ['元)', ')'],
    noChoice: ['你不需要选择', 'You do not need to chooose'],
    if1: ['如果第一阶段有人选1', 'If someone has chosen 1 in the first action,'],
    ifNot1: ['如果第一阶段没有人选1', 'If no one has chosen 1 in the first action,'],
    if1A: ['如果第一阶段有人选1, 且抽中表A', 'If someone has chosen 1 in the first action and this is table A,'],
    ifNot1A: ['如果不是“第一阶段有人选1, 且抽中表A”', 'If no one has chosen 1 in the first action or this is not table A,'],
    ok: ['确定', 'OK']
  })
  if(!c1 || gameType===GameType.T1) {
    return null;
  }
  const options = [{label: d>0 ? `${lang.choose1}${lang.feeLeft}${d}${lang.feeRight}` : lang.choose1, value: Choice.One}, {label: lang.choose2, value: Choice.Two}];
  return <div className={style.choice}>
    <p>{lang.secondAction}:</p>
    <div className={c1===Choice.Wait?'':style.disabled}>
    <p>{version===Version.V3 ? lang.if1A : lang.if1} {lang.yourChoice}:</p>
    <Radio  value={c2[0]} 
            options={options} 
            onChange={val => onChoose([val as number, c2[1]])} 
    />
    </div>
    <div className={c1===Choice.Wait?style.hidden:''}>
    <p>{lang.noChoice}</p>
    <Radio  value={c2[0]} 
            options={[{label: lang.ok, value: 0}]} 
            onChange={val => onChoose([val as number, c2[1]])} 
    />
    </div>
    <div className={c1===Choice.Wait?'':style.disabled}>
    <p>{version===Version.V3 ? lang.ifNot1A : lang.ifNot1} {lang.yourChoice}:</p>
    <Radio  value={c2[1]} 
            options={options} 
            onChange={val => onChoose([c2[0], val as number])} 
    />
    </div>
    <div className={c1===Choice.Wait?style.hidden:''}>
    <p>{lang.noChoice}</p>
    <Radio  value={c2[1]} 
            options={[{label: lang.ok, value: 0}]} 
            onChange={val => onChoose([c2[0], val as number])} 
    />
    </div>
  </div>
}

export default Choice2;