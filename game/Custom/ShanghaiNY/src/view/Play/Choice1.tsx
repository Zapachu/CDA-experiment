import * as React from 'react';
import * as style from './style.scss';
import {Choice, GameType, Mode, Version} from '../../config';
import {Lang} from '@elf/component';
import {Radio} from 'antd';

export default function Choice1({c1, onChoose, gameType, version, mode, d = 0}: {
  c1: number
  onChoose: (c1: number) => void
  gameType: GameType
  version: Version
  mode: Mode
  d?: number
}) {
  const lang = Lang.extractLang({
        choose1: ['选1', 'choose 1'],
        choose2: ['选2', 'choose 2'],
        chooseWait: ['等待', 'Wait'],
        changeChoice: ['改变选择', 'change your choice'],
        firstChoiceT1: ['你的选择', 'Your choice is'],
        firstChoiceT2: ['第一阶段: 你的选择', 'In the first action, your choice is'],
        pay1: ['若在第二阶段', '(If you '],
        pay2: ['，需要付出延迟选择费', ' in the next action, you need to pay $ '],
        pay3: ['分', ')'],
      }),
      choiceLabel = {
        [Choice.One]: lang.choose1,
        [Choice.Two]: lang.choose2,
        [Choice.Wait]: lang.chooseWait,
      };
  let options: Array<Choice> = [], tips: string = '';
  switch (gameType) {
    case GameType.T1:
      options = [Choice.One, Choice.Two];
      break;
    case GameType.T2:
      switch (version) {
        case Version.V2:
          options = [Choice.One, Choice.Two, Choice.Wait];
          break;
        case Version.V4:
          switch (mode) {
            case Mode.HR:
              options = [Choice.One, Choice.Wait];
              tips = lang.choose1;
              break;
            case Mode.LR:
              options = [Choice.Two, Choice.Wait];
              tips = lang.choose2;
              break;
            case Mode.BR:
              options = [Choice.One, Choice.Two];
              tips = lang.changeChoice;
              break;
          }
          break;
        default:
          options = [Choice.One, Choice.Wait];
          tips = lang.choose1;
      }
  }
  return <div className={style.choice}>
    <p>{gameType === GameType.T1 ? lang.firstChoiceT1 : lang.firstChoiceT2}</p>
    <Radio.Group value={c1} onChange={({target: {value}}) => onChoose(+value)}>
      {
        options.map(value => <Radio value={value}>{choiceLabel[value].toUpperCase()}</Radio>)
      }
    </Radio.Group>
    <p className={style.tips} style={{visibility: d > 0 && c1 === options[options.length - 1] ? 'visible' : 'hidden'}}>
      {`${lang.pay1}${tips}${lang.pay2}${d}${lang.pay3}`}
    </p>
  </div>;
}
