import { List } from 'immutable'
import {
  ScalarMarketRecord,
  CategoricalMarketRecord,
  BoundsRecord,
  OutcomeRecord,
} from 'store/models'

export { default as oneMarketData } from './oneMarket'
export { default as twoMarketData } from './twoMarket'
export { default as realData } from './realData'

class MarketBuilder {
  constructor() {
    this.market = undefined
  }

  ofScalarType() {
    this.market = new ScalarMarketRecord()
    return this
  }

  ofCategoricalType() {
    this.market = new CategoricalMarketRecord()
    return this
  }

  withAddress(address) {
    this.market = this.market.set('address', address)
    return this
  }

  withTitle(title) {
    this.market = this.market.set('title', title)
    return this
  }

  withDescription(description) {
    this.market = this.market.set('description', description)
    return this
  }

  withCreator(creator) {
    this.market = this.market.set('creator', creator)
    return this
  }

  withCollateralToken(collateralToken) {
    this.market = this.market.set('collateralToken', collateralToken)
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

  withClosed(closed) {
    this.market = this.market.set('closed', closed)
    return this
  }

  withEventAddress(address) {
    this.market = this.market.set('eventAddress', address)
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

  withOutcomeTokensSold(...outcomeTokensSold) {
    this.market = this.market.set('outcomeTokensSold', List(outcomeTokensSold))

    return this
  }

  withBounds(lower, upper, unit, decimals) {
    this.market = this.market.set('bounds', new BoundsRecord({
      lower, upper, unit, decimals: parseInt(decimals, 10),
    }))
    return this
  }

  withFunding(funding) {
    this.market = this.market.set('funding', funding)
    return this
  }

  get() {
    return this.market
  }
}

const aMarket = () => new MarketBuilder()

export class MarketFactory {
  static aKittiesMarket = aMarket()
    .ofScalarType()
    .withAddress('0xa625c9ccf5860e9709a31cbac1ffd6fc557558f6')
    .withTitle('How much will Cryptokitties transactions make up of the entire Ethereum network transactions by December 29th, in the last 1500 blocks?')
    .withDescription('How much of the total Ethereum transactions in the last 1500 blocks will be made by CryptoKitties game actions in the Ethereum network? The winning outcome will be calculated according to the sum of interactions with the smart contract address: 0x06012c8cf97bead5deae237070f9587f8e7a266d (CryptoKitties) and the address: 0xb1690c08e213a35ed9bab7b318de14420fb57d8c (CryptoKitties Auction) which make up for all the interactions made with CryptoKitties contracts. Source: https://ethgasstation.info/gasguzzlers.php')
    .withResolution('2017-12-30T00:00:00')
    .withVolume('9523809523809680')
    .withFunding('10000000000000000')
    .withStage(1)
    .withClosed(true)
    .withEventAddress('0x2077708a049f059ee7a7878071b5adca92e6a4ba')
    .withCreation('2017-12-29T13:39:44')
    .withResolved(false)
    .withCollateralToken('c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
    .withCreator('0x9eab578556de5782445ec036f25a41902ba19eeb')
    .withBounds('1', '20', '%', '0')
    .withOutcomeTokensSold(
      '15211146333519251',
      '0',
    )
    .get()

  static aEthereumMarket = aMarket()
    .ofScalarType()
    .withAddress('0xedb69ab6fa7a1740f91f7dec0c667873269bea96')
    .withTitle('What will the number of Ethereum transactions be on January 3rd, 2018?')
    .withDescription('You can check the progress and number of Ethereum transactions here: https://etherscan.io/chart/tx')
    .withResolution('2018-01-03T12:00:00')
    .withCreation('2017-12-31T13:12:51')
    .withResolved(false)
    .withClosed(true)
    .withEventAddress('0x471f34c2b6addf8d501c7b3a157701633be3eb79')
    .withVolume('857142857142872776')
    .withFunding('1000000000000000000')
    .withStage(1)
    .withCollateralToken('c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
    .withCreator('0x9eab578556de5782445ec036f25a41902ba19eeb')
    .withBounds('500000', '1250000', 'Txs', '0')
    .withOutcomeTokensSold(
      '0',
      '1391159866011082687',
    )
    .get()

  static aGasPriceMarket = aMarket()
    .ofCategoricalType()
    .withAddress('0xa8d84fc1fc77c87203c1448587ebdb5ee845f26b')
    .withTitle('What will be the median gas price on Feb. 1st, 2018?')
    .withDescription('What will be the median gas price payed among all transactions on Feb. 1st, 2018?')
    .withResolution('2018-02-01T12:00:00')
    .withVolume('342952380952380954')
    .withFunding('1000000000000000000')
    .withStage(1)
    .withCreation('2017-12-31T13:58:13')
    .withCollateralToken('c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
    .withCreator('0x9eab578556de5782445ec036f25a41902ba19eeb')
    .withEventAddress('0xf43c5e4113aaeb07e4b18a80537ec6cd52213e1e')
    .withResolved(false)
    .withClosed(true)
    .withOutcomes(
      new OutcomeRecord({
        name: '<20 GWei', index: 0, marginalPrice: '0.2287', outcomeTokensSold: '0',
      }),
      new OutcomeRecord({
        name: '20 GWei', index: 1, marginalPrice: '0.3454', outcomeTokensSold: '375216952973444123',
      }),
      new OutcomeRecord({
        name: '>20 GWei', index: 2, marginalPrice: '0.4259', outcomeTokensSold: '566120592814650422',
      }),
    )
    .withOutcomeTokensSold(
      '0',
      '375216952973444123',
      '566120592814650422',
    )
    .get()
}

export default aMarket
