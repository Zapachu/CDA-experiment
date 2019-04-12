import * as React from 'react'
import {ImgLoader} from '../ImgLoader'

export function Idea({msg = ''}: {
    msg: string | number
}) {
    return <ImgLoader src={[require('./idea.svg')]} render={
        ({images: [idea]}) =>
            <g transform={`translate(${idea.width >> 1},${-idea.height})`}>
                <image href={idea.src}/>
                <text {...{
                    fontSize: idea.height / 3,
                    y: idea.height * .6,
                    x: idea.width * .3
                }}>{msg}</text>
            </g>
    }/>
}
