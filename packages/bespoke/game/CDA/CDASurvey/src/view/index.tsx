import {registerOnFramework} from 'elf-component'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {Result4Owner} from './Result4Owner'
import {namespace} from '../config'

registerOnFramework(namespace, {
    localeNames: ['CDA问卷', 'CDA Survey'],
    Play,
    Play4Owner,
    Result4Owner
})
