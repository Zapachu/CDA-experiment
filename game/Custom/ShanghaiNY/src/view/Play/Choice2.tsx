import * as React from 'react';
import * as style from './style.scss';
import {Choice, GameType, Mode, Version} from '../../config';
import {Lang} from '@elf/component';
import {Radio} from 'antd';

export default function Choice2({playersPerGroup, c1, c2, onChoose, gameType, version, mode, d = 0}: {
  c1: number,
  c2: Array<number>,
  playersPerGroup: number,
  onChoose: (c2: Array<number>) => void,
  gameType: GameType,
  version: Version,
  mode: Mode,
  d?: number
}) {
  const lang = Lang.extractLang({
    choose1: ['选1', 'Choose 1'],
    choose2: ['选2', 'Choose 2'],
    chooseWait: ['等待', 'Wait'],
    secondAction: ['第二阶段', 'Second action'],
    yourChoice: ['你的选择', 'your choice is'],
    feeLeft: ['(延迟选择费', '(extra fee $ '],
    feeRight: ['分)', ')'],
    noChoice: ['你不需要选择', 'You do not need to chooose'],
    case1: ['如果第一阶段包括你一共有 : '],
    case2: ['人'],
    if1: ['如果第一阶段有人选1', 'If someone has chosen 1 in the first action,'],
    ifNot1: ['如果第一阶段没有人选1', 'If no one has chosen 1 in the first action,'],
    if1A: ['如果第一阶段有人选1, 且抽中表A', 'If someone has chosen 1 in the first action and this is table A,'],
    ifNot1A: ['如果不是“第一阶段有人选1, 且抽中表A”', 'If no one has chosen 1 in the first action or this is not table A,'],
    ok: ['确定', 'OK']
  });
  if (!c1 || gameType === GameType.T1) {
    return null;
  }
  const options = [{
    label: d > 0 ? `${lang.choose1}${lang.feeLeft}${d}${lang.feeRight}` : lang.choose1,
    value: Choice.One
  }, {label: lang.choose2, value: Choice.Two}];
  let questions: Array<string> = [], needChoice: boolean = c1 === Choice.Wait;
  switch (version) {
    case Version.V3:
      questions = [lang.if1A, lang.ifNot1A];
      break;
    case Version.V4:
      const chooseLabel = {
        [Mode.HR]: [lang.choose1, lang.chooseWait],
        [Mode.LR]: [lang.choose2, lang.chooseWait],
        [Mode.BR]: [lang.choose1, lang.choose2],
      }[mode];
      if (mode === Mode.BR) {
        needChoice = true;
      }
      questions = Array(playersPerGroup + 1).fill(null).map((_, i) => `${lang.case1}${i}${lang.case2}${chooseLabel[0]}, ${playersPerGroup - i}${lang.case2}${chooseLabel[1]}`);
      break;
    default:
      questions = [lang.if1, lang.ifNot1];
      break;
  }
  return <div className={style.choice}>
    <p>{lang.secondAction}:</p>
    <ol>
      {
        questions.map((question, i) => <li>
          <div className={needChoice ? '' : style.disabled}>
            <p>{question} , {lang.yourChoice}:</p>
            <Radio.Group disabled={!needChoice} value={c2[i]}
                         onChange={({target: {value}}) => {
                           const c = c2.slice();
                           c[i] = +value;
                           onChoose(c);
                         }}>
              {
                options.map(({label, value}) => <Radio value={value}>{label}</Radio>)
              }
            </Radio.Group>
          </div>
          {
            needChoice ? null :
                <div>
                  <p>{lang.noChoice}</p>
                  <Radio.Group value={c2[i]} onChange={({target: {value}}) => {
                    const c = c2.slice();
                    c[i] = +value;
                    onChoose(c);
                  }}>
                    {
                      [{label: lang.ok, value: 0}].map(({label, value}) => <Radio value={value}>{label}</Radio>)
                    }
                  </Radio.Group>
                </div>
          }
        </li>)
      }
    </ol>
  </div>;
};