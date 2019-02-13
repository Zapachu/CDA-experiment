import * as React from 'react'
import * as style from './style.scss'
import {Input} from '../'

import {TQuestionProps} from './index'

export declare type TEssayProps = TQuestionProps & {
    notices:string
}

export default class Essay extends React.Component<TEssayProps>{
    render(){
        const {label, seq, notices, value, handleInput} = this.props
        return <div className={style.essay}>
            <p><b>{seq}、</b>{label}</p>
            <div className={style.essayInput}>
                <Input {...{
                    value,
                    onChange:({target:{value}})=>handleInput(value)
                }}/>
                <span>{notices}</span>
            </div>
        </div>
    }
}