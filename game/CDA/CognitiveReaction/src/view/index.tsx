import {registerOnFramework} from '@bespoke/register'
import {namespace} from '../config'
import {Play} from './Play'
import {Create} from './Create'
import {Play4Owner} from './Play4Owner'
import {Result4Owner} from './Result4Owner'
import {Result} from './Result'

registerOnFramework(namespace, {
    localeNames: ['认知反应', 'Cognitive Reaction'],
    Create,
    Play,
    Play4Owner,
    Result4Owner,
    Result
})
