import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { lifecycle } from 'recompose'
import { getFeatureConfig } from 'utils/features'

import Onfido from 'onfido-sdk-ui'

import styles from './style.scss'

const cx = classnames.bind(styles)

const tournamentConfig = getFeatureConfig('tournament')

const OnFidoIntegration = ({ closeModal, canClose }) => (
  <>
    {canClose && <button type="button" className={cx('closeButton')} onClick={closeModal} />}
    <div id="onfido-mount" className={cx('onfido-wrapper')} />
  </>
)

OnFidoIntegration.propTypes = {
  canClose: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
}

OnFidoIntegration.defaultProps = {
  canClose: false,
}

const enhancer = lifecycle({
  async componentDidMount() {
    const {
      token, startUserReport, account, setStep,
    } = this.props
    
    Onfido.init({
      // the JWT token that you generated earlier on
      token,
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
            message: 'Documents submitted',
            submessage: 'Please check your email to continue with the process.',
          },
        },
      ],
      onComplete: async () => {
        await startUserReport(account)
        setStep({ page: 'integration', options: { canClose: true, token } })
        // You can now trigger your backend to start a new check
      },
    })
  },
})

export default enhancer(OnFidoIntegration)
