import * as React from 'react'
import * as style from './style.scss'
export function RangeInput({value, ...props}){
    return <div className={style.rangeInput}>
        <input {...{
            type:'range',
            value
        }} {...props}/>
        <span>{value}</span>
    </div>
}