import React from 'react'
import classnames from 'classnames/bind'
import { lifecycle } from 'recompose'
import { getFeatureConfig } from 'utils/features'

import Onfido from 'onfido-sdk-ui'

import styles from './OnFidoIntegration.scss'

const cx = classnames.bind(styles)

const tournamentConfig = getFeatureConfig('tournament')

const OnFidoIntegration = () => (
  <div id="onfido-mount" className={cx('onfido-wrapper')} />
)

const enhancer = lifecycle({
  componentDidMount() {
    Onfido.init({
      // the JWT token that you generated earlier on
      token: 'YOUR_JWT_TOKEN',
      // id of the element you want to mount the component on
      containerId: 'onfido-mount',
      useModal: false,
      steps: [
        {
          type: 'welcome',
          options: {
            title: 'Confirm your Identity',
            descriptions: [`In order to interact with ${tournamentConfig.name || 'the application'} you have to verify your Identity with OnFido.`],
          },
        },
        'document',
        'face',
        {
          type: 'complete',
          options: {
            title: 'Thank you for verifying your Identity',
            descriptions: ['Please come back later when your Identity was confirmed by OnFido.'],
          },
        },
      ],
      onComplete: () => {
        console.log('everything is complete')
        // You can now trigger your backend to start a new check
      },
    })
  },
})

export default enhancer(OnFidoIntegration)
