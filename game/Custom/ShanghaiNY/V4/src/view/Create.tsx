import * as React from 'react';
import {Label, Lang} from '@elf/component';
import {Core} from '@bespoke/client';
import {Col, InputNumber, Row, Select, Slider} from 'antd';
import {ICreateParams, Min, Mode} from '../config';
import style from './style.scss';

const {Option} = Select;

interface ICreateState {
    playersPerGroup: number,
    rounds: number,
    participationFee: number,
    a: number,
    b: number,
    c: number,
    d: number,
    eH: number,
    eL: number,
    s: number,
    p: number,
    b0: number,
    b1: number
}

type EnumLabel<E> = Array<{
    label: string,
    value: E
}>

const modes: EnumLabel<Mode> = [
    {label: 'HR', value: Mode.HR},
    {label: 'LR', value: Mode.LR},
    {label: 'BR', value: Mode.BR},
];

const mins: EnumLabel<Min> = [
    {label: '1', value: Min.A},
    {label: '2', value: Min.B}
];


export class Create extends Core.Create<ICreateParams, ICreateState> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        playersPerGroup: ['每组人数', 'Players per Group'],
        gameType: ['类型', 'Game Type'],
        mode: ['模式(REV)', 'Mode(REV)'],
        min: ['结果展示(MIN)', 'Result(REV)'],
        participationFee: ['参与费', 'Participation Fee']
    });

    componentDidMount(): void {
        const {props: {setParams}} = this;
        let defaultParams: ICreateParams = {
            playersPerGroup: 2,
            rounds: 2,
            mode: Mode.HR,
            min: Min.A,
            participationFee: 0,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            eH: 0,
            eL: 0,
            s: 0,
            p: 0
        };
        setParams(defaultParams);
    }

    render(): React.ReactNode {
        const INPUT_STYLE: React.CSSProperties = {
            width: '8rem'
        };
        const {lang, props: {params, setParams}} = this;
        return <Row>
            <Col span={10} offset={7}>
                <ul className={style.create}>
                    <li>
                        <Label label={lang.playersPerGroup}/>
                        <Slider className={style.slider}
                                value={params.playersPerGroup}
                                min={1}
                                max={12}
                                step={1}
                                onChange={playersPerGroup => setParams({playersPerGroup: +playersPerGroup})}
                        />
                    </li>
                    <li>
                        <Label label={lang.round}/>
                        <Slider className={style.slider}
                                value={params.rounds}
                                min={1}
                                max={12}
                                step={1}
                                onChange={v => setParams({rounds: +v})}
                        />
                    </li>
                    <li>
                        <Label label={lang.participationFee}/>
                        <InputNumber style={INPUT_STYLE} {...{
                            style: INPUT_STYLE,
                            value: params.participationFee,
                            onChange: v => setParams({participationFee: +v})
                        }}/>
                    </li>
                    <>
                        <li>
                            <Label label={lang.mode}/>
                            <Select value={params.mode as any} style={INPUT_STYLE}
                                    onChange={mode => setParams({mode})}>
                                {
                                    modes.map(({label, value}) => <Option value={value}>{label}</Option>)
                                }
                            </Select>
                        </li>
                        <li>
                            <Label label={lang.min}/>
                            <Select value={params.min as any} style={INPUT_STYLE}
                                    onChange={min => setParams({min})}>
                                {
                                    mins.map(({label, value}) => <Option value={value}>{label}</Option>)
                                }
                            </Select>
                        </li>
                    </>
                    {
                        (['a', 'b', 'c', 'd', 'eH', 'eL', 's', 'p'] as Array<keyof ICreateParams>).map(key => <li
                            key={key}>
                            <Label label={key}/>
                            <InputNumber{...{
                                style: INPUT_STYLE,
                                value: params[key],
                                onChange: v => setParams({[key]: +v})
                            }}/>
                        </li>)
                    }
                </ul>
            </Col>
        </Row>;
    }
}
