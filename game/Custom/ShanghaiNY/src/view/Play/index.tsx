import * as React from 'react';
import * as style from './style.scss';
import {Button, ButtonProps, Input, Label, Lang, MaskLoading, Toast} from '@elf/component';
import {Core, Request} from '@bespoke/client';
import {
    FetchRoute,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    namespace,
    PushType,
    Stage
} from '../../config';
import TestStage from './TestStage';
import MainStage from './MainStage';
import SurveyStage from './SurveyStage';

interface IPlayState {
    seatNumber: string
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {

    state: IPlayState = {
        seatNumber: ''
    };
    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment'],
        end: ['实验结束', 'Game Over'],
        totalPoint: ['你在本场试验共获得积分 ', 'Total points you have got in this game are '],
        totalProfit: ['你的最终收益为 ', 'Total profit you have earned in this game is ']
    });

    componentDidMount() {
        const {playerState: {actor}, frameEmitter, game} = this.props;
        frameEmitter.emit(MoveType.initPosition);
        Request.instance(namespace).get(FetchRoute.getUserMobile, {gameId: game.id}, {
            token: actor.token,
            actorType: actor.type
        });
    }

    render(): React.ReactNode {
        const {props: {playerState: {stage}}} = this;
        return <section className={style.play}>
            {
                (() => {
                    switch (stage) {
                        case Stage.Seat: {
                            return this.renderSeatNumberStage();
                        }
                        case Stage.Test: {
                            return <TestStage {...this.props} />;
                        }
                        case Stage.Main: {
                            return <MainStage {...this.props} />;
                        }
                        case Stage.Survey: {
                            return <SurveyStage {...this.props} />;
                        }
                        case Stage.End: {
                            return this.renderEndStage();
                        }
                    }
                })()
            }
        </section>;
    }

    renderEndStage = () => {
        const {lang, props: {game: {params: {s, participationFee}}, playerState: {finalProfit}}} = this;
        return <section className={style.endStage}>
            <p>{lang.totalPoint}{isNaN(finalProfit) ? '-' : finalProfit.toFixed(2)}</p>
            <p>{lang.totalProfit}{isNaN(finalProfit * s + participationFee) ? '-' : (finalProfit * s + participationFee).toFixed(2)}</p>
        </section>;
    };

    renderSeatNumberStage = () => {
        const {lang, props: {frameEmitter, playerState}, state: {seatNumber}} = this;
        return playerState.seatNumber ? <MaskLoading label={lang.wait4StartMainTest}/> :
            <section className={style.seatStage}>
                <span>{playerState.seatNumber}</span>
                <Label label={lang.inputSeatNumberPls}/>
                <Input {...{
                    value: seatNumber || '',
                    onChange: ({target: {value: seatNumber}}) => this.setState({seatNumber})
                }}/>
                <Button style={{marginTop: '1rem'}} width={ButtonProps.Width.medium} label={lang.submit}
                        onClick={() => {
                            frameEmitter.emit(MoveType.inputSeatNumber, {seatNumber}, success => {
                                if (!success) {
                                    Toast.warn(lang.invalidSeatNumber);
                                }
                            });
                        }}/>
            </section>;
    };

}
