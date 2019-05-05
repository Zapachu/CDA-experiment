import {registerOnFramework} from 'bespoke-client-util'
import {Create} from './Create'
import {CreateOnElf} from './CreateOnElf'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('TBM', {
    localeNames: ['集合竞价', 'Together Bid Market'],
    Create,
    CreateOnElf,
    Play,
    Result,
})
