import * as React from 'react'
import * as style from './style.scss'

enum Size {
    small,
    normal
}

const PropsEnums = {
    Size
}

interface IBtnGroupProps {
    size?: Size,
    label?: string,
    options: Array<string>,
    value: number,
    onChange: (value: number) => void
}

export const BtnGroup: React.SFC<IBtnGroupProps> & typeof PropsEnums = Object.assign(
    ({size=Size.small, label, options, value, onChange}) =>
        <div className={`${style.btnGroup} ${size === Size.small ? style.small : ''}`}>
            {label ? <label>{label}</label> : null}
            <ul className={style.btns}>{
                options.map((option, i) => <li {...{
                    key: i,
                    className: i === value ? style.active : '',
                    onClick: () => onChange(i)
                }}>{option}</li>)
            }</ul>
        </div>, PropsEnums)