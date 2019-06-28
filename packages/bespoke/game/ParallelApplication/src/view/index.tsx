import {registerOnFramework} from 'elf-component'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework('ParallelApplication', {
    localeNames: ['平行志愿', 'Parallel Application'],
    Create,
    Play
})