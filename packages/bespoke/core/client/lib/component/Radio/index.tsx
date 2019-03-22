import * as React from 'react'
import * as style from './style.scss'

type Value = number | string

interface Option {
  label: string,
  value: Value,
}

interface PropsType {
  title?: string,
  value: Value,
  options: Array<Option|string>,
  onChange: (value: Value) => void,
  style?: object,
}

export const Radio: React.FunctionComponent<PropsType> = ({title, value, options, onChange, style: propStyle={}}) => {
    const random = Math.random().toString();
    const newOptions: Array<Option> = options.map(option => {
      return {
        label: typeof option === 'object' ? option.label : option,
        value: typeof option === 'object' ? option.value : option,
      }
    })
    return <ul className={style.radio} style={propStyle}>
      {newOptions.map((option, i) => {
        return <li key={i}>
          <input type="radio" id={`${random}-${i}`} checked={value===option.value} onChange={() => onChange(option.value)} />
          <label htmlFor={`${random}-${i}`}>{option.label}</label>
        </li>
      })}
    </ul>
}
