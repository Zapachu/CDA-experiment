import * as React from 'react'
import * as style from './style.scss'
import {RadioGroup} from '../'
import {TQuestionProps} from './index'

export declare type TPresupposedChoiceProps = TQuestionProps & {
    lang:{[key:string]:string|Function}
    options:Array<string>
    answer:number
    notice:string
}

export default class PresupposedChoice extends React.Component<TPresupposedChoiceProps>{
    render(){
        const {seq, label, value, handleInput, options, answer, notice} = this.props,
            isWrong = value !== options[answer]
        return <div className={style.presupposedChoice}>
            <div style={{
                display:'flex'
            }}>
                <b>{seq}、</b><pre>{label}</pre>
            </div>
            <RadioGroup {...{
                options,
                value,
                onChange:handleInput
            }}/>
            {
                !value ? null:
                    <text className={`${style.notice} ${isWrong?style.wrong:''}`}>
                        <em>{isWrong?'✘':'✔'}</em>
                        {notice}
                    </text>
            }
        </div>
    }
}