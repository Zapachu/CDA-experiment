import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client'
import {Label, Lang, Select} from '@elf/component'
import {ICreateParams} from '../config'
import {NCreateParams} from '@micro-experiment/share'

const gameTypes = [
    {label: '中位数', value: NCreateParams.IPOType.Median},
    {label: '最高价前K', value: NCreateParams.IPOType.TopK},
    {label: '第一价格密封拍卖', value: NCreateParams.IPOType.FPSBA},
]

export class Create extends Core.Create<ICreateParams> {
    lang = Lang.extractLang({
        gameType: ['类型', 'Game Type'],
    })

    componentDidMount(): void {
        const {props: {setParams}} = this
        let defaultParams: ICreateParams = {
            type: NCreateParams.IPOType.Median
        }
        setParams(defaultParams)
    }

    render(): React.ReactNode {
        const {lang, props: {params, setParams}} = this
        return <section className={style.create}>
            <ul className={style.fields}>
                <li>
                    <Label label={lang.gameType}/>
                    <Select value={params.type} options={gameTypes} onChange={val => setParams({type: +val})}/>
                </li>
            </ul>
        </section>
    }
}