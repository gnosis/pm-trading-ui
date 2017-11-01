import { text } from '@storybook/addon-knobs'
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
    .add('Account in the first 10 positions ', () => {
        const data = users
        const myWallet = text('User account', '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca007')

        return (
          <Layout data={data} myAccount={myWallet} />
        )
    })
    .add('Account NOT in the first 10 positions ', () => {
        const data = users

        return (
          <Layout data={data} myAccount={undefined} />
        )
    })
