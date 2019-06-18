import {registerOnFramework} from 'elf-component'
import {namespace} from '../config'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['EgretDemo', 'EgretDemo'],
    Play
})
