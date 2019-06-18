import * as React from 'react'
import RangeInputComp from './RangeInputComp'
import NumberInputComp from './NumberInputComp'

export interface propType {
    value: number,
    onChange: (number)=>void,
    label: string,
    step?: number,
    min?: number,
    max?: number,
    style?: object,
}

export const NumberInput = ({style:propStyle={}, value, min, max, step=1, onChange, label}:propType) => {
    return (
        <div style={propStyle}>
            <p style={{textAlign:'center',marginBottom:'1rem',color:'#5588ee'}}>{label}</p>
            {!isNaN(min)&&!isNaN(max)
                ? <RangeInputComp style={{marginBottom:'.8rem'}}
                              value={value}
                              min={min}
                              max={max}
                              step={step}
                              onChange={onChange}/>
                : null
            }
            <NumberInputComp value={value}
                         min={min}
                         max={max}
                         step={step}
                         onChange={onChange}/>
        </div>
    )
}
