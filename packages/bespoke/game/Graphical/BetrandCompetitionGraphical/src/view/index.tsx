import {registerOnFramework} from '@bespoke/client-sdk'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework(namespace, {
    localeNames: ['古诺竞争', 'Cournot Competition'],
    Create,
    Play,
    Result
})