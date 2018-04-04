import { number, object } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Block from 'components/layout/Block'
import * as React from 'react'
import { host } from 'storybook-host'
import { badgeOf } from 'routes/scoreboard/components/ScoreTable/table'
import Layout from './Layout'

storiesOf('Route Dashboard', module)
  .addDecorator(host({
    title: 'Metrics',
    align: 'center',
    height: 375,
  }))
  .add('Metrics of regular account', () => {
    const tokens = number('OLY Tokens', 200)
    const predictedProfit = number('Predicted profits', 32)
    const rank = number('rank', 20)
    const juniorBadge = object('badge', badgeOf(2))
    const crystalBadge = object('badge', badgeOf(7))
    const fortuneBadge = object('badge', badgeOf(12))
    const clairvoyantBadge = object('badge', badgeOf(17))
    const psychicBadge = object('badge', badgeOf(20))

    return (
      <Block>
        <Block margin="sm">
          <Layout tokens={tokens} predictedProfit={predictedProfit} rank={rank} badge={juniorBadge} />
        </Block>
        <Block margin="sm">
          <Layout tokens={tokens} predictedProfit={predictedProfit} rank={rank} badge={crystalBadge} />
        </Block>
        <Block margin="sm">
          <Layout tokens={tokens} predictedProfit={predictedProfit} rank={rank} badge={fortuneBadge} />
        </Block>
        <Block margin="sm">
          <Layout tokens={tokens} predictedProfit={predictedProfit} rank={rank} badge={clairvoyantBadge} />
        </Block>
        <Block margin="sm">
          <Layout tokens={tokens} predictedProfit={predictedProfit} rank={rank} badge={psychicBadge} />
        </Block>
      </Block>
    )
  })
  .add('Metrics of undefined account', () => {
    const tokens = undefined
    const predictedProfit = undefined
    const rank = undefined
    const badge = object('badge', badgeOf(undefined))

    return (
      <Layout tokens={tokens} predictedProfit={predictedProfit} rank={rank} badge={badge} />
    )
  })
