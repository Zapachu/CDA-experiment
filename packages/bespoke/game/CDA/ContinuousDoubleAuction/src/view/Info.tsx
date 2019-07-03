import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client-sdk'
import {ICreateParams} from '../interface'
import {phaseTemplates} from './phase'

export const Info: Core.InfoSFC<ICreateParams> = ({game: {params: {phases}}}) =>
    phases.length ?
        <React.Fragment>
            {
                phases.map((phase, index) => {
                    const {Info} = phaseTemplates.find(({name}) => name === phase.templateName)
                    return <li className={style.phaseItemInfo}>
                        <div className={style.phaseHead}>
                            <a className={style.phasesName}>{phase.templateName}</a>
                        </div>
                        <div className={style.phaseBody}>
                            <Info key={index} {...{phases, params: phase.params}}/>
                        </div>
                    </li>
                })
            }
        </React.Fragment> :
        <div className={style.blankMsg}>NO PHASE</div>