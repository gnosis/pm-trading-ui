import classNames from 'classnames/bind'
import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Img from 'components/layout/Img'
import Bold from 'components/layout/Bold'
import * as css from '../index.css'

const prediction1 = require('routes/GameGuide/assets/prediction1.png')
const prediction2 = require('routes/GameGuide/assets/prediction2.png')
const prediction3 = require('routes/GameGuide/assets/prediction3.png')
const prediction4 = require('routes/GameGuide/assets/prediction4.png')
const prediction5 = require('routes/GameGuide/assets/prediction5.png')

const cx = classNames.bind(css)

const MakePrediction = () => (
  <Block margin="xl">
    <Subtitle>Make a prediction</Subtitle>
    <Block margin="md">
      <Img src={prediction1} width={1140} bordered />
    </Block>
    <Paragraph>
      Making a prediction means buying tokens for the outcome that you believe will occur at a price point/probability
      that you consider as reasonable and that will result in a maximum payout once the market is resolved.
    </Paragraph>
    <Paragraph>
      When clicking on a prediction market from the Dashboard or Market Overview, you’ll be navigated to the market’s
      detail page. It includes a description of the prediction market and presents the probabilities of the different
      outcome options (for categorical events) or the currently estimated price (for scalar events).
    </Paragraph>
    <Paragraph>
      You’ll find more detailed information about the market such as token type, fee percentage, total funding, current
      trading volume, or creator of the market in the sidebar.
    </Paragraph>
    <Paragraph>You are able to participate in the market from the Market Details Page.</Paragraph>
    <Paragraph>
      Here, you can buy or sell tokens, navigate to My Tokens, providing you with an overview of your current token
      holdings, or you can view your transactions in the My Trades tab .
    </Paragraph>
    <Paragraph>
      Depending on whether you’re predicting a categorical event or a scalar event, you’ll be able to trade outcome or
      short/long tokens (see <a href="https://blog.gnosis.pm/getting-to-the-core-4db11a31c35f">this blog</a> post for a
      detailed explanation on trading in prediction markets on categorical and scalar events).
    </Paragraph>
    <Paragraph>
      <Bold>To buy tokens:</Bold>
      <br />
      <Bold>1. </Bold>Click on <Bold>Buy Tokens</Bold>
      <br />
      <Bold>2. </Bold>Select your predicted outcome
      <br />
      <Bold>3. </Bold>Insert the amount which you&apos;d like to invest in the investment box
      <br />
      <Bold>4. </Bold>Click on the Buy Tokens button
      <br />
      <Bold>5. </Bold>Sign the transaction on Metamask by approving the transaction pop-ups that appear on your screen
      <br />
      <Bold>6. </Bold>Once the transaction is successfully processed, you’ll be able to see the tokens you traded in the
      My Tokens and My Trades tabs
      <br />
      <Bold>7. </Bold>If you&apos;d like to sell tokens you&apos;re holding, you can do so via the My Tokens tab
      <br />
    </Paragraph>
    <Paragraph>
      <Bold>To sell tokens:</Bold>
      <br />
      Selling outcome tokens you hold in a market means exiting your position in that market in return for OLY. You
      would sell outcome tokens either because you changed your mind about the winning outcome, or because you think
      exiting the market at the current price point will lead to the highest payout for you. That is, you believe the
      probability of an outcome will not increase any further.
      <br />
      <Bold>1. </Bold>Navigate to the My Tokens tab on any Market Details page.
      <br />
      <Bold>2. </Bold>From the Market Details page, you can see how many tokens you hold
      <br />
      <Bold>3. </Bold>You can now choose to sell all (or a portion of) tokens you hold by specifying how much you would
      like to sell, and clicking on the <Bold>Sell Tokens</Bold> button
      <br />
      <Bold>4. </Bold>Above the <Bold>Sell Tokens</Bold> button, you can see how much OLY you will be credited for
      selling your selected shares at the current price
    </Paragraph>
    <Block margin="md">
      <Paragraph>
        To follow up on your trades, and see how the share price progresses with time, scroll down to the trading chart
        displayed under each market on the Market Details page.
      </Paragraph>
    </Block>
    <Img src={prediction5} width="100%" bordered />
  </Block>
)

export default MakePrediction
