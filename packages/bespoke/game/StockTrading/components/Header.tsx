import * as React from 'react'
import * as style from './style.scss'

interface IProps {
    stage: string
}

const stages = [
    {name: 'home', text: '首页'},
    {name: 'ipo', text: 'IPO发售'},
    {name: 'tbm', text: '集合竞价'},
    {name: 'cbm', text: '连续竞价'},
]


export default class Header extends React.Component<IProps> {
    render(): React.ReactNode {

        const {stage} = this.props
        return <div className={style.header}>
            {
                // stages.map((item, idx) =>
                //     <div key={`headerItem-${idx}`} className={style.item}
                //          style={{
                //              color: stage === item.name ? '#58c350' : '#fff',
                //              borderBottom: stage === item.name ? 'solid 1px #1d6318' : 'none'
                //          }}>
                //         {item.text}
                //     </div>
                // )
                stages.map((item, idx) =>
                    <div key={`headerItem${idx}`} className={style.item}
                         style={{
                             color: stage === item.name ? '#58c350' : '#fff',
                             display: 'flex',
                             flexDirection: 'column',
                             height: '100%',
                         }}>
                        <div style={{flex: 1, marginTop: 12}}>{item.text}</div>
                        <div className={style.headerLine}>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )
            }
        </div>
    }
}
