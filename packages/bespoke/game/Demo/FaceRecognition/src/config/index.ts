export const namespace = 'FaceRecognition'

export enum MoveType {
    getQiniuConfig = 'getQiniuConfig',
    recognize = 'recognize'
}

export enum PushType {
}

/**-----------------------------------------------------------------------**/
export const recognizeInterval = 3000

export const qiniuTokenLifetime = 7200

export enum Gender {
    male = 'male',
    female = 'female'
}

export type Emotion = {
    anger: number,
    contempt: number,
    disgust: number,
    fear: number,
    happiness: number,
    neutral: number,
    sadness: number,
    surprise: number
}

export type Point = {
    x: number,
    y: number
}

export type TResultItem = {
    faceRectangle: {
        top: number,
        left: number,
        width: number,
        height: number
    },
    faceAttributes: {
        gender: Gender,
        age: number,
        emotion: Emotion
    },
    faceLandmarks: {
        eyeLeftBottom: Point
        eyeLeftInner: Point
        eyeLeftOuter: Point
        eyeLeftTop: Point
        eyeRightBottom: Point
        eyeRightInner: Point
        eyeRightOuter: Point
        eyeRightTop: Point
        eyebrowLeftInner: Point
        eyebrowLeftOuter: Point
        eyebrowRightInner: Point
        eyebrowRightOuter: Point
        mouthLeft: Point
        mouthRight: Point
        noseLeftAlarOutTip: Point
        noseLeftAlarTop: Point
        noseRightAlarOutTip: Point
        noseRightAlarTop: Point
        noseRootLeft: Point
        noseRootRight: Point
        noseTip: Point
        pupilLeft: Point
        pupilRight: Point
        underLipBottom: Point
        underLipTop: Point
        upperLipBottom: Point
        upperLipTop: Point
    }
}