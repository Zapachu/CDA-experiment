import * as React from 'react'
import * as style from './style.scss'

export const Tabs: React.FunctionComponent<{
    labels: Array<string>,
    children: Array<JSX.Element>,
    activeTabIndex: number,
    switchTab: (i: number) => void,
    vertical?: boolean
}> =
    ({children, labels, activeTabIndex, switchTab, vertical}) =>
        <section className={`${style.tabs} ${vertical ? style.vertical : ''}`}>
            <ul className={style.tabsHeader}>{
                children.map((child, index) => {
                        return <li key={index} className={index === activeTabIndex ? style.active : ''}
                                   onClick={() => switchTab(index)}
                        >
                            {labels[index]}
                        </li>
                    }
                )}
            </ul>
            <div>
                {
                    children[activeTabIndex]
                }
            </div>
        </section>
