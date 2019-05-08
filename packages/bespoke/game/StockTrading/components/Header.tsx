import * as React from 'react'
import * as style from '../style.scss'

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
                stages.map((item, idx) =>
                    <div key={`headerItem-${idx}`} className={style.item}
                         color={stage === item.name ? '75ff6b' : '#fff'}>
                        {item.text}
                    </div>
                )
            }
        </div>
    }
}
