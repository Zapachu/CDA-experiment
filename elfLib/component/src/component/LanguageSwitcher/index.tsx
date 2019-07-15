import * as React from 'react'
import {parse} from 'querystring'
import * as style from './style.scss'

export enum Language {
    zh = 'zh',
    en = 'en'
}

export class Lang {
    static readonly key = 'lang'
    static readonly languages = [Language.zh, Language.en]
    static readonly defaultLanguage = Language.zh
    static activeLanguage: Language =
        parse(location.search.slice(1))[Lang.key] ||
        window.localStorage.getItem(Lang.key) as any ||
        Lang.defaultLanguage
    static switchListeners: Array<() => void> = []

    static extractLang<TLangDict>(LangDict: TLangDict): { [K in keyof TLangDict]: (string & ((...args: any[]) => string)) } {
        const defaultLanguageIndex = Lang.languages.indexOf(Lang.defaultLanguage)
        let activeLanguageIndex = Lang.languages.indexOf(this.activeLanguage)
        if (activeLanguageIndex === -1) {
            activeLanguageIndex = defaultLanguageIndex
        }
        const lang = {} as any
        Object.getOwnPropertyNames(LangDict).forEach(k => {
            lang[k] = LangDict[k][activeLanguageIndex]||LangDict[k][defaultLanguageIndex]
        })
        return lang
    }

    static switchLang(language: Language) {
        this.activeLanguage = language
        window.localStorage.setItem(Lang.key, this.activeLanguage)
        this.switchListeners.forEach(fn => fn())
    }
}

export function LanguageSwitcher() {
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