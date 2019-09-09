import * as React from 'react';
import * as style from './style.scss';
import {Core} from '@bespoke/client';
import {Label, Lang, Switch} from '@elf/component';
import {ICreateParams} from '../config';
import {NCreateParams} from '@micro-experiment/share';
import {InputNumber, Select} from 'antd';
import {getEnumKeys} from '../util';
import CBMRobotType = NCreateParams.CBMRobotType;

const {Option} = Select;

type TPlayProps = Core.ICreateProps<ICreateParams>

export function Create({params, setParams}: TPlayProps) {
    {
        const lang = Lang.extractLang({
            allowLeverage: ['允许杠杆', 'Allow Leverage'],
            robotType: ['机器人类型', 'RobotType'],
            robotCD: ['机器人报价间隔', 'RobotCD'],
        });
        React.useEffect(() => {
            setParams({allowLeverage: false, robotType: NCreateParams.CBMRobotType.zip, robotCD: 5});
        }, []);
        return <section className={style.create}>
            <div>
                <Label label={lang.allowLeverage}/>
                <Switch onChange={() => setParams({allowLeverage: !params.allowLeverage})}
                        checked={params.allowLeverage}/>
            </div>
            <div>
                <Label label={lang.robotType}/>
                <Select defaultValue={CBMRobotType[CBMRobotType.zip]} style={{width: 120}} onChange={(key: string) =>
                    setParams({robotType: CBMRobotType[key]})
                }>
                    {
                        getEnumKeys(NCreateParams.CBMRobotType).map(key => <Option key={key} value={key}>{key}</Option>)
                    }
                </Select>
            </div>
            <div>
                <Label label={lang.robotCD}/>
                <InputNumber onChange={(robotCD: number) => setParams({robotCD})} value={params.robotCD}/>
            </div>
        </section>;

    }
}