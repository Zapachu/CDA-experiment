import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {baseEnum, config} from '@bespoke/share'
import {Lang, Toast} from '@elf/component'
import {Api} from '../util'
import * as QrCode from 'qrcode.react'
import * as style from './style.scss'

declare interface IShareState {
    shareCode: string
    title: string
}

export class Share extends React.Component<RouteComponentProps<{ gameId: string }>, IShareState> {
    state: IShareState = {
        title: '',
        shareCode: ''
    }

    lang = Lang.extractLang({
        shareCode: ['快速加入码', 'QuickAccessCode'],
        failed2GeneShareCode: ['生成快速加入码失败', 'Failed to Generate Quick Access Code']
    })

    async componentDidMount() {
        const {code, shareCode, title} = await Api.shareGame(this.props.match.params.gameId)
        if (code === baseEnum.ResponseCode.success) {
            this.setState({shareCode, title})
        } else {
            Toast.warn(this.lang.failed2GeneShareCode)
        }
    }

    render(): React.ReactNode {
        const {lang, props: {history, match: {params: {gameId}}}, state} = this
        return <section className={style.Share}>
            <img
                src={'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTM4MjEzOTM2NDk2IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMzNTgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTM5NS4yMTUxOCA1MTMuNjA0NTQ0bDMyMy4xMzU1MzgtMzEyLjM3MzQyN2MxOS4wNTI5MzgtMTguNDE2NDQyIDE5LjA1MjkzOC00OC4yNzM0NDcgMC02Ni42NjAyMTItMTkuMDUzOTYxLTE4LjQxNjQ0Mi00OS45MTA3MzctMTguNDE2NDQyLTY4Ljk2NDY5OCAwTDI5MS43NTE3NiA0ODAuMjkwODExYy0xOS4wNTI5MzggMTguNDE2NDQyLTE5LjA1MjkzOCA0OC4yNzM0NDcgMCA2Ni42NjAyMTJsMzU3LjYzMzIzNyAzNDUuNjg4MTgzYzkuNTI1OTU3IDkuMjA3NzA5IDIyLjAxMjM0IDEzLjc5NjIxNCAzNC40OTc2OTkgMTMuNzk2MjE0IDEyLjQ4NTM1OSAwIDI0Ljk3MTc0MS00LjU4ODUwNSAzNC40NjY5OTktMTMuODI4OTYgMTkuMDUyOTM4LTE4LjQxNjQ0MiAxOS4wNTI5MzgtNDguMjQyNzQ3IDAtNjYuNjYwMjEyTDM5NS4yMTUxOCA1MTMuNjA0NTQ0eiIgcC1pZD0iMzM1OSI+PC9wYXRoPjwvc3ZnPg=='}
                className={style.goBack}
                onClick={() => history.goBack()}/>
            <h2>{state.title}</h2>
            <div className={style.qrCodeWrapper} onClick={() => history.push(`/info/${gameId}`)}>
                <QrCode size={256} value={`/${config.rootName}/info/${gameId}`}/>
            </div>
            <div className={style.shareCode}>
                <label>{lang.shareCode}</label>
                <span>{state.shareCode}</span>
            </div>
        </section>
    }
}