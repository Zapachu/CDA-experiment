import * as React from 'react';
import * as style from './style.scss';
import {Lang} from '@elf/component';

interface PropsType {
    data?: {
        p11: number,
        p21: number,
        p22: number,
    }
}

const Display: React.FunctionComponent<PropsType> = ({data}) => {
    const lang = Lang.extractLang({
        lowest: ['组内最低的选择', 'Lowest choice in the group'],
        choose1: ['选1', 'Choose 1'],
        choose2: ['选2', 'Choose 2'],
        chooseWait: ['等待', 'Wait'],
        yourChoice: ['你的选择', 'Your choice'],
        noShow: ['不可能出现', 'Will not happen']
    });
    return <table className={style.display}>
        <tbody>
        <tr>
            <td></td>
            <td></td>
            <td colSpan={2}>{lang.lowest}</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td>1</td>
            <td>2</td>
        </tr>
        <tr>
            <td rowSpan={2}>{lang.yourChoice}</td>
            <td>{lang.choose1}</td>
            <td className={style.data}>{data ? data.p11.toFixed(2) : 'π11'}</td>
            <td>{lang.noShow}</td>
        </tr>
        <tr>
            <td>{lang.choose2}</td>
            <td className={style.data}>{data ? data.p21.toFixed(2) : 'π21'}</td>
            <td className={style.data}>{data ? data.p22.toFixed(2) : 'π22'}</td>
        </tr>
        </tbody>
    </table>;
};

export default Display;