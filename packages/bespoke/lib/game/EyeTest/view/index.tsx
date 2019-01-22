import {registerOnFramework} from '../../index'
import {Create} from './Create'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {Result4Owner} from './Result4Owner'
import {Result} from './Result'

registerOnFramework('EyeTest', {
    localeNames: ['眼区测试', 'EyeTest'],
    Create,
    Play,
    Play4Owner,
    Result4Owner,
    Result
})
