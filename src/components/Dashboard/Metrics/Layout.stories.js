import { number, text } from '@storybook/addon-knobs'
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
        const badge = text('badge', "Clairvoyant")
        
        return (
            <Layout tokens={ tokens } predictedProfits={ predictedProfits } rank={ rank } badge={ badge } />
        )
    })
    .add('Metrics of undefined account', () => {
        const tokens = undefined;
        const predictedProfits = undefined;
        const rank = undefined;
        const badge = undefined;

        return (
            <Layout tokens={ tokens } predictedProfits={ predictedProfits } rank={ rank }/>
        )
    })