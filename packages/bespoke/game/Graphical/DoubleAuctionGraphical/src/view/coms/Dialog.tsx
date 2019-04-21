import {span, Button} from 'bespoke-game-graphical-util'
import * as React from "react"

interface IDialog {
    dealDialog: boolean
    price: number
    position: number
    role: number
    dealDone: Function
}

const Dialog = ({dealDialog, price, position, dealDone, role}: IDialog) => {
    const deal = (position, price, status) => {
        dealDone(position, price, status)
    }
    if (dealDialog) {
        if (role === 0) {
            return <>
                <foreignObject {...{
                    x: span(1.5),
                    y: span(4.5)
                }}>
                    <div style={{
                        width: 300,
                        height: 140,
                        background: '#fff',
                        border: 'solid 5px #bdbdbd',
                        borderRadius: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyItems: 'flex-start',
                        alignItems: 'center',
                        fontSize: '1.8rem',
                        padding: '2rem',
                        position: 'relative'
                    }}>
                        <a
                            style={{position: 'absolute', top: '.4rem', right: '1rem'}}
                            onClick={deal.bind(this, position, price, false)}
                        >x</a>
                        <div>成交价格： {price}</div>
                    </div>
                </foreignObject>
                <foreignObject {...{
                    x: span(3.3),
                    y: span(5.8)
                }}>
                    <Button label='成交' onClick={deal.bind(this, position, price, true)}/>
                </foreignObject>
            </>
        } else {
            return <>
                <foreignObject {...{
                    x: span(5.5),
                    y: span(4.5)
                }}>
                    <div style={{
                        width: 300,
                        height: 140,
                        background: '#fff',
                        border: 'solid 5px #bdbdbd',
                        borderRadius: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyItems: 'flex-start',
                        alignItems: 'center',
                        fontSize: '1.8rem',
                        padding: '2rem',
                        position: 'relative'
                    }}>
                        <a
                            style={{position: 'absolute', top: '.4rem', right: '1rem'}}
                            onClick={deal.bind(this, position, price, false)}
                        >x</a>
                        <div>成交价格： {price}</div>
                    </div>
                </foreignObject>
                <foreignObject {...{
                    x: span(7.3),
                    y: span(5.8)
                }}>
                    <Button label='成交' onClick={deal.bind(this, position, price, true)}/>
                </foreignObject>
            </>
        }
    }
    return null
}

export default Dialog
