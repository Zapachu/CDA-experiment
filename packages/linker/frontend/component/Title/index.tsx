import * as React from 'react'
import * as style from './style.scss'

export const Title: React.SFC<{ label: string }> = ({ label }) => <h2 className={style.title}>{label}</h2>
