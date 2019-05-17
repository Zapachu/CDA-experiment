import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['首页', 'Home'],
    Create,
    Play
})