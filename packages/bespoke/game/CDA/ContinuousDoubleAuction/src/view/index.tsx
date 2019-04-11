import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Create} from './Create'
import {CreateOnElf} from './CreateOnElf'
import {Info} from './Info'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {Result} from './Result'
import {Result4Owner} from './Result4Owner'

registerOnFramework(namespace, {
    localeNames: ['连续双向拍卖', 'ContinuousDoubleAuction'],
    Create,
    CreateOnElf,
    Info,
    Play,
    Play4Owner,
    Result,
    Result4Owner
})