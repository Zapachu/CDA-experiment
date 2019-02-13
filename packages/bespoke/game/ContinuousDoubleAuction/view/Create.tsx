import * as React from 'react'
import * as style from './style.scss'
import {phaseTemplates, localePhaseNames} from './phase'
import {CreateParams, ICreateParams} from '../interface'
import {Core, Lang} from '@dev/client'
import {FetchType, IDENTITY, phaseNames, ROLE} from '../config'
import cloneDeep = require('lodash/cloneDeep')

export class Create extends Core.Create<ICreateParams, FetchType> {
    lang = Lang.extractLang({
        gameType: ['实验类型', 'Game Type'],
        clone: ['复制', 'CLONE'],
        remove: ['移除', 'REMOVE']
    })

    componentDidMount() {
        const {props: {params, setParams}} = this
        if (params.phases) {
            return
        }
        const marketPositions = [
            ...Array(6).fill(null).map(() => ({
                identity: IDENTITY.ZipRobot,
                interval: 1,
                exchangeRate: 1,
                k: 1,
                role: ROLE.Seller
            })),
            ...Array(6).fill(null).map(() => ({
                identity: IDENTITY.ZipRobot,
                interval: 1,
                exchangeRate: 1,
                k: 1,
                role: ROLE.Buyer
            }))
        ]
        const phases = [{
            templateName: phaseNames.assignPosition,
            params: {
                participationFee: 10,
                positions: marketPositions
            }
        }, {
            templateName: phaseNames.mainGame,
            params: {
                durationOfEachPeriod: 180,
                time2ReadInfo: 15,
                unitLists: marketPositions.map(({role}) => role === ROLE.Buyer ?
                    '325 325 305 260 220' :
                    '185 185 235 260 270'
                ),
                startTime: marketPositions.map(() => 3)
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

    clonePhase(phaseIndex: number) {
        const {props: {params, setParams}} = this,
            newParams = cloneDeep(params),
            {phases} = newParams
        newParams.phases = [...phases.slice(0, phaseIndex), cloneDeep(phases[phaseIndex]), ...phases.slice(phaseIndex)]
        setParams(newParams)
    }

    removePhase(phaseIndex: number) {
        const {props: {params, setParams}} = this,
            newParams = cloneDeep(params),
            {phases} = newParams
        newParams.phases = [...phases.slice(0, phaseIndex - 1), ...phases.slice(phaseIndex)]
        setParams(newParams)
    }

    render(): React.ReactNode {
        const {lang, props: {fetcher, params: {phases = []}}} = this
        return <section className={style.create}>
            <ul className={style.phases}>{
                phases.map(({templateName, params}, i) => {
                    const {name, Create} = phaseTemplates.find(({name}) => name === templateName)
                    return <li className={style.phase} key={`${i}-${templateName}`}>
                        <label
                            className={style.phaseTitle}>{i + 1} - {Lang.extractLang({name: localePhaseNames[name]}).name}</label>
                        <div className={style.createWrapper}>
                            <Create {...{
                                params,
                                phases,
                                fetcher,
                                updateParams: newParams => this.updateCreateParams(i, newParams)
                            }}/>
                            {
                                name === phaseNames.mainGame ? <ul className={style.marketBtns}>
                                    {i > 1 ? <li className={style.btnRemove}
                                                 onClick={() => this.removePhase(i)}>{lang.remove}</li> : null}
                                    <li onClick={() => this.clonePhase(i)}>{lang.clone}</li>
                                </ul> : null
                            }
                        </div>
                    </li>
                })
            }</ul>
        </section>
    }
}