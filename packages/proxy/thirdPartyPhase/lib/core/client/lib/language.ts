import {baseEnum} from "@common"
import Language = baseEnum.Language

export const languageNames = [Language.chinese, Language.english]

export class Lang {
    static languageName: Language
    static switchListeners: Array<() => void> = []

    static extractLang<TLangDict>(LangDict: TLangDict): { [K in keyof TLangDict]: (string & ((...args: any[]) => string)) } {
        this.languageName = window.localStorage.getItem('languageName') as any
        let languageIndex = languageNames.indexOf(this.languageName)
        if (languageIndex === -1) {
            languageIndex = languageNames.indexOf(Language.chinese)
        }
        const lang = {} as any
        Object.getOwnPropertyNames(LangDict).forEach(k => {
            lang[k] = LangDict[k][languageIndex]
        })
        return lang
    }

    static switchLang(lang: Language) {
        this.languageName = lang
        window.localStorage.setItem('languageName', this.languageName.toString())
        this.switchListeners.forEach(fn => fn())
    }
}