import * as React from 'react'
import * as style from './style.scss'

export const Label: React.SFC<{ label: string }> = ({ label }) => <label className={style.label}>{label}</label>
