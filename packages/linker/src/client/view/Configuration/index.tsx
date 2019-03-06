import * as React from 'react'
import * as style from './style.scss'
import {CorePhaseNamespace, IGameWithId} from '@common'
import {Api, Lang, loadScript} from '@client-util'
import {RouteComponentProps} from 'react-router'
import {Card, Modal} from '@antd-component'
import {Breadcrumb, Loading, Title} from '@client-component'
import {PhaseFlowChart} from '../Create'
import {phaseTemplates} from '../../index'

declare interface IInfoState {
    loading: boolean
    game?: IGameWithId
    activePhaseKey?: string
}

export class Configuration extends React.Component<RouteComponentProps<{ gameId: string }>, IInfoState> {

    lang = Lang.extractLang({
        back2Game: ['实验信息', 'Game Info'],
        console: ['控制台', 'CONSOLE'],
        title: ['标题', 'Title'],
        desc: ['描述', 'Description'],
        groupPhases: ['实验环节', 'Game Phases']
    })

    state: IInfoState = {
        loading: true
    }

    async componentDidMount() {
        const {props: {match: {params: {gameId}}}} = this
        const {game} = await Api.getGame(gameId)
        const {templates} = await Api.getPhaseTemplates()
        loadScript(templates.reduce((prev, {jsUrl}) => [...prev, ...jsUrl.split(';')], []), () => {
            this.setState({loading: false, game})
        })
    }

    render(): React.ReactNode {
        const {lang, props: {history}, state: {loading, game}} = this
        if (loading) {
            return <Loading/>
        }
        return <section className={style.groupConfiguration}>
            <Breadcrumb history={history} links={[
                {to: `/info/${game.id}`, label: lang.back2Game},
                {to: `/play/${game.id}`, label: lang.console},
            ]}/>
            <div>
                <Title label={lang.groupPhases}/>
                <Card title={game.title}>
                    {game.desc}
                </Card>
            </div>
            <PhaseFlowChart phaseConfigs={game.phaseConfigs}
                            onClickPhase={key => this.setState({activePhaseKey: key})}/>
            {
                this.renderActivePhaseModal()
            }
        </section>
    }

    renderActivePhaseModal() {
        const {state: {game: {phaseConfigs}, activePhaseKey}} = this
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