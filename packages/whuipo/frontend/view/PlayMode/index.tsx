import * as React from 'react'
import * as style from './style.less'
import {Button} from '@micro-experiment/component'

interface IBasePlayModeProps<ICreateParams> {
    onSubmit: (multiPlayer: boolean, params: ICreateParams) => void
}

interface IBasePlayModeState<ICreateParams> {
    multiPlayer: boolean
    params: ICreateParams
}

export type TBasePlayMode<ICreateParams> = React.ComponentType<IBasePlayModeProps<ICreateParams>>

export class BasePlayMode<ICreateParams> extends React.Component<IBasePlayModeProps<ICreateParams>, IBasePlayModeState<ICreateParams>> {
    state: IBasePlayModeState<ICreateParams> = {
        multiPlayer: false,
        params: null
    }

    renderParams(): React.ReactNode {
        return null
    }

    render(): React.ReactNode {
        const {props: {onSubmit}, state: {multiPlayer, params}} = this
        return <section className={style.playMode}>
            <div className={style.modesWrapper}>
                {
                    [{
                        active: !multiPlayer,
                        onClick: () => this.setState({multiPlayer: false}),
                        label: '单人学习',
                        subLabel: '市场上为算法交易者'
                    }, {
                        active: multiPlayer,
                        onClick: () => this.setState({multiPlayer: true}),
                        label: '交互学习',
                        subLabel: '市场上为其他玩家'
                    }].map(({active, onClick, label, subLabel}) =>
                        <div className={style.btnMode} key={label} onClick={() => onClick()}>
                            <img
                                src={active ? require('./play_mode_active.svg') : require('./play_mode_inactive.svg')}/>
                            <div className={active ? style.active : style.inactive}>
                                <p>{label}</p>
                                <p>{subLabel}</p>
                            </div>
                        </div>)
                }
            </div>
            {
                multiPlayer ? null : this.renderParams()
            }
            <Button label={'开始匹配'} onClick={() => onSubmit(multiPlayer, params)}/>
        </section>
    }

}