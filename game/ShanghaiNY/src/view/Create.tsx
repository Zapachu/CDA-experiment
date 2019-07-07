import * as React from 'react'
import * as style from './style.scss'
import {Input, Label, Lang, RangeInput, Select} from '@elf/component'
import {Core} from '@bespoke/register'
import {GameType, Version} from '../config'
import {ICreateParams} from '../interface'

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
]

const versions = [
    {label: 'V1', value: Version.V1},
    {label: 'V2', value: Version.V2},
    {label: 'V3', value: Version.V3}
]

export class Create extends Core.Create<ICreateParams, ICreateState> {
    lang = Lang.extractLang({
        round: ['轮次', 'Round'],
        playersPerGroup: ['每组人数', 'Players per Group'],
        gameType: ['类型', 'Game Type'],
        version: ['版本', 'Version'],
        params: ['参数', 'Parameters'],
        participationFee: ['参与费', 'Participation Fee']
    })

    componentDidMount(): void {
        const {props: {setParams}} = this
        let defaultParams: ICreateParams = {
            playersPerGroup: 2,
            rounds: 2,
            gameType: GameType.T1,
            version: Version.V1,
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
        }
        setParams(defaultParams)
    }

    render(): React.ReactNode {
        const {lang, props: {params, setParams}} = this
        const gameParams = ['a', 'b', 'c', 'd', 'eH', 'eL', 's', 'p', 'b0', 'b1']
        return <section className={style.create}>
            <ul className={style.fields}>
                <li>
                    <Label label={lang.playersPerGroup}/>
                    <RangeInput value={params.playersPerGroup}
                                min={2}
                                max={12}
                                step={2}
                                onChange={({target: {value: playersPerGroup}}) => setParams({playersPerGroup: Number(playersPerGroup)})}
                    />
                </li>
                <li>
                    <Label label={lang.round}/>
                    <RangeInput value={params.rounds}
                                min={1}
                                max={30}
                                step={1}
                                onChange={({target: {value: rounds}}) => setParams({rounds: Number(rounds)})}
                    />
                </li>
                <li>
                    <Label label={lang.participationFee}/>
                    <Input {...{
                        type: 'number',
                        value: params.participationFee,
                        onChange: ({target: {value}}) => setParams({participationFee: Number(value)})
                    }}/>
                </li>
                <li>
                    <Label label={lang.gameType}/>
                    <Select value={params.gameType} options={gameTypes} onChange={val => setParams({gameType: +val})}/>
                </li>
                <li>
                    <Label label={lang.version}/>
                    <Select value={params.version} options={versions} onChange={val => setParams({version: +val})}/>
                </li>
            </ul>
            <p className={style.params}>{lang.params}</p>
            <ul className={style.fields}>
                {
                    gameParams.map(p => {
                        if (params.gameType === GameType.T1 && p === 'd') return null
                        if (params.version === Version.V3 && p === 'b') return null
                        if (params.version !== Version.V3 && ['p', 'b0', 'b1'].includes(p)) return null
                        return <li key={p}>
                            <Label label={p}/>
                            <Input {...{
                                type: 'number',
                                value: params[p],
                                onChange: ({target: {value}}) => setParams({[p]: Number(value)})
                            }}/>
                        </li>
                    })
                }
            </ul>
        </section>
    }
}