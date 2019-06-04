import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Play} from './Play'
import {Create} from './Create'

registerOnFramework(namespace, {
    localeNames: ['连续竞价', 'CBM'],
    Create,
    Play
})
