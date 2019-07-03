import * as React from 'react'
import * as style from './style.scss'
import * as qiniu from 'qiniu-js'
import {Core} from '@bespoke/client-sdk'
import {Lang, Button, ButtonProps} from 'elf-component'
import {MoveType, PushType, TResultItem, Point, recognizeInterval} from '../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'

interface IPlayState {
    recognizing: boolean
    resultArray: Array<TResultItem>
    qiNiuUploadToken?: string
    videoMetaData?: {
        width: number,
        height: number
    }
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {
    videoRef = React.createRef<HTMLVideoElement>()
    canvasRef = React.createRef<HTMLCanvasElement>()
    recognizeTimer: number

    lang = Lang.extractLang({
        start: ['开始', 'START'],
        pause: ['暂停', 'PAUSE'],
        result: ['结果', 'Result']
    })

    state: IPlayState = {
        recognizing: false,
        resultArray: [{"faceId":"e36b54d7-0b40-4e05-ad7b-78f8ff2d67f4","faceRectangle":{"top":205,"left":287,"width":287,"height":274},"faceLandmarks":{"pupilLeft":{"x":367.6,"y":281},"pupilRight":{"x":484.7,"y":284.3},"noseTip":{"x":440,"y":349.7},"mouthLeft":{"x":373.7,"y":420.2},"mouthRight":{"x":488,"y":421.3},"eyebrowLeftOuter":{"x":309.1,"y":255.2},"eyebrowLeftInner":{"x":405.2,"y":240.7},"eyeLeftOuter":{"x":345.5,"y":285.3},"eyeLeftTop":{"x":365.3,"y":275.9},"eyeLeftBottom":{"x":366.4,"y":289.8},"eyeLeftInner":{"x":386,"y":283.5},"eyebrowRightInner":{"x":451.7,"y":240},"eyebrowRightOuter":{"x":530.9,"y":252.1},"eyeRightInner":{"x":468.2,"y":286.5},"eyeRightTop":{"x":484.8,"y":279.6},"eyeRightBottom":{"x":486.6,"y":291.4},"eyeRightOuter":{"x":502.8,"y":286.7},"noseRootLeft":{"x":412.2,"y":285.2},"noseRootRight":{"x":447.3,"y":284.2},"noseLeftAlarTop":{"x":401.6,"y":337.7},"noseRightAlarTop":{"x":466.9,"y":331.8},"noseLeftAlarOutTip":{"x":389.6,"y":363.7},"noseRightAlarOutTip":{"x":479.6,"y":358},"upperLipTop":{"x":438.9,"y":409.2},"upperLipBottom":{"x":439.4,"y":423.4},"underLipTop":{"x":438.4,"y":430.8},"underLipBottom":{"x":438.4,"y":449.2}},"faceAttributes":{"gender":"male","age":21,"emotion":{"anger":0,"contempt":0.002,"disgust":0,"fear":0,"happiness":0.052,"neutral":0.942,"sadness":0.003,"surprise":0}}}] as any
    }

    componentDidMount(): void {
        navigator.getUserMedia({video: true},
            videoStream => this.videoRef.current.srcObject = videoStream,
            error => console.log(error)
        )
    }

    startRecognize() {
        this.props.frameEmitter.emit(MoveType.getQiniuConfig, {}, qiNiuUploadToken =>
            this.setState({qiNiuUploadToken, recognizing: true}, () =>
                this.recognizeTimer = window.setTimeout(() => this.recognize(), recognizeInterval)
            )
        )
    }

    stopRecognize() {
        this.setState({
            recognizing: false
        })
        window.clearInterval(this.recognizeTimer)
    }

    componentWillUnmount(): void {
        window.clearInterval(this.recognizeTimer)
    }

    recognize() {
        const {props: {frameEmitter}, state: {qiNiuUploadToken}, videoRef, canvasRef} = this
        const video = videoRef.current, canvas = canvasRef.current
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        canvas.toBlob(blob => {
            const imageName = `images/azure/faces/${Math.random().toString(32).substr(2)}.png`
            const observable = qiniu.upload(blob, imageName, qiNiuUploadToken)
            observable.subscribe(() => null, () => null, () => frameEmitter.emit(MoveType.recognize, {imageName},
                (resultArray: TResultItem[]) => {
                    this.setState({resultArray})
                    this.recognizeTimer = window.setTimeout(() => this.recognize(), recognizeInterval)
                }))
        })
    }

    serializePoints(points: Array<Point>) {
        return points.map(({x, y}) => `${x},${y}`).join(' ')
    }

    render(): React.ReactNode {
        const {lang, videoRef, state: {resultArray, videoMetaData, recognizing}} = this
        return <section className={style.play}>
            <div className={style.mainContent}>
                <div className={style.videoWrapper}>
                    <video className={style.video} autoPlay={true} ref={videoRef}
                           onLoadedMetadata={() => this.setState({
                               videoMetaData: {
                                   width: videoRef.current.videoWidth,
                                   height: videoRef.current.videoHeight
                               }
                           })}/>
                    {
                        videoMetaData ? <React.Fragment>
                            <svg className={style.svg} xmlns="http://www.w3.org/2000/svg"
                                 viewBox={`0,0,${videoMetaData.width},${videoMetaData.height}`}>
                                {
                                    resultArray.map(({
                                                         faceRectangle: {left, top, height, width}, faceLandmarks: {
                                            eyeLeftBottom, eyeLeftTop, eyeLeftInner, eyeLeftOuter,
                                            eyeRightBottom, eyeRightTop, eyeRightInner, eyeRightOuter,
                                            eyebrowLeftInner, eyebrowLeftOuter, eyebrowRightInner, eyebrowRightOuter,
                                            mouthLeft, mouthRight,
                                            noseTip, noseLeftAlarTop, noseLeftAlarOutTip, noseRootLeft, noseRootRight, noseRightAlarOutTip, noseRightAlarTop,
                                            pupilLeft, pupilRight,
                                            upperLipBottom, upperLipTop, underLipBottom, underLipTop,
                                        }
                                                     }, i) =>
                                        <React.Fragment key={i}>
                                            <polygon
                                                points={`${left},${top} ${left},${top + height} ${left + width},${top + height} ${left + width},${top}`}/>
                                            <polygon points={this.serializePoints([eyeLeftBottom, eyeLeftInner, eyeLeftTop, eyeLeftOuter])}/>
                                            <polygon points={this.serializePoints([eyeRightBottom, eyeRightInner, eyeRightTop, eyeRightOuter])}/>
                                            <polygon points={this.serializePoints([eyebrowLeftOuter, eyebrowLeftInner])}/>
                                            <polygon points={this.serializePoints([eyebrowRightOuter, eyebrowRightInner])}/>
                                            <polygon points={this.serializePoints([noseTip, noseLeftAlarTop, noseLeftAlarOutTip, noseRootLeft, noseRootRight, noseRightAlarOutTip, noseRightAlarTop])}/>
                                            <polygon points={this.serializePoints([mouthLeft, upperLipBottom, mouthRight, upperLipTop])}/>
                                            <polygon points={this.serializePoints([mouthLeft, underLipBottom, mouthRight, underLipTop])}/>
                                            <circle cx={pupilLeft.x} cy={pupilLeft.y} r={2}/>
                                            <circle cx={pupilRight.x} cy={pupilRight.y} r={2}/>
                                        </React.Fragment>)
                                }
                            </svg>
                            <canvas width={videoMetaData.width}
                                    height={videoMetaData.height}
                                    className={style.canvas}
                                    ref={this.canvasRef}/>
                        </React.Fragment> : null
                    }
                </div>
                <div className={style.btnWrapper}>
                    {
                        recognizing ?
                            <Button label={lang.pause} color={ButtonProps.Color.red} onClick={() => this.stopRecognize()}/> :
                            <Button label={lang.start} onClick={() => this.startRecognize()}/>
                    }
                </div>
            </div>
            <ul className={style.result}>
                <h3 className={style.title}>{lang.result}</h3>
                {
                    resultArray.map((resultItem, i) => <ResultItem key={i} {...resultItem}/>)
                }
            </ul>
        </section>
    }
}

const ResultItem: React.SFC<TResultItem> = resultItem => {
    console.log(resultItem)
    const {faceAttributes: {age, gender, emotion}} = resultItem
    console.log(resultItem)
    const lang = Lang.extractLang({
        age: ['年龄', 'Age'],
        gender: ['性别', 'Gender'],
        emotion: ['情绪', 'Emotion']
    })
    const emotionNames: Array<string> = [],
        emotionPoints: Array<number> = []
    Object.entries(emotion).forEach(([name, value]) => {
        emotionPoints.push(value)
        emotionNames.push(name)
    })
    return <li className={style.resultItem}>
        <div>
            <p>{lang.age}<em>{age}</em></p>
            <p>{lang.gender}<em>{gender}</em></p>
        </div>
        <div>
            <p>{lang.emotion}</p>
            <table className={style.emotion}>
                <tr>
                    {
                        emotionNames.map((name, i) => <td key={i}>{name}</td>)
                    }
                </tr>
                <tr>
                    {
                        emotionPoints.map((point, i) => <td key={i}>{point}</td>)
                    }
                </tr>
            </table>
        </div>
    </li>
}