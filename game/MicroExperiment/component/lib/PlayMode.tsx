import * as React from 'react'
import * as style from './style.scss'
import Button from './Button'

const PLAY_MODE_INACTIVE = require('./play_mode_inactive.svg')
const PLAY_MODE_ACTIVE = require('./play_mode_active.svg')

enum Mode {
    Single,
    Multi
}

class PlayMode extends React.Component<PropType, StateType> {
    static Single = Mode.Single
    static Multi = Mode.Multi

    constructor(props) {
        super(props)
        this.state = {
            activeMode: Mode.Single
        }
    }

    render() {
        const {activeMode} = this.state
        const {onPlay, style: propStyle} = this.props
        return (
            <div className={style.playMode} style={propStyle}>
                <ul>
                    <SingleMode
                        active={activeMode === Mode.Single}
                        onClick={() => this.setState({activeMode: Mode.Single})}
                    />
                    <MultiMode
                        active={activeMode === Mode.Multi}
                        onClick={() => this.setState({activeMode: Mode.Multi})}
                    />
                </ul>
                <Button label={'开始匹配'} onClick={() => onPlay(activeMode === Mode.Multi)}/>
            </div>
        )
    }
}

const SingleMode: React.SFC<ModePropType> = ({active, onClick}) => {
    return (
        <li onClick={() => onClick()}>
            <img src={active ? PLAY_MODE_ACTIVE : PLAY_MODE_INACTIVE}/>
            <div className={active ? style.active : style.inactive}>
                <p>单人学习</p>
                <p>市场上为算法交易者</p>
            </div>
        </li>
    )
}

const MultiMode: React.SFC<ModePropType> = ({active, onClick}) => {
    return (
        <li onClick={() => onClick()}>
            <img src={active ? PLAY_MODE_ACTIVE : PLAY_MODE_INACTIVE}/>
            <div className={active ? style.active : style.inactive}>
                <p>交互学习</p>
                <p>市场上为其他玩家</p>
            </div>
        </li>
    )
}

interface PropType {
    onPlay: (multiMode: boolean) => void;
    style?: React.CSSProperties;
}

interface StateType {
    activeMode: Mode;
}

interface ModePropType {
    active: boolean;
    onClick: Function;
}

export default PlayMode
