import * as React from 'react'
import * as style from './style.scss'
import {Button} from 'client-vendor'

export function BtnGroup({options, activeIndex, onChange, onConfirm}) {
    return <section className={style.subBtnGroup}>
        <ul className={style.btns}>
            {
                options.map((option, index) =>
                    <li key={index} className={index === activeIndex ? style.active : ''}
                        onClick={() => onChange(index)}
                    >{option}</li>
                )
            }
        </ul>
        <div className={style.operateTips}>Your move : <em>{options[activeIndex]}</em></div>
        <div>
            <Button label='Confirm' width={Button.Width.small} onClick={() => onConfirm()}/>
        </div>
    </section>
}