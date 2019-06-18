import {registerOnFramework} from 'elf-component'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework('TBM', {
    localeNames: ['集合竞价', 'Together Bid Market'],
    Create,
    Play
})
