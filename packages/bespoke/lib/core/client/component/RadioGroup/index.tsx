import * as React from 'react'
import * as style from './style.scss'

const type = 'radio',
    leastCharsOfItem = 6

export function RadioGroup({options, value, onChange, otherIndex = null, optionStyle = null}) {
    const name = Math.random().toString()
    let maxLength = leastCharsOfItem
    options.forEach(({length}) => length > maxLength ? maxLength = length : null)
    return <ul className={style.radioGroup} style={optionStyle === 'inline' ? {flexWrap: 'unset'} : {}}>
        {
            options.map((option, i) =>
                <li key={option} className={value === option ? style.active : ''}
                    style={{
                        flexBasis: optionStyle && optionStyle.includes('%') ? optionStyle : `${1.5 * maxLength + 5}rem`
                    }}>
                    <span className={style.iconWrapper}>
                        <svg viewBox="0 0 24 24">
                            <path className={style.radioIcon}
                                  d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </span>
                    <input {...{
                        type,
                        name,
                        id: `${name}_${option}`,
                        checked: value === option || (i === otherIndex && value && !options.includes(value)),
                        onChange: () => onChange(option)
                    }}/>
                    <label htmlFor={`${name}_${option}`}>{option}</label>
                </li>
            )
        }
    </ul>
}