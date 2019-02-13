import {registerOnFramework} from '@dev/client'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {Result4Owner} from './Result4Owner'

registerOnFramework('CDASurvey', {
    localeNames: ['CDA问卷', 'CDA Survey'],
    Play,
    Play4Owner,
    Result4Owner
})