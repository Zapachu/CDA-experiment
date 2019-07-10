import * as React from 'react'
import * as style from './style.scss'
import {BtnGroup} from '../BtnGruop'
import {Lang} from '../LanguageSwitcher'
import {loadScript} from '../../util'
import marked = require('marked')

interface IMarkdownProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    editable: boolean
    value: string
}

interface IMarkdownState {
    preview: boolean
}

export class Markdown extends React.Component<IMarkdownProps, IMarkdownState> {
    lang = Lang.extractLang({
        edit: ['编辑', 'EDIT'],
        preview: ['预览', 'PREVIEW']
    })

    state: IMarkdownState = {
        preview: false
    }

    componentDidUpdate(prevProps: Readonly<IMarkdownProps>, prevState: Readonly<IMarkdownState>, snapshot?: any): void {
        if (this.state.preview) {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'output'])
        }
    }

    render(): React.ReactNode {
        const {lang, props: {editable, value, ...otherProps}, state: {preview}} = this
        return <section className={style.markdown}>
            {
                editable ? <BtnGroup {...{
                    size: BtnGroup.Size.small,
                    options: [lang.edit, lang.preview],
                    value: preview ? 1 : 0,
                    onChange: () => this.setState({preview: !preview})
                }}/> : null
            }
            {
                !editable || preview ?
                    <div className={style.content} dangerouslySetInnerHTML={{__html: marked(value)}}/> :
                    <textarea className={style.content} value={value} {...otherProps}/>
            }
        </section>
    }
}

declare const MathJax: any

loadScript(['https://cdn.jsdelivr.net/npm/mathjax@2.7.5/MathJax.js'], () =>
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'output'])
)
