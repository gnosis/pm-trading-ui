import { List } from 'immutable'
import { MarketRecord, BoundsRecord } from '../models'

/* eslint-disable */
export const realData = {
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "contract": {
        "creationBlock": 4818543,
        "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
        "factoryAddress": "0xdde21f8be9e50b9b1165ee302e6b468cf30e4c4c",
        "creationDate": "2017-12-29T13:39:44",
        "address": "0xa625c9ccf5860e9709a31cbac1ffd6fc557558f6"
      },
      "event": {
        "contract": {
          "creationBlock": 4818540,
          "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
          "factoryAddress": "0x5b21ba38a0db91cc43aa7daba778979758e67991",
          "creationDate": "2017-12-29T13:39:29",
          "address": "0x2077708a049f059ee7a7878071b5adca92e6a4ba"
        },
        "collateralToken": "c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "oracle": {
          "contract": {
            "creationBlock": 4818537,
            "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
            "factoryAddress": "0xc4f4b8c0259c8264376fc32984e2a8cf4a3c70ca",
            "creationDate": "2017-12-29T13:39:02",
            "address": "0x02d7f617bc27b2a09675d2c095c1d0ffc761afd5"
          },
          "isOutcomeSet": false,
          "owner": "0x9eab578556de5782445ec036f25a41902ba19eeb",
          "eventDescription": {
            "ipfsHash": "QmfGcwGtG7LoPSD3wQk3hNNKZkRAszAgrzeS6GrB7Us9np",
            "description": "How much of the total Ethereum transactions in the last 1500 blocks will be made by CryptoKitties game actions in the Ethereum network? The winning outcome will be calculated according to the sum of interactions with the smart contract address: 0x06012c8cf97bead5deae237070f9587f8e7a266d (CryptoKitties) and the address: 0xb1690c08e213a35ed9bab7b318de14420fb57d8c (CryptoKitties Auction) which make up for all the interactions made with CryptoKitties contracts. Source: https://ethgasstation.info/gasguzzlers.php",
            "title": "How much will Cryptokitties transactions make up of the entire Ethereum network transactions by December 29th, in the last 1500 blocks?",
            "resolutionDate": "2017-12-30T00:00:00",
            "decimals": 0,
            "unit": "%"
          },
          "type": "CENTRALIZED"
        },
        "isWinningOutcomeSet": false,
        "lowerBound": "1",
        "upperBound": "20",
        "type": "SCALAR"
      },
      "marketMaker": "7ee6e9dc512b0fe5cb5e28697cfc34375a9adc4b",
      "fee": 0,
      "funding": "10000000000000000",
      "netOutcomeTokensSold": [
        "15211146333519251",
        "0"
      ],
      "stage": 1,
      "tradingVolume": "9523809523809680",
      "withdrawnFees": "0",
      "collectedFees": "0",
      "marginalPrices": [
        "0.7416",
        "0.2584"
      ]
    },
    {
      "contract": {
        "creationBlock": 4830058,
        "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
        "factoryAddress": "0xdde21f8be9e50b9b1165ee302e6b468cf30e4c4c",
        "creationDate": "2017-12-31T13:12:51",
        "address": "0xedb69ab6fa7a1740f91f7dec0c667873269bea96"
      },
      "event": {
        "contract": {
          "creationBlock": 4830056,
          "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
          "factoryAddress": "0x5b21ba38a0db91cc43aa7daba778979758e67991",
          "creationDate": "2017-12-31T13:12:00",
          "address": "0x471f34c2b6addf8d501c7b3a157701633be3eb79"
        },
        "collateralToken": "c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "oracle": {
          "contract": {
            "creationBlock": 4830054,
            "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
            "factoryAddress": "0xc4f4b8c0259c8264376fc32984e2a8cf4a3c70ca",
            "creationDate": "2017-12-31T13:11:37",
            "address": "0xe5c7fd34f0053ad1cb0f6892082f347f08c8133d"
          },
          "isOutcomeSet": false,
          "owner": "0x9eab578556de5782445ec036f25a41902ba19eeb",
          "eventDescription": {
            "ipfsHash": "QmNTiWX57wcHTEromRzLtJLpSmEd15rj7ATShBVgaChrzu",
            "description": "You can check the progress and number of Ethereum transactions here: https://etherscan.io/chart/tx",
            "title": "What will the number of Ethereum transactions be on January 3rd, 2018?",
            "resolutionDate": "2018-01-03T12:00:00",
            "decimals": 0,
            "unit": "Txs"
          },
          "type": "CENTRALIZED"
        },
        "isWinningOutcomeSet": false,
        "lowerBound": "500000",
        "upperBound": "1250000",
        "type": "SCALAR"
      },
      "marketMaker": "7ee6e9dc512b0fe5cb5e28697cfc34375a9adc4b",
      "fee": 0,
      "funding": "1000000000000000000",
      "netOutcomeTokensSold": [
        "0",
        "1391159866011082687"
      ],
      "stage": 1,
      "tradingVolume": "857142857142872776",
      "withdrawnFees": "0",
      "collectedFees": "0",
      "marginalPrices": [
        "0.2760",
        "0.7240"
      ]
    },
    {
      "contract": {
        "creationBlock": 4830266,
        "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
        "factoryAddress": "0xdde21f8be9e50b9b1165ee302e6b468cf30e4c4c",
        "creationDate": "2017-12-31T13:58:13",
        "address": "0xa8d84fc1fc77c87203c1448587ebdb5ee845f26b"
      },
      "event": {
        "contract": {
          "creationBlock": 4830264,
          "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
          "factoryAddress": "0x5b21ba38a0db91cc43aa7daba778979758e67991",
          "creationDate": "2017-12-31T13:57:54",
          "address": "0xf43c5e4113aaeb07e4b18a80537ec6cd52213e1e"
        },
        "collateralToken": "c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "oracle": {
          "contract": {
            "creationBlock": 4830255,
            "creator": "0x9eab578556de5782445ec036f25a41902ba19eeb",
            "factoryAddress": "0xc4f4b8c0259c8264376fc32984e2a8cf4a3c70ca",
            "creationDate": "2017-12-31T13:54:44",
            "address": "0xd8b16d799718e23cc2adfbe1107d1489bf1de9c5"
          },
          "isOutcomeSet": false,
          "owner": "0x9eab578556de5782445ec036f25a41902ba19eeb",
          "eventDescription": {
            "outcomes": [
              "<20 GWei",
              "20 GWei",
              ">20 GWei"
            ],
            "ipfsHash": "QmfAQHNR8NRjeiVyPzMPkRXp6EQ3oExZFYfNBxQhcR6ihz",
            "description": "What will be the median gas price payed among all transactions on Feb. 1st, 2018?",
            "resolutionDate": "2018-02-01T12:00:00",
            "title": "What will be the median gas price on Feb. 1st, 2018?"
          },
          "type": "CENTRALIZED"
        },
        "isWinningOutcomeSet": false,
        "type": "CATEGORICAL"
      },
      "marketMaker": "7ee6e9dc512b0fe5cb5e28697cfc34375a9adc4b",
      "fee": 0,
      "funding": "1000000000000000000",
      "netOutcomeTokensSold": [
        "0",
        "375216952973444123",
        "566120592814650422"
      ],
      "stage": 1,
      "tradingVolume": "342952380952380954",
      "withdrawnFees": "0",
      "collectedFees": "0",
      "marginalPrices": [
        "0.2287",
        "0.3454",
        "0.4259"
      ]
    }
  ]
}
/* eslint-enable */

class MarketBuilder {
  constructor() {
    this.market = new MarketRecord()
  }

  withTitle(title) {
    this.market = this.market.set('title', title)
    return this
  }

  withDate(date) {
    this.market = this.market.set('date', date)
    return this
  }

  withVolume(volume) {
    this.market = this.market.set('volume', volume)
    return this
  }

  withType(type) {
    this.market = this.market.set('type', type)
    return this
  }

  withOutcomes(outcomes) {
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

export default aMarket
