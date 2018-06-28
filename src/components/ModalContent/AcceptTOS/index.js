import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { getFeatureConfig } from 'utils/features'
import LegalCompliance from 'containers/LegalCompliance'
import style from './AcceptTOS.mod.scss'

const { name = 'the application' } = getFeatureConfig('tournament')

const cx = cn.bind(style)


const AcceptTOS = ({
  closeModal, initProviders, setLegalDocumentsAccepted,
}) => {
  const login = (docsAccepted) => {
    setLegalDocumentsAccepted(docsAccepted)
    initProviders()
    closeModal()
  }

  return (
    <div className={cx('acceptTOS')}>
      <button className={cx('closeButton')} onClick={closeModal} />
      <div className={cx('tosContainer')}>
        <LegalCompliance
          showExplanation
          showHeading
          submitButtonClassName={cx('loginButton')}
          submitButtonDisabledClassName={cx('disabled')}
          onSubmitAcceptedDocs={login}
          applicationName={name}
        />
      </div>
    </div>
  )
}

AcceptTOS.propTypes = {
  closeModal: PropTypes.func.isRequired,
  setLegalDocumentsAccepted: PropTypes.func.isRequired,
  initProviders: PropTypes.func.isRequired,
}

export default AcceptTOS
