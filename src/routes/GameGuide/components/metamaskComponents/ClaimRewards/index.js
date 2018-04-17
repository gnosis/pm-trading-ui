import React from 'react'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'
import Img from 'components/layout/Img'
import ClaimRewardsScreenshot from 'routes/GameGuide/assets/claimRewards.png'
import ClaimSwitchNetwork from 'routes/GameGuide/assets/claimSwitchNetwork.png'
import switchNetwork1 from 'routes/GameGuide/assets/switchNetwork.png'
import switchNetwork2 from 'routes/GameGuide/assets/switchNetwork2.png'
import ClaimScreenshot from 'routes/GameGuide/assets/claim.png'
import style from './ClaimRewards.mod.scss'

const cx = cn.bind(style)

const SignUp = () => (
  <Block margin="md">
    <Subtitle>Claim your Rewards</Subtitle>
    <Paragraph>
      When the tournament ends and all markets are resolved, the final scoreboard will be announced. If you make it to
      the top 100 predictors, you will be able to claim rewards. You can claim your rewards within 30 days from the
      final scoreboard announcement.
    </Paragraph>
    <Paragraph>
      If you ended up in the top 100 (congratulations!), your reward amount will be displayed next to your wallet
      address on top of the scoreboard.
    </Paragraph>
    <br />
    <Img src={ClaimRewardsScreenshot} />
    <br />
    <br />
    <Paragraph>
      Above the scoreboard, you will see the amount of GNO tokens available for you to claim, and the time left for you
      to claim them.
    </Paragraph>
    <Paragraph>
      <Bold>To claim your rewards:</Bold>
      <br />
      <Bold>1. </Bold>Click on “Claim Now” on the Scoreboard page during the 30-day reward claim period.
      <br />
      <Bold>2. </Bold>Switch your Metamask network from Rinkeby to the mainnet<br />
      <br />
      <Img src={ClaimSwitchNetwork} />
      <br />
      <br />
      <Img src={switchNetwork2} />
      <br />
      <br />
      <Img src={switchNetwork1} />
      <br />
      <Bold>3. </Bold>Make sure you have enough ETH on your mainnet wallet to submit the reward claim transaction.{' '}
      <Bold>(NOTE: Processing this transaction will cost actual money)</Bold>
      <br />
      <br />
      <Img src={ClaimScreenshot} />
      <br />
      <Bold>4. </Bold>Click on the <Bold>Claim</Bold> button to run the Metamask transaction claiming your GNO rewards
    </Paragraph>
  </Block>
)

export default SignUp
