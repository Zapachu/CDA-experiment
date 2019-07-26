import {registerOnFramework} from '@bespoke/client'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {Result} from './Result'
import {Result4Owner} from './Result4Owner'

registerOnFramework(namespace, {
    Create,
    Play,
    Play4Owner,
    Result,
    Result4Owner
})
