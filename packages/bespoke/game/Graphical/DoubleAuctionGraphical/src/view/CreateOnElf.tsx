import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, BtnGroup} from 'elf-component'
import {Create} from './Create'
import {ICreateParams} from '../interface'

export class CreateOnElf extends Core.CreateOnElf<ICreateParams> {

    render(): React.ReactNode {
        const {props: {phases, updatePhase, curPhase: {param}}} = this
        const lang = Lang.extractLang({
            nextPhaseKey: ['下个环节', 'Next phase']
        })
        return <section className={style.createOnElf}>
            <BtnGroup {...{
                label: lang.nextPhaseKey,
                options: phases.map(({label}) => label),
                value: phases.findIndex(({key}) => key === param.nextPhaseKey),
                onChange: value => {
                    const nextPhaseKey = phases[value].key
                    updatePhase([nextPhaseKey], {nextPhaseKey})
                }
            }}/>
            <Create {...{
                params: param,
                setParams: newParams => {
                    updatePhase(param.nextPhaseKey ? [param.nextPhaseKey] : [], newParams)
                },
                setSubmitable: () => null
            }}/>
        </section>
    }
}
