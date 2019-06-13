import * as React from 'react'
import * as style from './style.scss'
import {Lang} from '../../util'

export const Loading: React.SFC<{
    label?: string
}> = ({label}) => <section className={style.loadingWrapper}>
    <div className={style.bounceWrapper}>
        <span className={style.bounce}/>
        <span className={style.bounce}/>
    </div>
    <label className={style.label}>{label || Lang.extractLang({label: ['加载中', 'Loading']}).label}</label>
</section>