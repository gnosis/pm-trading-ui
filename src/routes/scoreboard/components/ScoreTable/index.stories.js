import { array, object, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import users from 'stories/knobs/scoreboardUsers'
import { host } from 'storybook-host'
import Component from './index'

storiesOf('Route ScoreBoard components', module)
    .addDecorator(host({
      title: 'ScoreBoard',
      align: 'center',
      height: 650,
      width: '100%',
    }))
    .add('ScoreTable', () => {
        const data = users;
        const myWallet = text('Skype name', '0x90F8bf6A479f320ead074411a4B0e7944Ea8ca007')

        return (
            <Component tableData={ data } myAccount={ myWallet } />
        )
    })
