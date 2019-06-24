import * as React from 'react'
import * as style from './style.scss'

const type = 'checkbox',
    leastCharsOfItem = 6

export function CheckboxGroup({options, value, onChange, otherIndex=null}){
    const name = Math.random().toString()
    let maxLength = leastCharsOfItem
    options.forEach(({length})=>length>maxLength ? maxLength=length: null)
    return <ul className={style.checkboxGroup}>
        {
            options.map((option, i) =>
                <li className={value.includes(option)?style.active:''}
                    style={{
                    flexBasis:`${1.5 * maxLength + 5}rem`
                }}>
                    <input {...{
                        type,
                        name,
                        id:`${name}_${option}`,
                        checked:value.includes(option) || (i===otherIndex&&value.some(v => !options.includes(v))),
                        onChange:()=> {
                            if(!value.length) {
                                onChange([option]);
                            }
                            else if(value.includes(option)) {
                                onChange(value.filter(val => val!==option))
                            }
                            else if(i===otherIndex&&value.some(v => !options.includes(v))) {
                                const otherVal = value.filter(v => !options.includes(v))[0]
                                onChange(value.filter(val => val!==otherVal))
                            }
                            else {
                                onChange([...value, option])
                            }
                        }
                    }}/>
                    <label htmlFor={`${name}_${option}`}>{option}</label>
                </li>
            )
        }
    </ul>
}