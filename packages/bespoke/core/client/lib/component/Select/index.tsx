import * as React from 'react'
import * as style from './style.scss'

type Value = number | string | Array<string>

interface Option {
  label: string,
  value: Value,
  disabled?: boolean,
}

interface PropsType {
  value: Value,
  options: Array<Option|string>,
  onChange: (value: Value) => void,
  style?: object,
  placeholder?: string,
}

export const Select: React.FunctionComponent<PropsType> = ({value, options, placeholder, onChange, style: propStyle={}}) => {
    const newOptions: Array<Option> = options.map(option => {
      return {
        label: typeof option === 'object' ? option.label : option,
        value: typeof option === 'object' ? option.value : option,
        disabled: typeof option === 'object' ? !!option.disabled : false
      }
    })
    if(placeholder) newOptions.unshift({label: placeholder, value: ''});
    return <div className={style.select} style={propStyle}>
        <select value={value||''} onChange={e => {
          if(e.target.value!=='') onChange(e.target.value)
        }}>
          {newOptions.map((option, i) => <option key={i} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        </select>
    </div>
}
