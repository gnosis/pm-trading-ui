import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Img from 'components/layout/Img'
import Bold from 'components/layout/Bold'

const profits1 = require('routes/gamerules/assets/profits1.png')
const profits2 = require('routes/gamerules/assets/profits2.png')
const profits3 = require('routes/gamerules/assets/profits3.png')

const MakePrediction = () => (
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
)

export default MakePrediction
