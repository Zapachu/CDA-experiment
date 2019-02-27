import {registerOnFramework} from 'bespoke-client'
import {Play} from './Play'

registerOnFramework('FaceRecognition', {
    localeNames: ['人脸识别', 'FaceRecognition'],
    Play
})