import * as React from 'react';
import * as style from './style.scss';
import {Choice, Mode} from '../../config';
import {Lang} from '@elf/component';
import {Radio} from 'antd';

export default function Choice1({test, c1, onChoose, mode, d = 0}: {
    c1: number
    onChoose: (c1: number) => void
    mode: Mode
    d?: number
    test?: boolean
}) {
    const lang = Lang.extractLang({
            choose1: ['选1', 'choose 1'],
            choose2: ['选2', 'choose 2'],
            chooseWait: ['等待', 'Wait'],
            changeChoice: ['改变选择', 'change your choice'],
            firstChoiceT2: ['第一阶段: 你的选择', 'In the first action, your choice is'],
            pay1: ['若在第二阶段', '(If you '],
            pay2: ['，需要付出延迟选择费', ' in the next action, you need to pay $ '],
            pay3: ['分', ')'],
            secondAction: ['请做出你第二阶段的选择:', 'Make your choice for the second action please:'],
            confirmOnly: ['因为你在第一阶段已经做出了选择，第二阶段不需要选择，请点击下面的“确定按钮”:', 'Since you have chosen in the first action, you do not need to make the choice for the second action, please click the "Confirm" button below:'],
        }),
        choiceLabel = {
            [Choice.One]: lang.choose1,
            [Choice.Two]: lang.choose2,
            [Choice.Wait]: lang.chooseWait,
        };
    const {options, tips}: {
        options: Array<Choice>,
        tips: string
    } = {
        [Mode.HR]: {
            options: [Choice.One, Choice.Wait],
            tips: c1 === Choice.Wait ? lang.choose1 : null
        },
        [Mode.LR]: {
            options: [Choice.Two, Choice.Wait],
            tips: c1 === Choice.Wait ? lang.choose2 : null
        },
        [Mode.BR]: {
            options: [Choice.One, Choice.Two],
            tips: lang.changeChoice
        }
    }[mode];
    return <div className={style.choice}>
        <p>{lang.firstChoiceT2}</p>
        <Radio.Group value={c1} onChange={({target: {value}}) => onChoose(+value)}>
            {
                options.map(value => <Radio value={value}>{choiceLabel[value].toUpperCase()}</Radio>)
            }
        </Radio.Group>
        <p className={style.tips}
           style={{visibility: d > 0 && tips ? 'visible' : 'hidden'}}>
            {`${lang.pay1}${tips}${lang.pay2}${d}${lang.pay3}`}
        </p>
        {
            test ? <p className={style.instruction} style={c1 ? null : {visibility: 'hidden'}}>
                {c1 === Choice.Wait || mode === Mode.BR ? lang.secondAction : lang.confirmOnly}
            </p> : null
        }
    </div>;
}
