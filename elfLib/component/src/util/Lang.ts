import { parse } from "querystring";

export namespace Lang {
  export enum Language {
    zh = "zh",
    en = "en"
  }

  export const key = "lang",
    languages = [Language.zh, Language.en],
    defaultLanguageIndex = 0,
    switchListeners: Array<() => void> = [];

  export let activeLanguage: Language =
    parse(location.search.slice(1))[key] ||
    window.localStorage.getItem(key) as any ||
    languages[defaultLanguageIndex];

  export function extractLang<TLangDict>(
    LangDict: TLangDict
  ): { [K in keyof TLangDict]: string & ((...args: any[]) => string) } {
    const activeLanguageIndex = languages.indexOf(activeLanguage);
    const lang = {} as any;
    Object.getOwnPropertyNames(LangDict).forEach(k => {
      const dict = LangDict[k];
      lang[k] = dict[activeLanguageIndex] || dict[defaultLanguageIndex];
    });
    return lang;
  }

  export function extract(dict: string[]): string {
    const activeLanguageIndex = languages.indexOf(activeLanguage);
    return dict[activeLanguageIndex] || dict[defaultLanguageIndex];
  }

  export function listenLang(callback: () => void) {
    callback();
    switchListeners.push(callback);
  }

  export function switchLang(language: Language) {
    activeLanguage = language;
    window.localStorage.setItem(key, activeLanguage);
    switchListeners.forEach(fn => fn());
  }
}
