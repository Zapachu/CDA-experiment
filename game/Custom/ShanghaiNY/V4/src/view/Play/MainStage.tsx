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
    Mode,
    MoveType,
    PushType
} from '../../config';
import Display from './Display';
import Choice1 from './Choice1';
import Choice2 from './Choice2';
import {checkChoice} from './regC2Group';

interface IPlayState {
    c1: number,
    c2: Array<number>,
}

export default class MainStage extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {

    state: IPlayState = {
        c1: Choice.Null,
        c2: []
    };
    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        chooseInFirstAction: ['在第一阶段选择 : ', 'In the first action chose :'],
        chooseInSecondAction: ['在第二阶段选择 : ', 'In the second action chose :'],
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
        inFirstAction: ['在第一阶段中, 你的小组一共有', 'In the first action, '],
        yourSecondChoice: ['你在第二阶段的选择为:', 'Your choice in the second action is:'],
        wait4Others2Choose: ['等待其他玩家选择', 'Waiting for others to choose'],
        wait4Others2Next: ['等待其他玩家进入下一轮', 'Waiting for others to enter the next round'],
        roundIndex: [(m, n) => `第${m}/${n}轮`, (m, n) => `Round ${m}/${n}`],
        checkPls: ['请检查您的选择', 'Check your choice please'],
        choose1: ['选1', 'Choose 1'],
        choose2: ['选2', 'Choose 2'],
        chooseWait: ['等待', 'Wait'],
        case1: ['如果包括你一共有'],
        players: ['人', 'players'],
        yourChoice: ['你的选择', 'your choice is']
    });

    constructor(props) {
        super(props);
        this.state = this.initState(props);
    }

    initState = props => {
        const {playerState: {groupIndex, choices}, gameState: {groups}} = props;
        const curGroup = groups[groupIndex];
        const curChoice = choices[curGroup.roundIndex];
        return curChoice ? {c1: curChoice.c1 || Choice.Null, c2: curChoice.c2 || []} : {c1: Choice.Null, c2: []};
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
        const {lang, props: {game: {params: {playersPerGroup, mode}}}} = this;
        const chooseLabel = {
                [Mode.HR]: [lang.choose1, lang.chooseWait],
                [Mode.LR]: [lang.choose2, lang.chooseWait],
                [Mode.BR]: [lang.choose1, lang.choose2],
            }[mode],
            choice2Lang = {
                [Choice.One]: lang.choose1,
                [Choice.Two]: lang.choose2,
                [Choice.Wait]: lang.chooseWait,
            };
        return <>
            <p>{lang.chooseInFirstAction}{choice2Lang[c1]}</p>
            {
                c2.some(c => [Choice.One,Choice.Two].includes(c)) ? <>
                    <p>{lang.chooseInSecondAction}</p>
                    <table className={style.yourChoice2}>
                        <tr>
                            <td>{lang.case1}</td>
                            <td>{lang.yourChoice}</td>
                        </tr>
                        {
                            Array(playersPerGroup + 1).fill(null).map((_, i) => {
                                    const c = c2[i];
                                    return [Choice.One,Choice.Two].includes(c) ? <tr key={i}>
                                        <td>{i}{lang.players}{chooseLabel[0]}&nbsp;,&nbsp;{playersPerGroup - i}{lang.players}{chooseLabel[1]}</td>
                                        <td>{choice2Lang[c]}</td>
                                    </tr> : null;
                                }
                            )
                        }
                    </table>
                </> : null
            }
        </>;
    };

    renderResult = () => {
        const {lang, props: {frameEmitter, game: {params: {min, mode}}, playerState: {groupIndex, roundIndex, choices, profits, finalProfit}, gameState: {groups}}} = this;
        const curRoundIndex = roundIndex;
        const curGroup: IGameGroupState = groups[groupIndex],
            curRound = curGroup.rounds[curRoundIndex],
            {one1, two1, wait1} = curRound
        const curChoice = choices[curRoundIndex];
        if (!curChoice) return null;
        const curProfit = profits[curRoundIndex];
        const [labelA, labelB, countA, countB] = {
            [Mode.HR]:[lang.choose1, lang.chooseWait, one1, wait1],
            [Mode.LR]:[lang.choose2, lang.chooseWait, two1, wait1],
            [Mode.BR]:[lang.choose1, lang.choose2, one1, two1],
        }[mode]
        return <>
            <p>{lang.yourFirstChoiceLeft}{curRoundIndex + 1}{lang.yourFirstChoiceRight} </p>
            {this.renderChoice2(curChoice.c1, curChoice.c2)}
            <p style={{margin: '2rem 0'}}>{lang.inFirstAction}{countA}{lang.players}{labelA}&nbsp;,&nbsp;{countB}{lang.players}{labelB}</p>
            {curChoice.c2.some(c => [Choice.One,Choice.Two].includes(c)) ? <p>{lang.yourSecondChoice} {curChoice.c}</p> : null}
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
                        this.setState({c1: Choice.Null, c2: []});
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
                    {c1 === Choice.Null ? null : <Choice2 {...{
                        playersPerGroup, c1, c2, d, mode, onChoose: c2 => this.setState({c2})
                    }}/>}
                    <Button type='primary'
                            onClick={() => {
                                if (!checkChoice({playersPerGroup, c1, c2, mode})) {
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
