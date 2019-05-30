import * as React from "react"
import * as style from "./style.scss"
import {Lang, Core} from "bespoke-client-util"
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams
} from "../../interface"
import {
    FetchType,
    MoveType,
    PushType,
    PlayerStatus
} from "../../config"
import {Line, PlayMode, MatchModal, Modal} from "bespoke-game-stock-trading-component"

interface IPlayState {
    matchTimer: number;
    matchNum: number;
}

export default class IntroStage extends Core.Play<ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    FetchType,
    IPlayState> {
    constructor(props) {
        super(props);
        this.state = {
            matchTimer: null,
            matchNum: null
        };
    }

    lang = Lang.extractLang({})

    componentDidMount() {
        const {frameEmitter} = this.props;
        frameEmitter.on(PushType.matchTimer, ({matchTimer, matchNum}) => {
            this.setState({matchTimer, matchNum});
        });
    }

    render() {
        const {
            frameEmitter,
            playerState: {playerStatus},
            game: {
                params: {groupSize}
            }
        } = this.props;
        const {matchTimer, matchNum} = this.state;
        return (
            <section className={style.introStage}>
                <Line text={"交易规则介绍"} style={{marginBottom: "20px"}}/>
                <PlayMode
                    onPlay={mode => {
                        if (mode === PlayMode.Single) {
                            frameEmitter.emit(MoveType.startSingle);
                        }
                        if (mode === PlayMode.Multi) {
                            frameEmitter.emit(MoveType.startMulti);
                        }
                    }}
                />
                <MatchModal
                    visible={playerStatus === PlayerStatus.matching}
                    totalNum={groupSize}
                    matchNum={matchNum}
                    timer={matchTimer}
                />
            </section>
        );
    }
}