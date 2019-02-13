import {baseEnum, config} from "@dev/common"

export const languages = [baseEnum.Language.zh, baseEnum.Language.en]

export class Lang {
    static activeLanguage: baseEnum.Language = window.localStorage.getItem('activeLanguage') as any || config.defaultLanguage
    static switchListeners: Array<() => void> = []

    static extractLang<TLangDict>(LangDict: TLangDict): { [K in keyof TLangDict]: (string & ((...args: any[]) => string)) } {
        let activeLanguageIndex = languages.indexOf(this.activeLanguage)
        if (activeLanguageIndex === -1) {
            activeLanguageIndex = languages.indexOf(config.defaultLanguage)
        }
        const lang = {} as any
        Object.getOwnPropertyNames(LangDict).forEach(k => {
            lang[k] = LangDict[k][activeLanguageIndex]
        })
        return lang
    }

    static switchLang(language: baseEnum.Language) {
        this.activeLanguage = language
        window.localStorage.setItem('activeLanguage', this.activeLanguage)
        this.switchListeners.forEach(fn => fn())
    }
}