import {registerOnFramework} from '@bespoke/register'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {Result4Owner} from './Result4Owner'
import {Result} from './Result'

registerOnFramework(namespace, {
    localeNames: ['眼区测试', 'EyeTest'],
    Create,
    Play,
    Play4Owner,
    Result4Owner,
    Result
})
