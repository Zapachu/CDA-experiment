import * as React from 'react'
import * as style from './style.scss'

export function Tabs({children, labels, activeTabIndex, switchTab}: {
    labels: Array<string>,
    children: Array<JSX.Element>,
    activeTabIndex: number,
    switchTab: (i: number) => void,
}) {
    return <section className={style.tabs}>
        <div className={style.tabsHeader}>{
            children.map((child, index) => {
                    return <span key={index} className={index === activeTabIndex ? style.active : ''}
                               onClick={() => switchTab(index)}
                    >
                        {labels[index]}
                    </span>
                }
            )}
        </div>
        <div>
            {
                children[activeTabIndex]
            }
        </div>
    </section>
}