import * as React from 'react'
import * as style from './style.scss'
import {Lang} from '@client-util'

export enum NAV {
    basic,
    phase
}

export const withSideNav = (Component, nav:NAV) => props => {
    const lang = Lang.extractLang({
        title: ['标题', 'Title'],
        desc: ['详情', 'Description'],
        save: ['保存', 'Save'],
        return: ['返回列表', 'Return to List'],
        basic: ['实验信息', 'Game Info'],
        phases: ['实验环节', 'Game Phase'],
    })
    const {history, match:{params:{gameId}}} = props;
    let classes, navFuncs;
    switch(nav) {
        case NAV.basic: {
            classes = [style.active, gameId?'':style.closed, gameId?'':style.closed];
            navFuncs = [
                ()=>{},
                gameId ? () => history.push(`/phase/${gameId}`) : ()=>{}
            ]
            break;
        }
        case NAV.phase: {
            classes = ['', style.active, ''];
            navFuncs = [
                () => history.push(`/baseInfo/${gameId}`),
                ()=>{}
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
                        onClick={() => history.push('/')}>{lang.return}</li>
                    <li
                        className={classes[0]}
                        onClick={navFuncs[0]}>{lang.basic}</li>
                    <li className={classes[1]}
                        onClick={navFuncs[1]}>{lang.phases}</li>
                </ul>
            </nav>
            <div className={style.navHolder}></div>
            <div className={style.container}><Component {...props} /></div>
        </section>
    )
}
