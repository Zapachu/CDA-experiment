import * as React from 'react';
import * as style from './style.scss';
import {Lang, MaskLoading, Toast} from '@elf/component';
import {Core} from '@bespoke/client';
import {Button} from 'antd';
import {
    Choice,
    ICreateParams,
    IGameGroupState,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MainStageIndex,
    Min,
    MoveType,
    PushType
} from '../../config';
import Display from './Display';
import Choice1 from './Choice1';
import Choice2 from './Choice2';

interface IPlayState {
    c1: number,
    c2: Array<number>,
}

export default class MainStage extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {

    state: IPlayState = {
        c1: 0,
        c2: []
    };
    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        chooseInFirstAction: ['在第一阶段选择', 'In the first action chose '],
        chooseInSecondActionLeft: ['等待, 如果第一阶段有人选1, 则选', 'Wait, if someone has chosen 1 in the first action, choose '],
        chooseInSecondActionRight: ['; 如果第一阶段没有人选1, 则选', '; if on one has chosen 1 in the first action, choose '],
        yourFirstChoiceLeft: ['你在第', 'Your choice in round '],
        yourFirstChoiceRight: ['轮的选择为:', ' is:'],
        roundResult0: ['第', 'The lowest choice of the group in round '],
        roundResult1: ['轮组内最低选择为:', ' is:'],
        roundResult2: ['第', 'In round'],
        roundResult3: ['轮组内一共有', ' , '],
        roundResult4: ['人选1，', ' players chose 1'],
        roundResult5: ['人选2，', ' , players chose 2'],
        profitLeft: ['你在第', 'Your profit in round '],
        profitRight: ['轮的积分为:', ' is:'],
        totalProfitLeft: ['截止第', 'Until round '],
        totalProfitRight: ['轮，你的积分为:', ' your total profit is:'],
        inFirstAction: ['在第一阶段中,', 'In the first action,'],
        yourSecondChoice: ['你在第二阶段的选择为:', 'Your choice in the second action is:'],
        wait4Others2Choose: ['等待其他玩家选择', 'Waiting for others to choose'],
        wait4Others2Next: ['等待其他玩家进入下一轮', 'Waiting for others to enter the next round'],
        roundIndex: [(m, n) => `第${m}/${n}轮`, (m, n) => `Round ${m}/${n}`],
        checkPls: ['请检查您的选择', 'Check your choice please'],
    });

    constructor(props) {
        super(props);
        this.state = this.initState(props);
    }

    initState = props => {
        const {playerState: {groupIndex, choices}, gameState: {groups}} = props;
        const curGroup = groups[groupIndex];
        const curChoice = choices[curGroup.roundIndex];
        return curChoice ? {c1: curChoice.c1 || 0, c2: curChoice.c2 || []} : {c1: 0, c2: []};
    };

    calcDisplayData = () => {
        const {props: {game: {params: {a, b, c, eL, eH}}}} = this;
        return {
            p11: a * eL - b * eL + c,
            p21: a * eL - b * eH + c,
            p22: a * eH - b * eH + c
        };
    };

    renderChoice2 = (c1, c2) => {
        const {lang} = this;
        if (c1 !== Choice.Wait) {
            return <p>{lang.chooseInFirstAction}{c1}</p>;
        }
        return <p>{lang.chooseInSecondActionLeft}{c2[0]}{lang.chooseInSecondActionRight}{c2[1]}</p>;
    };

    renderResult = () => {
        const {lang, props: {frameEmitter, game: {params: {min}}, playerState: {groupIndex, roundIndex, choices, profits, finalProfit}, gameState: {groups}}, state: {c1, c2}} = this;
        const curRoundIndex = roundIndex;
        const curGroup: IGameGroupState = groups[groupIndex],
            curRound = curGroup.rounds[curRoundIndex];
        const curChoice = choices[curRoundIndex];
        if (!curChoice) return null;
        const curProfit = profits[curRoundIndex];
        return <>
            <p>{lang.yourFirstChoiceLeft}{curRoundIndex + 1}{lang.yourFirstChoiceRight} </p>
            {this.renderChoice2(c1, c2)}
            <p style={{margin: '2rem 0'}}>{lang.inFirstAction}{curRound.x}{lang.roundResult4}{curRound.y}{lang.roundResult5}</p>
            {curChoice.c1 !== Choice.One ? <p>{lang.yourSecondChoice} {curChoice.c2.toString()}</p> : null}
            {
                min === Min.A ?
                    <p>{lang.roundResult0}{curRoundIndex + 1}{lang.roundResult1} {curRound.min}</p> :
                    <p>{lang.roundResult2}{curRoundIndex + 1}{lang.roundResult3}{curRound.x}{lang.roundResult4}{curRound.y}{lang.roundResult5}</p>
            }
            <p>{lang.profitLeft}{curRoundIndex + 1}{lang.profitRight} {curProfit.toFixed(2)}</p>
            <p>{lang.totalProfitLeft}{curRoundIndex + 1}{lang.totalProfitRight} {finalProfit.toFixed(2)}</p>
            <Button type='primary'
                    onClick={() => {
                        frameEmitter.emit(MoveType.advanceRoundIndex, {nextRoundIndex: curRoundIndex + 1});
                        this.setState({c1: 0, c2: []});
                    }}
            >{lang.confirm}</Button>
        </>;
    };

    render() {
        const {lang, props: {frameEmitter, playerState: {stageIndex, roundIndex}, game: {params: {playersPerGroup, mode, d, rounds}}}, state: {c1, c2}} = this;
        const displayData = this.calcDisplayData();
        let content;
        switch (stageIndex) {
            case MainStageIndex.Choose: {
                content = <div>
                    <Display data={displayData}/>
                    <Choice1 {...{
                        c1, d, mode, onChoose: c1 => this.setState({c1, c2: []})
                    }}/>
                    <Choice2 {...{
                        playersPerGroup, c1, c2, d, mode, onChoose: c2 => this.setState({c2})
                    }}/>
                    <Button type='primary'
                            onClick={() => {
                                if (!c1 || c2.length !== +playersPerGroup + 1 || c2.includes(undefined)) {
                                    return Toast.warn(lang.checkPls);
                                }
                                frameEmitter.emit(MoveType.answerMain, {c1, c2}, err => {
                                    if (err) Toast.warn(err);
                                });
                            }}
                    >{lang.confirm}</Button>
                </div>;
                break;
            }
            case MainStageIndex.Wait4Result: {
                content = <div>
                    <Display data={displayData}/>
                    <MaskLoading label={lang.wait4Others2Choose}/>
                </div>;
                break;
            }
            case MainStageIndex.Result: {
                content = <div>
                    <Display data={displayData}/>
                    <div className={style.resultLines}>{this.renderResult()}</div>
                </div>;
                break;
            }
        }

        return <section className={style.mainStage}>
            <p>{lang.roundIndex(roundIndex + 1, rounds)}</p>
            {content}
        </section>;
    }
}
