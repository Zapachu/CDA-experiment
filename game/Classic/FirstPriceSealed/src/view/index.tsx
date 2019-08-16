import {registerOnFramework} from '@bespoke/client'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('FirstPriceSealed', {
    localeNames: ['第一价格密封拍卖', 'First Price Sealed'],
    Create,
    Play,
    Result,
})
