import React from 'react'
import classnames from 'classnames/bind'
import PropTypes from 'prop-types'
import Indefinite from 'components/Spinner/Indefinite'
import { getFeatureConfig } from 'utils/features'

import Welcome from './Welcome'
import Integration from './Integration'

import styles from './style.scss'

const { name: applicationName = 'the application' } = getFeatureConfig('tournament')

const cx = classnames.bind(styles)

const SignMessage = ({ t }) => (
  <p>{t('verification.sign_message')}</p>
)

SignMessage.propTypes = {
  t: PropTypes.func.isRequired,
}

const DeniedMessage = ({
  reason, heading, canRetry, closeModal, setStep, t,
}) => (
  <div className={cx('modal', 'denied')}>
    <button type="button" className={cx('closeButton')} onClick={closeModal} />
    <h2>{heading || t('verification.headings.denied_default', { applicationName })}</h2>
    <p>{reason}</p>

    {canRetry && <button type="button" className={cx('retryButton')} onClick={() => setStep({ page: 'welcome' })}>{t('verification.try_again')}</button>}
  </div>
)

DeniedMessage.propTypes = {
  reason: PropTypes.string,
  heading: PropTypes.node,
  closeModal: PropTypes.func.isRequired,
  canRetry: PropTypes.bool,
  setStep: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

DeniedMessage.defaultProps = {
  reason: '',
  heading: undefined,
  canRetry: true,
}

const Steps = {
  welcome: Welcome,
  integration: Integration,
  signMessage: SignMessage,
  denied: DeniedMessage,
}

const OnFido = ({ step, ...props }) => {
  const { page, options, ...other } = step

  if (Steps[page]) {
    const StepComponent = Steps[page]
    return <StepComponent {...other} {...props} {...options} />
  }

  return <Indefinite width={64} height={64} />
}

OnFido.propTypes = {
  step: PropTypes.shape({
    page: PropTypes.string.isRequired,
    options: PropTypes.object,
  }).isRequired,
}

export default OnFido
