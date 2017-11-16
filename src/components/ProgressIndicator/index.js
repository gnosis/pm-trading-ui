import React from 'react'
import PropTypes from 'prop-types'
import ProgressSpinner from 'components/ProgressSpinner'
import { TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

const ProgressIndicator = ({ completed, completionStatus, progress }) => {
  if (completed) {
    if (completionStatus === TRANSACTION_COMPLETE_STATUS.NO_ERROR) {
      return (
        <div className="transaction__icon">
          <div className="icon icon--checkmark" />
        </div>
      )
    }

    return (
      <div className="transaction__icon">
        <div className="icon icon--error" />
      </div>
    )
  }

  return (
    <ProgressSpinner width={32} height={32} strokeWidthPx={1} fontSizePx={8} progress={progress} modifier="spinning" />
  )
}

ProgressIndicator.propTypes = {
  completed: PropTypes.bool,
  completionStatus: PropTypes.string,
  progress: PropTypes.number,
}

export default ProgressIndicator
