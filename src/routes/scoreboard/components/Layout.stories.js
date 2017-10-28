import { array, object, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import users from 'stories/knobs/scoreboardUsers'
import { host } from 'storybook-host'
import Layout from './Layout'

storiesOf('Route ScoreBoard', module)
    .addDecorator(host({
      title: 'ScoreBoard ',
      align: 'center',
      height: 720,
    }))
    .add('Account not in the first 10 positions ', () => {

        const data = users;
        const myWallet = text('Skype name', '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca099')
        const myPosition = object(' User me ', {
            currentRank: 28,
            diffRank: 25,
            pastRank: 53,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca099',
            score: '55400000000000000',
            balance: '200000000000000000',
            predictedProfit: '354000000000000000',
        })

        return (
            <Layout data={ data } myPosition={ myPosition } containsAccount={ false }/>
        )
    })
    .add('Account in the first 10 positions ', () => {

        const data = users;
        const myWallet = text('Skype name', '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca007')
        const myPosition = object(' User me ', {
            currentRank: 7,
            diffRank: 7,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca007',
            score: '520600000000000000',
            balance: '166600000000000000',
            predictedProfit: '354000000000000000',
        })

        return (
            <Layout data={ data } myPosition={ myPosition } containsAccount/>
        )
    })
