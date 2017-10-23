import { number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { host } from 'storybook-host'
import Layout from './Layout'

storiesOf('Route Dashboard', module)
    .addDecorator(host({
        title: 'Metrics',
        align: 'center',
        height: 75,
    }))
    .add('Metrics of regular account', () => {
        const tokens = number('OLY Tokens', 200)
        const predictedProfits = number('Predicted profits', 32)
        const rank = number('rank', 20)
        
        return (
            <Layout tokens={ tokens } predictedProfits={ predictedProfits } rank={ rank }/>
        )
    })
    .add('Metrics of undefined account', () => {
        const tokens = undefined;
        const predictedProfits = undefined;
        const rank = undefined;
        
        return (
            <Layout tokens={ tokens } predictedProfits={ predictedProfits } rank={ rank }/>
        )
    })