import * as React from 'react'
import * as style from './style.scss'
import {ErrorBoundary} from '../ErrorBoundary'

export const Tabs: React.SFC<{ labels: Array<string>, children: Array<JSX.Element>, activeTabIndex: number, switchTab: (i: number) => void }> =
    ({children, labels, activeTabIndex, switchTab}) =>
        <section className={style.tabs}>
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
                <ErrorBoundary>
                    {
                        children[activeTabIndex]
                    }
                </ErrorBoundary>
            </div>
        </section>