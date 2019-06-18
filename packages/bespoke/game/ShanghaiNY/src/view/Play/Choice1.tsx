import * as React from 'react'
import * as style from './style.scss'
import {GameType, Choice, Version} from '../../config'
import {Lang, Radio} from 'elf-component'

interface PropsType {
  c1: number,
  onChoose: (c1: number) => void,
  gameType: GameType,
  version: Version,
  d?: number
}

const Choice1: React.FunctionComponent<PropsType> = ({c1, onChoose, gameType, version, d=0}) => {
  const lang = Lang.extractLang({
    choose1: ['选1', 'Choose 1'],
    choose2: ['选2', 'Choose 2'],
    chooseWait: ['等待', 'Wait'],
    firstChoiceT1: ['你的选择', 'Your choice is'],
    firstChoiceT2: ['第一阶段: 你的选择', 'In the first action, your choice is'],
    feeLeft: ['(若在第二阶段选1，需要付出延迟选择费', '(If you choose 1 in the next action, you need to pay $ '],
    feeRight: ['分)', ')']
  })
  const options = gameType===GameType.T1
    ? [{label: lang.choose1, value: Choice.One}, {label: lang.choose2, value: Choice.Two}]
    : version===Version.V2
      ? [{label: lang.choose1, value: Choice.One}, {label: lang.choose2, value: Choice.Two}, {label: lang.chooseWait, value: Choice.Wait}]
      : [{label: lang.choose1, value: Choice.One}, {label: gameType===GameType.T2&&d>0 ? `${lang.chooseWait}${lang.feeLeft}${d}${lang.feeRight}` : lang.chooseWait, value: Choice.Wait}]
  return <div className={style.choice}>
    <p>{gameType===GameType.T1?lang.firstChoiceT1:lang.firstChoiceT2}</p>
    <Radio  value={c1}
            options={options}
            onChange={val => onChoose(val as number)}
    />
  </div>
}

export default Choice1;
