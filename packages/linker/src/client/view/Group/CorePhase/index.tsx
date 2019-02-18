// import * as React from 'react'
// import * as style from './style.scss'
// import {clsNames, Lang} from '@client-util'
// import {CorePhaseNamespace} from '@common'
// import {Radio} from '@antd-component'
// import {BaseCreate, registerPhaseCreate} from '../../../index'
// import {Label} from '@client-component'

// const {Group: RadioGroup, Button: RadioButton} = Radio

export function registerCorePhases() {
    // registerPhaseCreate(CorePhaseNamespace.start, {
    //     localeNames: ['开始', 'Start'],
    //     Create: class Create extends BaseCreate<{ firstPhaseKey: string }, {}> {

    //         render(): React.ReactNode {
    //             const {props: {phases, updatePhase, curPhase}} = this
    //             const lang = Lang.extractLang({
    //                 firstPhase: ['起始环节', 'First Phase']
    //             })
    //             const customPhases = phases.filter(({namespace}) => !CorePhaseNamespace[namespace])
    //             return <section className={clsNames(style.startPhase, style.create)}>
    //                 <div className={style.firstPhaseWrapper}>
    //                     {
    //                         customPhases.length ? <React.Fragment>
    //                             <Label label={lang.firstPhase}/>
    //                             <RadioGroup value={curPhase.param.firstPhaseKey || ''}
    //                                         onChange={({target: {value}}) => value ?
    //                                             updatePhase([value], {firstPhaseKey: value}) : null}
    //                             >
    //                                 {
    //                                     customPhases.map(({label, key}) => <RadioButton key={key}
    //                                                                                     value={key}>{label}</RadioButton>)
    //                                 }

    //                             </RadioGroup>
    //                         </React.Fragment> : null
    //                     }
    //                 </div>
    //             </section>
    //         }
    //     }
    // })
    // registerPhaseCreate(CorePhaseNamespace.end, {
    //     localeNames: ['结束', 'End']
    // })
}