import * as React from 'react';
import * as style from './style.scss';
import {Button, ButtonProps, Lang, MaskLoading, Radio} from '@elf/component';
import {Core} from '@bespoke/client';
import {
    Choice,
    GameType,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PushType,
    Test1,
    Test2,
    TestStageIndex,
    Version
} from '../../config';
import Display from './Display';
import Choice1 from './Choice1';
import Choice2 from './Choice2';

interface IPlayState {
    c1: number,
    c2: Array<number>,
    answers: Array<string>,
    tips: Array<Tip>
}

enum Tip {
    Correct = 1,
    Wrong,
}

interface Word {
    text: string,
    color?: boolean,
    br?: number
}

interface Test {
    desc: Array<Word>,
    questions: Array<{
        title: Array<Word>,
        options: Array<string | { label: string, value: string }> | Function,
        answer: string | Function
    }>
}

export default class TestStage extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {
    state: IPlayState = {
        c1: 0,
        c2: [],
        answers: [],
        tips: []
    };
    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        instructionTitle: ['本页面是为了帮助你熟悉操作界面。你可以尝试在界面上进行不同的选择。当你确定已经熟悉了操作界面之后，请点击最下方的“确定”按钮。', 'This page aims to help you get familiar with the interface. You can try to make different choices. After you are familiar with the interface, please click the "Confirm" button below.'],
        instructionFirstT1: ['每一轮中，你需要点击按钮做出选择:', 'You should make a choice in every round:'],
        instructionFirstT2: ['首先，做出你在第一阶段的选择:', 'Now, make your choice for the first action:'],
        instructionSecondWait: ['因为你在第一阶段已经等待，请针对第一阶段可能出现的两种结果，做出你第二阶段的选择:', 'Since you have chosen to wait in the first action, make your choice for the second action based on possible results of the previous action:'],
        instructionSecond1: ['因为你在第一阶段已经选择了1，第二阶段不需要选择，请点击下面的“确定按钮”:', 'Since you have chosen 1 in the first action, you do not need to make the choice for the second action, please click the "Confirm" button below:'],
        next: ['选择完成后，点击“确定”进入下一轮:', 'After making the choices, click "Confirm" button for the next round:'],
        wait4Others: ['等待其他玩家完成测试', 'Waiting for others to complete the test'],
        wrong: ['(错误)', '(Wrong)'],
        nextToMain: ['理解测试结束，下面进入正式实验', 'The test is over, click "Confirm" button for the main game'],
        pageIndex: [(m, n) => `第${m}/${n}页`, (m, n) => `Page ${m}/${n}`]
    });
    private Test: Array<Test>;

    constructor(props) {
        super(props);
        this.Test = props.game.params.gameType === GameType.T1 ? Test1 : Test2;
    }

    submit = () => {
        const {props: {frameEmitter, playerState: {stageIndex}}, state: {answers, tips}} = this;
        const curTest = this.Test[stageIndex];
        if (answers.length !== curTest.questions.length) {
            return;
        }
        if (answers.includes(undefined)) return;
        if (tips.some(tip => tip !== Tip.Correct)) {
            return;
        }
        frameEmitter.emit(MoveType.answerTest);
        this.setState({answers: [], tips: []});
    };

    answer = (val: string, i: number) => {
        const {props: {playerState: {stageIndex}, game: {params: {d}}}, state: {answers, tips}} = this;
        const newAnswers = [...answers];
        newAnswers[i] = val;
        const answer = this.Test[stageIndex].questions[i].answer;
        const answerVal = typeof answer === 'function' ? answer(d) : answer;
        const newTips = [...tips];
        newTips[i] = val === answerVal ? Tip.Correct : Tip.Wrong;
        this.setState({answers: newAnswers, tips: newTips});
    };

    calcDisplayData = () => {
        const {props: {playerState: {groupIndex, roundIndex}, gameState: {groups}, game: {params: {a, b, c, eL, eH, b0, b1, version}}}} = this;
        const curGroup = groups[groupIndex];
        if (version === Version.V3) {
            const prob = curGroup.probs[roundIndex];
            return prob
                ? {
                    p11: a * eL - b0 * eL + c,
                    p21: a * eL - b0 * eH + c,
                    p22: a * eH - b0 * eH + c
                }
                : {
                    p11: a * eL - b1 * eL + c,
                    p21: a * eL - b1 * eH + c,
                    p22: a * eH - b1 * eH + c
                };
        } else {
            return {
                p11: a * eL - b * eL + c,
                p21: a * eL - b * eH + c,
                p22: a * eH - b * eH + c
            };
        }
    };

    joinWords = (words: Array<Word>) => {
        return <>
            {words.map(({text, color, br}, i) => {
                let className = '';
                if (color) className = className ? className + ' ' + style.blueWords : style.blueWords;
                if (br !== undefined) className = className ? className + ' ' + style.newLine : style.newLine;
                return <span key={i} className={className} style={{marginTop: `${br}px`}}>{text}</span>;
            })}
        </>;
    };

    render() {
        const {lang, props: {frameEmitter, playerState: {stageIndex}, game: {params: {gameType, version, d}}}, state: {c1, c2, answers, tips}} = this;
        const displayData = this.calcDisplayData();
        let content;
        if (stageIndex === TestStageIndex.Interface) {
            switch (gameType) {
                case GameType.T1: {
                    content = (<>
                        <p className={style.instruction}>{lang.instructionTitle}</p>
                        <Display data={displayData}/>
                        <p className={style.instruction}>{lang.instructionFirstT1}</p>
                        <Choice1 c1={c1} d={d} version={version} gameType={gameType}
                                 onChoose={c1 => this.setState({c1})}/>
                        <p className={style.instruction}>{lang.next}</p>
                        <Button width={ButtonProps.Width.small}
                                label={lang.confirm}
                                onClick={() => {
                                    if (!c1) return;
                                    frameEmitter.emit(MoveType.answerTest);
                                    this.setState({c1: 0});
                                }}
                        />
                    </>);
                    break;
                }
                case GameType.T2: {
                    content = (<>
                        <p className={style.instruction}>{lang.instructionTitle}</p>
                        <Display data={displayData}/>
                        <p className={style.instruction}>{lang.instructionFirstT2}</p>
                        <Choice1 c1={c1} d={d} version={version} gameType={gameType}
                                 onChoose={c1 => this.setState({c1, c2: []})}/>
                        {c1
                            ? c1 === Choice.Wait
                                ? <p className={style.instruction}>{lang.instructionSecondWait}</p>
                                : <p className={style.instruction}>{lang.instructionSecond1}</p>
                            : null
                        }
                        <Choice2 c1={c1} c2={c2} d={d} version={version} gameType={gameType}
                                 onChoose={c2 => this.setState({c2})}/>
                        <p className={style.instruction}>{lang.next}</p>
                        <Button width={ButtonProps.Width.small}
                                label={lang.confirm}
                                onClick={() => {
                                    if (!c1 || c2.length !== 2 || c2.includes(undefined)) return;
                                    frameEmitter.emit(MoveType.answerTest);
                                    this.setState({c1: 0});
                                }}
                        />
                    </>);
                    break;
                }
            }
        } else if (stageIndex === TestStageIndex.Next) {
            content = <div>
                <p>{lang.nextToMain}</p>
                <Button width={ButtonProps.Width.small}
                        style={{marginTop: '10px'}}
                        label={lang.confirm}
                        onClick={() => {
                            frameEmitter.emit(MoveType.toMain);
                        }}
                />
            </div>;
        } else if (stageIndex === TestStageIndex.Wait4Others) {
            content = <div>
                <MaskLoading label={lang.wait4Others}/>
            </div>;
        } else {
            const curTest = this.Test[stageIndex];
            content = <div className={style.testQuestion}>
                <h3>{lang.pageIndex(stageIndex + 1, this.Test.length)}</h3>
                <Display data={displayData}/>
                <p className={style.desc}>{this.joinWords(curTest.desc)}</p>
                <ul>
                    {curTest.questions.map(({title, options}, i) => <li key={i} style={{paddingBottom: '20px'}}>
                        <p className={tips[i] === Tip.Wrong ? style.tipWrong : ''}>{this.joinWords(title)} {tips[i] === Tip.Wrong ?
                            <span>{lang.wrong}</span> : null}</p>
                        <Radio options={typeof options === 'function'
                            ? options(displayData, d)
                            : options}
                               value={answers[i] || ''}
                               onChange={e => this.answer(e as string, i)}
                        />
                    </li>)}
                </ul>
                <Button width={ButtonProps.Width.small}
                        label={lang.confirm}
                        onClick={this.submit}
                />
            </div>;
        }
        return <section className={style.testStage}>
            {content}
        </section>;
    }
}
