import * as React from 'react'
import {Template} from '@elf/register'
import * as style from './style.scss'
import {registerOnFramework} from '../../index'
import {fetchData} from '../../common/utils/fetchData'

let otreeNode: { namespace: string, oTreeProxy: string }

class Create extends Template.Create<{ otreeName: string }> {

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
        const {props: {setParams}} = this
        this.setState({otreeName})
        setParams({otreeName})
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

    render() {
        return <section className={style.create}>
            {this.renderOtreePhaseList()}
        </section>
    }
}

;(window as any).registerOtreePhase = (namespace: string, oTreeProxy: string) => {
    otreeNode = {namespace, oTreeProxy}
    registerOnFramework(namespace, {
        localeNames: [namespace, namespace],
        Create
    })
}

