import {registerOnFramework} from '@bespoke/register'
import {Play} from './Play'
import {Play4Owner} from './Play4Owner'
import {namespace} from '../config'

registerOnFramework(namespace, {
    localeNames: ['人脸识别', 'FaceRecognition'],
    Play,
    Play4Owner
})
