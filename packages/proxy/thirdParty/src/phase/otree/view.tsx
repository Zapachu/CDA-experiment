import * as React from 'react'
import {BaseCreate, BasePlay, Lang} from '@client-vendor'
import * as style from './style.scss'

import {ICreateParam, PushType, MoveType} from './config'
import {registerOnFramework} from '../index'

class Create extends BaseCreate<any> {

    state = {
        nextPhaseKey: -1,
        list: [],
        otreeName: 'public_goods'
    }

    componentDidMount() {

        // const fetchUrl = 'http://127.0.0.1:3070/phases/list'
        // fetchData(fetchUrl, (res) => {
        //     if (!res.err) {
        //         this.setState({ list: res.list })
        //     } else {
        //         console.log(res.errMsg)
        //     }
        // })

        this.createPhase('public_goods')
        this.setState({list: ['public_goods', 'guess_two_thirds', 'survey', 'quiz']})
    }

    /**
     * 新建 phase
     * @param namespace
     */
    createPhase(otreeName: string) {
        console.log(otreeName)
        const {props: {updatePhase}} = this
        this.setState({otreeName})
        updatePhase([], {otreeName})
    }

    /**
     * 渲染 otree phase 视图
     */
    renderOtreePhaseList(): React.ReactNode {
        const listView = []
        this.state.list.map((li, key) => {
            listView.push(
                <React.Fragment key={`otree-phase-list-${key}`}>
                    <li style={{
                        cursor: 'pointer',
                        listStyle: 'circle',
                        color: li.toString() === this.state.otreeName.toString() ? '#2196f3' : 'rgba(85, 85, 85, 0.8)'
                    }} onClick={this.createPhase.bind(this, li)}>
                        <span></span>{li}
                    </li>
                </React.Fragment>
            )
        })
        return listView
    }

    calcSuffixPhaseKeys(newParam: Partial<ICreateParam>): Array<string> {
        return Array.from(new Set([newParam.nextPhaseKey].filter(k => k)))
    }

    /**
     * 新建视图
     */
    render(): React.ReactNode {

        /**
         * language: 语言
         * phases: 所有已创建phases
         * updatePhase: 创建一个新的phase
         * highlightPhase: 高亮phase
         * nextPhaseKey: 下一个phase
         */
        const {props: {phases, updatePhase, highlightPhases, curPhase}} = this
        const nextPhase = phases[phases.findIndex(({key}) => key === curPhase.key) + 1]
        console.log(curPhase)
        console.log(phases)

        const lang = Lang.extractLang({
            name: ['结束后跳转至', 'Link To Next Phase'],
            submit: ['保存', 'Save']
        })

        if (nextPhase && !curPhase.param.nextPhaseKey) {
            setTimeout(() => updatePhase([nextPhase.key], {
                nextPhaseKey: nextPhase.key
            }), 0)
        }

        return <section className={style.create}>


            {this.renderOtreePhaseList()}

            <div className={style.case}>
                <label>{lang.name}</label>
                <ul className={style.suffixPhases}>
                    {
                        phases.map(({key, label}) => <li key={key}
                                                         className={`${key === curPhase.param.nextPhaseKey ? style.active : ''}`}
                                                         onMouseEnter={() => highlightPhases([key])}
                                                         onMouseOut={() => highlightPhases([])}
                                                         onClick={() => updatePhase(this.calcSuffixPhaseKeys({
                                                             ...curPhase.param, nextPhaseKey: key
                                                         }), {nextPhaseKey: key})}>
                                {label || key}
                            </li>
                        )
                    }
                </ul>
            </div>

        </section>
    }
}

class Play extends BasePlay<MoveType, PushType> {

    render(): React.ReactNode {
        return <section></section>
    }
}

registerOnFramework('otree', {
    localeNames: ['Otree 环节', 'Otree Phase'],
    Create,
    Play
})