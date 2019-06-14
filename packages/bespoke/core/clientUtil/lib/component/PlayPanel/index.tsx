import * as React from 'react'
import * as style from './style.scss'

export default function PlayPanel({twoColumn, children}){
    const components = [
        <div className={style.title}>{children[0]}</div>,
        <div className={style.desc}>{children[1]}</div>,
        <div >{children[2]}</div>
    ].map((component,index)=>children[index].props.children?component:null)
    return <section className={`${style.playPanel} ${twoColumn?style.twoColumn:''}`}>
        <div className={style.headWrapper}>
            {
                components[0]
            }
            {
                components[1]
            }
        </div>
        <div className={style.bodyWrapper}>
            {
                components[2]
            }
        </div>
    </section>
}