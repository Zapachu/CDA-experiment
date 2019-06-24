import * as React from 'react'
import * as style from './style.scss'

export enum Language {
    zh = 'zh',
    en = 'en'
}

export class Lang {
    static readonly languages = [Language.zh, Language.en]
    static readonly defaultLanguage = Language.zh
    static activeLanguage: Language = window.localStorage.getItem('activeLanguage') as any || Lang.defaultLanguage
    static switchListeners: Array<() => void> = []

    static extractLang<TLangDict>(LangDict: TLangDict): { [K in keyof TLangDict]: (string & ((...args: any[]) => string)) } {
        let activeLanguageIndex = Lang.languages.indexOf(this.activeLanguage)
        if (activeLanguageIndex === -1) {
            activeLanguageIndex = Lang.languages.indexOf(Lang.defaultLanguage)
        }
        const lang = {} as any
        Object.getOwnPropertyNames(LangDict).forEach(k => {
            lang[k] = LangDict[k][activeLanguageIndex]
        })
        return lang
    }

    static switchLang(language: Language) {
        this.activeLanguage = language
        window.localStorage.setItem('activeLanguage', this.activeLanguage)
        this.switchListeners.forEach(fn => fn())
    }
}

export function LanguageSwitcher(){
    const lang = Lang.extractLang({
        [Language[Language.zh]]: ['中文', '中文'],
        [Language[Language.en]]: ['English', 'English']
    })
    return <ul className={style.languageSwitcher}>
        {
            Lang.languages.map(language =>
                <li key={language} className={language === Lang.activeLanguage ? style.active : ''}
                    onClick={() => Lang.switchLang(language)}>{lang[Language[language]]}</li>)
        }
    </ul>
}