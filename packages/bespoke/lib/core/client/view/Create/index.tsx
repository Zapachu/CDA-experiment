import * as React from 'react'
import {RouteComponentProps} from 'react-router'
import * as style from './style.scss'
import {connCtx, rootContext, TRootCtx} from '../../context'
import {GameInfo} from './GameInfo'
import {HistoryGame} from './HistoryGame'
import {Button, Toast, Api, Fetcher, Lang} from 'client-vendor'
import * as baseEnum from '../../../common/baseEnum'
import {IGameConfig} from '@common'

const SubmitBarHeight = '5rem'

declare interface ICreateState {
    game: IGameConfig<any>
    submitable: boolean
}

@connCtx(rootContext)
export class Create extends React.Component<RouteComponentProps<{ namespace: string }> & TRootCtx, ICreateState> {
    lang = Lang.extractLang({
        Submit: ['提交', 'Submit'],
        InvalidBaseGameInfo: ['实验标题或描述有误', 'Invalid game title or description'],
        CreateSuccess: ['实验创建成功', 'Create success'],
        CreateFailed: ['实验创建失败', 'Create Failed']
    })

    state: ICreateState = {
        game: {
            title: '',
            desc: '',
            params: {}
        },
        submitable: true
    }

    setSubmitable(submitable: boolean) {
        this.setState({submitable})
    }

    async submit() {
        const {lang, props: {gameTemplate: {namespace}}, state: {game}} = this
        if (!game.title || !game.desc) {
            return Toast.warn(lang.InvalidBaseGameInfo)
        }
        const {code, gameId} = await Api.newGame(game, namespace)
        if (code === baseEnum.ResponseCode.success) {
            Toast.success(lang.CreateSuccess)
            setTimeout(() => this.props.history.push(`/play/${gameId}`), 1000)
        } else {
            Toast.error(lang.CreateFailed)
        }
    }

    render(): React.ReactNode {
        const {lang, props: {gameTemplate}, state: {game, submitable}} = this
        if (!gameTemplate) {
            return null
        }
        const {namespace, Create} = gameTemplate
        return <section className={style.create} style={{marginBottom: SubmitBarHeight}}>
            <div className={style.baseInfoWrapper}>
                <GameInfo {...{
                    title: game.title,
                    desc: game.desc,
                    updateGameInfo: (gameCfgPartial: { title?: string, desc?: string }) =>
                        this.setState(({game}) => ({game: {...game, ...gameCfgPartial}}))
                }}/>
                <HistoryGame {...{
                    namespace,
                    applyHistoryGame: (game: IGameConfig<any>) => this.setState({game})
                }}/>
            </div>
            <div className={style.bespokeWrapper}>
                <Create {...{
                    params: game.params,
                    fetcher: new Fetcher<any>(namespace),
                    setParams: newParams => this.setState({game: {...game, params: {...game.params, ...newParams}}}),
                    setSubmitable: submitable => this.setSubmitable(submitable)
                }}/>
            </div>
            <div className={style.submitBtnWrapper} style={{height: SubmitBarHeight}}>
                {
                    submitable ? <Button width={Button.Width.medium}
                                         label={lang.Submit}
                                         onClick={() => this.submit()}
                    /> : null
                }
            </div>
        </section>
    }
}