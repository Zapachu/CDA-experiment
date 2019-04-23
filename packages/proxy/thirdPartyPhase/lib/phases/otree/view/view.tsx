import * as React from 'react'
import {BaseCreate, Lang} from '@client-vendor'
import * as style from './style.scss'
import {registerOnFramework} from '../../index'
import {fetchData} from '../../common/utils/fetchData'

let otreeNode: { namespace: string,  oTreeProxy:string}

class Create extends BaseCreate<any> {

    state = {
        nextPhaseKey: -1,
        list: [],
        otreeName: 'quiz'
    }

    async componentDidMount() {
        const fetchUrl = `${otreeNode.oTreeProxy}/phases/list`
        const res = await fetchData(fetchUrl)
        if (!res.err) {
            this.createPhase('public_goods')
            this.setState({list: res.list})
        }
    }

    createPhase(otreeName: string) {
        console.log(otreeName)
        console.log(otreeName)
        const {props: {updatePhase}} = this
        this.setState({otreeName})
        updatePhase([], {otreeName})
    }

    renderOtreePhaseList(): React.ReactNode {
        const listView = []
        this.state.list.map((li, key) => {
            listView.push(
                <React.Fragment key={`oTree-phase-list-${key}`}>
                    <li style={{
                        cursor: 'pointer',
                        listStyle: 'circle',
                        color: li.toString() === this.state.otreeName.toString() ? '#2196f3' : 'rgba(85, 85, 85, 0.8)'
                    }} onClick={this.createPhase.bind(this, li)}>
                        <span> </span>{li}
                    </li>
                </React.Fragment>
            )
        })
        return listView
    }

    calcSuffixPhaseKeys = (newParam) => {
        return Array.from(new Set([newParam.nextPhaseKey].filter(k => k)))
    }

    render() {
        const {props: {phases, updatePhase, highlightPhases, curPhase}} = this
        const nextPhase = phases[phases.findIndex(({key}) => key === curPhase.key) + 1]
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
                        phases.map(({key, label}) =>
                            <li key={key}
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

;(window as any).registerOtreePhase = (namespace:string, oTreeProxy:string) => {
    otreeNode = {namespace, oTreeProxy}
    registerOnFramework(namespace, {
        localeNames: [namespace, namespace],
        Create
    })
}

