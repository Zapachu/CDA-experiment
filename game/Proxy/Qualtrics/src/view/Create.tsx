import {Core} from '@bespoke/client'
import {ICreateParams} from '../config'
import * as React from 'react'
import {Input} from 'antd'
import * as style from './style.scss'
import {Lang} from '@elf/component'

export function Create({params, setParams}: Core.ICreateProps<ICreateParams>) {
    const lang = Lang.extractLang({
        qualtricsUrl: ['Qualtrics Survey Link', 'Qualtrics Survey 链接']
    })
    return <section className={style.create}>
        <Input size={'small'} placeholder={lang.qualtricsUrl} value={params.surveyUrl}
               onChange={({target: {value}}) => setParams({surveyUrl: value})}/>
    </section>
}