import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['连续竞价', 'CBM'],
    Play
})
