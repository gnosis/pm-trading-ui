import classNames from 'classnames/bind'
import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Img from 'components/layout/Img'
import Bold from 'components/layout/Bold'
import * as css from '../index.css'

const prediction1 = require('routes/gamerules/assets/prediction1.png')
const prediction2 = require('routes/gamerules/assets/prediction2.png')
const prediction3 = require('routes/gamerules/assets/prediction3.png')
const prediction4 = require('routes/gamerules/assets/prediction4.png')
const prediction5 = require('routes/gamerules/assets/prediction5.png')

const cx = classNames.bind(css)

const MakePrediction = () => (
  <Block margin="xl">
    <Subtitle>Make a prediction</Subtitle>
    <Block margin="md">
      <Img src={prediction1} width={1140} />
    </Block>
    <Paragraph color="medium">
        When clicking on a prediction market from the Dashboard or Market Overview, you’ll be navigated to the market’s detail page. It includes a description of the prediction market and presents the probabilities of the different outcome options (for categorical events) or the currently estimated price (for scalar events).
      </Paragraph>
    <Paragraph>
        You’ll find more detailed information about the market such as token type, fee percentage, total funding, current trading volume, or creator of the market in the sidebar.
      </Paragraph>
    <Paragraph>
        From within this detail page, you’ll be able to participate in the prediction market.<br />
        You can buy tokens in the market, navigate to your current token holdings at My Tokens, as well as display your transactions in this market at My Trades.
      </Paragraph>
    <Paragraph>
        Depending on whether you’re predicting a categorical event or a scalar event, you’ll be able to trade outcome or short/long tokens (see <a href="https://blog.gnosis.pm/getting-to-the-core-4db11a31c35f">this blog</a> post for a detailed explanation on trading in prediction markets on categorical and scalar events).
      </Paragraph>
    <Paragraph>
        To buy tokens, simply click on <Bold>Buy Tokens</Bold>, select your predicted outcome, and insert the amount which you'd like to invest to make your prediction.
      </Paragraph>
    <Paragraph>
        To sign the transaction, scan the displayed barcode using your uPort app. From within the app, hit approve.
      </Paragraph>
    <Block className={cx('slider')} margin="md">
      <Img src={prediction2} width={320} height={380} fullwidth />
      <Img src={prediction3} width={320} height={600} />
      <Img src={prediction4} width={320} height={600} />
    </Block>
    <Block margin="md">
      <Paragraph>
            A chart of the different outcome tokens (for categorical events) or short/long tokens (for scalar events) over a time period of a week, or a day will be displayed in the bottom section.
        </Paragraph>
    </Block>
    <Img src={prediction5} width={'100%'} />
  </Block>
)

export default MakePrediction
