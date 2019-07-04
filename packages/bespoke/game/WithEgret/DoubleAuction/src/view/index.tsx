import {registerOnFramework} from '@bespoke/register'
import {namespace} from '../config'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['EgretDemo', 'EgretDemo'],
    Play
})
