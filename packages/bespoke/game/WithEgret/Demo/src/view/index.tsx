import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['EgretDemo', 'EgretDemo'],
    Play
})
