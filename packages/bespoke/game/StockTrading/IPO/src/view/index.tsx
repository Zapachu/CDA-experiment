import {registerOnFramework} from '@bespoke/client-sdk'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['上海纽约大学实验', 'Shanghai New York'],
    Create,
    Play,
})
