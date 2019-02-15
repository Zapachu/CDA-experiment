import * as React from 'react'
import * as style from './style.scss'
import {Lang} from '@client-util'

export enum NAV {
    basic,
    group,
    publish
}

export const withTab = (Component, nav:NAV, created?:boolean) => props => {
    const lang = Lang.extractLang({
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        save: ['保存', 'Save'],
        return: ['返回列表', 'Return to List'],
        basic: ['实验信息', 'Game Info'],
        group: ['实验环节', 'Game Phase'],
        publish: ['预览及发布', 'Preview & Publish'],
    })
    const {history, match:{params:{gameId}}} = props;
    let classes, navFuncs;
    switch(nav) {
        case NAV.basic: {
            classes = [style.active, gameId?'':style.closed, gameId?'':style.closed];
            navFuncs = [
                ()=>{},
                gameId ? () => history.push(`/group/create/${gameId}`) : ()=>{},
                gameId ? () => history.push(`/game/publish/${gameId}`) : ()=>{}
            ]
            break;
        }
        case NAV.group: {
            classes = ['', style.active, ''];
            navFuncs = [
                () => history.push(`/game/info/${gameId}`),
                ()=>{},
                () => history.push(`/game/publish/${gameId}`)
            ]
            break;
        }
        case NAV.publish: {
            classes = ['', '', style.active];
            navFuncs = [
                () => history.push(`/game/info/${gameId}`),
                () => history.push(`/group/create/${gameId}`),
                ()=>{},
            ]
            break;
        }
    }

    return (
        <section className={style.nav}>
            <nav>
                <ul>
                    <li 
                        style={{fontSize:'14px',color:'gray'}} 
                        onClick={() => history.push('/game')}>{lang.return}</li>
                    <li 
                        className={classes[0]}
                        onClick={navFuncs[0]}>{lang.basic}</li>
                    <li className={classes[1]}
                        onClick={navFuncs[1]}>{lang.group}</li>
                    {/* <li 
                        className={classes[2]}
                        onClick={navFuncs[2]}>{lang.publish}</li> */}
                </ul>
            </nav>
            <div className={style.navHolder}></div>
            <div className={style.container}><Component {...props} /></div>
        </section>
    )
}