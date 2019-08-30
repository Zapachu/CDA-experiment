import * as React from 'react'
import Button from './Button'
import * as style from './style.scss'

export interface ITestPageQuestion {
    Content: React.ComponentType<{
        inputProps: (style?: React.CSSProperties) => { style: React.CSSProperties, value: React.ReactText, onChange }
    }>
    Answer: React.ComponentType<{}>
    answer: Array<React.ReactText>
}

export function TestPage({questions, done}: { questions: Array<ITestPageQuestion>, done: () => void }) {
    const [questionIndex, setQuestionIndex] = React.useState(0)

    function Question({Content, Answer, answer}: {
        Content: React.ComponentType<{
            inputProps: (style?: React.CSSProperties) => { style: React.CSSProperties, value: React.ReactText, onChange }
        }>,
        Answer: React.ComponentType<{}>,
        answer: Array<React.ReactText>
    }) {
        const [inputArr, _setInputArr] = React.useState([]),
            [showAnswer, setShowAnswer] = React.useState(false)
        let inputIndex = 0

        function inputProps(style: React.CSSProperties = {width: '8rem', margin: '2px .5rem'}) {
            const index = inputIndex++
            return {
                style,
                value: inputArr[index],
                onChange: ({target: {value}}) => {
                    const _inputArr = inputArr.slice()
                    _inputArr[index] = value
                    _setInputArr(_inputArr)
                }
            }
        }

        function nextQuestion() {
            if (questionIndex < questions.length - 1) {
                setQuestionIndex(questionIndex + 1)
            } else {
                done()
            }
        }

        return <section className={style.question}>
            <div className={style.contentWrapper}>
                <Content inputProps={style => inputProps(style)}/>
            </div>
            <div className={`${style.answerWrapper} ${showAnswer ? style.active : ''}`}>
                <Answer/>
            </div>
            <div className={style.btnWrapper}>
                {
                    showAnswer ?
                        <Button label={'下一步'}
                                onClick={() => {
                                    if (inputArr.toString() !== answer.toString()) {
                                        return
                                    }
                                    nextQuestion()
                                }
                                }/> :
                        <Button label={'确定'}
                                onClick={() => setShowAnswer(true)}/>
                }
                <a className={style.btnSkip} onClick={()=>nextQuestion()}>跳过</a>
            </div>
        </section>
    }

    return <section className={style.testPage}>
        <div className={style.title}>{`知识点测试(${questionIndex+1}/${questions.length})`}</div>
        <Question {...questions[questionIndex]}/>
    </section>
}