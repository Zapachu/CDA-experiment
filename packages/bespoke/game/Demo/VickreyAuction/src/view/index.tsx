import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Egret'
import {Result} from './Result'

registerOnFramework(namespace, {
    localeNames: ['维克里拍卖', 'Vickrey Auction'],
    Create,
    Play,
    Result
})