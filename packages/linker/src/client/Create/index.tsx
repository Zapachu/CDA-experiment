import * as React from 'react'
import {Api, GameTemplate, loadScript, TPageProps} from '../util'
import {Lang} from '@elf/component'
import {Loading} from '../component'
import {RouteComponentProps} from 'react-router'
import {Button, Input, message} from 'antd'
import {ResponseCode} from '@elf/share'

interface ICreateState {
    loading: boolean
    title: string
    desc: string
    params: {},
    submitable: boolean
}

export class Create extends React.Component<TPageProps & RouteComponentProps<{ namespace: string }>, ICreateState> {
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
        params: {},
        submitable: true
    }

    async componentDidMount() {
        const {code, jsUrl} = await Api.getJsUrl(this.props.match.params.namespace)
        if (code !== ResponseCode.success) {
            return
        }
        loadScript(jsUrl.split(';'), () =>
            this.setState({
                loading: false
            })
        )
    }

    async handleSubmit() {
        const {lang, props: {history}, state: {title, desc, params}} = this
        if (!title || !desc) {
            return message.warn(lang.invalidBaseInfo)
        }
        const {code, gameId} = await Api.postNewGame(title, desc, GameTemplate.getTemplate().namespace, params)
        if (code === ResponseCode.success) {
            message.success(lang.createSuccess)
            history.push(`/info/${gameId}`)
        } else {
            message.error(lang.submitFailed)
        }
    }

    updatePhase(newParam: {}) {
        this.setState(({params}) => ({
            params: {...params, ...newParam}
        }))
    }

    render(): React.ReactNode {
        const {lang, state: {loading, params, title, desc, submitable}} = this
        if (loading) {
            return <Loading/>
        }
        console.log(GameTemplate.getTemplate())
        const {Create} = GameTemplate.getTemplate()
        return <section style={{
            maxWidth: '64rem',
            margin: 'auto',
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
                params,
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
