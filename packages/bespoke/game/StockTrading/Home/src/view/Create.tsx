import * as React from 'react'
import {Core, Lang, Label, Input, Toast} from 'bespoke-client-util'
import * as style from './style.scss'
import {ICreateParams} from '../interface'
import {FetchType} from '../config'
import {phaseLocaleNames} from '../config'

type TProps = Core.ICreateProps<ICreateParams, FetchType>

export function Create({submitable, setSubmitable, params: {playUrl = []}, setParams}: TProps) {
    React.useEffect(() => {
        setSubmitable(false)
        setParams({playUrl: phaseLocaleNames.map(() => '')})
    }, [])

    const lang = Lang.extractLang({
        playUrl: ['环节地址', 'PhasePlayUrl'],
        edit: ['编辑', 'EDIT'],
        done: ['完成', 'DONE'],
        invalidPlayUrl: ['环节地址有误', 'Invalid play urls']
    })

    function done() {
        if (playUrl.some(p => !p.startsWith('http'))) {
            Toast.warn(lang.invalidPlayUrl)
            return
        }
        setSubmitable(true)
    }

    return <section className={style.create}>
        <label className={style.playUrlLabel}>{lang.playUrl}</label>
        <ul className={style.playUrl}>
            {
                phaseLocaleNames.map((localeName, i) => <li key={localeName[0]}>
                    <label>{Lang.extractLang({name: localeName}).name}</label>
                    {
                        submitable ?
                            <a href={playUrl[i]} target='_blank'>{playUrl[i]}</a> :
                            <input value={playUrl[i] || ''}
                                   placeholder={'http://www.ancademy.org/bespoke/IPO-Home/play/xxx'}
                                   onChange={({target: {value}}) => {
                                       const _playUrl = playUrl.slice()
                                       _playUrl[i] = value
                                       setParams({playUrl: _playUrl})
                                   }}/>
                    }
                </li>)
            }
        </ul>
        <div className={style.btnSwitch}>
            {
                submitable ? <a onClick={() => setSubmitable(false)}>{lang.edit}</a> :
                    <a onClick={() => done()}>{lang.done}</a>
            }
        </div>
    </section>
}
