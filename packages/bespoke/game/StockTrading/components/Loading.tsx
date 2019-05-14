import * as React from 'react'
import * as style from './style.scss'

const Loading = ({label}) =>
    <section className={style.loadingWrapper}>
        <div className={style.bounceWrapper}>
            <span className={style.bounce}/>
            <span className={style.bounce}/>
        </div>
        <label className={style.label}>{label || '加载中'}</label>
    </section>

export default Loading
