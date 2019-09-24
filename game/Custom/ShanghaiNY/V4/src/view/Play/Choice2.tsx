import * as React from 'react';
import * as style from './style.scss';
import {Choice, Mode} from '../../config';
import {Lang} from '@elf/component';
import {Radio} from 'antd';

export default function Choice2({playersPerGroup, c1, c2, onChoose, mode, d}: {
    c1: number,
    c2: Array<number>,
    playersPerGroup: number,
    onChoose: (c2: Array<number>) => void,
    mode: Mode,
    d: number
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
            impossible: ['不可能发生', 'Impossible'],
            ok: ['确定', 'OK']
        }),
        chooseLabel = {
            [Mode.HR]: [lang.choose1, lang.chooseWait],
            [Mode.LR]: [lang.choose2, lang.chooseWait],
            [Mode.BR]: [lang.choose1, lang.choose2],
        }[mode];
    const questions: Array<{ question: string, options: Array<{ label: string, value: Choice }> }> = Array(playersPerGroup + 1).fill(null).map((_, i) => ({
        question: `${i}${lang.case2}${chooseLabel[0]}, ${playersPerGroup - i}${lang.case2}${chooseLabel[1]}`,
        options: {
            [Mode.HR]: c1 === Choice.Wait && i === playersPerGroup ? null : [
                {label: d > 0 ? `${lang.choose1}${lang.feeLeft}${d}${lang.feeRight}` : lang.choose1, value: Choice.One},
                {label: lang.choose2, value: Choice.Two}
            ],
            [Mode.LR]: i === playersPerGroup ? null : [
                {label: lang.choose1, value: Choice.One},
                {label: d > 0 ? `${lang.choose2}${lang.feeLeft}${d}${lang.feeRight}` : lang.choose2, value: Choice.Two}
            ],
            [Mode.BR]: c1 === Choice.One ? i === 0 ? null : [
                {label: lang.choose1, value: Choice.One},
                {label: d > 0 ? `${lang.choose2}${lang.feeLeft}${d}${lang.feeRight}` : lang.choose2, value: Choice.Two}
            ] : i === playersPerGroup ? null : [
                {label: d > 0 ? `${lang.choose1}${lang.feeLeft}${d}${lang.feeRight}` : lang.choose1, value: Choice.One},
                {label: lang.choose2, value: Choice.Two}
            ]
        }[mode]
    }));
    return <div className={style.choice}>
        <p>{lang.secondAction}:</p>
        <p>{lang.case1}</p>
        <ol>
            {
                questions.map(({question, options}, i) => {
                    const needChoice: boolean = (mode === Mode.BR && !!options) || (c1 === Choice.Wait && i < playersPerGroup);
                    return <li>
                        <div style={{display: 'flex'}}>
                            {
                                needChoice ? null :
                                    <div style={{marginRight: '2rem'}}>
                                        <p>{lang.noChoice}</p>
                                        <Radio.Group value={c2[i]} onChange={({target: {value}}) => {
                                            const c = c2.slice();
                                            c[i] = +value;
                                            onChoose(c);
                                        }}>
                                            {
                                                [{label: lang.ok, value: 0}].map(({label, value}) => <Radio
                                                    value={value}>{label}</Radio>)
                                            }
                                        </Radio.Group>
                                    </div>
                            }
                            <div className={needChoice ? '' : style.disabled}>
                                <p>{question} , {lang.yourChoice}:</p>
                                {
                                    options ? <Radio.Group disabled={!needChoice} value={c2[i]}
                                                           onChange={({target: {value}}) => {
                                                               const c = c2.slice();
                                                               c[i] = +value;
                                                               onChoose(c);
                                                           }}>
                                            {
                                                options.map(({label, value}) => <Radio value={value}>{label}</Radio>)
                                            }
                                        </Radio.Group> :
                                        <p style={{fontSize: '14px', margin: '10px 0 0'}}>{lang.impossible}</p>
                                }
                            </div>
                        </div>
                    </li>;
                })
            }
        </ol>
    </div>;
};