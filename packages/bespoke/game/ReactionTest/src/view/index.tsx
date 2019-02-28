import {registerOnFramework} from 'bespoke-client-util'
import {Create} from './Create'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {Result4Owner} from './Result4Owner'
import {Result} from './Result'

registerOnFramework('ReactionTest', {
    localeNames: ['Reaction测试', 'Reaction Test'],
    Create,
    Play,
    Play4Owner,
    Result4Owner,
    Result,
})
