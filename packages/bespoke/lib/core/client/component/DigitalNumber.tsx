import * as React from 'react'

const pointsGroup = [
    '21,0 1,0 5,4 17,4',
    '21,21.5 19,19.5 3,19.5 1,21.5 3,23.5 19,23.5',
    '21,43 1,43 5,39 17,39',
    '0,1 0,21 4,17 4,5',
    '22,1 22,21 18,17 18,5',
    '0,22 0,42 4,38 4,26',
    '22,22 22,42 18,38 18,26',
]
const statusDict = [
    [1,0,1,1,1,1,1],
    [0,0,0,0,1,0,1],
    [1,1,1,0,1,1,0],
    [1,1,1,0,1,0,1],
    [0,1,0,1,1,0,1],
    [1,1,1,1,0,0,1],
    [1,1,1,1,0,1,1],
    [1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,0,1]
]

export default function DigitalNumber({number}) {
    const digits = statusDict[number]||[0,1,0,0,0,0,0]
    return <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0,0,22,43">
        {
            pointsGroup.map((points,index)=>
                <polygon fill={digits[index]?'#333':'#eee'} points={points}/>
            )
        }
    </svg>
}