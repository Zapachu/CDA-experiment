import {registerOnFramework} from '@bespoke/client-sdk'
import {Create} from './Create'
import {Play} from './Play'
import {namespace} from '../config'

registerOnFramework(namespace, {
    localeNames: ['卡牌实验', 'CardGame'],
    Create,
    Play
})
