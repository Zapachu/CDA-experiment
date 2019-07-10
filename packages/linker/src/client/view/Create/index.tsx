import React from 'react'
import {Api, connCtx, Lang, loadScript} from '@client-util'
import {Loading} from '@client-component'
import {RouteComponentProps} from 'react-router'
import {phaseTemplates} from '../../index'
import {Button, Input, message} from '@antd-component'
import {rootContext, TRootContext} from '@client-context'
import {ResponseCode} from '@elf/share'

interface ICreateState {
    loading: boolean
    title: string
    desc: string
    namespace: string
    param: {},
    submitable: boolean
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
        namespace: this.props.match.params.namespace,
        param: {},
        submitable: true
    }

    async componentDidMount() {
        const {code, templates} = await Api.getPhaseTemplates()
        if (code !== ResponseCode.success) {
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
        const {lang, props: {history}, state: {title, desc, namespace, param}} = this
        if (!title || !desc) {
            return message.warn(lang.invalidBaseInfo)
        }
        const {code, gameId} = await Api.postNewGame(title, desc, namespace, param)
        if (code === ResponseCode.success) {
            message.success(lang.createSuccess)
            history.push(`/info/${gameId}`)
        } else {
            message.error(lang.submitFailed)
        }
    }

    updatePhase(newParam: {}) {
        this.setState(({param}) => ({
            param: {...param, ...newParam}
        }))
    }

    render(): React.ReactNode {
        const {lang, state: {loading, namespace, param, title, desc, submitable}} = this
        if (loading) {
            return <Loading/>
        }
        const {Create} = phaseTemplates[namespace]
        return <section style={{
            maxWidth: '64rem',
            margin: '1rem auto',
            padding: '1rem 1.5rem',
            background: 'white'
        }}>
            <br/>
            <Input value={title}
                   placeholder={lang.title}
                   maxLength='20'
                   onChange={({target: {value: title}}) => this.setState({title})}/>
            <br/><br/>
            <Input.TextArea value={desc}
                            maxLength={500}
                            autosize={{minRows: 4, maxRows: 8}}
                            placeholder={lang.desc}
                            onChange={({target: {value: desc}}) => this.setState({desc})}/>
            <br/><br/>
            <Create {...{
                submitable,
                setSubmitable: submitable => this.setState({submitable}),
                params: param,
                setParams: params => this.updatePhase(params)
            }}/>
            {
                submitable ?
                    <div style={{textAlign: 'center'}}>
                        <Button type='primary' onClick={() => this.handleSubmit()}>{lang.submit}</Button>
                    </div> : null
            }
        </section>
    }
}
