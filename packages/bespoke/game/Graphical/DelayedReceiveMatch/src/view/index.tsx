import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['延迟接收匹配', 'DelayedReceiveMatch'],
    Create,
    Play
})