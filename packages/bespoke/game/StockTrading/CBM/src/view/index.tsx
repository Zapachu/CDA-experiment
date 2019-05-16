import {registerOnFramework} from 'bespoke-client-util'
import {namespace} from '../config'
import {Create} from './Create'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['连续双向拍卖', 'ContinuousDoubleAuction'],
    Create,
    Play,
})
