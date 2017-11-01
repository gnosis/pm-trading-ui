import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Bold from 'components/layout/Bold'
import Img from 'components/layout/Img'
import PageFrame from 'components/layout/PageFrame'
import Paragraph from 'components/layout/Paragraph'
import Title from 'components/layout/Title'
import Subtitle from 'components/layout/Subtitle'
import * as React from 'react'
import Youtube from 'react-youtube'
import * as css from './index.css'

const login1 = require('../assets/login1.png')
const login2 = require('../assets/login2.png')
const login3 = require('../assets/login3.png')
const login4 = require('../assets/login4.png')
const marketoverview1 = require('../assets/marketoverview1.png')
const dashboardoverview1 = require('../assets/dashboardoverview1.png')
const prediction1 = require('../assets/prediction1.png')
const prediction2 = require('../assets/prediction2.png')
const prediction3 = require('../assets/prediction3.png')
const prediction4 = require('../assets/prediction4.png')
const prediction5 = require('../assets/prediction5.png')
const profits1 = require('../assets/profits1.png')
const profits2 = require('../assets/profits2.png')
const profits3 = require('../assets/profits3.png')

const cx = classNames.bind(css)

/* const videoOpts = {
    height: '260',
    width: '520',
    playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
    },
}
*/

const GameRules = () => (
  <PageFrame>
    <Block margin="md">
      <Title>GAME RULES</Title>
      {/* <Youtube
        videoId="0WmUbiMHeSE"
        opts={videoOpts}
      /> */}
    </Block>
    <Block margin="xl">
      <Subtitle>Sign-up</Subtitle>
      <Paragraph color="medium">
        To participate in our two-week tournament, verify your identity by signing up via the uPort app on Android or iOS. <br />
        uPort is a secure, easy-to-use system for self-sovereign identity, built on Ethereum. uPort identities are fully
         owned and controlled by the creator, and don't rely on centralized third-parties for creation or validation.
          Via uPort, you can own and control your personal identity; securely and selectively disclose your data to counterparties, and interact with decentralized applications and smart contracts such as Gnosis.
      </Paragraph>
    </Block>
    <Block margin="xl">
      <Subtitle>Log-in</Subtitle>
      <Paragraph color="medium">
        Once the tournament starts, you will be able to access Olympia at http://olympia.gnosis.pm. <br />
        To log in, select Continue via uPort, scan the QR code with your installed uPort app by heading
         to the camera icon in the very top left, and accept the login request.
      </Paragraph>
      <Block>
        <Block className={cx('slider')}>
          <Img src={login1} />
          <Img src={login2} />
        </Block>
        <Block className={cx('slider')}>
          <Img src={login3} width={350} height={622} />
          <Img src={login4} width={350} height={622} />
        </Block>
      </Block>
    </Block>
    <Block margin="xl">
      <Subtitle>Market Overview</Subtitle>
      <Block margin="md">
        <Img src={marketoverview1} width={1140} />
      </Block>
      <Paragraph color="medium">
        Once logged in, you'll find <Bold>200 OLY tokens</Bold> in your wallet which you can use to make predictions on various topics. OLY is the official play-money token issued for the Olympia tournament.
      </Paragraph>
      <Paragraph>
        Using your OLY tokens, you can participate in prediction markets of your choice via the Markets page. The Markets page will provide you with an overview of all prediction markets. From the sidebar, you can easily filter this preview by market resolution, resolution date, and trading volume. If you’d like to look for a market by title or description, you’re able to do so through the designated data input forms.
      </Paragraph>
      <Paragraph>
        As you unlock new levels, new prediction markets with varying resolution dates will be offered to you so your predictive skills keep being challenged.
      </Paragraph>
      <Paragraph>
        Every two days, you'll also get a <Bold>top-up of new OLY tokens</Bold> that you can trade to unlock new markets and climb up the scoreboard.
      </Paragraph>
    </Block>
    <Block margin="xl">
      <Subtitle>Dashboard Overview</Subtitle>
      <Block margin="md">
        <Img src={dashboardoverview1} width={1140} />
      </Block>
      <Paragraph color="medium">
        From the Dashboard, you can stay on top of all active markets and your trading activity. <br />
        To get an overview of your trading activity, the top section will display the balance of OLY tokens you're currently holding, predicted profits from your investments, your rank on the scoreboard, as well as the predictor badge you've been assigned.
      </Paragraph>
      <Paragraph>
        Different cards will give you a preview of new and soon-closing markets along with their current outcome prediction so you’ll never miss a chance to participate.
      </Paragraph>
      <Paragraph>
        A summary of your token holdings and trades from the markets you’ve participated in will show up in the bottom section.
      </Paragraph>
    </Block>
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
        <Img src={prediction2} width={320} height={380} />
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
    <Block margin="xl">
      <Subtitle>Profits</Subtitle>
      <Block margin="md">
        <Paragraph color="medium">
            The more profits you make from correctly predicted events, <Bold>...the higher you rank on the Scoreboard</Bold>
        </Paragraph>
      </Block>
      <Block margin="md">
        <Img src={profits1} width={'100%'} />
      </Block>
      <Paragraph>
        Upon market resolution, your points are automatically registered in the scoreboard where you can keep track of your rank compared to other participants and hopefully get (more and more) competitive :)
      </Paragraph>
      <Paragraph>
        Your score is the <Bold>sum of OLY tokens you hold (tokens you won - tokens you've lost) plus the predicted profits</Bold> you're going to make out of the prediction markets you participated in.
      </Paragraph>
      <Paragraph>
        <Bold>...the fancier the badge you'll receive</Bold>
      </Paragraph>
      <Block margin="md">
        <Img src={profits2} width={'100%'} />
      </Block>
      <Paragraph>
        As you make more predictions, you'll gain honorary predictor badges—will you remain a Junior Predictor, become a Fortune Teller, or even call yourself a Psychic?
      </Paragraph>
      <Paragraph>
        <Bold>...and the more GNO tokens you win!</Bold>
      </Paragraph>
      <Block margin="md" center>
        <Img src={profits3} width={'75%'} />
      </Block>
      <Paragraph>
        If you're among the top 100 predictors, you will be rewarded with GNO tokens. In case you get to the top 10, your GNO rewards will increase based on your final score.
      </Paragraph>
    </Block>
  </PageFrame>
    )

export default GameRules
