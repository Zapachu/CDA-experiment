require('./style.scss')
import * as React from 'react'

const RCSwitch = require('rc-switch').default as React.ComponentClass<any>

export const Switch:React.SFC<{
    onChange: Function,
    checked: boolean,
    disabled?: boolean,
    defaultChecked?: boolean
}>=props=><RCSwitch {...props}/>