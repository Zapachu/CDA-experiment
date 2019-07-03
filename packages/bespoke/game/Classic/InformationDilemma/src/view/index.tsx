import {registerOnFramework} from 'elf-component'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework('InformationDilemma', {
    localeNames: ['信息困境与信息层叠', 'Information Dilemma'],
    Create,
    Play,
    Result,
})
