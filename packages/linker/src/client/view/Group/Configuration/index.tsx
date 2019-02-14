import * as React from 'react'
import * as style from './style.scss'
import {CorePhaseNamespace, IGroupWithId} from '@common'
import {Api, Lang, loadScript} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {Card, Modal} from '@antd-component'
import {Breadcrumb, Loading, Title} from '@client-component'
import {PhaseFlowChart} from '../Create'
import {phaseTemplates} from '../../../index'

declare interface IInfoState {
    loading: boolean
    group?: IGroupWithId
    activePhaseKey?: string
}

export class Configuration extends React.Component<RouteComponentProps<{ groupId: string }>, IInfoState> {

    lang = Lang.extractLang({
        back2Game: ['返回实验', 'Back to game'],
        console: ['控制台', 'CONSOLE'],
        title: ['标题', 'Title'],
        desc: ['描述', 'Description'],
        groupInfo: ['实验组信息', 'Game Info'],
        groupPhases: ['实验组环节', 'Game Phases']
    })

    state: IInfoState = {
        loading: true
    }

    async componentDidMount() {
        const {props: {match: {params: {groupId}}}} = this
        const {group} = await Api.getGroup(groupId)
        const {templates} = await Api.getPhaseTemplates()
        loadScript(templates.reduce((prev, {jsUrl}) => [...prev, ...jsUrl.split(';')], []), () => {
            this.setState({loading: false, group})
        })
    }

    render(): React.ReactNode {
        const {lang, props: {history}, state: {loading, group}} = this
        if (loading) {
            return <Loading/>
        }
        return <section className={style.groupConfiguration}>
            <Breadcrumb history={history} links={[
                {to: `/game/info/${group.gameId}`, label: lang.back2Game},
                {to: `/group/play/${group.id}`, label: lang.console},
            ]}/>
            <div>
                <Title label={lang.groupInfo}/>
                <Card title={group.title}>
                    {group.desc}
                </Card>
            </div>
            <PhaseFlowChart phaseConfigs={group.phaseConfigs}
                            onClickPhase={key => this.setState({activePhaseKey: key})}/>
            {
                this.renderActivePhaseModal()
            }
        </section>
    }

    renderActivePhaseModal() {
        const {state: {group: {phaseConfigs}, activePhaseKey}} = this
        const curPhase = phaseConfigs.find(({key}) => key === activePhaseKey)
        if (!curPhase || [CorePhaseNamespace.start, CorePhaseNamespace.end].includes(curPhase.namespace as any)) {
            return null
        }
        const {Create} = phaseTemplates[curPhase.namespace]
        return <Modal width={'60%'} visible={true} footer={null} onCancel={() => this.setState({activePhaseKey: ''})}>
            <Card className={style.createWrapper} title={curPhase.title}>
                <Create {...{
                    key: activePhaseKey,
                    phases: phaseConfigs.map(({namespace, title, key}) => ({
                        label: title,
                        key,
                        namespace
                    })),
                    curPhase,
                    updatePhase: () => null,
                    highlightPhases: () => null
                }}/>
            </Card>
        </Modal>
    }
}