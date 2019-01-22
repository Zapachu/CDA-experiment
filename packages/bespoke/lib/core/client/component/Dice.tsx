import * as React from 'react'

const offset = 10, space = 5, r = 16,
    viewBoxWidth = 2*(offset+3*r+space)
const circles = Array(9).fill('').map((_,index)=>{
    const x = index%3, y = ~~(index/3)
    return {
        cx:offset + r + (2*r+space)*x,
        cy:offset + r + (2*r+space)*y
    }
})
const statusDict = [
    [],
    [0,0,0,0,1,0,0,0,0],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [1,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,0,1],
    [1,1,1,0,0,0,1,1,1]
]

export class Dice extends React.Component<{
    number:number
    showAnimation?:boolean
}>{
    interval:number

    state={
        number : 1
    }

    componentDidMount(){
        clearInterval(this.interval)
        this.interval = window.setInterval(()=>{
            this.setState({
                number:~~(Math.random()*6)+1
            })
        },200)
        setTimeout(()=>{
            clearInterval(this.interval)
            this.setState({
                number:this.props.number
            })
        },2000)
    }

    render(){
        const {number} = this.props.showAnimation?this.state:this.props
        const circlePoints = statusDict[number]
        return <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox={`0,0,${viewBoxWidth},${viewBoxWidth}`}>
            <rect fill='#fff' x='0' y='0' rx={r} ry={r} width={viewBoxWidth} height={viewBoxWidth}/>
            {
                circlePoints.map((circlePoint,index)=>!circlePoint?null:
                    <circle fill="#E27B6A" {...circles[index]} r={(1.6-0.14*number)*r}/>
                )
            }
        </svg>
    }
}