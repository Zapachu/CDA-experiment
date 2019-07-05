import {registerOnFramework} from '@bespoke/register'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('DoubleAuctionGraphical', {
    localeNames: ['双向拍卖动画版', 'Graphical Double Auction'],
    Create,
    Play,
    Result,
})
