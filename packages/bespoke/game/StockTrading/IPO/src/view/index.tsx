import {registerOnFramework} from 'elf-component'
import {namespace} from '../config'
import {Create} from './Create'
import {CreateOnElf} from './CreateOnElf'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['上海纽约大学实验', 'Shanghai New York'],
    Create,
    CreateOnElf,
    Play,
})
