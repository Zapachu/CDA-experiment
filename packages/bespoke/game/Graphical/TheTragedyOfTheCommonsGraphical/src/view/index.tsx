import {registerOnFramework} from 'elf-component'
import {Create} from './Create'
import {Play} from './Play'
import {Result} from './Result'
import {CreateOnElf} from './CreateOnElf'

registerOnFramework('TheTragedyOfTheCommonsGraphical', {
    localeNames: ['公地悲剧动画版', 'The Tragedy Of The Commons (Graphical)'],
    Create,
    CreateOnElf,
    Play,
    Result,
})
