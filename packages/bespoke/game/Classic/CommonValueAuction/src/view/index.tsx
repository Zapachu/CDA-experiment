import {registerOnFramework} from 'elf-component'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('CommonValueAuction', {
    localeNames: ['公共价值拍卖', 'CommonValueAuction'],
    Create,
    Play,
    Result,
})
