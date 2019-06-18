import {registerOnFramework} from 'elf-component'
import {Create} from './Create'
import {CreateOnElf} from './CreateOnElf'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('TogetherBidMarket', {
    localeNames: ['集合竞价', 'TogetherBidMarket'],
    Create,
    CreateOnElf,
    Play,
    Result,
})
