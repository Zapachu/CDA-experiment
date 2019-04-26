import {registerOnFramework} from 'bespoke-client-util'
import {Create} from './Create'
import {CreateOnElf} from './CreateOnElf'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('PublicGoods', {
    localeNames: ['公共品', 'Public Goods'],
    Create,
    CreateOnElf,
    Play,
    Result,
})
