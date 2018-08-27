import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Img from 'components/layout/Img'
import Bold from 'components/layout/Bold'

const profits1 = require('routes/GameGuide/assets/profits1.png')
const profits2 = require('routes/GameGuide/assets/profits2.png')
const profits3 = require('routes/GameGuide/assets/profits3.png')

const ProfitsAndScoreboard = () => (
  <Block margin="xl">
    <Subtitle>Profits and Scoreboard</Subtitle>
    <Block margin="md">
      <Paragraph>
        The more profits you make from correctly predicted events,<br />
        <Bold>...the higher you rank on the Scoreboard</Bold>
      </Paragraph>
    </Block>
    <Block margin="md">
      <Img src={profits1} width="100%" bordered />
    </Block>
    <Paragraph>
      Upon market resolution, your points are automatically registered in the scoreboard where you can keep track of
      your rank compared to other participants and hopefully get (more and more) competitive :)
    </Paragraph>
    <Paragraph>
      Your score is the{' '}
      <Bold>sum of OLY tokens you hold (tokens you won - tokens you&apos;ve lost) plus the predicted profits</Bold>{' '}
      you&apos;re going to make out of the prediction markets you participated in.
    </Paragraph>
    <Paragraph>
      <Bold>...the fancier the badge you&apos;ll receive</Bold>
    </Paragraph>
    <Block margin="md">
      <Img src={profits2} width="100%" bordered />
    </Block>
    <Paragraph>
      As you make more predictions, you&apos;ll gain honorary predictor badges—will you remain a Junior Predictor,
      become a Fortune Teller, or even call yourself a Psychic?
    </Paragraph>
    <Paragraph>
      <Bold>...and the more GNO tokens you win!</Bold>
    </Paragraph>
    <Block margin="md" center>
      <Img src={profits3} width="75%" bordered />
    </Block>
    <Paragraph>
      <Bold>If you&apos;re among the top 100 predictors, you will be rewarded with GNO tokens.</Bold> The higher your
      rank on the scoreboard, the more GNO you win.
    </Paragraph>
  </Block>
)

export default ProfitsAndScoreboard
