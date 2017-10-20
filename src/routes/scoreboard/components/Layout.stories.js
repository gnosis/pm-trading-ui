import { array, object, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { host } from 'storybook-host'
import Layout from './Layout'

storiesOf('Route ScoreBoard', module)
    .addDecorator(host({
      title: 'ScoreBoard ',
      align: 'center',
      height: 650,
    }))
    .add('Layout', () => {
        const data = array('Wallet Provider ', [object('User 1', {
            currentRank: 1,
            diffRank: 10,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca001',
            score: '554000000000000000',
            balance: '200000000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 2', {
            currentRank: 2,
            diffRank: 5,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca002',
            score: '534000000000000000',
            balance: '180000000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 3', {
            currentRank: 3,
            diffRank: 5,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca003',
            score: '614000000000000000',
            balance: '260000000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 4', {
            currentRank: 4,
            diffRank: 0,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca004',
            score: '632000000000000000',
            balance: '278000000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 5', {
            currentRank: 5,
            diffRank: 1,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca005',
            score: '465000000000000000',
            balance: '111000000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 6', {
            currentRank: 6,
            diffRank: -2,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca006',
            score: '466000000000000000',
            balance: '112000000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 7', {
            currentRank: 7,
            diffRank: 7,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca007',
            score: '520600000000000000',
            balance: '166600000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 8', {
            currentRank: 8,
            diffRank: -7,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca007',
            score: '55400000000000000',
            balance: '200000000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 9', {
            currentRank: 9,
            diffRank: 44,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca008',
            score: '502750000000000000',
            balance: '148750000000000000',
            predictedProfits: '354000000000000000',
        }), object('User 10', {
            currentRank: 10,
            diffRank: 74,
            pastRank: 10,
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca009',
            score: '719870000000000000',
            balance: '145870000000000000',
            predictedProfits: '574000000000000000',
        })])

        const myWallet = text('Skype name', '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca004')

        return (
            <Layout data={ data } myWallet={ myWallet } />
        )
    })
