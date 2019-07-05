import * as React from 'react'
import * as style from './style.scss'

declare type TextFieldProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?: string
}

export const TextField:React.SFC<TextFieldProps>=({label, ...inputProps})=><section className={style.textField}>
    {
        label? <label className={style.textFieldLabel}>{label}</label>:null
    }
    <input {...inputProps}/>
</section>