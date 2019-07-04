import * as React from 'react'
import * as style from './style.scss'
import {render} from 'react-dom'

const DEFAULT_LIFE_TIME = 3000
const MSGQUEUE_SIZE = 10

enum MsgType {
    success,
    info,
    warn,
    error
}

const MsgConfig = {
    [MsgType.success]: {
        color: '#43a047',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    },
    [MsgType.info]: {
        color: '#1976d2',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
    },
    [MsgType.warn]: {
        color: '#ffa000',
        icon: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'
    },
    [MsgType.error]: {
        color: '#d32f2f',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
    }
}

enum Status {
    visible,
    hidden
}

interface IToastState {
    msgQueue: {
        [key: string]: {
            text: string,
            type: MsgType,
            status: Status
        }
    }
}

let fnToast: (text: string, color: MsgType, time?: number) => void

class _Toast extends React.Component<{}, IToastState> {
    state: IToastState = {
        msgQueue: {}
    }

    componentDidMount(): void {
        fnToast = (text: string, type: MsgType, time: number = DEFAULT_LIFE_TIME) => {
            this.setState(({msgQueue}) => {
                const msgKey = Math.random().toString()
                setTimeout(() => this.closeMsg(msgKey), time)
                return {msgQueue: {...msgQueue, [msgKey]: {text, type, status: Status.visible}}}
            })
        }
    }

    closeMsg(msgKey: string) {
        this.setState(state => {
            const msgQueue = {...state.msgQueue}
            msgQueue[msgKey].status = Status.hidden
            return {msgQueue}
        })
        if (Object.keys(this.state.msgQueue).length > MSGQUEUE_SIZE) {
            setTimeout(() => this.clearDeadMsgs(), 0)
        }
    }

    clearDeadMsgs() {
        this.setState(state => {
            const msgQueue = {}
            for (let key in state.msgQueue) {
                const msg = state.msgQueue[key]
                if (msg.status === Status.visible) {
                    msgQueue[key] = msg
                }
            }
            return {msgQueue}
        })
    }

    render(): React.ReactNode {
        const {state: {msgQueue}} = this
        return <ul className={style.toast}>
            {
                Object.entries(msgQueue).map(([key, {text, type, status}]) =>
                    <li key={key}
                        className={status === Status.hidden ? style.dead : ''}
                        style={{background: MsgConfig[type].color}}>
                            <span className={style.iconWrapper}>
                                <svg viewBox="0 0 24 24"><path d={MsgConfig[type].icon}/></svg>
                            </span>
                        {text}
                        <span className={`${style.iconWrapper} ${style.close}`}
                              onClick={() => this.closeMsg(key)}
                        >
                                <svg viewBox="0 0 24 24">
                                    <path
                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </span>
                    </li>)
            }
        </ul>
    }
}

render(<_Toast/>, document.body.appendChild(document.createElement('div')))

export const Toast = {
    success: (text: string, time?: number) => fnToast(text, MsgType.success, time),
    info: (text: string, time?: number) => fnToast(text, MsgType.info, time),
    warn: (text: string, time?: number) => fnToast(text, MsgType.warn, time),
    error: (text: string, time?: number) => fnToast(text, MsgType.error, time)
}