import React from 'react'
import {Api, connCtx, genePhaseKey, Lang, loadScript} from '@client-util'
import {Loading} from '@client-component'
import {RouteComponentProps} from 'react-router'
import {baseEnum, CorePhaseNamespace, IPhaseConfig} from '@common'
import {phaseTemplates} from '../../index'
import {Button, Input, message} from '@antd-component'
import {rootContext, TRootContext} from '@client-context'

interface ICreateState {
    loading: boolean
    title: string
    desc: string
    phaseConfig: IPhaseConfig
}

@connCtx(rootContext)
export class Create extends React.Component<TRootContext & RouteComponentProps<{ namespace: string }>, ICreateState> {
    lang = Lang.extractLang({
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        invalidBaseInfo: ['请检查实验标题与描述信息', 'Check game title and description please'],
        start: ['开始', 'Start'],
        end: ['结束', 'End'],
        submit: ['提交', 'SUBMIT'],
        submitFailed: ['提交失败', 'Submit failed'],
        createSuccess: ['创建成功', 'Created successfully']
    })

    state: ICreateState = {
        loading: true,
        title: '',
        desc: '',
        phaseConfig: {
            key: genePhaseKey(),
            title: ``,
            namespace: this.props.match.params.namespace,
            param: {},
            suffixPhaseKeys: []
        }
    }

    async componentDidMount() {
        const {code, templates} = await Api.getPhaseTemplates(this.props.user.orgCode)
        if (code !== baseEnum.ResponseCode.success) {
            return
        }
        const template = templates.find(({namespace}) => namespace === this.props.match.params.namespace)
        if (!template) {
            return
        }
        loadScript(template.jsUrl.split(';'), () =>
            this.setState({
                loading: false
            })
        )
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
        const {code, gameId} = await Api.postNewGame(title, desc, baseEnum.GameMode.easy, phaseConfigs)
        if (code === baseEnum.ResponseCode.success) {
            message.success(lang.createSuccess)
            history.push(`/info/${gameId}`)
        } else {
            message.error(lang.submitFailed)
        }
    }

    updatePhase(param: {}) {
        const {state: {phaseConfig: config}} = this
        const phaseConfig = {...config, param: {...config.param, ...param}}
        this.setState({
            phaseConfig
        })
    }

    render(): React.ReactNode {
        const {lang, state: {loading, phaseConfig, title, desc}} = this
        if (loading) {
            return <Loading/>
        }
        const {Create} = phaseTemplates[phaseConfig.namespace]
        return <section style={{
            maxWidth: '64rem',
            margin: '1rem auto',
            padding:'1rem 1.5rem',
            background:'white'
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
            <Create {...{
                key: phaseConfig ? phaseConfig.key : '',
                phases: [],
                curPhase: phaseConfig,
                updatePhase: (suffixPhaseKeys: Array<string>, param: {}) => this.updatePhase(param),
                highlightPhases: () => console.log('highlight')
            }}/>
            <div style={{textAlign: 'center'}}>
                <Button type='primary' onClick={() => this.handleSubmit()}>{lang.submit}</Button>
            </div>
        </section>
    }
}
