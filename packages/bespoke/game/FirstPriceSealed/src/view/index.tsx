import {registerOnFramework} from 'bespoke-client-util'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('FirstPriceSealed', {
    localeNames: ['第一密封价格拍卖', 'First Price Sealed'],
    Create,
    Play,
    Result,
})
