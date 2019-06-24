import {registerOnFramework} from 'elf-component'
import {Play} from './Play'
import {namespace} from '../config'

registerOnFramework(namespace, {
    localeNames: ['人脸识别', 'FaceRecognition'],
    Play
})
