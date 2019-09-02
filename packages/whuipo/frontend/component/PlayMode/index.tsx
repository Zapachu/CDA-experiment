import * as React from 'react'
import * as style from './style.less'
import {Button, Modal} from '@micro-experiment/component'

interface IBasePlayModeProps<ICreateParams> {
    onSubmit: (multiPlayer: boolean, params: ICreateParams) => void
}

interface IBasePlayModeState<ICreateParams> {
    showConfigModal: boolean
    showDescModal: boolean
    multiPlayer: boolean
    params: ICreateParams
}

export type TBasePlayMode<ICreateParams> = React.ComponentType<IBasePlayModeProps<ICreateParams>>

export class BasePlayMode<ICreateParams> extends React.Component<IBasePlayModeProps<ICreateParams>, IBasePlayModeState<ICreateParams>> {
    defaultParams:ICreateParams = {} as any

    componentDidMount(): void {
        this.setState({
            params:this.defaultParams
        })
    }

    state: IBasePlayModeState<ICreateParams> = {
        showConfigModal: false,
        showDescModal: false,
        multiPlayer: false,
        params: this.defaultParams
    }

    renderConfigDesc(): React.ReactNode {
        return null
    }


    renderConfig(): React.ReactNode {
        return null
    }

    render(): React.ReactNode {
        const {props: {onSubmit}, state: {showConfigModal, showDescModal, multiPlayer, params}} = this
        const configNode = this.renderConfig(), descNode = this.renderConfigDesc()
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
                            <div className={`${style.btn} ${active ? style.active : ''}`}>
                                <p>{label}</p>
                                <p>{subLabel}</p>
                            </div>
                        </div>)
                }
            </div>
            <a style={{visibility: !multiPlayer && configNode ? 'visible' : 'hidden'}} className={style.btnShowConfig}
               onClick={() => this.setState({showConfigModal: true})}>配置算法交易者</a>
            <Modal visible={showConfigModal} width=''>
                <div className={style.configModal}>
                    <label className={style.btnShowDesc}
                           onClick={() => this.setState({showDescModal: true})}>关于算法交易者</label>
                    {
                        descNode ? <>
                            <Modal visible={showDescModal} width={'48rem'}>
                                {
                                    this.renderConfigDesc()
                                }
                                <div style={{marginBottom: '1rem'}}>
                                    <Button label={'确定'} onClick={() => this.setState({showDescModal: false})}/>
                                </div>
                            </Modal>
                        </> : null
                    }
                    <div className={style.paramsWrapper}>
                        {configNode}
                    </div>
                    <div>
                        <Button label={'确定'} onClick={() => this.setState({showConfigModal: false})}/>
                    </div>
                </div>
            </Modal>
            <Button label={'开始匹配'} onClick={() => onSubmit(multiPlayer, params)}/>
        </section>
    }

}