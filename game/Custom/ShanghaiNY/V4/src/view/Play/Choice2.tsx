import * as React from 'react';
import * as style from './style.scss';
import {Choice, Mode} from '../../config';
import {Lang} from '@elf/component';
import {Radio} from 'antd';

export default function Choice2({playersPerGroup, c1, c2, onChoose, mode, d}: {
    c1: Choice,
    c2: Array<Choice>,
    playersPerGroup: number,
    onChoose: (c2: Array<Choice>) => void,
    mode: Mode,
    d: number
}) {
    const lang = Lang.extractLang({
            choose1: ['选1', 'Choose 1'],
            choose2: ['选2', 'Choose 2'],
            chooseWait: ['等待', 'Wait'],
            secondAction: ['第二阶段', 'Second action'],
            yourChoice: ['你在第二阶段的选择', 'Your choice in second action'],
            feeLeft: ['(延迟选择费', '(extra fee $ '],
            feeRight: ['分)', ')'],
            case1: ['若第一阶段中，包括你的选择，一共有'],
            case2: ['人'],
            impossible: ['不可能发生', 'Impossible'],
            ok: ['你不需要选择，确定', 'You do not need to choose, OK']
        }),
        chooseLabel = {
            [Mode.HR]: [lang.choose1, lang.chooseWait],
            [Mode.LR]: [lang.choose2, lang.chooseWait],
            [Mode.BR]: [lang.choose1, lang.choose2],
        }[mode],
        OK_OPTIONS = [{label: lang.ok, value: Choice.Null}];
    const questions: Array<{ question: string, options: Array<{ label: string, value: Choice }> }> = Array(playersPerGroup + 1).fill(null).map((_, i) => ({
        question: `${i}${lang.case2}${chooseLabel[0]}, ${playersPerGroup - i}${lang.case2}${chooseLabel[1]}`,
        options: {
            [Mode.HR]: (c1 === Choice.Wait && i === playersPerGroup) || (c1 === Choice.One && i === 0) ? null : [
                {label: d > 0 ? `${lang.choose1}${lang.feeLeft}${d}${lang.feeRight}` : lang.choose1, value: Choice.One},
                {label: lang.choose2, value: Choice.Two}
            ],
            [Mode.LR]: (c1 === Choice.Wait && i === playersPerGroup) || (c1 === Choice.Two && i === 0) ? null : [
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
    const questionRows = [];
    questions.forEach(({question, options}, i) => {
        if (!options) {
            return;
        }
        questionRows.push(<tr>
            <td><p>({questionRows.length + 1}) {question}</p></td>
            <td>
                <Radio.Group value={c2[i]} onChange={({target: {value}}) => {
                    const c = c2.slice();
                    c[i] = +value;
                    onChoose(c);
                }}>
                    {
                        (mode === Mode.BR || c1 === Choice.Wait ? options : OK_OPTIONS).map(({label, value}) => <Radio
                            value={value}>{label}</Radio>)
                    }
                </Radio.Group>
            </td>
        </tr>);
    });
    return <div className={style.choice}>
        <p>{lang.secondAction}:</p>
        <table className={style.testStageTable}>
            <tr>
                <td style={{width: '60%'}}>{lang.case1}</td>
                <td>{lang.yourChoice}</td>
            </tr>
            {
                questionRows
            }
        </table>
    </div>;
};
