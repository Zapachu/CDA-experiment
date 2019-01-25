import * as React from 'react'
import * as style from './style.scss'
import {RadioGroup, CheckboxGroup, Input} from '../'
import {TQuestionProps} from './index'

const enum TYPE {
    radio='radio',
    checkbox='checkbox'
}

export declare type TChoiceProps = TQuestionProps & {
    otherIndex?: number
    options:Array<string>
    type?: TYPE
}

export default class Choice extends React.Component<TChoiceProps>{
    static TYPE = {
        radio: TYPE.radio,
        checkbox: TYPE.checkbox,
    }

    render(){
        const {seq, label, otherIndex, value, handleInput, options, type=TYPE.radio} = this.props
        let group, other, isOtherVal
        switch(type) {
            case TYPE.radio:
                group = <RadioGroup {...{
                    options,
                    value,
                    onChange:handleInput,
                    otherIndex
                }}/>;
                isOtherVal = otherIndex!==undefined && value!==undefined && !options.includes(value)
                other = isOtherVal || (value && value===options[otherIndex])
                    ? <Input {...{
                        value:value===options[otherIndex]?'':value,
                        onChange:({target:{value}})=>handleInput(value)
                    }}/>
                    :null;
                break;
            case TYPE.checkbox:
                group = <CheckboxGroup {...{
                    options,
                    value,
                    onChange:handleInput,
                    otherIndex
                }}/>;
                isOtherVal = otherIndex!==undefined && value.length && value.some(v => !options.includes(v))
                other = isOtherVal || (value && value.includes(options[otherIndex]))
                    ? <Input {...{
                        value:value.includes(options[otherIndex])?'':value.filter(v => !options.includes(v))[0],
                        onChange:({target:{value:inputVal}})=>{
                            const otherVal = value.filter(v => !options.includes(v))
                            const index = otherVal.length ? value.indexOf(otherVal[0]) : value.indexOf(options[otherIndex])
                            let arr = [...value]
                            arr[index] = inputVal
                            handleInput(arr)
                        }
                    }}/>
                    :null;
                break;
        }
        return <div className={style.choice}>
            <p><b>{seq}、</b>{label}</p>
            {group}
            {other}
        </div>
    }
}
