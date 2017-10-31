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

const cx = classNames.bind(css)

const videoOpts = {
    height: '260',
    width: '520',
    playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
    },
}


const GameRules = () => (
  <PageFrame>
    <Block margin="md">
      <Title>GAME RULES</Title>
      <Block margin="sm">
        <Paragraph color="medium">
                        These are the game rules for Gnosis Olympia. Lorem ipsum dolor sit <br />
                        amet, consectetur adipiscing elit. Praesent lorem quam, placerat eu <br />
                        ante at, gravida ornare purus. Aenean ultrices varius leo ac dignissim. <br />
                        Integer lacinia odio sit amet odio aliquet, nec vehicula turpis tristique. <br />
        </Paragraph>
      </Block>
      <Youtube
        videoId="0WmUbiMHeSE"
        opts={videoOpts}
      />
    </Block>
    <Block margin="md">
      <Subtitle>General Guidelines</Subtitle>
      <Paragraph color="medium">1. - Each participant gets 100 OLY tokens on start. Then 100 OLY tokens every 48 hours.</Paragraph>
      <Paragraph color="medium">2. - This would be another guideline in the list.</Paragraph>
      <Paragraph color="medium">3. - This would be another guideline in the list.</Paragraph>
      <Paragraph color="medium">4. - This would be another guideline in the list.</Paragraph>
      <Paragraph color="medium">5. - This would be another guideline in the list.</Paragraph>
    </Block>
    <Block margin="md">
      <Subtitle>FAQs</Subtitle>
      <Block margin="sm">
        <Paragraph color="dark" nomargin>
          <Bold>#1  -  How are my profits calculated?</Bold>
        </Paragraph>
        <Paragraph color="medium">
                        These are the game rules for Gnosis Olympia. Lorem ipsum dolor sit amet, consectetur <br />
                        adipiscing elit. Praesent lorem quam, placerat eu ante at, gravida ornare purus. <br />
                        Aenean ultrices varius leo ac dignissim. Integer lacinia odio sit amet odio aliquet, nec <br />
                        vehicula turpis tristique.
                    </Paragraph>
      </Block>
      <Block margin="sm">
        <Paragraph color="dark" nomargin>
          <Bold>#2  -  How do I create a market?</Bold>
        </Paragraph>
        <Paragraph color="medium">
                        These are the game rules for Gnosis Olympia. Lorem ipsum dolor sit amet, consectetur <br />
                        adipiscing elit. Praesent lorem quam, placerat eu ante at, gravida ornare purus. <br />
                        Aenean ultrices varius leo ac dignissim. Integer lacinia odio sit amet odio aliquet, nec <br />
                        vehicula turpis tristique.
                    </Paragraph>
      </Block>
    </Block>
  </PageFrame>
    )

export default GameRules
