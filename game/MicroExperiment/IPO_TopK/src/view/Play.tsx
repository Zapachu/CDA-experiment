import * as React from 'react'
import { Input as AntInput } from 'antd'
import { getPlay } from '../../../IPO_Median/src/view/Play'

export const Play = getPlay({
  ruleContent: (
    <>
      <p>
        您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对一个即将上市的股票有一个估值A元。您的公司给您提供了竞价资金B，要您在市场上参与该股票的询价过程。企业共发行了1万股股票，您与市场上其他交易者对该股票的估值可能相同，也可能不同，您需要与其他买家共同竞争购买股票。
        <br />
        股票的成交价格规则如下：每个股票都有一个最低的保留价格C元，即市场上股票的价格低于最低保留价格时，企业选择不发售股票，因此你的出价必需大于最低保留价格C。当所有的交易者提交自己的拟购买价格和拟购买数量，系统根据买家的拟购买价格由大到小进行排序后，拟购买价格在第10000股购买价之上的市场交易者获得购买资格，获得购买资格的交易者的成交价格即为其拟购买价，可购买数量按照价格排序后的拟购买数量依次进行分配。如若市场上拟购买总数小于企业发行的股票数量，则成交价格为最低保留价格C.
      </p>
      <br />
      <p>
        以下是一个简单的例子：
        <br />
        交易者A根据自己的估值给出的拟购买价格和拟购买数量分布为98元和5000股，交易者B给出的拟购买价格和购买数量为96元和6000股，交易者C给出的拟购买价格和购买数量为104元和3000股，交易者D给出的拟购买价格和购买数量为107元和4000股，你根据自己的估值105元给出的拟购买数量和拟购买价格是101元和6000股。
        系统按照购买价格的由高到低进行排序：
        <br />
        D：107元——4000股
        <br />
        C: 104元——3000股
        <br /> 您：101元——6000股
        <br /> A：98元——5000股
        <br /> B：96元——6000股
      </p>
      <br />
      <p>
        决定成交价格：则整个市场的拟购买总股数为24000，第10000股价格为101元，则按照拟购买价格顺序排列购买在前10000股的交易者获得购买资格，即相应的成交价即为其拟购买价格，可购买数量按照价格排序后的拟购买数量依次进行分配。
        决定购买数量：你、D和C都有购买这1万股股票的权利。按照价格排序后，D可购买的数量为4000股，D的购买价格为107元；C可购买的数量为3000股，C的购买价格为104元。虽然你的拟购买数量为6000股，但是此时你只能购买3000股，你的购买价格为101元。
        您的收益：（您对股票的估值-股票的成交价格）*您的购买数量
      </p>
    </>
  ),
  testQuestions: [
    {
      Content: ({ inputProps }) => (
        <p>
          当您们公司对股票的估值为52 元，股票的保留价格为43元是，则您的最高购买价格为
          <AntInput {...inputProps()} />
          元，最低购买价格为
          <AntInput {...inputProps()} />
          元；如若您输入购买价格后，系统显示您可以买4000股，则当您点击半仓时，您的购买数量为
          <AntInput {...inputProps()} />
          股，当您点击全仓时，您的购买数量为
          <AntInput {...inputProps()} />
          股。
        </p>
      ),
      Answer: () => <text>正确答案：52；43；2000；4000</text>,
      answer: ['52,43,2000,4000']
    },
    {
      Content: ({ inputProps }) => (
        <p>
          市场上有10000股股票。您的拟购买价格和拟购买数量是105元和4000股。市场上其他参与者的拟购买价格和拟购买数量如下：交易者A给出的拟购买价格和拟购买数量分布为99元和5000股，交易者B给出的拟购买价格和购买数量为100元和6000股，交易者C给出的拟购买价格和购买数量为102元和3000股，交易者D给出的拟购买价格和购买数量为96元和3000股
          系统按照购买价格的由高到低进行排序：
          <br />
          您：105元——4000股
          <br />
          C: 102元——3000股
          <br />
          B：100元——6000股
          <br />
          A：99元——5000股
          <br />
          D：96元——3000股
          <br />
          您的成交数量：
          <AntInput {...inputProps()} />
          股，购买价格为
          <AntInput {...inputProps()} />
          元；C的成交数量：
          <AntInput {...inputProps()} />
          股，购买价格为
          <AntInput {...inputProps()} />
          元；B的成交数量：
          <AntInput {...inputProps()} />
          股, 购买价格为
          <AntInput {...inputProps()} />
          元；A的成交数量：
          <AntInput {...inputProps()} />
          股； D的成交数量：
          <AntInput {...inputProps()} />股
        </p>
      ),
      Answer: () => (
        <text>
          解析：您、C、B都有购买这1万股股票的权利。按照价格排序后，您的成交数量为
          4000股，购买价格即为您的拟购买价格105元；C成交数量为3000股，购买价格即为C的拟购买价格102元；市场上还剩3000股股票。虽然B的拟购买数量为6000股，但是此时市面上只剩3000股，因此B的成交数量为3000股，B的购买价格即为B的拟购买价格。A和D的购买价格小于第10000股股票的价格，成交数量为0股
        </text>
      ),
      answer: ['4000', '105', '3000', '102', '3000', '100', '0', '0']
    },
    {
      Content: ({ inputProps }) => (
        <p>
          市场上有10000股股票。您的拟购买价格和拟购买数量是48元和4000股。市场上其他参与者的拟购买价格和拟购买数量如下：交易者A给出的拟购买价格和拟购买数量分布为35元和5000股，交易者B给出的拟购买价格和购买数量为50元和7000股，交易者C给出的拟购买价格和购买数量为44元和3000股，交易者D给出的拟购买价格和购买数量为39元和3000股。
          系统按照购买价格的由高到低进行排序：
          <br />
          B：50元——7000股
          <br />
          您: 48元——4000股
          <br />
          C：44元——3000股
          <br />
          D：39元——3000股
          <br />
          A：35元——5000股
          <br />
          B的成交数量：
          <AntInput {...inputProps()} />
          股, 购买价格为
          <AntInput {...inputProps()} />
          元；您的成交数量：
          <AntInput {...inputProps()} />
          股，购买价格为
          <AntInput {...inputProps()} />
          元；C的成交数量：
          <AntInput {...inputProps()} />
          股； D的成交数量：
          <AntInput {...inputProps()} />
          股；A的成交数量：
          <AntInput {...inputProps()} />股
        </p>
      ),
      Answer: () => (
        <text>
          解析：B、您都有购买这1万股股票的权利。按照价格排序后，B的成交数量为
          7000股，B的购买价格即为B的拟购买价格50元；市场上还剩3000股股票。虽然您的拟购买数量为4000股，但是此时市面上只剩3000股，因此您的成交数量为3000股，您的购买价格即为您的拟购买价格48元。C、A和D的购买价格小于股票的成交价格，成交数量为0股。
        </text>
      ),
      answer: ['7000', '50', '3000', '48', '0', '0', '0']
    }
  ]
})
