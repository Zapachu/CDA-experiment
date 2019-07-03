import {registerOnFramework} from '@bespoke/client-sdk'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('PublicGoods', {
    localeNames: ['公共品', 'Public Goods'],
    Create,
    Play,
    Result,
})
