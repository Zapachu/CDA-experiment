import * as React from 'react';
import * as style from './style.scss';

export default function Label(props: { label: string | number }) {
    return <label className={style.label}>{props.label}</label>
}