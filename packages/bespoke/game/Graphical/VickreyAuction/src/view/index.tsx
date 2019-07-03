import {registerOnFramework} from 'elf-component'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework(namespace, {
    localeNames: ['维克里拍卖', 'Vickrey Auction'],
    Create,
    Play,
    Result
})
