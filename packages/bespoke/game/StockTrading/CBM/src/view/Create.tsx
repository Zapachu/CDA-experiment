import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Label, RangeInput} from 'bespoke-client-util'
import {FetchType, ICreateParams} from '../config'

export const Create: Core.CreateSFC<ICreateParams, FetchType> = ({submitable, setSubmitable, params, setParams}) => {
    const lang = Lang.extractLang({
        edit: ['编辑', 'EDIT'],
        done: ['完成', 'DONE'],
        tradeTime: ['时期时长', 'Duration of a period'],
        prepareTime: ['浏览信息时长', 'Time to read game info'],
    })
    React.useEffect(() => {
        setParams({prepareTime: 15, tradeTime: 180})
    }, [])
    return <section className={style.create}>
        <ul className={style.baseFields}>
            {
                Object.entries({
                    prepareTime: {
                        min: 10,
                        max: 30,
                        step: 5
                    },
                    tradeTime: {
                        min: 60,
                        max: 300,
                        step: 30
                    }
                }).map(([key, props]) =>
                    <li className={style.baseField} key={key}>
                        <Label label={lang[key]}/>
                        {
                            submitable ?
                                <span>{params[key]}</span> :
                                <RangeInput {...props} {...{
                                    value: params[key],
                                    onChange: ({target: {value}}) => submitable ? null : setParams({[key]: +value})
                                }}/>
                        }
                    </li>)
            }
        </ul>
        <div className={style.btnSwitch}>
            {
                submitable ? <a onClick={() => setSubmitable(false)}>{lang.edit}</a> :
                    <a onClick={() => setSubmitable(true)}>{lang.done}</a>
            }
        </div>
    </section>

}
