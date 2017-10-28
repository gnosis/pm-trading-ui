import 'components/Header/header.less'
import { object } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { host } from 'storybook-host'
import Component from './index'

storiesOf('Components', module)
    .addDecorator(host({
      title: 'ProviderIcon',
      align: 'center',
      height: 50,
      width: '100%',
    }))
    .add('ProviderIcon', () => {
        const provider = object('Wallet Provider ', {
            name: 'METAMASK',
            loaded: true,
            available: true,
            network: 'UNKNOWN',
            account: '0x90f8bf6a479f320ead074411a4b0e',
            balance: '98.2348662',
            priority: 90,
        })

        return (
            <Component provider={ provider } />
        )
    })
