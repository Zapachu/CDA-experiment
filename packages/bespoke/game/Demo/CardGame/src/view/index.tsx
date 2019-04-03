import {registerOnFramework} from 'bespoke-client-util'
import {Create} from './Create'
import {Play} from './Play'
import {namespace} from '../config'

registerOnFramework(namespace, {
    localeNames: ['卡牌实验', 'CardGame'],
    Create,
    Play
})
