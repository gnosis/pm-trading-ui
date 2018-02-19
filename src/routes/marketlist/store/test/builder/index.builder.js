import { List } from 'immutable'
import {
  MarketRecord,
  BoundsRecord,
  OutcomeRecord,
  MARKET_CATEGORICAL,
  MARKET_SCALAR,
} from 'store/models'

export { default as oneMarketData } from './oneMarket'
export { default as twoMarketData } from './twoMarket'
export { default as realData } from './realData'

class MarketBuilder {
  constructor() {
    this.market = new MarketRecord()
  }

  withTitle(title) {
    this.market = this.market.set('title', title)
    return this
  }

  withResolution(resolution) {
    this.market = this.market.set('resolution', resolution)
    return this
  }

  withVolume(volume) {
    this.market = this.market.set('volume', volume)
    return this
  }

  withResolved(resolved) {
    this.market = this.market.set('resolved', resolved)
    return this
  }

  withType(type) {
    this.market = this.market.set('type', type)
    return this
  }

  withCreation(creation) {
    this.market = this.market.set('creation', creation)
    return this
  }

  withStage(stage) {
    this.market = this.market.set('stage', stage)
    return this
  }

  withOutcomes(...outcomes) {
    this.market = this.market.set('outcomes', List(outcomes))
    return this
  }

  withBounds(lower, upper, unit) {
    this.market = this.market.set('bounds', new BoundsRecord({ lower, upper, unit }))
    return this
  }

  get() {
    return this.market
  }
}

const aMarket = () => new MarketBuilder()

export class MarketFactory {
  static aKittiesMarket = aMarket()
    .withTitle('How much will Cryptokitties transactions make up of the entire Ethereum network transactions by December 29th, in the last 1500 blocks?')
    .withResolution('2017-12-30T00:00:00')
    .withVolume('9523809523809680')
    .withStage(1)
    .withCreation('2017-12-29T13:39:44')
    .withResolved(false)
    .withType(MARKET_SCALAR)
    .withOutcomes()
    .withBounds('1', '20', '%')
    .get()

  static aEthereumMarket = aMarket()
    .withTitle('What will the number of Ethereum transactions be on January 3rd, 2018?')
    .withResolution('2018-01-03T12:00:00')
    .withCreation('2017-12-31T13:12:51')
    .withResolved(false)
    .withVolume('857142857142872776')
    .withStage(1)
    .withType(MARKET_SCALAR)
    .withOutcomes()
    .withBounds('500000', '1250000', 'Txs')
    .get()

  static aGasPriceMarket = aMarket()
    .withTitle('What will be the median gas price on Feb. 1st, 2018?')
    .withResolution('2018-02-01T12:00:00')
    .withVolume('342952380952380954')
    .withStage(1)
    .withCreation('2017-12-31T13:58:13')
    .withResolved(false)
    .withType(MARKET_CATEGORICAL)
    .withOutcomes(
      new OutcomeRecord({ name: '<20 GWei', marginalPrice: '0.2287' }),
      new OutcomeRecord({ name: '20 GWei', marginalPrice: '0.3454' }),
      new OutcomeRecord({ name: '>20 GWei', marginalPrice: '0.4259' }),
    )
    .withBounds(undefined, undefined, undefined)
    .get()
}

export default aMarket
