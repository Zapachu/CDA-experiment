import React from 'react'
import {Api, connCtx, Lang, loadScript} from '@client-util'
import {Loading} from '@client-component'
import {RouteComponentProps} from 'react-router'
import {baseEnum, CorePhaseNamespace, IPhaseConfig} from '@common'
import {AddPhase} from '../Phase'
import {phaseTemplates} from '../../index'
import {Button, Input, message, Modal} from '@antd-component'
import GameMode = baseEnum.GameMode
import {rootContext, TRootContext} from '@client-context'

interface ICreateInFrameState {
    loading: boolean
    showCreateModal: boolean
    title: string
    desc: string
    phaseConfig: IPhaseConfig
}

@connCtx(rootContext)
export class CreateInFrame extends React.Component<TRootContext & RouteComponentProps, ICreateInFrameState> {
    lang = Lang.extractLang({
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        invalidBaseInfo: ['请检查实验标题与描述信息', 'Check game title and description please'],
        start: ['开始', 'Start'],
        end: ['结束', 'End'],
        submit: ['提交', 'SUBMIT'],
        submitFailed: ['提交失败', 'Submit failed'],
        createSuccess: ['创建成功', 'Created successfully'],
        extendedGame: ['组合实验', 'Extended Game'],
        customize: ['定制', 'Customize'],
        historyGame: ['历史实验', 'History Games']
    })

    state: ICreateInFrameState = {
        loading: true,
        showCreateModal: false,
        title: '',
        desc: '',
        phaseConfig: null
    }

    async componentDidMount() {
        const {code, templates} = await Api.getPhaseTemplates(this.props.user.orgCode)
        if (code === baseEnum.ResponseCode.success) {
            loadScript(templates.reduce((prev, {jsUrl}) => [...prev, ...jsUrl.split(';')], []), () =>
                this.setState({loading: false})
            )
        }
    }

    async handleSubmit() {
        const {lang, props: {history}, state: {phaseConfig, title, desc}} = this
        if (!title || !desc) {
            return message.warn(lang.invalidBaseInfo)
        }
        const startPhase = {
            key: CorePhaseNamespace.start,
            title: lang.start,
            namespace: CorePhaseNamespace.start,
            param: {firstPhaseKey: phaseConfig.key},
            suffixPhaseKeys: [phaseConfig.key]
        }
        const endPhase = {
            key: CorePhaseNamespace.end,
            title: lang.end,
            namespace: CorePhaseNamespace.end,
            param: {},
            suffixPhaseKeys: []
        }
        phaseConfig.suffixPhaseKeys = [endPhase.key]
        const phaseConfigs = [startPhase, phaseConfig, endPhase]
        const {code, gameId} = await Api.postNewGame(title, desc, GameMode.easy, phaseConfigs)
        if (code === baseEnum.ResponseCode.success) {
            message.success(lang.createSuccess)
            history.push(`/info/${gameId}`)
        } else {
            message.error(lang.submitFailed)
        }
    }

    render(): React.ReactNode {
        const {lang, props: {history}, state: {loading}} = this
        if (loading) {
            return <Loading/>
        }
        return <section>
            <div style={{textAlign: 'right', marginBottom: '2rem'}}>
                <Button onClick={() => history.push('/baseInfo')}>{lang.extendedGame}</Button>&nbsp;
                <Button onClick={() => history.push('/list')}>{lang.historyGame}</Button>&nbsp;
                <Button onClick={() => window.open('https://www.ancademy.org/customexp')}
                        type='primary'>{lang.customize}</Button>
            </div>
            <AddPhase onTagClick={phaseConfig => {
                this.setState({phaseConfig, showCreateModal: true})
            }
            }/>
            {
                this.renderCreate()
            }
        </section>
    }

    renderCreate() {
        const {lang, state: {showCreateModal, phaseConfig, title, desc}} = this
        return <Modal {...{
            width:'75%',
            visible: showCreateModal,
            onCancel: () => this.setState({showCreateModal: false}),
            onOk: () => this.handleSubmit()
        }}>
            <br/>
            <Input value={title}
                   placeholder={lang.title}
                   maxLength={20}
                   onChange={({target: {value: title}}) => this.setState({title})}/>
            <br/><br/>
            <Input.TextArea value={desc}
                            maxLength={500}
                            autosize={{minRows: 4, maxRows: 8}}
                            placeholder={lang.desc}
                            onChange={({target: {value: desc}}) => this.setState({desc})}/>
            <br/><br/>
            {
                phaseConfig ? this.renderPhase() : null
            }
        </Modal>
    }

    updatePhase(param: {}) {
        const {state: {phaseConfig: config}} = this
        const phaseConfig = {...config, param: {...config.param, ...param}}
        this.setState({
            phaseConfig
        })
    }

    renderPhase() {
        const {state: {phaseConfig}} = this
        const {Create} = phaseTemplates[phaseConfig.namespace]
        return <Create {...{
            key: phaseConfig ? phaseConfig.key : '',
            phases: [],
            curPhase: phaseConfig,
            updatePhase: (suffixPhaseKeys: Array<string>, param: {}) => this.updatePhase(param),
            highlightPhases: () => console.log('highlight')
        }}/>
    }
}
