import * as React from 'react';
import {Label, Lang} from '@elf/component';
import {Core} from '@bespoke/client';
import {Col, InputNumber, Row, Select, Slider} from 'antd';
import {GameType, ICreateParams, Mode, Version} from '../config';
import style from './style.scss';

const {Option} = Select;

interface ICreateState {
    playersPerGroup: number,
    rounds: number,
    gameType: GameType,
    version: Version,
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

const gameTypes = [
    {label: 'T1', value: GameType.T1},
    {label: 'T2', value: GameType.T2}
];

const versions = [
    {label: 'V1', value: Version.V1},
    {label: 'V2', value: Version.V2},
    {label: 'V3', value: Version.V3},
    {label: 'V4', value: Version.V4},
];

const modes = [
    {label: 'HR', value: Mode.HR},
    {label: 'LR', value: Mode.LR},
    {label: 'BR', value: Mode.BR},
];


export class Create extends Core.Create<ICreateParams, ICreateState> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        playersPerGroup: ['每组人数', 'Players per Group'],
        gameType: ['类型', 'Game Type'],
        version: ['版本', 'Version'],
        mode: ['模式', 'Mode'],
        participationFee: ['参与费', 'Participation Fee']
    });

    componentDidMount(): void {
        const {props: {setParams}} = this;
        let defaultParams: ICreateParams = {
            playersPerGroup: 2,
            rounds: 2,
            gameType: GameType.T2,
            version: Version.V1,
            mode: Mode.HR,
            participationFee: 0,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            eH: 0,
            eL: 0,
            s: 0,
            p: 0,
            b0: 0,
            b1: 0
        };
        setParams(defaultParams);
    }

    render(): React.ReactNode {
        const INPUT_STYLE: React.CSSProperties = {
            width: '8rem'
        };
        const {lang, props: {params, setParams}} = this;
        const gameParams = ['a', 'b', 'c', 'd', 'eH', 'eL', 's', 'p', 'b0', 'b1'];
        return <Row>
            <Col span={10} offset={7}>
                <ul className={style.create}>
                    <li>
                        <Label label={lang.playersPerGroup}/>
                        <Slider className={style.slider}
                                tooltipVisible={true}
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
                                tooltipVisible={true}
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
                    <li>
                        <Label label={lang.version}/>
                        <Select value={params.version as any} style={INPUT_STYLE}
                                onChange={version => setParams({version})}>
                            {
                                versions.map(({label, value}) => <Option value={value}>{label}</Option>)
                            }
                        </Select>
                    </li>
                    {
                        params.version === Version.V4 ?
                            <li>
                                <Label label={lang.mode}/>
                                <Select value={params.mode as any} style={INPUT_STYLE}
                                        onChange={mode => setParams({mode})}>
                                    {
                                        modes.map(({label, value}) => <Option value={value}>{label}</Option>)
                                    }
                                </Select>
                            </li> : <li>
                                <Label label={lang.gameType}/>
                                <Select value={params.gameType as any} style={INPUT_STYLE}
                                        onChange={gameType => setParams({gameType})}>
                                    {
                                        gameTypes.map(({label, value}) => <Option value={value}>{label}</Option>)
                                    }
                                </Select>
                            </li>
                    }
                    {
                        gameParams.map(p => {
                            if (params.gameType === GameType.T1 && p === 'd') return null;
                            if (params.version === Version.V3 && p === 'b') return null;
                            if (params.version !== Version.V3 && ['p', 'b0', 'b1'].includes(p)) return null;
                            return <li key={p}>
                                <Label label={p}/>
                                <InputNumber{...{
                                    style: INPUT_STYLE,
                                    value: params[p],
                                    onChange: v => setParams({[p]: +v})
                                }}/>
                            </li>;
                        })
                    }
                </ul>
            </Col>
        </Row>;
    }
}