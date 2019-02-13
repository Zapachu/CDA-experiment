import * as React from 'react'
import * as style from './style.scss'
import {baseEnum} from '@dev/common'
import {Lang, languages} from '../../util'
import Language = baseEnum.Language

export const LanguageSwitcher: React.SFC = () => {
    const lang = Lang.extractLang({
        [Language[Language.zh]]: ['中文', '中文'],
        [Language[Language.en]]: ['English', 'English'],
    })
    return <ul className={style.languageSwitcher}>
        {
            languages.map(language =>
                <li key={language} className={language === Lang.activeLanguage ? style.active : ''}
                    onClick={() => Lang.switchLang(language)}>{lang[Language[language]]}</li>)
        }
    </ul>
}