import * as React from 'react'
import {ImgLoader} from '../ImgLoader'

export function Shadow({active}: { active: boolean }) {
    return <ImgLoader src={[
        require('./shadow.svg'),
        require('./shadow_active.gif')
    ]} render={({images: [shadow, shadow_active]}) =>
        <image {...{
            href: active ? shadow_active.src : shadow.src,
            width:shadow.width,
            transform: `translate(${-shadow.width >> 1},0)`
        }}/>
    }/>
}
