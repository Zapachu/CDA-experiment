import {registerOnFramework} from 'bespoke-client'
import {namespace} from '../config'
import {Create} from './Create'
import {CreateOnElf} from './CreateOnElf'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework(namespace, {
    localeNames: ['维克里拍卖', 'Vickrey Auction'],
    Create,
    CreateOnElf,
    Play,
    Result
})