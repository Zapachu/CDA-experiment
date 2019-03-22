import {registerOnFramework} from 'bespoke-client-util'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('TogetherBidMarket', {
    localeNames: ['集合竞价', 'TogetherBidMarket'],
    Create,
    Play,
    Result,
})
