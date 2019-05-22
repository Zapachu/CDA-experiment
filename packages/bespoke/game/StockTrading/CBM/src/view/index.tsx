import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['连续竞价', 'CBM'],
    Create,
    Play,
})
