import * as React from 'react'
import * as style from './style.scss'
import {phaseTemplates, localePhaseNames} from './phase'
import {CreateParams, ICreateParams} from '../interface'
import {Core, Lang} from 'bespoke-client-util'
import {FetchType, phaseNames, ROLE} from '../config'
import cloneDeep = require('lodash/cloneDeep')

export class Create extends Core.Create<ICreateParams, FetchType> {
    componentDidMount() {
        const {props: {params, setParams}} = this
        if (params.phases) {
            return
        }
        const roles = [
            ...Array(6).fill(null).map(() => ROLE.Seller),
            ...Array(6).fill(null).map(() => ROLE.Buyer)
        ]
        const phases: Array<CreateParams.IPhase> = [{
            templateName: phaseNames.assignPosition,
            params: {
                roles
            }
        }, {
            templateName: phaseNames.mainGame,
            params: {
                durationOfEachPeriod: 180,
                time2ReadInfo: 15,
                unitLists: roles.map(role => role === ROLE.Buyer ?
                    '325 325 305 260 220' :
                    '185 185 235 260 270'
                )
            }
        }, {
            templateName: phaseNames.marketResult,
            params: {}
        }]
        setParams({phases})
    }

    updateCreateParams(phaseIndex: number, newPhaseParams: Partial<CreateParams.Phase.IParams>) {
        const {props: {params, setParams}} = this,
            newParams = cloneDeep(params),
            {phases} = newParams
        Object.assign(phases[phaseIndex].params, newPhaseParams)
        setParams(newParams)
    }

    render(): React.ReactNode {
        const {props: {fetcher, params: {phases = []}}} = this
        return <section className={style.create}>
            <ul className={style.phases}>{
                phases.map(({templateName, params}, i) => {
                    const {name, Create} = phaseTemplates.find(({name}) => name === templateName)
                    return <li className={style.phase} key={`${i}-${templateName}`}>
                        {
                            localePhaseNames[name] ? <label className={style.phaseTitle}>{
                                Lang.extractLang({name: localePhaseNames[name]}).name
                            }</label> : null
                        }
                        <div className={style.createWrapper}>
                            <Create {...{
                                params,
                                phases,
                                fetcher,
                                updateParams: newParams => this.updateCreateParams(i, newParams)
                            }}/>
                        </div>
                    </li>
                })
            }</ul>
        </section>
    }
}
