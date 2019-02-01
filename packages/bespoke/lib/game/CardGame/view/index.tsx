import {registerOnFramework} from 'client-vendor'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework('CardGame', {
    localeNames: ['卡牌实验', 'CardGame'],
    Create,
    Play,
})