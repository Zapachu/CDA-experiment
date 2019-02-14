import * as React from 'react'
import * as style from './style.scss'
import {baseEnum} from '@common'
import {Lang, languageNames} from '../../util'
import Language = baseEnum.Language

export const LanguageSwitcher: React.SFC = () => {
    const lang = Lang.extractLang({
        [Language[Language.chinese]]: ['中文', '中文'],
        [Language[Language.english]]: ['English', 'English']
    })
    return <ul className={style.languageSwitcher}>
        {
            languageNames.map(language =>
                <li key={language} className={language === Lang.languageName ? style.active : ''}
                    onClick={() => Lang.switchLang(language)}>{lang[Language[language]]}</li>)
        }
    </ul>
}