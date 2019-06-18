import * as React from 'react'
import * as style from './style.scss'
import {HistoryGame} from './HistoryGame'
import {Button, ButtonProps, Input, Label, Lang, Markdown, Toast, TPageProps} from 'elf-component'
import {baseEnum, IGameConfig} from 'bespoke-common'
import {Api} from '../util'

const SubmitBarHeight = '5rem'

export function Create({user, history, gameTemplate: {Create: GameCreate}}: TPageProps) {
    const lang = Lang.extractLang({
        GameTitle: ['实验标题', 'Title'],
        GameDesc: ['实验详情', 'Description'],
        Submit: ['提交', 'Submit'],
        CreateSuccess: ['实验创建成功', 'Create success'],
        CreateFailed: ['实验创建失败', 'Create Failed']
    })
    const [title, setTitle] = React.useState(''),
        [desc, setDesc] = React.useState(''),
        [params, setParams] = React.useState({}),
        [submitable, setSubmitable] = React.useState(true)
    React.useEffect(() => {
        if (user && user.role === baseEnum.AcademusRole.teacher) {
            return
        }
        history.push('/join')
    }, [])

    async function submit() {
        const {code, gameId} = await Api.newGame({title, desc, params})
        if (code === baseEnum.ResponseCode.success) {
            Toast.success(lang.CreateSuccess)
            setTimeout(() => history.push(`/play/${gameId}`), 1000)
        } else {
            Toast.error(lang.CreateFailed)
        }
    }

    return <section className={style.create} style={{marginBottom: SubmitBarHeight}}>
        <div className={style.baseInfoWrapper}>
            <section className={style.gameInfo}>
                <div className={style.gameFieldWrapper}>
                    <Input value={title} placeholder={lang.GameTitle}
                           onChange={({target: {value: title}}) => setTitle(title)}/>
                </div>
                <div className={style.gameFieldWrapper}>
                    <Label label={lang.GameDesc}/>
                    <Markdown editable={true} value={desc}
                              onChange={({target: {value: desc}}) => setDesc(desc)}/>
                </div>
            </section>
            <HistoryGame {...{
                applyHistoryGame: ({title, desc, params}: IGameConfig<any>) => {
                    setTitle(title)
                    setDesc(desc)
                    setParams(params)
                }
            }}/>
        </div>
        <div className={style.bespokeWrapper}>
            <GameCreate {...{
                params,
                setParams: newParams => setParams({...params, ...newParams}),
                submitable,
                setSubmitable: submitable => setSubmitable(submitable)
            }}/>
        </div>
        <div className={style.submitBtnWrapper} style={{height: SubmitBarHeight}}>
            {
                submitable ? <Button width={ButtonProps.Width.medium}
                                     label={lang.Submit}
                                     onClick={() => submit()}
                /> : null
            }
        </div>
    </section>

}
