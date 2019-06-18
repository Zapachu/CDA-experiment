import {registerOnFramework} from 'elf-component'
import {namespace} from '../config'
import {Create} from './Create'
import {CreateOnElf} from './CreateOnElf'
import {Play} from './Play'
import {Result} from './Result'

registerOnFramework(namespace, {
    localeNames: ['古诺竞争', 'Cournot Competition'],
    Create,
    CreateOnElf,
    Play,
    Result
})