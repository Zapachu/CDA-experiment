import {registerOnFramework} from '@bespoke/client'
import {namespace} from '../config'
import {Create} from '../../../../Classic/TrustGame/src/view/Create'
import {Result} from '../../../../Classic/TrustGame/src/view/Result'
import {Play} from './Play'

registerOnFramework(namespace, {
    localeNames: ['信任博弈 (动画版)', 'Trust Game (Graphical)'],
    Create,
    Play,
    Result
})
