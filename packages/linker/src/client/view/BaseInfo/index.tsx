import * as React from 'react'
import * as style from './style.scss'
import {RouteComponentProps} from 'react-router'
import {baseEnum, GameMode} from '@common'
import {Api, Lang} from '@client-util'
import {Button, Input, message, Switch} from '@antd-component'

interface IBaseInfoState {
    loading: boolean,
    title: string,
    desc: string,
    created: boolean,
    mode: string
}

export class BaseInfo extends React.Component<RouteComponentProps<{ gameId: string }>, IBaseInfoState> {
    lang = Lang.extractLang({
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        save: ['保存', 'Save'],
        lackInfo: ['实验描述缺失', 'Please complete game info'],
        extendedMode: ['扩展模式', 'Extended Mode']
    })
    state: IBaseInfoState = {
        loading: false,
        title: '',
        desc: '',
        created: false, //已创建
        mode: GameMode.easy
    }

    async componentDidMount() {
        if(self !== top){
            this.props.history.push('/createInFrame')
        }
        const {props: {match: {params: {gameId}}}} = this
        if (gameId) {
            const {game} = await Api.getGame(gameId)
            this.setState({created: true, title: game.title, desc: game.desc, mode: game.mode})
        }
    }

    async submitGame() {
        const {lang} = this
        const {title, desc, mode} = this.state
        if (!title || !desc) {
            return message.info(lang.lackInfo)
        }
        const {history} = this.props
        this.setState({loading: true})
        const {code, gameId} = await Api.postNewGame(title, desc, mode)
        if (code === baseEnum.ResponseCode.success) {
            history.push(`/phase/${gameId}`)
        } else {
            this.setState({loading: false})
        }
    }

    render(): React.ReactNode {
        const {lang, state: {title, desc, loading, created, mode}} = this
        return <section className={style.gameInfo}>
            <Input value={title}
                   disabled={created}
                   placeholder={lang.title}
                   maxLength={20}
                   onChange={({target: {value: title}}) => this.setState({title})}/>
            <br/><br/>
            <Input.TextArea value={desc}
                            disabled={created}
                            maxLength={500}
                            autosize={{minRows: 5, maxRows: 10}}
                            placeholder={lang.desc}
                            onChange={({target: {value: desc}}) => this.setState({desc})}/>
            <br/><br/>
            <div className={style.switchContainer}>
                <Switch checked={mode === GameMode.extended}
                        disabled={created}
                        onChange={checked => this.setState({mode: checked ? GameMode.extended : GameMode.easy})}/>
                <span>{lang.extendedMode}</span>
            </div>
            <br/><br/>
            <Button type={'primary'}
                    disabled={created}
                    loading={loading}
                    onClick={() => this.submitGame()}>{lang.save}
            </Button>
        </section>
    }
}