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
      width: '100%',
    }))
    .add('Layout', () => {
        const data = array('Wallet Provider ', [ object('User 1', {
            position: 1,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca001',
            markets: '23',
            score: 39532,
            change: 10,
        }), object('User 2', {
            position: 2,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca002',
            markets: '20',
            score: 23954,
            change: 5,
        }), object('User 3', {
            position: 3,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca003',
            markets: '20',
            score: 23954,
            change: 5,
        }), object('User 4', {
            position: 4,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca004',
            markets: '20',
            score: 23954,
            change: '-',
        }), object('User 5', {
            position: 5,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca005',
            markets: '20',
            score: 23954,
            change: 1,
        }), object('User 6', {
            position: 6,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca006',
            markets: '23',
            score: 23954,
            change: -2,
        }), object('User 7', {
            position: 7,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca007',
            markets: '20',
            score: 23954,
            change: 7,
        }), object('User 8', {
            position: 8,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca008',
            markets: '20',
            score: 23954,
            change: -7,
        }), object('User 9', {
            position: 9,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca009',
            markets: '20',
            score: 23954,
            change: +44,
        }), object('User 10', {
            position: 10,
            wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca010',
            markets: '20',
            score: 23954,
            change: +74,
        })])

        const myWallet = text('Skype name', '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca004');

        return (
            <Layout data={ data } myWallet={ myWallet } />
        )
    })
